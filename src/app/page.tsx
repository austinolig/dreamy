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

const floatingLights = [
  { top: "12%", left: "8%" },
  { top: "28%", left: "82%" },
  { top: "68%", left: "18%" },
  { top: "78%", left: "72%" },
  { top: "42%", left: "48%" },
];

export default function HomePage() {
  const primaryFeatures = features.filter(
    (feature) => feature.type === "primary"
  );
  const supportingFeatures = features.filter(
    (feature) => feature.type === "secondary"
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#050315] via-[#0d0b2f] to-[#141130] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.12),_transparent_60%)]" />

      {floatingLights.map((position, index) => (
        <span
          key={`${position.top}-${position.left}`}
          className="pointer-events-none absolute h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl animate-orb"
          style={{
            top: position.top,
            left: position.left,
            animationDelay: `${index * 0.25}s`,
          }}
        />
      ))}

      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-20 px-6 pb-24 pt-24 md:px-12">
        <div className="space-y-6 mt-6 mx-auto max-w-3xl text-center animate-fade-up">
          <div>
            <Badge variant="outline">
              <Sparkles className="h-4 w-4" />
              Dream Insights & Analysis
            </Badge>
            <h1 className="text-[80px] sm:text-[120px] md:text-[160px] font-light tracking-tight leading-tight  text-white">
              Dreamy
            </h1>
          </div>
          <p className="text-lg text-slate-200/80 md:text-xl">
            Capture dreams and transform them into meaningful insights with
            thoughtful summaries, helpful visualizations, and personalized
            analysis.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="group">
              <Link href="/dashboard">
                Start Exploring
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#benefits">See Benefits</Link>
            </Button>
          </div>
        </div>

        <section id="features" className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            {primaryFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.12 + 0.18}s` }}
                >
                  <CardHeader className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <CardDescription className="text-xs uppercase tracking-[0.35em] text-indigo-100/70">
                        {feature.tagline}
                      </CardDescription>
                      <CardTitle className="text-xl font-light text-white">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <aside className="space-y-6">
            <Card
              className="animate-fade-up"
              style={{ animationDelay: "0.54s" }}
            >
              <CardHeader>
                <CardDescription className="text-xs uppercase tracking-[0.35em] text-indigo-100/70">
                  Supporting insights
                </CardDescription>
                <CardTitle>Features you&apos;ll love</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {supportingFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <Card
                        key={feature.title}
                        className="animate-fade-up py-0"
                        style={{ animationDelay: `${index * 0.05 + 0.6}s` }}
                      >
                        <CardHeader className="flex items-center gap-4 p-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-200">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-light text-white">
                              {feature.title}
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                              {feature.tagline}
                            </CardDescription>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </aside>
        </section>

        <section
          id="benefits"
          className="animate-fade-up"
          style={{ animationDelay: "0.82s" }}
        >
          <Card className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-10 backdrop-blur">
            <CardContent className="grid gap-12 p-0 md:grid-cols-[1.15fr_0.85fr] lg:grid-cols-[1.4fr_1fr]">
              <div className="flex flex-col gap-10">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-indigo-200/70">
                    Benefits
                  </p>
                  <h3 className="text-3xl font-light text-white md:text-4xl">
                    Transform your dreams into meaningful insights
                  </h3>
                  <p className="text-base text-muted-foreground">
                    Capture your dreams and transform them into meaningful
                    insights with thoughtful summaries, helpful visualizations,
                    and personalized analysis.
                  </p>
                </div>
                <div className="grid gap-6">
                  <Card className="h-full rounded-2xl border-white/10 bg-white/5 p-5">
                    <CardContent className="flex h-full flex-col justify-between gap-3 p-0">
                      <p className="text-sm font-medium text-white">
                        Capture before memories fade
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Record text, voice, or sketches while details stay vivid
                        so every symbol remains within reach.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="h-full rounded-2xl border-white/10 bg-white/5 p-5">
                    <CardContent className="flex h-full flex-col justify-between gap-3 p-0">
                      <p className="text-sm font-medium text-white">
                        Let insights come to you
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Dreamy organizes entries automatically, surfacing the
                        tags, motifs, and characters that repeat across nights.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="h-full rounded-2xl border-white/10 bg-white/5 p-5">
                    <CardContent className="flex h-full flex-col justify-between gap-3 p-0">
                      <p className="text-sm font-medium text-white">
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
              <aside className="relative flex flex-col gap-6 border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                <Card className="relative overflow-hidden rounded-3xl bg-indigo-500/10 p-6">
                  <CardContent className="space-y-5 p-0">
                    <p className="text-xs uppercase tracking-[0.4em] text-indigo-100/80">
                      a nightly ritual
                    </p>
                    <p className="text-lg text-white">
                      &quot;Dreamy catches my half-awake notes, sorts them into
                      patterns, and shows me the moods pulsing through each
                      week.&quot;
                    </p>
                    <p className="text-sm text-indigo-100/80">
                      - The Dreamy Team
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border border-white/10 bg-[#050315]/50 p-6">
                  <CardContent className="space-y-4 p-0 text-left">
                    <p className="text-xs uppercase tracking-[0.4em] text-indigo-100/70">
                      nightly glance
                    </p>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-200" />
                        <span>
                          Emotional tone tracing how each night feels.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-200" />
                        <span>
                          Pattern prompts when familiar symbols reappear.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-200" />
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
