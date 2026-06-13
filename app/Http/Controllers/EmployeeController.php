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
        return response()->json($employee);
    }

    public function update(Request $request, Employee $employee)
    {
        $data = $request->validate([
            'first_name'  => 'sometimes|string',
            'last_name'   => 'sometimes|string',
            'email'       => 'sometimes|email|unique:employees,email,' . $employee->id,
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
}