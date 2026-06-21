<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\LeaveRequestController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user()->load('employee');
    });

    // Employees: admin + manager can manage, employee can only view
    Route::middleware('role:admin,manager')->group(function () {
        Route::post('/employees', [EmployeeController::class, 'store']);
        Route::put('/employees/{employee}', [EmployeeController::class, 'update']);
        Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy']);
    });
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::get('/employees/{employee}', [EmployeeController::class, 'show']);
    Route::get('/employees/{employee}/export', [EmployeeController::class, 'exportPdf']);

    // Attendance: admin + manager can update, everyone can view
    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::middleware('role:admin,manager')->group(function () {
        Route::post('/attendance', [AttendanceController::class, 'store']);
    });

    // Leave Requests: employees can submit, admin/manager can approve/reject
    Route::get('/leave-requests', [LeaveRequestController::class, 'index']);
    Route::post('/leave-requests', [LeaveRequestController::class, 'store']);
    Route::put('/leave-requests/{leaveRequest}', [LeaveRequestController::class, 'update']);
    Route::delete('/leave-requests/{leaveRequest}', [LeaveRequestController::class, 'destroy']);

    // Payroll: admin only
    Route::middleware('role:admin')->group(function () {
        Route::get('/payroll', [PayrollController::class, 'index']);
    });
});