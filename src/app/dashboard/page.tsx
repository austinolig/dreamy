import Link from "next/link";

import { AddDreamDialog } from "@/components/add-dream-dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { DeleteDreamDialog } from "@/components/delete-dream-dialog";
import { format } from "date-fns";
import { MoonIcon, SparklesIcon, SunIcon } from "lucide-react";

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
    orderBy: {
      dreamDate: "desc",
    },
  });

  const totalDreams = dreamLogs.length;
  const napCount = dreamLogs.filter((d) => d.isNap).length;
  const overnightCount = totalDreams - napCount;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dream Timeline</h1>
        <p className="text-muted-foreground">
          Your personal dream journal and exploration space
        </p>
      </div>

      {/* Stats Section */}
      {totalDreams > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Dreams
              </CardTitle>
              <SparklesIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDreams}</div>
              <p className="text-xs text-muted-foreground">Dreams captured</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overnight Dreams
              </CardTitle>
              <MoonIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overnightCount}</div>
              <p className="text-xs text-muted-foreground">Night journeys</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nap Dreams</CardTitle>
              <SunIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{napCount}</div>
              <p className="text-xs text-muted-foreground">Afternoon visions</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dreams Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {totalDreams === 0 ? "Start Your Journey" : "Recent Dreams"}
          </h2>
          <AddDreamDialog />
        </div>

        {totalDreams === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <MoonIcon className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No dreams yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                Begin documenting your dreams and discover patterns in your
                subconscious mind. Every journey starts with a single dream.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dreamLogs.map((dream) => (
              <Card
                key={dream.id}
                className="group relative overflow-hidden transition-shadow hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/logs/${dream.id}`}
                  className="absolute w-full h-full inset-0 z-0"
                >
                  <span className="sr-only">
                    Dream Log for {format(dream.dreamDate, "EEE, MMM d")}
                  </span>
                </Link>
                <CardHeader className="relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold line-clamp-1">
                        {format(dream.dreamDate, "EEEE, MMM d")}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {dream.isNap ? (
                          <SunIcon className="size-3" />
                        ) : (
                          <MoonIcon className="size-3" />
                        )}
                        <span>{dream.isNap ? "Nap" : "Overnight"}</span>
                      </div>
                    </div>
                    <DeleteDreamDialog id={dream.id} />
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                    {dream.description}
                  </p>
                </CardContent>
                {dream.tags.length > 0 && (
                  <CardFooter className="relative flex flex-wrap gap-2 border-t pt-4">
                    {dream.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
