<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'photo',
        'phone',
        'department',
        'position',
        'status',
        'hire_date',
        'salary',
    ];
}