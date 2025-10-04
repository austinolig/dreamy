"use client";

import { useState } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import DreamLogCard from "./dream-log-card";
import { Tag, DreamLog } from "@prisma/client";

type SortField = "createdAt" | "updatedAt" | "description";
type SortOrder = "asc" | "desc";

type DreamLogsListProps = {
  dreamLogs: (DreamLog & { tags: Tag[] })[];
};

export function DreamLogsList({ dreamLogs }: DreamLogsListProps) {
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sortedDreamLogs = [...dreamLogs].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "createdAt":
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "updatedAt":
        comparison =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case "description":
        comparison = a.description.localeCompare(b.description);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (dreamLogs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-muted">
            <FileTextIcon className="size-10 text-muted-foreground" />
          </div>
          <h3 className="mt-6 text-lg font-semibold">No dream logs yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start capturing your dreams to see them appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-row justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Sort by:
          </span>
          <ToggleGroup
            type="single"
            value={sortField}
            onValueChange={(value) => {
              if (value) setSortField(value as SortField);
            }}
            className="gap-1"
          >
            <ToggleGroupItem
              value="createdAt"
              aria-label="Sort by date created"
              className="gap-1.5"
            >
              <CalendarIcon className="size-4" />
              <span className="hidden sm:inline">Created</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="updatedAt"
              aria-label="Sort by date modified"
              className="gap-1.5"
            >
              <ClockIcon className="size-4" />
              <span className="hidden sm:inline">Modified</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="description"
              aria-label="Sort by description"
              className="gap-1.5"
            >
              <FileTextIcon className="size-4" />
              <span className="hidden sm:inline">Name</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortOrder}
          className="gap-2"
        >
          {sortOrder === "desc" ? (
            <ArrowDownIcon className="size-4" />
          ) : (
            <ArrowUpIcon className="size-4" />
          )}
          {sortOrder === "desc" ? "Newest" : "Oldest"}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {sortedDreamLogs.length}{" "}
        {sortedDreamLogs.length === 1 ? "dream" : "dreams"}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedDreamLogs.map((dream) => (
          <DreamLogCard key={dream.id} dream={dream} />
        ))}
      </div>
    </div>
  );
}
