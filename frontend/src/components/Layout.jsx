// Main Layout Component with Sidebar Navigation
import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { OfflineBanner } from "./ui/banner";
import {
  Home,
  Users,
  Milk,
  CreditCard,
  Receipt,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  Beef,
  Heart,
  Package,
  Bell,
  Wifi,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "../lib/utils";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Different navigation based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { name: "Dashboard", href: "/dashboard", icon: Home, label: "Dashboard" },
    ];

    if (user?.role === "ADMIN") {
      return [
        ...commonItems,
        {
          name: "Milk",
          href: "/milk-collections",
          icon: Milk,
          label: "Milk Collections",
        },
        {
          name: "Farmers",
          href: "/users",
          icon: Users,
          label: "Farmer Management",
          badge: null,
        },
  

        {
          name: "Inventory",
          href: "/inventory",
          icon: Package,
          label: "Inventory",
        },
        {
          name: "Finance",
          href: "/payments",
          icon: CreditCard,
          label: "Finance & Payouts",
        },
        {
          name: "Reports",
          href: "/reports",
          icon: BarChart3,
          label: "Analytics & Reports",
        },
        {
          name: "Notifications",
          href: "/notifications",
          icon: Bell,
          label: "Notifications",
        },

        {
          name: "Settings",
          href: "/settings",
          icon: Settings,
          label: "Settings",
        },
      ];
    } else if (user?.role === "FARMER") {
      return [
        ...commonItems,
        {
          name: "My Milk",
          href: "/my-collections",
          icon: Milk,
          label: "My Collections",
        },
        {
          name: "Finance",
          href: "/my-payments",
          icon: CreditCard,
          label: "My Payments",
        },
        {
          name: "Notifications",
          href: "/notifications",
          icon: Bell,
          label: "Notifications",
        },
      ];
    }
    return commonItems;
  };

  const navigation = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <h1 className="text-xl font-semibold">
              {user?.role === "ADMIN" ? "Admin Panel" : "Farmer Portal"}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-blue-600 text-white"
                  )}
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r shadow-sm">
          <div className="flex h-16 items-center px-6 border-b">
            <h1 className="text-xl font-semibold text-gray-900">
              {user?.role === "ADMIN" ? "Admin Panel" : "Farmer Portal"}
            </h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Offline Banner */}
        <OfflineBanner />

        {/* Top header */}
        <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden min-h-[44px] min-w-[44px]"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <Badge variant="outline" className="mt-0.5">
                    {user?.name}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
