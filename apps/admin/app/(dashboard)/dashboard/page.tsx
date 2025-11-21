"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { useListComponents } from "../../hooks/api/useComponent";
import {
  Cpu,
  Package,
  TrendingUp,
  DollarSign,
  Activity,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  const { components, isLoading } = useListComponents();

  // Calculate statistics
  const totalComponents = components.length;
  const componentsByType = components.reduce(
    (acc, component) => {
      acc[component.type] = (acc[component.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const averagePrice =
    components.length > 0
      ? components.reduce((sum, c) => sum + c.price, 0) / components.length
      : 0;

  const stats = [
    {
      title: "Total Components",
      value: totalComponents.toString(),
      icon: Cpu,
      description: "Active components in inventory",
      trend: "+12% from last month",
    },
    {
      title: "Total Products",
      value: "0",
      icon: Package,
      description: "PC build configurations",
      trend: "+8% from last month",
    },
    {
      title: "Average Price",
      value: `$${averagePrice.toFixed(2)}`,
      icon: DollarSign,
      description: "Per component",
      trend: "+3% from last month",
    },
    {
      title: "Active Users",
      value: "1,234",
      icon: Users,
      description: "Total registered users",
      trend: "+18% from last month",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your PC Builder platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Component Type Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Component Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Activity className="h-8 w-8 animate-pulse text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(componentsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium">{type}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {count} items
                    </span>
                  </div>
                ))}
                {Object.keys(componentsByType).length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    No components yet
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New component added</p>
                  <p className="text-xs text-muted-foreground">
                    Intel Core i9-13900K added to inventory
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Product updated</p>
                  <p className="text-xs text-muted-foreground">
                    Gaming PC Build v2 specifications updated
                  </p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">
                    John Doe joined the platform
                  </p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/components"
              className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
            >
              <Cpu className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium">Manage Components</h3>
                <p className="text-sm text-muted-foreground">
                  Add or edit PC components
                </p>
              </div>
            </a>
            <a
              href="/products"
              className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
            >
              <Package className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium">Manage Products</h3>
                <p className="text-sm text-muted-foreground">
                  Create PC build configurations
                </p>
              </div>
            </a>
            <a
              href="/settings"
              className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
            >
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium">View Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Check platform statistics
                </p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
