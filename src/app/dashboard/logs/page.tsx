import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DreamLogsList } from "@/components/dream-logs-list";

export const metadata: Metadata = {
  title: "Dream Logs",
  description:
    "Browse and manage all your dream entries. Search, filter, and explore your complete dream journal.",
};

export default async function DreamLogsPage() {
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
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dream Logs</h1>
        <p className="text-muted-foreground">
          Browse and manage all your dream entries
        </p>
      </div>

      <DreamLogsList dreamLogs={dreamLogs} />
    </div>
  );
}
