# Dairy Management System - Design System & UI Components

## Overview
This document describes the design system, visual language, and UI components implemented for the Dairy Management System.

## Design Principles

### Visual Language
- **Clean, high-contrast aesthetic**: Ensures readability and professional appearance
- **Color-coded status system**:
  - 🟢 **Green**: Normal/Success states
  - 🟠 **Amber**: Warning states
  - 🔴 **Red**: Critical/Error states
- **Accessible design**: Minimum 44px touch targets for mobile usability
- **Bilingual support ready**: All labels and text prepared for localization

### Color Palette

#### Light Theme
```css
--primary: Green (142 76% 36%) - Used for success states
--warning: Amber (38 92% 50%) - Used for warnings
--critical: Red (0 84% 60%) - Used for errors and critical alerts
--background: White (0 0% 100%)
--foreground: Dark Gray (222 47% 11%)
```

#### Dark Theme
Full dark mode support with appropriate color adjustments for readability.

## Core Components

### 1. Layout Components

#### App Shell (`Layout.jsx`)
- **Top Navigation Bar**: Fixed header with user info and logout
- **Left Sidebar Navigation**: Role-based menu items
- **Responsive**: Collapsible sidebar for mobile
- **Role-based routing**:
  - **Admin**: Full access to all modules
  - **Staff**: Limited access (no Settings)
  - **Farmer**: Dashboard, Milk (read-only), Finance, Notifications

#### Navigation Items
```javascript
Admin: Dashboard, Milk, Farmers, Cattle, Health, Feeding, 
       Inventory, Finance, Reports, Notifications, Devices, Settings

Staff: Dashboard, Milk, Farmers, Cattle, Health, Feeding,
       Inventory, Finance, Notifications

Farmer: Dashboard, My Milk, Finance, Notifications
```

### 2. Data Display Components

#### KPI Card (`kpi-card.jsx`)
Displays key performance indicators with:
- Title and icon
- Large value display with optional unit
- Trend indicator (up/down/stable)
- Color-coded borders (success/warning/critical)

**Usage:**
```jsx
<KPICard
  title="Total Milk Today"
  value={2450}
  unit="L"
  icon={Milk}
  trend="up"
  trendValue="+12% from yesterday"
  variant="success"
/>
```

#### Badge (`badge.jsx`)
Status indicators with variants:
- `default`, `secondary`, `outline`
- `success` (green), `warning` (amber), `critical` (red)

**Usage:**
```jsx
<Badge variant="success">Verified</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="critical">Urgent</Badge>
```

### 3. Feedback Components

#### Toast (`toast.jsx`)
Notification system for user feedback:
- Auto-dismiss after configurable duration
- Variants: success, warning, critical, default
- Hook-based API: `useToast()`

**Usage:**
```jsx
const { toast } = useToast()

toast({
  message: "Collection saved successfully",
  variant: "success",
  duration: 5000
})
```

#### Banner (`banner.jsx`)
Persistent alerts for important information:
- **Offline Banner**: Automatically shows when internet connection is lost
- Action buttons and dismissible options
- High contrast for visibility

**Usage:**
```jsx
<Banner
  variant="warning"
  message="Low stock alert: Protein mix below minimum"
  action="View Inventory"
  onAction={() => navigate('/inventory')}
/>

<OfflineBanner onRetry={handleRetry} />
```

#### Alert
Inline alerts for contextual warnings and information:
```jsx
<Alert variant="warning">
  <AlertTriangle className="h-4 w-4" />
  <AlertDescription>
    Fat content is outside normal range
  </AlertDescription>
</Alert>
```

### 4. Form Components

#### Input Fields
All inputs have:
- Minimum 44px height for touch targets
- Clear labels with `htmlFor` associations
- Error states with red borders and messages
- Proper `aria-` attributes for accessibility

#### Select Components
Custom styled dropdowns with:
- Large touch targets
- Keyboard navigation support
- Clear visual feedback

#### Validation
Using `react-hook-form` + `zod` schema validation:

**Example - Milk Collection Form:**
```javascript
const milkCollectionSchema = z.object({
  quantity: z.number().min(0.1).max(1000),
  fat: z.number().min(0).max(10),
  snf: z.number().min(0).max(12),
})
```

**Validation Rules:**
- **Milk Quantity**: > 0 L
- **Fat Content**: 0-10%
- **SNF Content**: 0-12%
- **Health Temperature**: Alert if > 103°F
- **Inventory**: Prevent negative stock

### 5. Loading & Empty States

#### Skeleton (`skeleton.jsx`)
Loading placeholders that match content shape:
```jsx
<SkeletonCard /> {/* For card loading */}
<SkeletonTable rows={5} /> {/* For table loading */}
```

#### Empty States (`empty-state.jsx`)
User-friendly messages when no data exists:
- **NoDataFound**: For filtered results
- **NoRecordsYet**: First-time user experience
- **ErrorState**: Error recovery

**Usage:**
```jsx
<NoRecordsYet 
  entityName="collections"
  onCreate={handleCreate}
/>
```

### 6. Navigation Components

#### Tabs (`tabs.jsx`)
Organize content into sections:
```jsx
<TabsWrapper defaultValue="milk">
  <TabsList>
    <TabsTrigger value="milk">Milk</TabsTrigger>
    <TabsTrigger value="health">Health</TabsTrigger>
    <TabsTrigger value="finance">Finance</TabsTrigger>
  </TabsList>
  <TabsContent value="milk">...</TabsContent>
  <TabsContent value="health">...</TabsContent>
  <TabsContent value="finance">...</TabsContent>
</TabsWrapper>
```

#### Stepper (`stepper.jsx`)
Multi-step processes (e.g., payout wizard):
```jsx
<Stepper 
  steps={[
    { name: 'Select Period', status: 'complete' },
    { name: 'Review', status: 'current' },
    { name: 'Generate', status: 'upcoming' }
  ]}
  currentStep={1}
/>
```

### 7. Progress Indicators

#### Progress Bar (`progress.jsx`)
Visual progress representation:
```jsx
<Progress value={75} variant="success" />
```

## Dashboard Implementations

### Admin Dashboard
**Key Features:**
- 8 KPI cards (milk, fat, SNF, payout, stock, devices, alerts, farmers)
- Quick action buttons
- Recent collections list
- System alerts panel
- Real-time status indicators

### Staff Dashboard
**Key Features:**
- Shift-based information
- Collection counter
- Pending verifications badge
- Quick action tiles (large, touch-friendly)
- Shift report access

### Farmer Dashboard
**Key Features:**
- Today's production summary
- 7-day trend chart with progress bars
- Estimated payout calculator
- Payment history
- SMS notification status
- Quality bonus indicators

## Form Validations & UX Rules

### Milk Collection Form
1. **Real-time payout estimation**: Updates as user types
2. **Quality warnings**: Alerts for outlier values
3. **Duplicate detection**: Warns if farmer already has entry for shift
4. **Save & Next**: Quick data entry for multiple farmers

### Error Handling
- **API errors**: Mapped to specific form fields
- **Network errors**: Global offline banner
- **Retry mechanism**: Background job retry with exponential backoff
- **Idempotent POSTs**: Client token prevents duplicate submissions

## Accessibility Features

### WCAG 2.1 AA Compliance
- ✅ Minimum 44px touch targets
- ✅ Keyboard navigation support
- ✅ Focus visible states (ring-2)
- ✅ Readable font sizes (min 14px)
- ✅ High contrast ratios (4.5:1+)
- ✅ Screen reader friendly (`aria-labels`, semantic HTML)
- ✅ Responsive tables with horizontal scroll

### Mobile-First Design
- Collapsible sidebar navigation
- Touch-optimized buttons and inputs
- Responsive grid layouts
- Swipeable cards and modals

## Icons Library

Using `lucide-react` icons:
```javascript
Milk - Milk collection
Beef - Cattle management
Heart - Health monitoring
Package - Inventory/Feeding
DollarSign - Finance/Payments
BarChart3 - Reports/Analytics
Bell - Notifications
Wifi - IoT Devices
Users - Farmer management
Settings - System settings
AlertTriangle - Warnings
```

## Theme Customization

### Switching Themes
```javascript
// Add to root element
<html className="dark">

// Or toggle programmatically
document.documentElement.classList.toggle('dark')
```

### CSS Variables
All colors defined as CSS variables in `index.css`:
- Easily customizable
- Automatic dark mode support
- Consistent across application

## Best Practices

### Component Usage
1. **Always provide accessible labels** for form inputs
2. **Use semantic HTML** (`<nav>`, `<main>`, `<article>`)
3. **Implement loading states** for async operations
4. **Show empty states** when no data
5. **Provide clear error messages** with recovery actions
6. **Use proper variants** for visual hierarchy (success/warning/critical)

### Performance
- Lazy load dashboard components
- Skeleton screens during data fetch
- Debounced search inputs
- Paginated tables
- Optimized re-renders with React.memo

### Internationalization Ready
All text strings should be prepared for localization:
```javascript
const labels = {
  'en': { title: 'Dashboard' },
  'hi': { title: 'डैशबोर्ड' }
}
```

## File Structure

```
frontend/src/
├── components/
│   ├── ui/                     # Base UI components
│   │   ├── badge.jsx
│   │   ├── banner.jsx
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── empty-state.jsx
│   │   ├── input.jsx
│   │   ├── kpi-card.jsx
│   │   ├── progress.jsx
│   │   ├── skeleton.jsx
│   │   ├── stepper.jsx
│   │   ├── tabs.jsx
│   │   └── toast.jsx
│   ├── forms/                  # Form components
│   │   └── MilkCollectionForm.jsx
│   ├── dashboards/             # Role-specific dashboards
│   │   ├── AdminDashboard.jsx
│   │   ├── StaffDashboard.jsx
│   │   └── FarmerDashboard.jsx
│   └── Layout.jsx              # Main layout shell
├── pages/                      # Page components
├── lib/                        # Utilities
└── index.css                   # Theme & global styles
```

## Next Steps

To fully implement the design system:

1. ✅ Core UI components created
2. ✅ Role-based dashboards implemented
3. ✅ Form validation patterns established
4. 🔲 Implement remaining page screens (Cattle, Health, Feeding, etc.)
5. 🔲 Add internationalization (i18n)
6. 🔲 Implement PDF export functionality
7. 🔲 Add data visualization charts
8. 🔲 Implement real-time updates (WebSocket)
9. 🔲 Add offline support (Service Workers)
10. 🔲 Conduct accessibility audit

## Support

For questions or modifications to the design system, refer to:
- Component documentation in each file
- Tailwind CSS documentation
- Radix UI documentation (for base primitives)
- lucide-react icon library
