# Veltahr

A full-stack HR management system I'm building to get back into web development after a few years away from coding. Started as a simple CRUD app, turned into something bigger once I started adding role-based access and self-service features.

Built with Laravel (API backend) + React (frontend) + MySQL.

## What it does right now

- Login/auth with Laravel Sanctum, token-based
- Three roles: admin, manager, employee — each sees a different version of the app
- Employee management (add, edit, delete, view profile) — admin/manager only
- Attendance tracking with daily check-in/check-out status, employees only see their own record
- Payroll with automatic tax/insurance calculation — admin only
- Leave requests — employees submit, admin/manager approve or reject, approved leave automatically updates attendance
- PDF export for individual employee reports
- Photo upload on employee profiles
- Dashboard that changes depending on who's logged in (admin sees company-wide stuff, employees get a simplified view with quick links)
- Dark mode and EN/FR language switch, both persist across the whole app
- Basic reports page — headcount by department, attendance breakdown, payroll by department

## Tech stack

**Backend:** Laravel 13, MySQL, Sanctum for API auth
**Frontend:** React 18 (via Vite, no Next.js or anything, just plain React + React Router), Axios for API calls
**Styling:** plain inline styles for now, no Tailwind/component library — wanted full control over the design while I was figuring out a visual identity for the app

## Why I'm building this

I have an engineering degree in IT but ended up working in a contact center for almost two years with zero coding. This is mainly a way to relearn the stack properly and have something real to show instead of another todo-list tutorial project. Trying to make it look and behave like something that could actually ship, not just a CRUD demo.

## Setup

You'll need PHP 8.2+, Composer, Node, and MySQL running locally.

```bash
git clone https://github.com/DBScarface/hr-system.git
cd hr-system

# backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` and point it at your MySQL database:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hr_system
DB_USERNAME=root
DB_PASSWORD=your_password 

Then:
```bash
php artisan migrate
php artisan db:seed --class=EmployeeSeeder
php artisan db:seed --class=AttendanceSeeder

# frontend
npm install
```

Run it (needs three terminals, or use a process manager if you've got one set up):
```bash
php artisan serve
npm run dev
```

Visit `http://127.0.0.1:8000`.

There's no registration page yet — accounts get created manually via `php artisan tinker`. Default admin login needs to be created the same way; check `AuthController.php` for how the login endpoint expects credentials.

## Status

This is not finished. It's a side project I work on in between other things, so expect gaps. Known stuff that's missing or half-built:

- No real document storage (the "document vault" on employee profiles is a placeholder)
- Performance reviews section on employee profiles is also just a placeholder — no backend for it yet
- No email notifications anywhere
- No tests written yet (I know, I know)
- Manager role exists but currently has close to the same permissions as admin except payroll — needs more granular separation
- Mobile responsiveness hasn't really been considered, this is desktop-first right now

If you're looking at this as a recruiter or admissions reviewer — this is meant to show where I am right now, actively rebuilding my skills, not a polished final product. Happy to walk through any part of the code or the decisions behind it.

## License

Not decided yet, treat it as all rights reserved for now.