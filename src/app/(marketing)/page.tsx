import {
  Bell,
  ChevronRight,
  Image as ImageIcon,
  Link2,
  Map,
  Moon,
  PenSquare,
  Sparkles,
  Tags,
  Type,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const features = [
  {
    title: "Quick Capture Mode",
    description:
      "Log vivid dream details the moment you wake up with text, voice, or sketches.",
    icon: PenSquare,
    type: "primary",
    tagline: "Capture before it fades",
  },
  {
    title: "Smart Tagging",
    description:
      "Organize entries automatically by recurring themes, symbols, settings, and characters.",
    icon: Tags,
    type: "primary",
    tagline: "Organize meaning automatically",
  },
  {
    title: "Theme & Symbol Analysis",
    description:
      "Spot the motifs that surface across nights and understand the stories your mind is weaving.",
    icon: Sparkles,
    type: "primary",
    tagline: "Surface recurring motifs",
  },
  {
    title: "Emotional Tone Detection",
    description:
      "Track the feelings flowing through each dream and notice how your inner world shifts.",
    icon: Moon,
    type: "secondary",
    tagline: "Chart your emotional undercurrent",
  },
  {
    title: "Recurring Pattern Alerts",
    description:
      "Get gentle nudges when familiar dream elements reappear so you can reflect with intention.",
    icon: Bell,
    type: "secondary",
    tagline: "Revisit the symbols that call you back",
  },
  {
    title: "Dream Maps & Stats",
    description:
      "Visualize trends, cycles, and peaks in a calm dashboard made for quiet reflection.",
    icon: Map,
    type: "secondary",
    tagline: "See rhythms across every night",
  },
  {
    title: "Dream-to-Life Links",
    description:
      "Connect nighttime narratives to daily rhythms to uncover the habits influencing your rest.",
    icon: Link2,
    type: "secondary",
    tagline: "Understand loops between day and night",
  },
  {
    title: "Generated Dream Art",
    description:
      "Bring your dreams to life with soothing visuals crafted from your own words and memories.",
    icon: ImageIcon,
    type: "secondary",
    tagline: "Turn memories into gentle visuals",
  },
  {
    title: "Dream Titles & Summaries",
    description:
      "Receive thoughtful titles and concise recaps so you can revisit dreams with clarity.",
    icon: Type,
    type: "secondary",
    tagline: "Remember with clear recaps",
  },
];

export default function HomePage() {
  const primaryFeatures = features.filter(
    (feature) => feature.type === "primary"
  );
  const supportingFeatures = features.filter(
    (feature) => feature.type === "secondary"
  );

  return (
    <main className="min-h-screen">
      <section className="container mx-auto max-w-6xl space-y-12 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="space-y-4">
            <Badge variant="outline">
              <Sparkles className="h-4 w-4" />
              Dream Insights & Analysis
            </Badge>
            <h1 className="text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl">
              Dreamy
            </h1>
          </div>
          <p className="text-lg text-muted-foreground md:text-xl">
            Capture dreams and transform them into meaningful insights with
            thoughtful summaries, helpful visualizations, and personalized
            analysis.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Start Exploring
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            {primaryFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <CardDescription className="text-xs uppercase tracking-wider">
                        {feature.tagline}
                      </CardDescription>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <aside className="space-y-6">
            <Card className="h-full">
              <CardHeader>
                <CardDescription className="text-xs uppercase tracking-wider">
                  Supporting insights
                </CardDescription>
                <CardTitle>Features you&apos;ll love</CardTitle>
              </CardHeader>
              <CardContent className="grid flex-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
                {supportingFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="flex flex-row items-center gap-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">{feature.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {feature.tagline}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </aside>
        </section>

        <section>
          <Card>
            <CardContent className="grid gap-12 p-8 md:grid-cols-2">
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-wider text-muted-foreground">
                    Benefits
                  </p>
                  <h3 className="text-3xl font-bold">
                    Transform your dreams into meaningful insights
                  </h3>
                  <p className="text-muted-foreground">
                    Capture your dreams and transform them into meaningful
                    insights with thoughtful summaries, helpful visualizations,
                    and personalized analysis.
                  </p>
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="space-y-2 p-5">
                      <p className="font-semibold">
                        Capture before memories fade
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Record text, voice, or sketches while details stay vivid
                        so every symbol remains within reach.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="space-y-2 p-5">
                      <p className="font-semibold">Let insights come to you</p>
                      <p className="text-sm text-muted-foreground">
                        Dreamy organizes entries automatically, surfacing the
                        tags, motifs, and characters that repeat across nights.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="space-y-2 p-5">
                      <p className="font-semibold">
                        Notice how you feel over time
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Follow moodlines, pattern nudges, and tranquil stats to
                        understand how rest echoes through your days.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <aside className="flex flex-col gap-6">
                <Card className="flex-1">
                  <CardContent className="space-y-4 p-6">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      A nightly ritual
                    </p>
                    <p className="text-lg">
                      &quot;Dreamy catches my half-awake notes, sorts them into
                      patterns, and shows me the moods pulsing through each
                      week.&quot;
                    </p>
                    <p className="text-sm text-muted-foreground">
                      - The Dreamy Team
                    </p>
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardContent className="space-y-4 p-6">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Nightly glance
                    </p>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        <span>
                          Emotional tone tracing how each night feels.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        <span>
                          Pattern prompts when familiar symbols reappear.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        <span>
                          Dream art and summaries ready to revisit anytime.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </aside>
            </CardContent>
          </Card>
        </section>
      </section>
    </main>
  );
}
