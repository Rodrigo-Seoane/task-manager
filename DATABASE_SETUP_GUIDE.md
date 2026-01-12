# Database Setup & Troubleshooting Guide

## ✅ SOLUTION: Database Was Not Running

### The Problem You Encountered

**Error**: "An unexpected error occurred. Please try again."

**Root Cause**: The Prisma dev database wasn't running when you tried to sign up.

---

## 🚀 Quick Fix (What I Just Did)

```bash
# 1. Start Prisma dev database
npx prisma dev --name board-master-dev

# 2. Regenerate Prisma Client
npx prisma generate

# 3. Restart Next.js server
# Kill old server: Ctrl+C or kill -9 $(lsof -ti:3002)
npm run dev
```

---

## 📋 How to Check if Database is Running

### Method 1: Check Process
```bash
ps aux | grep "prisma dev" | grep -v grep
```

**Expected Output** (if running):
```
rodrigo.seoane   29656   0.0  0.1 node prisma dev --name board-master-dev
```

**If empty**: Database is NOT running

### Method 2: Test Connection
```bash
npx prisma db pull
```

**Success**:
```
✓ Introspecting based on datasource
Database schema synced
```

**Failure**:
```
Error: P1001
Can't reach database server at `localhost:51217`
```

---

## 🔧 Starting the Database (REQUIRED Before npm run dev)

### Option 1: Separate Terminal (Recommended)

**Terminal 1 - Database**:
```bash
cd /Users/rodrigo.seoane/Local\ Sites/task-manager
npx prisma dev --name board-master-dev
# Keep this terminal open
```

**Terminal 2 - Next.js**:
```bash
cd /Users/rodrigo.seoane/Local\ Sites/task-manager
npm run dev
```

### Option 2: Background Process
```bash
# Start database in background
npx prisma dev --name board-master-dev &

# Wait 5 seconds for database to start
sleep 5

# Start Next.js
npm run dev
```

---

## 🗄️ Viewing Your Database

### Prisma Studio (GUI)

**Start**:
```bash
npx prisma studio
```

**Access**: http://localhost:5555

**Features**:
- ✅ View all tables (Tutor, Learner, WeeklyCycle, Task)
- ✅ See table data
- ✅ Add/edit/delete records manually
- ✅ Test queries

### Verify Tables Exist

In Prisma Studio, you should see:
- ✅ Tutor table
- ✅ Learner table
- ✅ WeeklyCycle table
- ✅ Task table
- ✅ TaskCompletion table

---

## 🧪 Testing Tutor Signup

### Method 1: Browser (Easiest)

1. Make sure database is running
2. Visit http://localhost:3002/tutor/signup
3. Fill in form:
   - **Full Name**: Test Tutor
   - **Email**: test@example.com
   - **Password**: TestPass123
   - **Confirm Password**: TestPass123
4. Click "Create Account"

**Success**: Redirects to login with green message

**Failure**: Shows error message

### Method 2: curl (for debugging)

```bash
curl -X POST http://localhost:3002/api/auth/tutor/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "fullName": "Test Tutor"
  }'
```

**Success Response**:
```json
{
  "message": "Account created successfully",
  "tutor": {
    "id": "...",
    "email": "test@example.com",
    "fullName": "Test Tutor"
  }
}
```

**Error Response**:
```json
{
  "error": "An unexpected error occurred. Please try again."
}
```

### Method 3: Check in Prisma Studio

After signup:
1. Open http://localhost:5555
2. Click "Tutor" table
3. Should see your new record with:
   - ✅ id (UUID)
   - ✅ email
   - ✅ fullName
   - ✅ passwordHash (encrypted)
   - ✅ createdAt timestamp

---

## 🔍 Common Errors & Solutions

### Error: "Can't reach database server"

**Cause**: Database not running

**Solution**:
```bash
npx prisma dev --name board-master-dev
```

### Error: "Validation failed"

**Cause**: Form validation error

**Check**:
- Email is valid format
- Password is at least 8 characters
- Password has uppercase, lowercase, and number
- Passwords match

### Error: "Account with this email already exists"

**Cause**: Email already in database

**Solution**:
- Use different email, OR
- Delete existing record in Prisma Studio

### Request Hangs/Times Out

**Cause**: Database not running or Prisma Client not generated

**Solution**:
```bash
# 1. Start database
npx prisma dev --name board-master-dev

# 2. Regenerate client
npx prisma generate

# 3. Restart server
kill -9 $(lsof -ti:3002)
npm run dev
```

---

## 📊 Database Connection Details

### Current Setup

**Connection String** (in .env):
```
DATABASE_URL="postgres://postgres:postgres@localhost:51217/template1?sslmode=disable"
```

**Ports**:
- 51216: HTTP connection (not used in this project)
- **51217**: TCP connection (used by Prisma)
- 51218: Shadow database

**Database Name**: `template1`
**Schema**: `public`

---

## 🔄 Resetting the Database

### Option 1: Soft Reset (Keep Schema)
```bash
# This keeps tables but clears data
npx prisma db push --force-reset
```

### Option 2: Fresh Start
```bash
# 1. Stop database
pkill -f "prisma dev"

# 2. Remove local data
rm -rf ~/.prisma/databases/*

# 3. Start fresh
npx prisma dev --name board-master-dev

# 4. Push schema
npx prisma db push

# 5. Restart server
npm run dev
```

---

## ✅ Startup Checklist

Before testing signup, ensure:

- [ ] Prisma dev database is running (`ps aux | grep "prisma dev"`)
- [ ] Port 51217 is listening (`lsof -i:51217`)
- [ ] Prisma Client is generated (`npx prisma generate`)
- [ ] Next.js server is running (`lsof -i:3002`)
- [ ] Can access homepage (http://localhost:3002)
- [ ] Prisma Studio works (http://localhost:5555)

---

## 🎯 Current Status

After my fixes:

✅ Database started: Running on port 51217
✅ Tables created: All 5 tables exist
✅ Prisma Client: Generated
✅ Server: Running on port 3002

**You should now be able to sign up!**

---

## 📝 Daily Startup Routine

**Every time you start working**:

```bash
# Terminal 1: Database
cd /Users/rodrigo.seoane/Local\ Sites/task-manager
npx prisma dev --name board-master-dev
# Leave this running

# Terminal 2: Next.js (in new terminal)
cd /Users/rodrigo.seoane/Local\ Sites/task-manager
npm run dev
# Leave this running

# Terminal 3: Prisma Studio (optional, in new terminal)
cd /Users/rodrigo.seoane/Local\ Sites/task-manager
npx prisma studio
# Opens browser at localhost:5555
```

---

## 🐛 Debugging Tips

### Check Server Logs

**Watch in real-time**:
```bash
# Server logs show up in terminal where you ran npm run dev
# Look for:
POST /api/auth/tutor/signup 500  # Error
POST /api/auth/tutor/signup 201  # Success
```

### Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Try signup
4. Look for errors in red

### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try signup
4. Click on the POST request
5. Check:
   - **Status**: Should be 201 (success) or 400/500 (error)
   - **Response**: See actual error message
   - **Request**: Verify data being sent

---

**Last Updated**: January 11, 2026
**Issue**: Database not running
**Status**: ✅ FIXED
**Next**: Try signing up again!
