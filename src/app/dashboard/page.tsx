import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
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
import {
  MoonIcon,
  SparklesIcon,
  SunIcon,
  TrendingUpIcon,
  TagIcon,
  SearchIcon,
  ImageIcon,
  BrainIcon,
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const [dreamLogs, tags] = await Promise.all([
    prisma.dreamLog.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        tags: true,
      },
      orderBy: {
        dreamDate: "desc",
      },
    }),
    prisma.tag.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        name: true,
        _count: {
          select: {
            dreamLogs: true,
          },
        },
      },
      orderBy: {
        dreamLogs: {
          _count: "desc",
        },
      },
      take: 6,
    }),
  ]);

  const totalDreams = dreamLogs.length;
  const napCount = dreamLogs.filter((dreamLog) => dreamLog.isNap).length;
  const overnightCount = totalDreams - napCount;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Your personal dream journal and exploration space
        </p>
      </div>

      {totalDreams > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-muted/40 p-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <SparklesIcon className="size-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="min-w-max text-sm font-medium text-muted-foreground">
                Total Dreams
              </p>
              <p className="text-3xl font-bold tracking-tight">{totalDreams}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-muted/40 p-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <MoonIcon className="size-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="min-w-max text-sm font-medium text-muted-foreground">
                Overnight Dreams
              </p>
              <p className="text-3xl font-bold tracking-tight">
                {overnightCount}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-muted/40 p-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <SunIcon className="size-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="min-w-max text-sm font-medium text-muted-foreground">
                Nap Dreams
              </p>
              <p className="text-3xl font-bold tracking-tight">{napCount}</p>
            </div>
          </div>
        </div>
      )}

      {totalDreams > 0 && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SearchIcon className="size-5 text-primary" />
                  <CardTitle>Quick Search</CardTitle>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/search">
                    Advanced Search
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>
                Search across all your dreams by content, tags, and themes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Search dreams..." className="flex-1" />
                <Button>Search</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TagIcon className="size-5 text-primary" />
                    <CardTitle>Top Tags</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/tags">
                      Manage
                      <ArrowRightIcon className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
                <CardDescription>
                  Most frequently used tags in your dreams
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.name}
                        variant="secondary"
                        className="text-sm px-3 py-1"
                      >
                        {tag.name}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {tag._count.dreamLogs}
                        </span>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No tags yet. Start tagging your dreams to see patterns.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="size-5 text-primary" />
                    <CardTitle>Dream Trends</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/analytics">
                      View All
                      <ArrowRightIcon className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
                <CardDescription>
                  Recent patterns in your dream journal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">This Week</span>
                  </div>
                  <span className="text-lg font-bold">
                    {
                      dreamLogs.filter(
                        (dreamLog) =>
                          new Date(dreamLog.dreamDate) >
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">This Month</span>
                  </div>
                  <span className="text-lg font-bold">
                    {
                      dreamLogs.filter(
                        (dreamLog) =>
                          new Date(dreamLog.dreamDate) >
                          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                      ).length
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainIcon className="size-5 text-primary" />
                  <CardTitle>AI Insights</CardTitle>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/insights">
                    View All
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>
                Discover patterns and themes across your dreams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="rounded-lg border bg-muted/20 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="size-4 text-primary" />
                    <span className="font-medium text-sm">
                      Recurring Theme Detected
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Water appears frequently in your dreams, often associated
                    with emotional experiences. This may indicate a focus on
                    feelings and intuition.
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/20 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="size-4 text-primary" />
                    <span className="font-medium text-sm">Dream Frequency</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You&apos;re averaging {(totalDreams / 30).toFixed(1)} dreams
                    per month. Consistent journaling helps capture more dream
                    memories!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="size-5 text-primary" />
                  <CardTitle>Dream Art Gallery</CardTitle>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/art">
                    View Gallery
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>
                AI-generated visual interpretations of your dreams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 flex items-center justify-center border border-dashed"
                  >
                    <ImageIcon className="size-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {totalDreams === 0 ? "Start Your Journey" : "Recent Dreams"}
          </h2>
          {totalDreams > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/logs">
                View All Dreams
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
          )}
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
            {dreamLogs.slice(0, 6).map((dream) => (
              <Card
                key={dream.id}
                className="group hover:border-primary/50 relative overflow-hidden transition-shadow hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/logs/${dream.id}`}
                  className="absolute w-full h-full inset-0 z-1"
                >
                  <span className="sr-only">
                    Dream Log for {format(dream.dreamDate, "EEE, MMM d")}
                  </span>
                </Link>
                <CardHeader className="relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold line-clamp-1">
                        {dream.description}
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
                <CardContent className="flex relative space-y-3">
                  <p className="flex-1 self-end text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                    {format(dream.dreamDate, "EEEE, MMM d")}
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
