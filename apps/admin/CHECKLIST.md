# ✅ Admin Dashboard - Installation & Deployment Checklist

## 📦 Initial Setup

### 1. Dependencies Installation
- [ ] Run `pnpm install` dari root directory
- [ ] Verify semua packages ter-install dengan benar
- [ ] Check for peer dependency warnings (optional)

### 2. Database Setup
```bash
cd packages/db
pnpm prisma generate
pnpm prisma migrate dev
```
- [ ] Prisma client generated
- [ ] Database migrations applied
- [ ] Test database connection

### 3. Environment Variables
Create `.env` file di root atau `apps/admin/`:
```env
DATABASE_URL="mysql://user:password@localhost:3306/pcbuilder"
NODE_ENV="development"
```
- [ ] Database URL configured
- [ ] Environment variables set

### 4. Development Server
```bash
cd apps/admin
pnpm dev
```
- [ ] Server running on http://localhost:3001
- [ ] No compilation errors
- [ ] Hot reload working

## 🎨 UI Verification

### Dashboard Pages
- [ ] **Home** (`/`) - Redirects to `/dashboard`
- [ ] **Dashboard** (`/dashboard`) - Overview page loads
  - [ ] Stats cards render
  - [ ] Component distribution shows
  - [ ] Recent activity displays
  - [ ] Quick actions visible

### Components Page
- [ ] **Components** (`/components`) - Table view loads
  - [ ] Search bar functional
  - [ ] Filter dropdown works
  - [ ] Add Component dialog opens
  - [ ] Table displays components (if data exists)
  - [ ] Empty state shows (if no data)
  - [ ] Edit/Delete actions appear in dropdown

### Other Pages
- [ ] **Products** (`/products`) - Coming soon page
- [ ] **Settings** (`/settings`) - All sections render
  - [ ] General Settings
  - [ ] Profile Settings
  - [ ] Notifications
  - [ ] Appearance
  - [ ] Security

### Layout Components
- [ ] **Sidebar** - Navigation menu
  - [ ] Logo displays
  - [ ] All menu items visible
  - [ ] Active state highlighting works
  - [ ] Logout button present
- [ ] **Header** - Top bar
  - [ ] Search input renders
  - [ ] Notification bell shows
  - [ ] User dropdown works

## 🔌 API Integration (TODO)

### tRPC Setup
- [ ] tRPC client configured
- [ ] API routes defined
- [ ] Type safety verified

### Components API
- [ ] `useListComponents()` - ✅ Working (read-only)
- [ ] `useCreateComponent()` - ⏳ TODO
- [ ] `useUpdateComponent()` - ⏳ TODO
- [ ] `useDeleteComponent()` - ⏳ TODO

### Test API Calls
```bash
# Test from browser console
const { data } = await fetch('/api/trpc/components.list').then(r => r.json());
```
- [ ] GET components works
- [ ] POST create works
- [ ] PUT update works
- [ ] DELETE works

## 🧪 Testing

### Manual Testing
- [ ] Add new component via dialog
- [ ] Edit existing component
- [ ] Delete component
- [ ] Search functionality
- [ ] Filter by type
- [ ] Navigate between pages
- [ ] Responsive design on mobile
- [ ] Responsive design on tablet

### Browser Testing
- [ ] Chrome/Edge ✅
- [ ] Firefox ✅
- [ ] Safari ✅
- [ ] Mobile browsers ✅

## 🎯 TypeScript & Linting

```bash
pnpm check-types
pnpm lint
```
- [ ] No TypeScript errors
- [ ] No ESLint errors/warnings
- [ ] All imports resolved

## 🚀 Build & Production

### Production Build
```bash
pnpm build
```
- [ ] Build succeeds without errors
- [ ] All pages pre-rendered
- [ ] Static assets generated
- [ ] Bundle size acceptable

### Production Test
```bash
pnpm start
```
- [ ] Production server starts
- [ ] All pages accessible
- [ ] No console errors
- [ ] Performance acceptable

## 📊 Performance Checks

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No layout shifts
- [ ] Images optimized (when added)

## 🔒 Security Checklist

- [ ] Authentication implemented
- [ ] Authorization/RBAC in place
- [ ] API routes protected
- [ ] CSRF protection enabled
- [ ] XSS prevention measures
- [ ] SQL injection prevention (Prisma)
- [ ] Environment variables secure
- [ ] No sensitive data in client

## 📝 Documentation

- [ ] README_DASHBOARD.md complete
- [ ] QUICKSTART.md available
- [ ] COMPONENTS.md documented
- [ ] API documentation written
- [ ] Code comments added where needed

## 🎨 Design & UX

- [ ] Consistent spacing throughout
- [ ] Color scheme matches brand
- [ ] Typography hierarchy clear
- [ ] Interactive elements have hover states
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Empty states designed
- [ ] Success/error notifications

## ♿ Accessibility

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels added
- [ ] Color contrast sufficient (WCAG AA)
- [ ] Screen reader tested
- [ ] Form labels associated
- [ ] Error messages clear

## 📱 Responsive Design

### Breakpoints
- [ ] Mobile (< 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)

### Mobile Menu
- [ ] Hamburger menu for sidebar
- [ ] Touch-friendly targets
- [ ] Swipe gestures (optional)

## 🔧 Additional Features (Optional)

### Phase 1 - Critical
- [ ] Form validation with Zod
- [ ] Toast notifications
- [ ] Loading spinners
- [ ] Error boundaries
- [ ] Authentication system

### Phase 2 - Important
- [ ] Image upload
- [ ] Bulk operations
- [ ] Export to CSV
- [ ] Table pagination
- [ ] Column sorting

### Phase 3 - Nice to Have
- [ ] Dark mode toggle
- [ ] Multi-language (i18n)
- [ ] Analytics charts
- [ ] Activity logs
- [ ] Global search (Cmd+K)
- [ ] Keyboard shortcuts

## 🚀 Deployment

### Pre-deployment
- [ ] Environment variables set on server
- [ ] Database migrated on production
- [ ] Build succeeds in CI/CD
- [ ] All tests passing

### Deployment Platforms
Choose one:
- [ ] Vercel (recommended for Next.js)
- [ ] Netlify
- [ ] AWS Amplify
- [ ] Self-hosted (Docker)

### Post-deployment
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Analytics tracking (optional)
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring

### Deployment Commands
```bash
# Vercel
vercel --prod

# Or custom
pnpm build
pnpm start
```

## 📈 Monitoring

### Setup Monitoring Tools
- [ ] Error tracking (Sentry, Bugsnag)
- [ ] Analytics (Google Analytics, Plausible)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Performance monitoring (Vercel Analytics)

### Health Checks
- [ ] API endpoints responsive
- [ ] Database connections stable
- [ ] Memory usage normal
- [ ] CPU usage acceptable

## 🔄 Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Review error logs weekly
- [ ] Backup database daily
- [ ] Monitor performance metrics
- [ ] Security patches applied

### Documentation Updates
- [ ] Keep README current
- [ ] Update CHANGELOG
- [ ] Document new features
- [ ] Update API docs

## ✨ Launch Checklist

### Pre-launch (Final Review)
- [ ] All critical features working
- [ ] No known bugs
- [ ] Documentation complete
- [ ] Team trained on system
- [ ] Backup plan in place

### Launch Day
- [ ] Deploy to production
- [ ] Verify all pages load
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Be ready for hotfixes

### Post-launch
- [ ] Gather user feedback
- [ ] Monitor analytics
- [ ] Track performance
- [ ] Plan next iteration
- [ ] Celebrate! 🎉

---

## 📊 Status Summary

### Completed ✅
- Dashboard layout & navigation
- All UI pages created
- shadcn/ui components integrated
- TypeScript compilation passing
- Production build working
- Responsive design implemented
- Documentation written

### In Progress 🔄
- API integration (mutations)
- Form validation
- Authentication system
- Error handling

### Pending ⏳
- Image upload
- Products module
- Analytics dashboard
- Advanced features

---

## 🆘 Troubleshooting

### Common Issues

**Port 3001 in use:**
```bash
lsof -ti:3001 | xargs kill -9
# Or use different port
PORT=3002 pnpm dev
```

**Prisma errors:**
```bash
cd packages/db
pnpm prisma generate
pnpm prisma db push
```

**Build errors:**
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
pnpm install
pnpm build
```

**TypeScript errors:**
```bash
pnpm check-types
# Fix imports, update types
```

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Status:** 🟢 Ready for Development