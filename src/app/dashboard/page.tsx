import type { Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
import DreamLogCard from "@/components/dream-log-card";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your personal dream journal and exploration space. View recent dreams, trends, and insights.",
};

export default async function OverviewPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">
          {session.user.name?.split(" ")[0]}&apos;s Dashboard
        </h1>
        <p className="text-muted-foreground">
          Your personal dream journal and exploration space
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4">
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
        <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4">
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
        <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4">
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

      <Card className={totalDreams > 0 ? "" : "border-dashed"}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SearchIcon className="size-5 text-primary" />
            <CardTitle>Quick Search</CardTitle>
          </div>
          <CardDescription>
            Search across all your dreams by content, tags, and themes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalDreams > 0 ? (
            <div className="flex gap-2">
              <Input placeholder="Search dreams..." className="flex-1" />
              <Button>Search</Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-6">
              <div className="rounded-full bg-muted p-4">
                <SearchIcon className="size-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Once you add dreams, you&apos;ll be able to search through them
                to find specific entries, themes, and patterns.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className={totalDreams > 0 ? "" : "border-dashed"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-5 text-primary" />
              <CardTitle>Recent Dreams</CardTitle>
            </div>
            {totalDreams > 0 && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/logs">
                  View All Dreams
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
            )}
          </div>
          <CardDescription>Your latest dream journal entries</CardDescription>
        </CardHeader>
        <CardContent>
          {totalDreams > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dreamLogs.slice(0, 6).map((dream) => (
                <DreamLogCard key={dream.id} dream={dream} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-6">
              <div className="rounded-full bg-muted p-4">
                <MoonIcon className="size-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No dreams yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  Begin documenting your dreams and discover patterns in your
                  subconscious mind. Every journey starts with a single dream.
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/logs">Add Your First Dream</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className={tags.length > 0 ? "" : "border-dashed"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TagIcon className="size-5 text-primary" />
                <CardTitle>Top Tags</CardTitle>
              </div>
              {tags.length > 0 && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/tags">
                    Manage
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              )}
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
              <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
                <div className="rounded-full bg-muted p-4">
                  <TagIcon className="size-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Tags help you categorize and find dreams. Add tags like
                  &quot;flying&quot;, &quot;lucid&quot;, or
                  &quot;nightmare&quot; to organize your journal.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={totalDreams > 0 ? "" : "border-dashed"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="size-5 text-primary" />
                <CardTitle>Dream Trends</CardTitle>
              </div>
              {totalDreams > 0 && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/analytics">
                    View All
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              )}
            </div>
            <CardDescription>
              Recent patterns in your dream journal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {totalDreams > 0 ? (
              <div className="space-y-4">
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
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
                <div className="rounded-full bg-muted p-4">
                  <TrendingUpIcon className="size-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Track your dreaming patterns over time. See which days you
                  dream most and identify trends in your sleep cycles.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className={totalDreams > 0 ? "" : "border-dashed"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainIcon className="size-5 text-primary" />
              <CardTitle>AI Insights</CardTitle>
            </div>
            {totalDreams > 0 && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/insights">
                  View All
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
            )}
          </div>
          <CardDescription>
            Discover patterns and themes across your dreams
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalDreams > 0 ? (
            <div className="grid gap-3">
              <div className="rounded-lg border bg-muted/20 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="size-4 text-primary" />
                  <span className="font-medium text-sm">
                    Recurring Theme Detected
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Water appears frequently in your dreams, often associated with
                  emotional experiences. This may indicate a focus on feelings
                  and intuition.
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
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-6">
              <div className="rounded-full bg-muted p-4">
                <BrainIcon className="size-8 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium mb-2">AI-Powered Analysis</h4>
                <p className="text-sm text-muted-foreground max-w-md">
                  Our AI will analyze your dreams to identify recurring themes,
                  emotional patterns, and symbolic meanings. Start journaling to
                  unlock personalized insights.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className={totalDreams > 0 ? "" : "border-dashed"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="size-5 text-primary" />
              <CardTitle>Dream Art Gallery</CardTitle>
            </div>
            {totalDreams > 0 && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/art">
                  View Gallery
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
            )}
          </div>
          <CardDescription>
            AI-generated visual interpretations of your dreams
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalDreams > 0 ? (
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
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-6">
              <div className="rounded-full bg-muted p-4">
                <ImageIcon className="size-8 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium mb-2">Visualize Your Dreams</h4>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  Transform your dream descriptions into beautiful AI-generated
                  artwork. Each dream becomes a unique piece of visual art.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full max-w-48">
                <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-dashed" />
                <div className="aspect-square rounded-lg bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 border border-dashed" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
