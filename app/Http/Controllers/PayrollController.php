<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    public function index()
    {
        $employees = Employee::all();

        $payroll = $employees->map(function ($employee) {
            $grossSalary = $employee->salary ?? 0;
            $tax         = round($employee->salary * 0.20, 2);
            $insurance   = round($employee->salary * 0.05, 2);
            $netSalary   = round($grossSalary - $tax - $insurance, 2);

            return [
                'employee_id'   => $employee->id,
                'employee_name' => $employee->first_name . ' ' . $employee->last_name,
                'department'    => $employee->department,
                'position'      => $employee->position,
                'gross_salary'  => $grossSalary,
                'tax'           => $tax,
                'insurance'     => $insurance,
                'net_salary'    => $netSalary,
                'status'        => 'pending',
            ];
        });

        return response()->json([
            'payroll'       => $payroll,
            'total_gross'   => $payroll->sum('gross_salary'),
            'total_net'     => $payroll->sum('net_salary'),
            'total_tax'     => $payroll->sum('tax'),
            'employee_count'=> $employees->count(),
        ]);
    }
}