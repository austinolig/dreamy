import { SunIcon, MoonIcon, CalendarIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { DreamLog, Tag } from "@prisma/client";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { format } from "date-fns";

export default function DreamLogCard({
  dream,
}: {
  dream: DreamLog & { tags: Tag[] };
}) {
  return (
    <Card
      key={dream.id}
      className="group relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg bg-input/30"
    >
      <Link
        href={`/dashboard/logs/${dream.id}`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">View dream log #{dream.id}</span>
      </Link>

      <CardHeader className="relative space-y-3">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="secondary" className="gap-1.5">
            {dream.isNap ? (
              <SunIcon className="size-3" />
            ) : (
              <MoonIcon className="size-3" />
            )}
            {dream.isNap ? "Nap" : "Sleep"}
          </Badge>
          <span className="text-xs font-medium text-muted-foreground">
            #{dream.id}
          </span>
        </div>

        <CardTitle className="line-clamp-1 text-base leading-snug">
          {dream.description}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarIcon className="size-3.5" />
          <span>{format(new Date(dream.dreamDate), "MMM d, yyyy")}</span>
        </div>
      </CardContent>

      <CardFooter className="relative border-t">
        <div className="flex flex-wrap gap-1.5">
          {dream.tags.length > 0 ? (
            <>
              {dream.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
              {dream.tags.length > 3 && (
                <Badge variant="outline">+{dream.tags.length - 3}</Badge>
              )}
            </>
          ) : (
            <Badge
              variant="outline"
              className="border border-transparent text-muted-foreground"
            >
              No tags
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
