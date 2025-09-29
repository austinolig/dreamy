import type { CSSProperties } from "react";

import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeftIcon, MoonIcon, SunIcon } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const dreamDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
  timeStyle: "short",
});

const metaDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

type DreamLogPageProps = {
  params: { id: string };
};

export default async function DreamLogPage({ params }: DreamLogPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userId = "id" in session.user ? String(session.user.id) : null;

  if (!userId) {
    redirect("/login");
  }

  const dreamLogId = Number.parseInt(params.id, 10);

  if (!Number.isInteger(dreamLogId) || dreamLogId <= 0) {
    notFound();
  }

  const dreamLog = await prisma.dreamLog.findFirst({
    where: {
      id: dreamLogId,
      tags: {
        some: {
          userId,
        },
      },
    },
    include: {
      tags: true,
    },
  });

  if (!dreamLog) {
    notFound();
  }

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
        <div className="flex-1 space-y-6 p-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/dashboard" className="flex items-center">
                <ArrowLeftIcon className="size-4" />
                Back to timeline
              </Link>
            </Button>
            <Badge variant="secondary" className="px-3 py-1 text-xs uppercase tracking-wide">
              {dreamLog.isNap ? "Nap" : "Overnight"}
            </Badge>
          </div>
          <Card className="flex flex-col gap-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                {dreamDateFormatter.format(dreamLog.dreamDate)}
                <span className="sr-only">Dream timing</span>
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Logged {metaDateFormatter.format(dreamLog.createdAt)}
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4 py-6">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {dreamLog.isNap ? (
                  <SunIcon className="size-4" aria-hidden />
                ) : (
                  <MoonIcon className="size-4" aria-hidden />
                )}
                {dreamLog.isNap ? "Captured during a nap" : "Overnight dream"}
              </div>
              <p className="whitespace-pre-wrap text-base text-foreground">
                {dreamLog.description}
              </p>
            </CardContent>
            {dreamLog.tags.length > 0 ? (
              <>
                <Separator />
                <CardFooter className="flex flex-wrap gap-2 py-4">
                  {dreamLog.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </CardFooter>
              </>
            ) : null}
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
