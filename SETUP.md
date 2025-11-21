# PC Builder Platform - Setup Guide

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Estimated Setup Time**: 15-30 minutes

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Running the Application](#running-the-application)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)
9. [Next Steps](#next-steps)

---

## Prerequisites

### Required Software

Before you begin, ensure you have the following installed:

#### 1. Node.js (v24)

```bash
# Check if Node.js is installed
node --version
# Should output: v24.x.x

# Install using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 24
nvm use 24
```

**Download Links:**
- [Node.js Official Website](https://nodejs.org/)
- [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm)

#### 2. PNPM (v9.0.0 or higher)

```bash
# Check if PNPM is installed
pnpm --version
# Should output: 9.x.x

# Install PNPM globally
npm install -g pnpm@9

# Or using npm
npm install -g pnpm

# Or using Homebrew (macOS)
brew install pnpm
```

#### 3. MySQL Database (8.0+)

**Option A: Local Installation**

```bash
# macOS (using Homebrew)
brew install mysql
brew services start mysql

# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql

# Windows
# Download from: https://dev.mysql.com/downloads/installer/
```

**Option B: Docker (Recommended for Development)**

```bash
# Pull MySQL image
docker pull mysql:8.0

# Run MySQL container
docker run --name pc-builder-mysql \
  -e MYSQL_ROOT_PASSWORD=yourpassword \
  -e MYSQL_DATABASE=pc_builder \
  -p 3306:3306 \
  -d mysql:8.0

# Verify it's running
docker ps | grep pc-builder-mysql
```

**Option C: Cloud Database**
- [PlanetScale](https://planetscale.com/) - MySQL-compatible, free tier
- [Amazon RDS](https://aws.amazon.com/rds/)
- [Google Cloud SQL](https://cloud.google.com/sql)

#### 4. Git

```bash
# Check if Git is installed
git --version

# Install Git
# macOS
brew install git

# Ubuntu/Debian
sudo apt install git

# Windows
# Download from: https://git-scm.com/download/win
```

---

## System Requirements

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| **OS** | macOS 10.15+, Windows 10+, Ubuntu 20.04+ |
| **CPU** | 2 cores |
| **RAM** | 4 GB |
| **Disk** | 2 GB free space |
| **Node.js** | v24.x |

### Recommended Requirements

| Component | Requirement |
|-----------|-------------|
| **OS** | macOS 12+, Windows 11+, Ubuntu 22.04+ |
| **CPU** | 4+ cores |
| **RAM** | 8+ GB |
| **Disk** | 5+ GB free space (SSD preferred) |
| **Node.js** | v24.x (latest) |

---

## Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd pc-builder

# Or if using SSH
git clone git@github.com:username/pc-builder.git
cd pc-builder
```

### Step 2: Verify Node Version

```bash
# Check Node version
node --version
# Should show v24.x.x

# If using nvm, use the project's Node version
nvm use
# This reads from .nvmrc file
```

### Step 3: Install Dependencies

```bash
# Install all dependencies using PNPM workspaces
pnpm install

# This will install dependencies for:
# - Root workspace
# - All apps (admin, builder, server)
# - All packages (api, db, ui, configs)
```

**Expected Output:**
```
Lockfile is up to date, resolution step is skipped
Already up to date
Progress: resolved X, reused X, downloaded 0, added 0, done

dependencies:
+prettier 3.6.2
+turbo 2.6.1
+typescript 5.9.2

Done in 15s
```

### Step 4: Verify Installation

```bash
# Check if all packages are installed
pnpm list --depth=0

# You should see all workspace packages listed
```

---

## Database Setup

### Step 1: Create Database

#### Using MySQL CLI

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE pc_builder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (optional, recommended for security)
CREATE USER 'pcbuilder'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON pc_builder.* TO 'pcbuilder'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
exit;
```

#### Using Docker

```bash
# If using Docker, the database is already created
# Connect to verify
docker exec -it pc-builder-mysql mysql -uroot -pyourpassword

# Check database exists
SHOW DATABASES;
# Should show: pc_builder

exit;
```

### Step 2: Configure Database Connection

```bash
# Navigate to database package
cd packages/db

# Create .env file from example (if exists)
cp .env.example .env

# Or create new .env file
touch .env
```

Edit `packages/db/.env`:

```env
# MySQL connection string format:
# DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# Local MySQL
DATABASE_URL="mysql://root:yourpassword@localhost:3306/pc_builder"

# Or with custom user
DATABASE_URL="mysql://pcbuilder:your_secure_password@localhost:3306/pc_builder"

# Docker MySQL
DATABASE_URL="mysql://root:yourpassword@127.0.0.1:3306/pc_builder"

# PlanetScale (example)
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/pc_builder?sslaccept=strict"
```

### Step 3: Run Database Migrations

```bash
# From project root
cd pc-builder

# Generate Prisma Client
pnpm prisma:generate

# Run migrations
cd packages/db
pnpm prisma migrate dev

# You should see:
# ✔ Generated Prisma Client
# ✔ Applied migration(s)
```

**Expected Output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": MySQL database "pc_builder" at "localhost:3306"

Applying migration `20240101000000_init`

The following migration(s) have been applied:

migrations/
  └─ 20240101000000_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (7.0.0) to ./node_modules/@prisma/client
```

### Step 4: Verify Database Schema

```bash
# Open Prisma Studio (visual database browser)
cd packages/db
pnpm prisma studio

# Opens browser at: http://localhost:5555
# You should see the Component table
```

Or verify using MySQL:

```bash
mysql -u root -p pc_builder

# Show tables
SHOW TABLES;
# Should show: Component

# Describe table
DESCRIBE Component;

exit;
```

---

## Environment Configuration

### Root Environment (Optional)

Create `.env` in project root (if needed):

```env
# Node environment
NODE_ENV=development

# Enable debug logging (optional)
DEBUG=true
```

### Admin App Environment (Optional)

Create `apps/admin/.env.local`:

```env
# API URL (if using standalone server)
NEXT_PUBLIC_API_URL=http://localhost:4000/trpc

# App-specific settings
NEXT_PUBLIC_APP_NAME="PC Builder Admin"
```

### Builder App Environment (Optional)

Create `apps/builder/.env.local`:

```env
# API URL (if using standalone server)
NEXT_PUBLIC_API_URL=http://localhost:4000/trpc

# App-specific settings
NEXT_PUBLIC_APP_NAME="PC Builder"
```

### Server Environment (Optional)

Create `apps/server/.env`:

```env
# Server port
PORT=4000

# CORS origins
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Node environment
NODE_ENV=development
```

---

## Running the Application

### Option 1: Run All Applications (Recommended)

```bash
# From project root
pnpm dev

# This starts:
# - Admin Dashboard (http://localhost:3001)
# - Builder App (http://localhost:3000)
# - Standalone Server (http://localhost:4000)
```

**Expected Output:**
```
• admin:dev: ready started server on [::]:3001
• builder:dev: ready started server on [::]:3000
• server:dev: Server listening at http://localhost:4000
```

### Option 2: Run Individual Applications

#### Admin Dashboard Only

```bash
pnpm dev --filter=@repo/admin

# Opens at: http://localhost:3001
```

#### Builder App Only

```bash
pnpm dev --filter=@repo/builder

# Opens at: http://localhost:3000
```

#### Standalone Server Only

```bash
pnpm dev --filter=@repo/server

# Runs at: http://localhost:4000
```

### Option 3: Run in Different Terminals

```bash
# Terminal 1 - Admin
cd apps/admin
pnpm dev

# Terminal 2 - Builder
cd apps/builder
pnpm dev

# Terminal 3 - Server
cd apps/server
pnpm dev
```

---

## Verification

### Step 1: Check All Services

```bash
# Check if all ports are listening
lsof -i :3000  # Builder
lsof -i :3001  # Admin
lsof -i :4000  # Server

# Or on Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :4000
```

### Step 2: Access Admin Dashboard

1. Open browser: http://localhost:3001
2. You should see the admin dashboard
3. Navigate to "Components" page
4. Verify empty state or existing components

### Step 3: Test API Connection

```bash
# Test tRPC endpoint (if using standalone server)
curl http://localhost:4000/trpc/component.list

# You should get a response (even if empty)
```

### Step 4: Create Test Component

1. Go to Admin Dashboard: http://localhost:3001/components
2. Click "Add Component"
3. Fill in form:
   - Name: "Test CPU"
   - Type: CPU
   - Price: 299.99
   - Add specifications (cores, threads, etc.)
4. Click "Create"
5. Verify component appears in list

### Step 5: Verify Database

```bash
# Check if component was created
cd packages/db
pnpm prisma studio

# Or using MySQL
mysql -u root -p pc_builder
SELECT * FROM Component;
exit;
```

---

## Troubleshooting

### Common Issues

#### Issue 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find and kill process using the port
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in package.json
"dev": "next dev --port 3002"
```

#### Issue 2: Database Connection Failed

**Error:**
```
Error: Can't reach database server at localhost:3306
```

**Solutions:**

```bash
# 1. Check if MySQL is running
# macOS
brew services list | grep mysql

# Ubuntu
sudo systemctl status mysql

# Docker
docker ps | grep mysql

# 2. Verify DATABASE_URL in packages/db/.env
cat packages/db/.env

# 3. Test connection
mysql -u root -p -h localhost -P 3306

# 4. Check firewall
# MySQL port 3306 should be open
```

#### Issue 3: Prisma Client Not Generated

**Error:**
```
Cannot find module '@prisma/client'
```

**Solution:**
```bash
# Generate Prisma Client
pnpm prisma:generate

# Or from packages/db
cd packages/db
pnpm prisma generate
```

#### Issue 4: PNPM Installation Errors

**Error:**
```
ERR_PNPM_PEER_DEP_ISSUES
```

**Solution:**
```bash
# Clean install
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

# Or force install
pnpm install --force
```

#### Issue 5: Node Version Mismatch

**Error:**
```
The engine "node" is incompatible with this module
```

**Solution:**
```bash
# Use correct Node version
nvm use 24

# Or install v24
nvm install 24
nvm use 24

# Verify
node --version
```

#### Issue 6: TypeScript Errors

**Error:**
```
Type error: Cannot find module '@repo/api'
```

**Solution:**
```bash
# Build API package first
pnpm build --filter=@repo/api

# Or build all packages
pnpm build

# Restart TypeScript server in your IDE
# VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Advanced Troubleshooting

#### Clean Reinstall

```bash
# Remove all dependencies and caches
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf .turbo
rm pnpm-lock.yaml

# Reinstall
pnpm install
pnpm prisma:generate
```

#### Reset Database

```bash
cd packages/db

# Warning: This deletes all data!
pnpm prisma migrate reset

# Confirm: yes
```

#### Check Logs

```bash
# Server logs (if using standalone server)
tail -f apps/server/logs/error.log
tail -f apps/server/logs/combined.log

# Next.js logs
# Check terminal output where pnpm dev is running
```

---

## Next Steps

### 1. Explore Admin Dashboard

- ✅ Create components
- ✅ Edit existing components
- ✅ View dashboard statistics
- ✅ Configure settings

### 2. Development

```bash
# Type checking
pnpm check-types

# Linting
pnpm lint

# Format code
pnpm format
```

### 3. Read Documentation

- [README.md](./README.md) - Project overview
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Complete docs
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [API.md](./API.md) - API documentation
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide

### 4. Add Sample Data (Optional)

```bash
# Create seed script (future)
# cd packages/db
# pnpm prisma db seed
```

### 5. Configure IDE

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

#### Recommended VS Code Extensions

- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

---

## Quick Reference

### Common Commands

```bash
# Development
pnpm dev                              # Run all apps
pnpm dev --filter=@repo/admin         # Run admin only
pnpm dev --filter=@repo/builder       # Run builder only
pnpm dev --filter=@repo/server        # Run server only

# Building
pnpm build                            # Build all
pnpm build --filter=@repo/admin       # Build admin only

# Database
pnpm prisma:generate                  # Generate Prisma client
cd packages/db && pnpm prisma studio  # Open database UI
cd packages/db && pnpm prisma migrate dev  # Run migrations

# Code Quality
pnpm lint                             # Lint all
pnpm check-types                      # Type check all
pnpm format                           # Format all files

# Troubleshooting
rm -rf node_modules && pnpm install   # Clean install
pnpm prisma:generate                  # Regenerate Prisma
```

### Port Reference

| Service | Port | URL |
|---------|------|-----|
| Builder App | 3000 | http://localhost:3000 |
| Admin Dashboard | 3001 | http://localhost:3001 |
| API Server | 4000 | http://localhost:4000 |
| Prisma Studio | 5555 | http://localhost:5555 |

---

## Getting Help

### Resources

- **Documentation**: Check docs in project root
- **Issues**: Create issue in repository
- **Team**: Contact development team

### Support Checklist

Before asking for help:

- [ ] Followed all setup steps
- [ ] Verified Node.js version (v24)
- [ ] Verified PNPM version (9.0+)
- [ ] Database is running
- [ ] Ran `pnpm install`
- [ ] Ran `pnpm prisma:generate`
- [ ] Checked troubleshooting section
- [ ] Checked terminal for error messages

---

**Setup Guide Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintained by**: PC Builder Team

**Congratulations! 🎉** You've successfully set up the PC Builder platform. Happy coding!