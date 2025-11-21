"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Package,
  Cpu,
  Settings,
  Database,
  BarChart3,
  Users,
  FileText,
  Wrench,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
} from "@repo/ui/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      items: [],
    },
    {
      title: "Components",
      url: "/components",
      icon: Cpu,
      items: [],
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: Package,
      items: [
        {
          title: "Stock Overview",
          url: "/inventory",
        },
        {
          title: "Low Stock Alerts",
          url: "/inventory/alerts",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Sales Overview",
          url: "/analytics/sales",
        },
        {
          title: "Popular Components",
          url: "/analytics/popular",
        },
        {
          title: "Build Statistics",
          url: "/analytics/builds",
        },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/users",
        },
        {
          title: "Admins",
          url: "/users/admins",
        },
        {
          title: "Activity Log",
          url: "/users/activity",
        },
      ],
    },
    {
      title: "Database",
      url: "/database",
      icon: Database,
      items: [
        {
          title: "Backup",
          url: "/database/backup",
        },
        {
          title: "Import/Export",
          url: "/database/import-export",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Documentation",
      url: "/docs",
      icon: FileText,
    },
    {
      title: "Tools",
      url: "/tools",
      icon: Wrench,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Help & Support",
      url: "/help",
      icon: HelpCircle,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Cpu className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">PC Builder</span>
                  <span className="text-xs text-muted-foreground">
                    Admin Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {data.navMain.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.url || pathname.startsWith(item.url + "/");
              const hasSubItems = item.items && item.items.length > 0;

              return hasSubItems ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        <Icon className="size-4" />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                        {item.items.map((subItem) => {
                          const isSubActive = pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isSubActive}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarMenu className="gap-1">
            {data.navSecondary.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.url;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/logout">
                <LogOut className="size-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
