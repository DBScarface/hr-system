<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        return response()->json(Employee::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name'  => 'required|string',
            'last_name'   => 'required|string',
            'email'       => 'required|email|unique:employees',
            'phone'       => 'nullable|string',
            'department'  => 'required|string',
            'position'    => 'required|string',
            'status'      => 'required|string',
            'hire_date'   => 'required|date',
            'salary'      => 'nullable|numeric',
        ]);

        $employee = Employee::create($data);
        return response()->json($employee, 201);
    }

    public function show(Employee $employee)
{
    $attendanceCount = \App\Models\Attendance::where('employee_id', $employee->id)
        ->where('status', 'present')
        ->count();

    $totalDays = \App\Models\Attendance::where('employee_id', $employee->id)->count();

    $attendanceRate = $totalDays > 0 ? round(($attendanceCount / $totalDays) * 100) : 0;

    $tax = round($employee->salary * 0.20, 2);
    $insurance = round($employee->salary * 0.05, 2);
    $netSalary = round($employee->salary - $tax - $insurance, 2);

    return response()->json([
        'employee' => $employee,
        'attendance_rate' => $attendanceRate,
        'payroll' => [
            'gross' => $employee->salary,
            'tax' => $tax,
            'insurance' => $insurance,
            'net' => $netSalary,
        ],
    ]);
}

    public function update(Request $request, Employee $employee)
{
    $data = $request->validate([
        'first_name'  => 'sometimes|string',
        'last_name'   => 'sometimes|string',
        'email'       => 'sometimes|email|unique:employees,email,' . $employee->id,
        'photo'       => 'nullable|string',
        'phone'       => 'nullable|string',
        'department'  => 'sometimes|string',
        'position'    => 'sometimes|string',
        'status'      => 'sometimes|string',
        'hire_date'   => 'sometimes|date',
        'salary'      => 'nullable|numeric',
    ]);

    $employee->update($data);
    return response()->json($employee);
}

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return response()->json(['message' => 'Employee deleted']);
    }

    public function exportPdf(Employee $employee)
{
    $tax = round($employee->salary * 0.20, 2);
    $insurance = round($employee->salary * 0.05, 2);
    $netSalary = round($employee->salary - $tax - $insurance, 2);

    $pdf = \PDF::loadView('employee-report', [
        'employee' => $employee,
        'tax' => $tax,
        'insurance' => $insurance,
        'net' => $netSalary,
    ]);

    return $pdf->download($employee->first_name . '_' . $employee->last_name . '_report.pdf');
}
}