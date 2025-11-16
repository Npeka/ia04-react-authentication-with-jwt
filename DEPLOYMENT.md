# Render.com Deployment Commands

## Backend (NestJS)

### Build Command (Recommended):

```bash
npm ci && npm run build
```

### Alternative Build Commands (if above fails):

```bash
# Option 1: Clean install with cache clear
npm cache clean --force && npm ci && npm run build

# Option 2: Install with legacy peer deps
npm install --legacy-peer-deps && npm run build

# Option 3: Force install all dependencies
npm install --force && npm run build
```

### Build Process Breakdown:
1. `npm ci` - Clean install from package-lock.json (faster and more reliable for production)
2. `prisma generate` - Auto-runs via postinstall script to generate Prisma Client
3. `npx nest build` - Compiles TypeScript to JavaScript in dist/ folder

### Start Command:

```bash
npm run start:prod
```

### Environment Variables:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-jwt-secret-key-here-make-it-long-and-secure
```

### Service Configuration:

- Runtime: Node.js
- Plan: Starter (free tier)
- Region: Ohio (or closest to your users)
- Auto-Deploy: Yes (from main branch)

---

## Frontend (Vite + React)

### Build Command:

```bash
npm install && npm run build
```

### Publish Directory:

```
dist
```

### Environment Variables:

```
VITE_BACKEND_URL=https://your-backend-service-name.onrender.com
```

### Service Configuration:

- Service Type: Static Site
- Plan: Starter (free tier)
- Auto-Deploy: Yes (from main branch)
- Root Directory: frontend

---

## Deployment Steps:

1. **Deploy Backend First:**

   - Create new Web Service on Render
   - Connect your GitHub repository
   - Set root directory to `backend` (or leave empty if backend is in root)
   - Add environment variables
   - Deploy and note the service URL

2. **Deploy Frontend:**

   - Create new Static Site on Render
   - Connect same GitHub repository
   - Set root directory to `frontend`
   - Set `VITE_BACKEND_URL` to your backend service URL
   - Deploy

3. **Configure Database:**

   - Create PostgreSQL database on Render
   - Copy the database URL to backend environment variables
   - Database will auto-migrate on first start

4. **Test Deployment:**
   - Visit your frontend URL
   - Try registration and login
   - Check backend logs for any issues

---

## Build Optimization Tips:

### Backend:

- Make sure `prisma generate` runs during build
- Set `NODE_ENV=production` for optimized builds
- Use `npm ci` instead of `npm install` for faster installs

### Frontend:

- Vite builds are already optimized
- Assets are automatically minified and compressed
- Consider enabling gzip compression on server

---

## Troubleshooting Build Issues

### Build Error: "nest: command not found"

**Problem**: The error `sh: 1: nest: not found` occurs because `nest` CLI is not available globally.

**Solutions**:
```bash
# Method 1: Use npx (Recommended - already in our package.json)
"build": "prisma generate && npx nest build"

# Method 2: Clean install and rebuild
npm cache clean --force && npm ci && npm run build

# Method 3: Install with legacy peer deps if dependency conflicts
npm install --legacy-peer-deps && npm run build
```

### Build Error: "prisma generate failed"

**Solutions**:
```bash
# Force regenerate Prisma Client
npx prisma generate --force

# Clear Prisma cache
rm -rf node_modules/.prisma && npx prisma generate
```

### Build Error: "TypeScript compilation errors"

**Solutions**:
```bash
# Check for type errors locally first
npx tsc --noEmit

# Build with skip type check (temporary)
npx nest build --skip-type-check
```

### Render-Specific Build Commands

**Primary Build Command** (recommended):
```bash
npm ci && npm run build
```

**Alternative Build Commands** (try in order if primary fails):
```bash
# Option 1: Clear cache first
npm cache clean --force && npm ci && npm run build

# Option 2: Use install instead of ci
npm install && npm run build

# Option 3: Force install with legacy deps
npm install --legacy-peer-deps --force && npm run build

# Option 4: Manual step-by-step
npm ci && npx prisma generate && npx nest build
```

### Environment Variables Checklist

Required for Render deployment:
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-long-secure-secret-key
FRONTEND_URL=https://your-frontend.vercel.app
```

### Debugging Tips

1. **Test Build Locally**:
   ```bash
   NODE_ENV=production npm run build
   NODE_ENV=production npm run start:prod
   ```

2. **Check Dependencies**:
   ```bash
   npm ls --production  # Verify all production dependencies
   ```

3. **Render Dashboard**:
   - Check "Logs" tab for detailed error messages
   - Increase build timeout if needed (Build & Deploy → Advanced)
   - Monitor resource usage during build

### Common Issues

- **Database Connection**: Ensure DATABASE_URL format is correct
- **CORS**: Update frontend URL in main.ts for production  
- **Memory Issues**: Build may fail on small instances with complex dependencies
- **Timeout**: Default 15min timeout may need increase for large projects
