import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { EditDreamDialog } from "@/components/edit-dream-dialog";
import { DeleteDreamDialog } from "@/components/delete-dream-dialog";
import { Separator } from "@/components/ui/separator";

type DreamLogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DreamLogPage({ params }: DreamLogPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const dreamLogId = Number.parseInt(id);

  const dreamLog = await prisma.dreamLog.findFirst({
    where: {
      id: dreamLogId,
      userId: session.user.id,
    },
    include: {
      tags: true,
    },
  });

  if (!dreamLog) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href="/dashboard">
            <ArrowLeftIcon className="size-4" />
            Back to timeline
          </Link>
        </Button>
        <Badge
          variant={dreamLog.isNap ? "default" : "secondary"}
          className="gap-1.5"
        >
          {dreamLog.isNap ? (
            <SunIcon className="size-3" />
          ) : (
            <MoonIcon className="size-3" />
          )}
          {dreamLog.isNap ? "Nap Dream" : "Overnight Dream"}
        </Badge>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Dream Log #{dreamLog.id}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="size-4" />
                  <span>{format(dreamLog.createdAt, "EEE, MMM d")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="size-4" />
                  <span>{format(dreamLog.createdAt, "h:mm a")}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <EditDreamDialog
                id={dreamLog.id}
                description={dreamLog.description}
                dreamDate={dreamLog.dreamDate}
                isNap={dreamLog.isNap}
                tags={dreamLog.tags}
              />
              <DeleteDreamDialog id={dreamLog.id} redirectPath="/dashboard" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {dreamLog.isNap ? (
              <>
                <SunIcon className="size-4" aria-hidden />
                <span>Captured during an afternoon nap</span>
              </>
            ) : (
              <>
                <MoonIcon className="size-4" aria-hidden />
                <span>Captured from overnight sleep</span>
              </>
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Dream Journal Entry
            </h2>
            <p className="whitespace-pre-wrap text-base leading-relaxed">
              {dreamLog.description}
            </p>
          </div>
        </CardContent>

        {dreamLog.tags.length > 0 && (
          <CardFooter className="flex flex-col items-start gap-3 border-t py-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {dreamLog.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
