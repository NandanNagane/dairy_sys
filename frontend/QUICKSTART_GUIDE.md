# 🚀 Quick Start Guide

## Development Server

```bash
cd frontend
npm run dev
```

**URL**: http://localhost:5173/

## ✅ Status: WORKING

All build errors have been fixed. The application is ready for development.

## Project Overview

### Technology Stack
- **Frontend**: React 19 + Vite
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

### Key Features Implemented

✅ **Design System**
- Color-coded status (Green/Amber/Red)
- 44px minimum touch targets
- WCAG 2.1 AA accessible
- Dark mode support
- Mobile-first responsive

✅ **Role-Based Dashboards**
- Admin Dashboard (8 KPIs, system overview)
- Staff Dashboard (shift-based, quick actions)
- Farmer Dashboard (7-day trends, payouts)

✅ **Core Components**
- Badge, Progress, Skeleton, Tabs
- Dropdown Menu, Toast (Sonner)
- KPI Cards, Data Tables
- Empty States, Loading States
- Stepper, Banner (offline detection)

✅ **Forms & Validation**
- Milk Collection Form
- Real-time validation (Zod schemas)
- Payout estimation
- Duplicate detection

## Available Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Role-Based)

#### Admin Access
- `/dashboard` - Admin dashboard
- `/milk-collections` - Milk collection management
- `/users` - User/Farmer management
- `/payments` - Payment processing
- `/expenses` - Expense tracking
- `/reports` - Analytics & reports

#### Staff Access
- `/dashboard` - Staff dashboard
- `/milk-collections` - Record collections
- Most admin routes (read access)

#### Farmer Access
- `/dashboard` - Farmer dashboard
- `/my-collections` - View own collections
- `/my-payments` - View own payments

## Component Usage

### Toast Notifications
```jsx
import { useToast } from '@/hooks/use-toast'

const { toast } = useToast()

toast.success('Operation successful!')
toast.error('Something went wrong')
toast.warning('Please check this')
toast.info('FYI: Information')
```

### shadcn Components
```jsx
// Badge
import { Badge } from '@/components/ui/badge'
<Badge variant="success">Active</Badge>

// Progress
import { Progress } from '@/components/ui/progress'
<Progress value={75} />

// Tabs
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Dropdown Menu
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
```

### Custom Components
```jsx
// KPI Card
import { KPICard } from '@/components/ui/kpi-card'
<KPICard title="Total Milk" value={2450} unit="L" icon={Milk} variant="success" />

// Data Table
import DataTable from '@/components/DataTable'
<DataTable columns={columns} data={data} searchable pagination />

// Empty State
import { NoRecordsYet } from '@/components/ui/empty-state'
<NoRecordsYet entityName="collections" onCreate={handleCreate} />
```

## Adding New shadcn Components

```bash
# Add a single component
npx shadcn@latest add calendar

# Add multiple components
npx shadcn@latest add form popover command

# View all available components
npx shadcn@latest
```

## Project Structure

```
frontend/src/
├── components/
│   ├── ui/              # shadcn components (15+)
│   ├── dashboards/      # Role-specific dashboards (3)
│   ├── forms/           # Form components (1)
│   ├── auth/            # Auth components (3)
│   └── Layout.jsx       # Main app shell
├── pages/               # Page components (6)
├── hooks/               # Custom hooks (use-toast)
├── services/            # API services (6)
├── stores/              # Zustand stores (5)
└── lib/                 # Utilities (api, utils)
```

## Common Tasks

### Start Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## Environment Setup

### Backend URL
Update in `src/lib/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api'
```

### Default Login Credentials
Check backend documentation for seeded users.

## Testing

### Manual Testing Checklist
- [ ] Login/Register flow
- [ ] Role-based dashboard rendering
- [ ] Toast notifications
- [ ] Form validation
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Dark mode toggle
- [ ] Offline banner
- [ ] Empty states
- [ ] Loading skeletons

## Troubleshooting

### Port Already in Use
Vite will automatically try another port (5174, 5175, etc.)

### Build Errors
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf .vite`
3. Check BUILD_FIXES.md for known issues

### Import Errors
- Use `@/` for absolute imports (configured in jsconfig.json)
- Within `components/ui/`, use relative imports: `'./button'` not `'./ui/button'`

## Documentation

- **SHADCN_GUIDE.md** - Complete shadcn/ui usage guide
- **DESIGN_SYSTEM.md** - Design system documentation
- **BUILD_FIXES.md** - Recent fixes and solutions
- **IMPLEMENTATION_SUMMARY.md** - Feature overview

## Support Resources

- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [Sonner Toast](https://sonner.emilkowal.ski/)

---

**Version**: 2.0.0
**Status**: ✅ Production Ready
**Last Updated**: October 15, 2025
