"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconMoon,
  IconPalette,
  IconSettings,
  IconSparkles,
  IconTags,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "@prisma/client";
import { Moon } from "lucide-react";
import { NavGroup } from "@/components/nav-group";

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
];

const dreamManagement = [
  {
    name: "Dream Logs",
    url: "/dashboard/logs",
    icon: IconMoon,
  },
  {
    name: "Tags Manager",
    url: "/dashboard/tags",
    icon: IconTags,
  },
  {
    name: "Dream Art",
    url: "/dashboard/art",
    icon: IconPalette,
  },
];

const analysisInsights = [
  {
    name: "Analytics",
    url: "/dashboard/analytics",
    icon: IconChartBar,
  },
  {
    name: "Insights",
    url: "/dashboard/insights",
    icon: IconSparkles,
  },
];

const navSecondary = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: IconSettings,
  },
  {
    title: "Get Help",
    url: "/dashboard/help",
    icon: IconHelp,
  },
];

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <Moon className="size-5" />
              <span className="text-base font-semibold">Dreamy</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavGroup items={dreamManagement} groupLabel="Dream Management" />
        <NavGroup items={analysisInsights} groupLabel="Analysis & Insights" />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            ...user,
            avatar: user.image ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
