# 🚀 Quick Start Guide - Dairy Management System UI

## Installation & Setup

### 1. Install Missing Dependencies
```bash
cd frontend
npm install @radix-ui/react-dropdown-menu
```

### 2. Run Development Server
```bash
npm run dev
```

The application will start at `http://localhost:5173`

## 🎨 What You Get

### ✅ Complete Design System
- 15+ production-ready UI components
- Role-based dashboards (Admin, Staff, Farmer)
- Form validation with real-time feedback
- Mobile-responsive layouts
- Dark mode support
- Accessibility compliant (WCAG 2.1 AA)

### 🎯 Key Features Implemented

#### 1. **Color-Coded Status System**
```jsx
// Green = Normal/Success
<Badge variant="success">Verified</Badge>

// Amber = Warning
<Badge variant="warning">Pending</Badge>

// Red = Critical
<Badge variant="critical">Urgent</Badge>
```

#### 2. **Role-Based Dashboards**
- **Admin**: 8 KPI cards, system overview, alerts
- **Staff**: Shift metrics, quick actions
- **Farmer**: Production trends, payment estimates

#### 3. **Smart Form Validation**
```jsx
<MilkCollectionForm
  farmers={farmerList}
  onSubmit={handleSubmit}
  // Features:
  // - Real-time payout calculation
  // - Quality outlier warnings
  // - Duplicate detection
  // - Save & Next for batch entry
/>
```

#### 4. **Responsive Data Tables**
```jsx
<DataTable
  columns={[
    { key: 'name', label: 'Farmer Name' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => <Badge variant={val}>{val}</Badge>
    }
  ]}
  data={farmers}
  searchable
  pagination
  pageSize={10}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

#### 5. **Toast Notifications**
```jsx
const { toast } = useToast()

toast({
  message: "Collection saved!",
  variant: "success",
  duration: 5000
})
```

#### 6. **Offline Detection**
```jsx
// Automatically shows banner when offline
<OfflineBanner onRetry={handleRetry} />
```

## 📱 Testing the UI

### Test Different Roles

1. **Admin Dashboard**
   - Login as admin user
   - See comprehensive KPIs
   - Access all navigation items
   - View system alerts

2. **Staff Dashboard**
   - Login as staff user
   - See shift-based metrics
   - Quick action buttons
   - Pending verifications

3. **Farmer Dashboard**
   - Login as farmer
   - View production trends
   - Check payment estimates
   - 7-day chart

### Test Components

```jsx
// In any page component
import { KPICard } from '@/components/ui/kpi-card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'

// Use them
<KPICard 
  title="Today's Milk"
  value={250}
  unit="L"
  icon={Milk}
  variant="success"
/>
```

## 🎨 Customizing Theme

### Change Primary Color
Edit `frontend/src/index.css`:
```css
:root {
  --primary: 142 76% 36%; /* Change this */
}
```

### Add Custom Status Color
```css
.status-custom {
  @apply bg-purple-100 text-purple-800;
}
```

## 📦 Component Library

### Status & Feedback
- `Badge` - Status indicators
- `Toast` - Notifications
- `Banner` - Persistent alerts
- `Alert` - Inline messages

### Data Display
- `KPICard` - Dashboard metrics
- `DataTable` - Feature-rich tables
- `Card` - Content containers
- `Progress` - Progress bars

### Navigation
- `Tabs` - Content organization
- `Stepper` - Multi-step forms
- `Layout` - App shell with sidebar

### Forms
- `Input` - Text inputs
- `Select` - Dropdowns
- `Label` - Form labels
- `MilkCollectionForm` - Complete example

### Loading States
- `Skeleton` - Loading placeholders
- `EmptyState` - No data states

## 🔧 Common Tasks

### Adding a New Page

1. Create page component:
```jsx
// src/pages/Cattle.jsx
import React from 'react'
import { Card } from '@/components/ui/card'

const Cattle = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold">Cattle Management</h1>
      {/* Your content */}
    </div>
  )
}

export default Cattle
```

2. Add route in `App.jsx`:
```jsx
<Route path="cattle" element={<Cattle />} />
```

3. Navigation item already added in `Layout.jsx` ✅

### Adding a Form

```jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  field: z.string().min(1, 'Required')
})

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('field')} />
      {errors.field && <p>{errors.field.message}</p>}
    </form>
  )
}
```

### Showing Notifications

```jsx
import { useToast } from '@/components/ui/toast'

const MyComponent = () => {
  const { toast } = useToast()
  
  const handleSave = async () => {
    try {
      await api.save()
      toast({
        message: 'Saved successfully!',
        variant: 'success'
      })
    } catch (error) {
      toast({
        message: 'Failed to save',
        variant: 'critical'
      })
    }
  }
}
```

## 📊 Next Features to Build

Based on the design system, implement:

1. **Cattle Management** - List, add, edit cattle
2. **Health Monitoring** - Temperature alerts, vaccination schedule
3. **Feed Management** - Feed plans, stock management
4. **Inventory** - Product tracking, low-stock alerts
5. **Finance** - Rate cards, payout wizard, invoices
6. **Reports** - Charts with recharts/chart.js
7. **Notifications** - Template manager, SMS logs
8. **Devices** - IoT device management

## 🐛 Troubleshooting

### Components not rendering?
Check imports use correct path aliases:
```jsx
import { Button } from '@/components/ui/button'  // ✅
import { Button } from '../components/ui/button' // ❌
```

### Styles not applying?
Ensure Tailwind is processing the files:
```javascript
// vite.config.js
content: [
  "./index.html",
  "./src/**/*.{js,jsx}"
]
```

### Dark mode not working?
Toggle the dark class:
```javascript
document.documentElement.classList.toggle('dark')
```

## 📚 Resources

- **Design System Docs**: `DESIGN_SYSTEM.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Component Examples**: Check `src/components/dashboards/` for usage examples
- **Tailwind Docs**: https://tailwindcss.com
- **Radix UI**: https://radix-ui.com
- **Lucide Icons**: https://lucide.dev

## 🎯 Ready to Use Components

All these are ready to import and use:

```jsx
// Status & Feedback
import { Badge } from '../ui/badge'
import { useToast } from '../hooks/use-toast'
import { Banner, OfflineBanner } from '../ui/banner'
import { Alert } from '../ui/alert'

// Data Display
import { KPICard } from '../ui/kpi-card'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import DataTable from '@/components/DataTable'

// Forms
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import MilkCollectionForm from '@/components/forms/MilkCollectionForm'

// Navigation
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Stepper } from '@/components/ui/stepper'

// Loading & Empty
import { Skeleton, SkeletonCard, SkeletonTable } from '@/components/ui/skeleton'
import { EmptyState, NoDataFound, NoRecordsYet } from '@/components/ui/empty-state'
```

## ✅ Implementation Checklist

- ✅ Design system with color-coded status
- ✅ 15+ UI components
- ✅ 3 role-based dashboards
- ✅ Form validation with Zod
- ✅ Responsive layout with sidebar
- ✅ Toast notifications
- ✅ Offline detection
- ✅ Loading & empty states
- ✅ Data tables with actions
- ✅ Mobile-responsive (44px targets)
- ✅ Dark mode support
- ✅ Accessibility (WCAG 2.1 AA)

## 🚀 Start Building

1. Run `npm install @radix-ui/react-dropdown-menu`
2. Start dev server: `npm run dev`
3. Login to see dashboards
4. Start building new features using existing components!

---

**Happy Coding! 🎉**

For detailed documentation, see `DESIGN_SYSTEM.md`
