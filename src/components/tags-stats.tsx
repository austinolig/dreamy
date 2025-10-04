"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Hash, TrendingUp } from "lucide-react";

type TagWithDreamLogs = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  dreamLogs: Array<{ id: number }>;
};

interface TagsStatsProps {
  tags: TagWithDreamLogs[];
}

export function TagsStats({ tags }: TagsStatsProps) {
  const totalTags = tags.length;
  const totalTaggedDreams = tags.reduce(
    (acc, tag) => acc + tag.dreamLogs.length,
    0
  );
  const averageTagsPerDream =
    totalTaggedDreams > 0 ? (totalTaggedDreams / totalTags).toFixed(1) : "0";

  // Find most used tag
  const mostUsedTag = tags.reduce(
    (max, tag) =>
      tag.dreamLogs.length > max.count
        ? { name: tag.name, count: tag.dreamLogs.length }
        : max,
    { name: "", count: 0 }
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTags}</div>
          <p className="text-muted-foreground text-xs">
            {totalTaggedDreams} total dream{totalTaggedDreams !== 1 ? "s" : ""}{" "}
            tagged
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Uses Per Tag
          </CardTitle>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageTagsPerDream}</div>
          <p className="text-muted-foreground text-xs">
            Dreams per tag on average
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Used Tag</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mostUsedTag.name || "N/A"}</div>
          <p className="text-muted-foreground text-xs">
            {mostUsedTag.count > 0
              ? `Used in ${mostUsedTag.count} dream${
                  mostUsedTag.count !== 1 ? "s" : ""
                }`
              : "No tags used yet"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
