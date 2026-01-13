# Board Master - Troubleshooting Guide

## ✅ FIXED: "Connection Refused" / "Localhost Won't Connect"

### Problem
Browser shows "localhost refused to connect" or connection error when trying to access http://localhost:3002

### Root Cause
Port 3002 was already in use by a previous Next.js process that didn't shut down cleanly.

**Error Message**:
```
Error: listen EADDRINUSE: address already in use :::3002
```

### Solution

#### Quick Fix (Kill the process and restart)

```bash
# 1. Find the process using port 3002
lsof -ti:3002

# 2. Kill the process (replace PID with the number from step 1)
kill -9 <PID>

# Example:
# lsof -ti:3002
# Output: 36846
# kill -9 36846

# 3. Start the server again
cd /Users/rodrigo.seoane/Local\ Sites/task-manager
npm run dev
```

#### One-Line Fix

```bash
# Kill any process on port 3002 and start server
lsof -ti:3002 | xargs kill -9 2>/dev/null; cd /Users/rodrigo.seoane/Local\ Sites/task-manager && npm run dev
```

---

## Common Issues & Solutions

### 1. Port Already in Use

**Symptoms**:
- `EADDRINUSE: address already in use :::3002`
- Server won't start
- Connection refused

**Solution**:
```bash
# Kill process on port 3002
kill -9 $(lsof -ti:3002)

# Or use a different port
npm run dev -- -p 3003
```

---

### 2. Middleware Edge Runtime Error

**Symptoms**:
- `The edge runtime does not support Node.js 'crypto' module`
- Runtime error on all pages

**Solution**:
✅ Already fixed in [middleware.ts](middleware.ts:1)

The middleware now checks session cookies directly instead of using NextAuth's `auth()` wrapper.

**If error returns**: Check that middleware.ts doesn't import `auth` from `@/lib/auth`

---

### 3. Build Fails - TypeScript Errors

**Symptoms**:
- `Failed to compile`
- TypeScript type errors

**Solution**:
```bash
# Check for missing dependencies
npm install

# Install missing types
npm install --save-dev @types/pg

# Rebuild
npm run build
```

---

### 4. Database Connection Error

**Symptoms**:
- `Can't reach database server`
- Prisma errors on startup

**Solution**:
```bash
# 1. Check if Prisma dev database is running
ps aux | grep prisma

# 2. Start Prisma dev database
npx prisma dev --name board-master-dev

# 3. In another terminal, start Next.js
npm run dev
```

---

### 5. Module Not Found Errors

**Symptoms**:
- `Cannot find module 'next-auth'`
- Missing dependency errors

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma Client
npx prisma generate

# Rebuild
npm run build
```

---

### 6. Session Not Persisting / Login Not Working

**Symptoms**:
- Login appears successful but redirects back to login
- Session doesn't persist across pages
- Dashboard redirects to login immediately

**Solution**:

**Check 1**: Environment variables
```bash
cat .env | grep NEXTAUTH
# Should show:
# NEXTAUTH_URL="http://localhost:3002"
# NEXTAUTH_SECRET="your-secret-here"
```

**Check 2**: Cookies in browser
- Open DevTools → Application → Cookies
- Look for `authjs.session-token` or `__Secure-authjs.session-token`
- If missing after login, NextAuth isn't creating sessions

**Check 3**: NextAuth configuration
```bash
# Verify auth.ts and auth.config.ts exist
ls -la lib/auth*
```

---

### 7. Page Won't Load / Blank Screen

**Symptoms**:
- White screen
- Nothing renders
- Console shows component errors

**Solution**:

**Check 1**: Browser console
```
F12 → Console tab
Look for errors
```

**Check 2**: Server logs
```bash
# Check the terminal where npm run dev is running
# Look for compilation errors or runtime errors
```

**Check 3**: Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

---

### 8. Styles Not Loading

**Symptoms**:
- No colors, no fonts
- Plain HTML only
- CSS variables not working

**Solution**:

**Check 1**: globals.css is loading
```bash
# Verify file exists
cat app/globals.css | head -20

# Should see CSS variables defined
```

**Check 2**: Fonts loading
```bash
# Check layout.tsx imports fonts
grep "Slackey\|Poppins" app/layout.tsx
```

**Check 3**: Hard refresh browser
```
Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
Firefox: Ctrl+F5 or Cmd+Shift+R
```

---

### 9. Form Validation Not Working

**Symptoms**:
- Forms submit without validation
- Error messages don't show
- Zod validation not triggering

**Solution**:

**Check 1**: Dependencies installed
```bash
npm list react-hook-form zod @hookform/resolvers
```

**Check 2**: Form setup
```typescript
// Should have resolver
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(YourSchema),
});
```

---

### 10. Database Changes Not Reflecting

**Symptoms**:
- New fields don't appear
- Schema changes ignored
- Prisma errors about missing columns

**Solution**:
```bash
# Push schema changes to database
npx prisma db push

# Or create and apply migration
npx prisma migrate dev --name your_change_name

# Regenerate Prisma Client
npx prisma generate

# Restart dev server
# Ctrl+C in terminal, then npm run dev
```

---

## Diagnostic Commands

### Check System Status

```bash
# Check if server is running
lsof -ti:3002

# Check if database is running
ps aux | grep prisma | grep -v grep

# Check environment variables
cat .env | grep -E "NEXTAUTH|DATABASE"

# Check build status
npm run build
```

### View Logs

```bash
# Next.js server logs
# (In terminal where npm run dev is running)

# Database logs
npx prisma studio
# Opens GUI to inspect database
```

### Clean Start

```bash
# Full reset
kill -9 $(lsof -ti:3002) 2>/dev/null
rm -rf .next node_modules
npm install
npx prisma generate
npm run build
npm run dev
```

---

## Preventive Measures

### Before Starting Work

```bash
# 1. Pull latest changes (if using Git)
git pull

# 2. Update dependencies
npm install

# 3. Check database
npx prisma db push

# 4. Start server
npm run dev
```

### Before Stopping Work

```bash
# 1. Commit changes
git add .
git commit -m "Your message"

# 2. Stop server cleanly
# Press Ctrl+C in terminal running npm run dev
# Wait for "Server stopped" message

# 3. Check no processes left running
lsof -ti:3002
# Should return nothing
```

### Regular Maintenance

```bash
# Weekly: Update dependencies
npm update

# Weekly: Check for unused packages
npm prune

# Monthly: Audit security
npm audit
npm audit fix
```

---

## Quick Reference

| Issue | Command |
|-------|---------|
| Port in use | `kill -9 $(lsof -ti:3002)` |
| Clear cache | `rm -rf .next` |
| Reinstall deps | `rm -rf node_modules && npm install` |
| Update database | `npx prisma db push` |
| View database | `npx prisma studio` |
| Rebuild | `npm run build` |
| Start server | `npm run dev` |

---

## Still Having Issues?

### Check Documentation
- [PHASE2_READY.md](PHASE2_READY.md) - Testing guide
- [QUICK_START.md](QUICK_START.md) - Setup instructions
- [CONNECTION_FIX.md](CONNECTION_FIX.md) - Port configuration
- [RUNTIME_ERROR_FIX.md](RUNTIME_ERROR_FIX.md) - Edge runtime fixes

### Check Logs
1. Terminal where `npm run dev` is running
2. Browser console (F12 → Console)
3. Network tab (F12 → Network)

### Get Help
- Check Next.js docs: https://nextjs.org/docs
- Check Prisma docs: https://www.prisma.io/docs
- Check NextAuth docs: https://next-auth.js.org

---

**Last Updated**: January 11, 2026
**Current Version**: Phase 2 Complete
**Server Status**: ✅ RUNNING on http://localhost:3002
