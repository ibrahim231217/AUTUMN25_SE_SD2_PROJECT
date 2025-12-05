# 🔐 Hospital Management System - Admin Credentials

## ✅ Three Predefined Admin Accounts Created

All admin accounts have been seeded to the database and are ready to use!

---

## 📋 Admin Login Details

### **Admin 1**
```
Role:     Admin
Username: admin1
Password: Admin@123456
Email:    admin1@hospital.com
```

### **Admin 2**
```
Role:     Admin
Username: admin2
Password: Admin@234567
Email:    admin2@hospital.com
```

### **Admin 3**
```
Role:     Admin
Username: admin3
Password: Admin@345678
Email:    admin3@hospital.com
```

---

## 🚀 How to Login as Admin

1. **Go to Login Page**
   - Navigate to: `http://localhost:3001/login`

2. **Select Admin Role**
   - Click the "👨‍💼 Admin" button

3. **Enter Credentials**
   - **Username:** admin1 (or admin2 or admin3)
   - **Password:** Admin@123456 (or corresponding password)
   - Note: Admin login uses **username**, not email

4. **Submit**
   - Click "Login" button
   - You'll be redirected to the Admin Dashboard

---

## 📊 Admin Dashboard Features

Once logged in as admin, you can:

✅ **View Statistics**
- Total Patients
- Total Doctors  
- Pending Doctor Approvals
- Total Appointments
- Appointments Today

✅ **Manage Doctors**
- View all approved doctors
- Search doctors by name/email/speciality
- Delete doctors (cascade delete bookings)
- Approve pending doctors

✅ **Approve Doctors**
- View doctors awaiting approval
- Approve new doctor registrations
- Reject doctor applications

✅ **Manage Patients**
- View all patients
- Search patients by name/email
- View patient details

✅ **View Bookings**
- See all appointments in the system
- View patient and doctor details for each booking

---

## 🔑 Important Notes

- **Username Only:** Admin login uses username instead of email
- **Role-Based Access:** Only admin role can access admin features
- **Password Protection:** All passwords are hashed using bcrypt
- **Database Seeded:** These accounts are stored in MongoDB
- **Unique Credentials:** Each admin has unique username, email, and password

---

## 💡 Testing Flow

### Step 1: Register as Doctor
1. Go to `/register`
2. Select "Doctor" role
3. Fill in details (speciality required)
4. Doctor status: "⏳ Pending Approval"

### Step 2: Admin Approves Doctor
1. Login as admin1 (use credentials above)
2. Go to Admin Dashboard
3. Click "Pending Doctor Approvals"
4. Click "Approve" on the pending doctor
5. Doctor moves to "✅ Approved" list

### Step 3: Doctor Can Now Login
1. Doctor can now login with their email and password
2. Doctor can see bookings and appointments

---

## 🛡️ Security Features

✅ Password hashing (bcrypt)
✅ JWT token-based authentication
✅ Admin-only middleware on all admin routes
✅ Role validation on login
✅ Doctor approval system prevents unauthorized access

---

**Credentials Created:** December 5, 2025
**Status:** ✅ Active and Ready to Use

