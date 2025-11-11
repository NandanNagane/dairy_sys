import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Search
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

const Inventory = () => {
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterType, setFilterType] = React.useState('all') // all, low-stock, expired

  const [items, setItems] = React.useState([
    {
      id: 1,
      name: 'Protein Mix',
      category: 'Feed',
      quantity: 45,
      unit: 'kg',
      minQuantity: 50,
      price: 850,
      lastUpdated: '2024-10-14',
      expiryDate: '2025-03-15',
      status: 'low',
    },
    {
      id: 2,
      name: 'Calcium Supplement',
      category: 'Supplement',
      quantity: 120,
      unit: 'kg',
      minQuantity: 30,
      price: 1200,
      lastUpdated: '2024-10-13',
      expiryDate: '2025-06-20',
      status: 'good',
    },
    {
      id: 3,
      name: 'Vitamin D3',
      category: 'Medicine',
      quantity: 15,
      unit: 'bottles',
      minQuantity: 20,
      price: 450,
      lastUpdated: '2024-10-12',
      expiryDate: '2024-11-30',
      status: 'critical',
    },
    {
      id: 4,
      name: 'Hay Bales',
      category: 'Feed',
      quantity: 200,
      unit: 'bales',
      minQuantity: 100,
      price: 350,
      lastUpdated: '2024-10-10',
      expiryDate: '2025-12-31',
      status: 'good',
    },
    {
      id: 5,
      name: 'Antibiotics',
      category: 'Medicine',
      quantity: 8,
      unit: 'boxes',
      minQuantity: 10,
      price: 2500,
      lastUpdated: '2024-10-11',
      expiryDate: '2025-01-15',
      status: 'low',
    },
  ])

  const getStatusBadge = (item) => {
    const isExpiringSoon = new Date(item.expiryDate) - new Date() < 30 * 24 * 60 * 60 * 1000
    
    if (item.quantity < item.minQuantity * 0.5) {
      return <Badge variant="critical">Critical</Badge>
    }
    if (item.quantity < item.minQuantity) {
      return <Badge variant="warning">Low Stock</Badge>
    }
    if (isExpiringSoon) {
      return <Badge variant="warning">Expiring Soon</Badge>
    }
    return <Badge variant="success">Good</Badge>
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filterType === 'all') return matchesSearch
    if (filterType === 'low-stock') return matchesSearch && item.quantity < item.minQuantity
    if (filterType === 'expired') {
      const isExpiringSoon = new Date(item.expiryDate) - new Date() < 30 * 24 * 60 * 60 * 1000
      return matchesSearch && isExpiringSoon
    }
    return matchesSearch
  })

  const stats = {
    total: items.length,
    lowStock: items.filter(i => i.quantity < i.minQuantity).length,
    critical: items.filter(i => i.quantity < i.minQuantity * 0.5).length,
    totalValue: items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track and manage your dairy inventory
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                Add a new item to your inventory
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input id="item-name" placeholder="Enter item name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="Feed, Medicine, Supplement" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" placeholder="kg, bottles, bales" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-quantity">Min Quantity</Label>
                  <Input id="min-quantity" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Unit</Label>
                  <Input id="price" type="number" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" type="date" />
              </div>
              <Button className="w-full">Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.critical}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'low-stock' ? 'default' : 'outline'}
                  onClick={() => setFilterType('low-stock')}
                  size="sm"
                >
                  Low Stock
                </Button>
                <Button
                  variant={filterType === 'expired' ? 'default' : 'outline'}
                  onClick={() => setFilterType('expired')}
                  size="sm"
                >
                  Expiring Soon
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Min Qty</TableHead>
                    <TableHead>Price/Unit</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No items found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell>
                          {item.minQuantity} {item.unit}
                        </TableCell>
                        <TableCell>₹{item.price}</TableCell>
                        <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(item)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Inventory
