"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Package, Plus } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage pre-built PC configurations
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Package className="h-16 w-16 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">Coming Soon</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Product management features will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
