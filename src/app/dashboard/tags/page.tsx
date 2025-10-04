import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TagsList } from "@/components/tags-list";
import { TagsStats } from "@/components/tags-stats";
import { prisma } from "@/lib/prisma";

export default async function TagsManagerPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const tags = await prisma.tag.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      dreamLogs: {
        orderBy: {
          dreamDate: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Tags Manager</h1>
        <p className="text-muted-foreground">
          Organize and manage your dream tags, themes, and symbols
        </p>
      </div>

      {tags.length > 0 && <TagsStats tags={tags} />}

      <TagsList tags={tags} />
    </div>
  );
}
