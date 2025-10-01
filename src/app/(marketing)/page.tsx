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
      <section className="container mx-auto max-w-6xl space-y-24 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="space-y-4">
            <div className="animate-fade-in-up">
              <Badge variant="outline">
                <Sparkles className="h-4 w-4" />
                Dream Insights & Analysis
              </Badge>
            </div>
            <h1 className="animate-fade-in-up animation-delay-100 text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl">
              Dreamy
            </h1>
          </div>
          <p className="animate-fade-in-up animation-delay-200 text-lg text-muted-foreground md:text-xl">
            Capture dreams and transform them into meaningful insights with
            thoughtful summaries, helpful visualizations, and personalized
            analysis.
          </p>
          <div className="animate-fade-in-up animation-delay-300 flex flex-wrap items-center justify-center gap-4">
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

        <section className="animate-fade-in-up animation-delay-400 space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to understand your dreams
            </h2>
            <p className="text-muted-foreground">
              Powerful tools that work together to help you capture, analyze,
              and reflect on your dream life.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {primaryFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="animate-fade-in-up border-2"
                  style={{
                    animationDelay: `${500 + idx * 100}ms`,
                  }}
                >
                  <CardHeader>
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="mt-4 text-xl">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-xs uppercase tracking-wider">
                      {feature.tagline}
                    </CardDescription>
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {supportingFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${800 + idx * 50}ms`,
                  }}
                >
                  <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {feature.tagline}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="animate-fade-in-up animation-delay-400">
          <Card className="overflow-hidden border-2">
            <CardContent className="grid gap-12 p-8 lg:grid-cols-2 lg:gap-16 lg:p-12">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Your dreams deserve attention
                  </h2>
                  <p className="text-muted-foreground">
                    Build a deeper connection with your subconscious through
                    powerful yet simple tools designed for reflection and
                    growth.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Moon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Never Lose a Dream</h3>
                      <p className="text-sm text-muted-foreground">
                        Wake up and immediately capture fleeting memories with
                        text, voice notes, or quick sketches.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">
                        Discover Hidden Patterns
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Automatic tagging reveals recurring themes, symbols, and
                        characters across nights.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Map className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">
                        Track Your Inner Journey
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Visualize emotional patterns and dream frequency over
                        time with beautiful charts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">
                        Stay Mindfully Aware
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Gentle notifications when meaningful symbols reappear.
                      Reflect on what your subconscious is trying to tell you.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <ImageIcon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">
                        Visualize Your Dreams
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Transform written entries into beautiful, AI-generated
                      artwork that captures the essence of your adventures.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Link2 className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">
                        Connect Day & Night
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Link dreams to daily events, habits, and moods to discover
                      what influences your sleep.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="animate-fade-in-up animation-delay-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Moon className="h-5 w-5 text-primary" />
                Private & Secure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your dreams are personal. All entries are encrypted and stored
                securely. Only you have access.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Works Everywhere
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Capture dreams on any device. Sync seamlessly across phone,
                tablet, and desktop.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Tags className="h-5 w-5 text-primary" />
                Free to Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Begin your dream journey at no cost. Upgrade anytime for
                advanced insights and features.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="animate-fade-in-up animation-delay-400">
          <Card className="border-2 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
            <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Moon className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Ready to explore your dreams?
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  Join Dreamy today and start uncovering the patterns, emotions,
                  and insights hidden in your nightly adventures.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" className="text-base">
                  <Link href="/sign-up">
                    Sign Up
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link href="/dashboard">Start Exploring</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </section>
    </main>
  );
}
