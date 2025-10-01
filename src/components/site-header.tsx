"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/logs": "Dream Logs",
  "/dashboard/tags": "Tags Manager",
  "/dashboard/search": "Search Dreams",
  "/dashboard/analytics": "Analytics",
  "/dashboard/insights": "Insights",
  "/dashboard/art": "Dream Art",
  "/dashboard/settings": "Settings",
  "/dashboard/help": "Get Help",
};

export function SiteHeader() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (routeTitles[pathname]) {
      return routeTitles[pathname];
    }

    if (pathname.startsWith("/dashboard/logs/")) {
      return `Dream Log #${pathname.split("/")[3]}`;
    }

    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-20 bg-background flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle()}</h1>
      </div>
    </header>
  );
}
