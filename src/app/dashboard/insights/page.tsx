import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Discover recurring themes, symbols, emotional patterns, and connections across your dream journal.",
};

export default async function InsightsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground">
          Discover recurring themes, symbols, emotional patterns, and
          connections
        </p>
      </div>

      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          AI-powered dream insights coming soon...
        </p>
      </div>
    </div>
  );
}
