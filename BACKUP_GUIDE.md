# Board Master - Backup & Version Control Guide

## 🎯 Quick Backup Before Starting New Phase

Before starting any new phase of development, follow these steps to create a safe backup point:

### Method 1: Git Commit (Recommended)

```bash
# 1. Check current status
git status

# 2. Add all changes
git add .

# 3. Create a commit with phase marker
git commit -m "✅ Phase 2 Complete: Tutor Onboarding

- Implemented tutor signup/login
- Created dashboard with learner management
- Added learner creation with PIN setup
- All tests passing, build successful"

# 4. Create a tag for this milestone
git tag -a phase-2-complete -m "Phase 2: Tutor Onboarding Complete"

# 5. Push to remote (if you have one set up)
git push origin main
git push origin --tags
```

### Method 2: Manual Backup (Additional Safety)

```bash
# Create a timestamped backup of the entire project
cd /Users/rodrigo.seoane/Local\ Sites/
tar -czf "task-manager-backup-$(date +%Y%m%d-%H%M%S).tar.gz" task-manager/

# Or create a backup excluding node_modules (faster, smaller)
cd /Users/rodrigo.seoane/Local\ Sites/task-manager
tar -czf "../task-manager-phase2-$(date +%Y%m%d).tar.gz" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.turbo' \
  --exclude='dist' \
  .

# Verify backup was created
ls -lh ../task-manager-*.tar.gz
```

### Method 3: Database Backup

```bash
# Backup your PostgreSQL database
pg_dump -h localhost -p 51217 -U postgres template1 > backup-phase2-$(date +%Y%m%d).sql

# Or using Prisma
npx prisma db pull --force  # Update schema from database
npx prisma db push         # Ensure migrations are applied
```

---

## 📋 Pre-Phase Checklist

Before starting a new phase, verify:

- [ ] All current phase tasks are complete
- [ ] Build is successful (`npm run build`)
- [ ] No TypeScript errors
- [ ] All tests pass (when implemented)
- [ ] Git status is clean or committed
- [ ] Backup created (git tag or tarball)
- [ ] Database migrations are applied
- [ ] Documentation is updated

---

## 🔄 Restoring from Backup

### Restore from Git Tag

```bash
# List available tags
git tag -l

# View tag details
git show phase-2-complete

# Restore to a specific tag (creates new branch)
git checkout -b restore-from-phase-2 phase-2-complete

# Or reset current branch to tag (DESTRUCTIVE)
git reset --hard phase-2-complete
```

### Restore from Tarball

```bash
# Extract backup to new location
cd /Users/rodrigo.seoane/Local\ Sites/
tar -xzf task-manager-backup-20260111.tar.gz -C task-manager-restored/

# Or overwrite current (CAREFUL!)
cd /Users/rodrigo.seoane/Local\ Sites/task-manager
rm -rf node_modules .next  # Clean first
cd ..
tar -xzf task-manager-backup-20260111.tar.gz

# Reinstall dependencies
cd task-manager
npm install
npx prisma generate
```

### Restore Database

```bash
# From SQL dump
psql -h localhost -p 51217 -U postgres template1 < backup-phase2-20260111.sql

# Or reset and re-migrate
npx prisma migrate reset --force
npx prisma migrate deploy
```

---

## 🏷️ Git Tagging Strategy

Use semantic tags for each phase:

```bash
# Phase completion tags
git tag -a phase-1-complete -m "Foundation complete"
git tag -a phase-2-complete -m "Tutor onboarding complete"
git tag -a phase-3-complete -m "Weekly cycle creation complete"

# Feature tags
git tag -a feature-auth -m "Authentication system complete"
git tag -a feature-dashboard -m "Dashboard implementation complete"

# Pre-deployment tags
git tag -a pre-deploy-mvp -m "Ready for MVP deployment"
git tag -a v1.0.0 -m "MVP Release"
```

---

## 📁 Backup Storage Recommendations

### Local Backups
```
/Users/rodrigo.seoane/Backups/
├── task-manager/
│   ├── phase-1-complete-20260109.tar.gz
│   ├── phase-2-complete-20260111.tar.gz
│   ├── database-phase-2-20260111.sql
│   └── README.txt (notes about each backup)
```

### Cloud Backup Options

1. **GitHub/GitLab** (Code only)
   - Free private repositories
   - Version control built-in
   - Easy rollback

2. **Google Drive / Dropbox** (Full backups)
   - Upload tarball backups
   - 15GB free (Google Drive)
   - Automatic sync

3. **Time Machine** (macOS)
   - Automatic hourly backups
   - Restore from Finder
   - Requires external drive

---

## 🚨 Emergency Recovery

If something breaks during development:

### Quick Rollback (Git)
```bash
# See recent commits
git log --oneline -10

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Restore specific file
git checkout HEAD -- path/to/file.tsx
```

### Clean Slate
```bash
# Reset to last working state
git reset --hard phase-2-complete

# Clean all untracked files
git clean -fd

# Reinstall dependencies
npm install
npx prisma generate

# Rebuild
npm run build
```

### Database Recovery
```bash
# Reset to last known good state
npx prisma migrate reset --force

# Re-apply migrations
npx prisma migrate deploy

# Or restore from backup
psql -h localhost -p 51217 -U postgres template1 < backup.sql
```

---

## 📊 Backup Schedule Recommendation

**Daily Development:**
- Commit to git after each feature/fix
- Tag at end of work session if significant progress

**Phase Completion:**
- Git commit + tag
- Create tarball backup
- Database dump
- Update documentation

**Before Major Changes:**
- Full backup (code + database)
- Test restore process
- Document changes

**Weekly:**
- Push to remote repository
- Create weekly snapshot
- Archive old backups (keep last 4 weeks)

---

## ✅ Current Backup Status

### Phase 2 Complete - Ready to Backup

**Before starting Phase 3, run:**

```bash
# Create Phase 2 checkpoint
cd /Users/rodrigo.seoane/Local\ Sites/task-manager

# Git backup
git add .
git commit -m "✅ Phase 2 Complete: Tutor Onboarding"
git tag -a phase-2-complete -m "Phase 2: Tutor Onboarding - All features working"

# File backup
cd ..
tar -czf "task-manager-phase2-$(date +%Y%m%d).tar.gz" \
  --exclude='node_modules' \
  --exclude='.next' \
  task-manager/

# Database backup
cd task-manager
pg_dump -h localhost -p 51217 -U postgres template1 > \
  "../task-manager-db-phase2-$(date +%Y%m%d).sql"

# Verify
git tag -l
ls -lh ../task-manager-phase2-*.tar.gz
ls -lh ../task-manager-db-phase2-*.sql
```

**Estimated Backup Sizes:**
- Code (no node_modules): ~5-10 MB
- Database (Phase 2): ~1-2 MB
- Full with dependencies: ~300-400 MB

---

## 🔐 Security Notes

**Do NOT backup these files to public repos:**
- `.env` (contains secrets)
- `node_modules/` (too large, reinstall instead)
- `.next/` (build artifacts, regenerate)
- Database dumps with real user data

**Safe to backup:**
- All source code (`.ts`, `.tsx`, `.md`)
- `package.json` and `package-lock.json`
- `prisma/schema.prisma`
- Configuration files
- Documentation

---

## 📝 Backup Verification Checklist

After creating a backup:

- [ ] Git tag created and visible (`git tag -l`)
- [ ] Tarball created and correct size (`ls -lh *.tar.gz`)
- [ ] Can list tarball contents (`tar -tzf backup.tar.gz | head`)
- [ ] Database dump created (`ls -lh *.sql`)
- [ ] Build still works (`npm run build`)
- [ ] Documentation updated with backup details

---

**Last Updated:** January 11, 2026
**Current Phase:** Phase 2 Complete ✅
**Next Phase:** Phase 3 - Weekly Cycle Creation
