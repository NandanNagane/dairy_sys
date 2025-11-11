# 🎨 Dairy Management System - Using shadcn/ui Components

## ✅ What We're Using

This project uses **[shadcn/ui](https://ui.shadcn.com/)** - a collection of beautifully designed, accessible, and customizable React components built with Radix UI and Tailwind CSS.

### Why shadcn/ui?

- ✅ **Not a component library** - Components are copied into your project, giving you full control
- ✅ **Accessible** - Built on Radix UI primitives (WCAG compliant)
- ✅ **Customizable** - Easily modify components to fit your design
- ✅ **Type-safe** - Full TypeScript support (works with JSX too)
- ✅ **Beautifully designed** - Professional UI out of the box

## 📦 Components Added via shadcn CLI

### Core UI Components (from shadcn)
```bash
# Already installed:
- badge          # Status indicators
- skeleton       # Loading states
- progress       # Progress bars  
- tabs           # Tab navigation
- dropdown-menu  # Context menus
- sonner         # Toast notifications
- breadcrumb     # Navigation breadcrumbs
- separator      # Visual dividers
- scroll-area    # Custom scrollbars
- avatar         # User avatars

# Already in project (pre-installed):
- button
- card
- dialog
- input
- label
- select
- table
- alert
```

### Custom Components (Built on shadcn)
```
- KPICard        # Dashboard metric cards
- Banner         # Alert banners (online/offline)
- EmptyState     # No data states
- Stepper        # Multi-step forms
- DataTable      # Feature-rich tables
- MilkCollectionForm  # Domain-specific form
- Role Dashboards     # Admin/Staff/Farmer views
```

## 🚀 Adding New shadcn Components

### Method 1: Using CLI (Recommended)
```bash
cd frontend

# Add a single component
npx shadcn@latest add <component-name>

# Add multiple components
npx shadcn@latest add calendar popover command

# Add all components
npx shadcn@latest add --all
```

### Method 2: Browse and Add
1. Visit [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)
2. Pick a component
3. Click "Install" to see the CLI command
4. Run the command in your terminal

### Available Components to Add
```bash
# Forms
npx shadcn@latest add form checkbox radio-group switch textarea

# Data Display  
npx shadcn@latest add accordion collapsible data-table

# Overlays
npx shadcn@latest add sheet tooltip popover command

# Navigation
npx shadcn@latest add navigation-menu menubar

# Feedback
npx shadcn@latest add alert-dialog toast

# Date/Time
npx shadcn@latest add calendar date-picker

# Media
npx shadcn@latest add aspect-ratio carousel

# And many more...
```

## 💡 Usage Examples

### Toast Notifications (Sonner)
```jsx
import { useToast } from '@/hooks/use-toast'

function MyComponent() {
  const { toast } = useToast()
  
  const handleSave = async () => {
    try {
      await api.save()
      toast.success('Saved successfully!')
    } catch (error) {
      toast.error('Failed to save')
    }
  }
  
  // More options
  toast.warning('Please review this')
  toast.info('Information message')
  
  // Loading state
  const toastId = toast.loading('Saving...')
  // Later: toast.dismiss(toastId)
  
  // Promise-based
  toast.promise(saveData(), {
    loading: 'Saving...',
    success: 'Data saved!',
    error: 'Failed to save',
  })
}
```

### Badge Component
```jsx
import { Badge } from '@/components/ui/badge'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>

// Custom variants (in badge.jsx)
<Badge variant="success">Verified</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="critical">Urgent</Badge>
```

### Progress Bar
```jsx
import { Progress } from '@/components/ui/progress'

<Progress value={75} />
<Progress value={33} className="w-full" />
```

### Dropdown Menu
```jsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Tabs
```jsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

<Tabs defaultValue="milk">
  <TabsList>
    <TabsTrigger value="milk">Milk</TabsTrigger>
    <TabsTrigger value="health">Health</TabsTrigger>
    <TabsTrigger value="finance">Finance</TabsTrigger>
  </TabsList>
  <TabsContent value="milk">Milk collections content</TabsContent>
  <TabsContent value="health">Health monitoring content</TabsContent>
  <TabsContent value="finance">Finance reports content</TabsContent>
</Tabs>
```

### Skeleton Loading
```jsx
import { Skeleton } from '@/components/ui/skeleton'

<div className="space-y-3">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
  <Skeleton className="h-20 w-full" />
</div>
```

## 🎨 Customizing Components

All shadcn components are in `src/components/ui/` and can be customized:

### Example: Adding Custom Badge Variants
```jsx
// src/components/ui/badge.jsx
const badgeVariants = cva(
  "inline-flex items-center rounded-full...",
  {
    variants: {
      variant: {
        default: "...",
        // Add your custom variant:
        success: "bg-green-100 text-green-800 dark:bg-green-900",
        warning: "bg-amber-100 text-amber-800 dark:bg-amber-900",
        critical: "bg-red-100 text-red-800 dark:bg-red-900",
      },
    },
  }
)
```

### Example: Customizing Theme Colors
```css
/* src/index.css or src/App.css */
:root {
  --primary: 142 76% 36%;        /* Green for dairy/success */
  --destructive: 0 84% 60%;      /* Red for errors */
  --warning: 38 92% 50%;         /* Amber for warnings */
}
```

## 📚 Component Documentation

### shadcn/ui Official Docs
- **Main Site**: https://ui.shadcn.com/
- **Components**: https://ui.shadcn.com/docs/components
- **Themes**: https://ui.shadcn.com/themes
- **Examples**: https://ui.shadcn.com/examples

### Component Categories

**Form Components**
- Input, Label, Textarea, Select
- Checkbox, Radio Group, Switch
- Form (with react-hook-form integration)

**Data Display**
- Table, Card, Badge, Avatar
- Accordion, Collapsible
- Separator, Scroll Area

**Feedback**
- Alert, Alert Dialog
- Toast (Sonner), Dialog
- Progress, Skeleton

**Navigation**
- Tabs, Breadcrumb
- Dropdown Menu, Context Menu
- Navigation Menu, Menubar

**Overlays**
- Dialog, Sheet, Popover
- Tooltip, Hover Card
- Command (⌘K menu)

## 🔧 Configuration

### components.json
```json
{
  "style": "new-york",
  "tailwind": {
    "config": "",
    "css": "src/App.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Path Aliases (jsconfig.json)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

This allows imports like:
```jsx
import { Button } from '@/components/ui/button'  // ✅
// instead of
import { Button } from '../../../components/ui/button'  // ❌
```

## 🎯 Best Practices

### 1. **Don't Modify shadcn Components Directly**
Instead, create wrapper components:
```jsx
// src/components/custom/my-button.jsx
import { Button } from '@/components/ui/button'

export function MyButton({ children, ...props }) {
  return (
    <Button className="my-custom-styles" {...props}>
      {children}
    </Button>
  )
}
```

### 2. **Use Composition**
```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

function MetricCard({ title, value, icon: Icon }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
```

### 3. **Leverage Variants**
```jsx
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Link</Button>
<Button variant="link">Text Link</Button>
```

### 4. **Use Size Props**
```jsx
<Button size="default">Normal</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <Icon />
</Button>
```

## 🚀 Next Steps

1. ✅ shadcn/ui components installed
2. ✅ Toast system set up (Sonner)
3. ✅ Custom components built on shadcn
4. 🔲 Add more shadcn components as needed:
   ```bash
   npx shadcn@latest add form calendar popover command
   ```
5. 🔲 Customize theme in `src/index.css`
6. 🔲 Build domain-specific components using shadcn as foundation

## 📖 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI (Primitives)](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Sonner (Toast)](https://sonner.emilkowal.ski/)

---

**Remember**: shadcn/ui components are **yours** to modify. They're copied into your project, not installed as dependencies. Feel free to customize them to match your exact needs!
