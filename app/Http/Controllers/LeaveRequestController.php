<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = LeaveRequest::with(['employee', 'reviewer']);

        // Employees only see their own requests
        if ($user->role === 'employee') {
            $query->where('employee_id', $user->employee_id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
            'type'       => 'required|in:vacation,sick,personal,other',
            'reason'     => 'nullable|string',
        ]);

        // Employees can only submit for themselves
        $employeeId = $user->role === 'employee' ? $user->employee_id : $request->input('employee_id');

        if (!$employeeId) {
            return response()->json(['message' => 'employee_id is required'], 422);
        }

        $leaveRequest = LeaveRequest::create([
            ...$data,
            'employee_id' => $employeeId,
            'status' => 'pending',
        ]);

        return response()->json($leaveRequest->load('employee'), 201);
    }

    public function update(Request $request, LeaveRequest $leaveRequest)
    {
        $user = $request->user();

        // Only admin/manager can approve or reject
        if (!in_array($user->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'status'      => 'required|in:approved,rejected',
            'review_note' => 'nullable|string',
        ]);

        $leaveRequest->update([
            'status'      => $data['status'],
            'review_note' => $data['review_note'] ?? null,
            'reviewed_by' => $user->id,
        ]);

        // If approved, mark attendance as on_leave for those dates
        if ($data['status'] === 'approved') {
            $period = \Carbon\CarbonPeriod::create($leaveRequest->start_date, $leaveRequest->end_date);
            foreach ($period as $date) {
                \App\Models\Attendance::updateOrCreate(
                    ['employee_id' => $leaveRequest->employee_id, 'date' => $date->toDateString()],
                    ['status' => 'on_leave']
                );
            }
        }

        return response()->json($leaveRequest->load(['employee', 'reviewer']));
    }

    public function destroy(Request $request, LeaveRequest $leaveRequest)
    {
        $user = $request->user();

        // Employees can only delete their own pending requests
        if ($user->role === 'employee') {
            if ($leaveRequest->employee_id !== $user->employee_id || $leaveRequest->status !== 'pending') {
                return response()->json(['message' => 'Forbidden'], 403);
            }
        }

        $leaveRequest->delete();
        return response()->json(['message' => 'Leave request deleted']);
    }
}