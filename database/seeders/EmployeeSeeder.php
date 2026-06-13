<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $employees = [
            ['first_name' => 'Sara', 'last_name' => 'Rami', 'email' => 'sara.rami@veltahr.com', 'phone' => '+212 6 11 22 33 44', 'department' => 'Design', 'position' => 'UX Designer', 'status' => 'active', 'hire_date' => '2023-03-15', 'salary' => 8500],
            ['first_name' => 'Karim', 'last_name' => 'Alaoui', 'email' => 'karim.alaoui@veltahr.com', 'phone' => '+212 6 22 33 44 55', 'department' => 'Engineering', 'position' => 'Backend Engineer', 'status' => 'active', 'hire_date' => '2022-07-01', 'salary' => 12000],
            ['first_name' => 'Nadia', 'last_name' => 'Bennani', 'email' => 'nadia.bennani@veltahr.com', 'phone' => '+212 6 33 44 55 66', 'department' => 'People', 'position' => 'HR Manager', 'status' => 'on_leave', 'hire_date' => '2021-01-10', 'salary' => 11000],
            ['first_name' => 'Youssef', 'last_name' => 'Mansouri', 'email' => 'youssef.mansouri@veltahr.com', 'phone' => '+212 6 44 55 66 77', 'department' => 'Engineering', 'position' => 'Data Analyst', 'status' => 'active', 'hire_date' => '2023-09-01', 'salary' => 9500],
            ['first_name' => 'Leila', 'last_name' => 'Fassi', 'email' => 'leila.fassi@veltahr.com', 'phone' => '+212 6 55 66 77 88', 'department' => 'Sales', 'position' => 'Sales Manager', 'status' => 'active', 'hire_date' => '2022-04-20', 'salary' => 10500],
            ['first_name' => 'Omar', 'last_name' => 'Tazi', 'email' => 'omar.tazi@veltahr.com', 'phone' => '+212 6 66 77 88 99', 'department' => 'Engineering', 'position' => 'Frontend Engineer', 'status' => 'active', 'hire_date' => '2024-01-15', 'salary' => 9000],
        ];

        foreach ($employees as $emp) {
            Employee::create($emp);
        }
    }
}