<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date', Carbon::today()->toDateString());

        $employees = Employee::all();

        $attendance = Attendance::with('employee')
            ->where('date', $date)
            ->get()
            ->keyBy('employee_id');

        $result = $employees->map(function ($employee) use ($attendance, $date) {
            $record = $attendance->get($employee->id);
            return [
                'employee_id'   => $employee->id,
                'employee_name' => $employee->first_name . ' ' . $employee->last_name,
                'department'    => $employee->department,
                'position'      => $employee->position,
                'date'          => $date,
                'check_in'      => $record?->check_in,
                'check_out'     => $record?->check_out,
                'status'        => $record?->status ?? 'absent',
                'notes'         => $record?->notes,
                'attendance_id' => $record?->id,
            ];
        });

        return response()->json($result);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date'        => 'required|date',
            'check_in'    => 'nullable|date_format:H:i',
            'check_out'   => 'nullable|date_format:H:i',
            'status'      => 'required|in:present,absent,late,on_leave',
            'notes'       => 'nullable|string',
        ]);

        $attendance = Attendance::updateOrCreate(
            ['employee_id' => $data['employee_id'], 'date' => $data['date']],
            $data
        );

        return response()->json($attendance, 201);
    }
}