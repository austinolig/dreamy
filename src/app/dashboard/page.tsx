import type { CSSProperties } from "react";

import Link from "next/link";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { AddDreamDialog } from "@/components/add-dream-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const dreamLogs = await prisma.dreamLog.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
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
        <div className="@container/main flex-1 grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
          <AddDreamDialog />
          {dreamLogs.length > 0
            ? dreamLogs.map((dream) => (
                <Link
                  key={dream.id}
                  href={`/dashboard/logs/${dream.id}`}
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Card className="h-full transition-shadow group-hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-base">
                        {dream.dreamDate.toLocaleDateString()}
                        <span className="text-xs font-medium text-muted-foreground">
                          {dream.isNap ? "Nap" : "Overnight"}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {dream.description}
                      </p>
                    </CardContent>
                    {/* {dream.tags.length > 0 ? (
                  <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                    {dream.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </CardFooter>
                ) : null} */}
                  </Card>
                </Link>
              ))
            : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
