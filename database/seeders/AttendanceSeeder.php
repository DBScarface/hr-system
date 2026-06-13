<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attendance;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $today = Carbon::today()->toDateString();
        $yesterday = Carbon::yesterday()->toDateString();

        $records = [
            ['employee_id' => 1, 'date' => $today, 'check_in' => '08:55', 'check_out' => null, 'status' => 'present'],
            ['employee_id' => 2, 'date' => $today, 'check_in' => '09:10', 'check_out' => null, 'status' => 'late'],
            ['employee_id' => 3, 'date' => $today, 'check_in' => null, 'check_out' => null, 'status' => 'on_leave'],
            ['employee_id' => 4, 'date' => $today, 'check_in' => '08:45', 'check_out' => null, 'status' => 'present'],
            ['employee_id' => 5, 'date' => $today, 'check_in' => '09:00', 'check_out' => null, 'status' => 'present'],
            ['employee_id' => 6, 'date' => $today, 'check_in' => null, 'check_out' => null, 'status' => 'absent'],

            ['employee_id' => 1, 'date' => $yesterday, 'check_in' => '08:50', 'check_out' => '17:30', 'status' => 'present'],
            ['employee_id' => 2, 'date' => $yesterday, 'check_in' => '09:00', 'check_out' => '18:00', 'status' => 'present'],
            ['employee_id' => 3, 'date' => $yesterday, 'check_in' => null, 'check_out' => null, 'status' => 'on_leave'],
            ['employee_id' => 4, 'date' => $yesterday, 'check_in' => '08:30', 'check_out' => '17:00', 'status' => 'present'],
            ['employee_id' => 5, 'date' => $yesterday, 'check_in' => '09:15', 'check_out' => '17:45', 'status' => 'late'],
            ['employee_id' => 6, 'date' => $yesterday, 'check_in' => '08:55', 'check_out' => '17:15', 'status' => 'present'],
        ];

        foreach ($records as $record) {
            Attendance::create($record);
        }
    }
}