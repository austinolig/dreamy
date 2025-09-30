import type { CSSProperties } from "react";

import Link from "next/link";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { AddDreamDialog } from "@/components/add-dream-dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { DeleteDreamDialog } from "@/components/delete-dream-dialog";
import { format } from "date-fns";

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
    include: {
      tags: true,
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
        <div className="@container/main grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
          <AddDreamDialog />
          {dreamLogs.length > 0 &&
            dreamLogs.map((dream) => (
              <Card key={dream.id} className="relative">
                <Link
                  href={`/dashboard/logs/${dream.id}`}
                  className="w-full h-full absolute inset-0 rounded-xl overflow-hidden"
                >
                  <span className="sr-only">
                    Dream Log for {format(dream.dreamDate, "EEE, MMM d")}
                  </span>
                </Link>
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center justify-between text-base">
                      {format(dream.dreamDate, "EEE, MMM d")}
                    </CardTitle>
                    <div className="text-xs font-medium text-muted-foreground">
                      {dream.isNap ? "Nap" : "Overnight"}
                    </div>
                  </div>
                  <DeleteDreamDialog id={dream.id} />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {dream.description}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                  {dream.tags.length > 0 &&
                    dream.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                </CardFooter>
              </Card>
            ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
