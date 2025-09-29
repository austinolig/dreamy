import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        user={{
          ...session.user,
          image: session.user.image || null,
        }}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="@container/main flex-1 grid grid-cols-4 gap-2 p-4">
          <Button variant="outline">
            <Plus />
            Add
          </Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
