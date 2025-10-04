"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Calendar, Moon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DreamLog, Tag } from "@prisma/client";
import { DeleteTagDialog } from "@/components/delete-tag-dialog";

type SortField = "name" | "createdAt" | "count";
type SortOrder = "asc" | "desc";

interface TagsListProps {
  tags: (Tag & { dreamLogs: DreamLog[] })[];
}

export function TagsList({ tags }: TagsListProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedTags = useMemo(() => {
    return [...tags].sort((a, b) => {
      let compareValue = 0;

      switch (sortField) {
        case "name":
          compareValue = a.name.localeCompare(b.name);
          break;
        case "createdAt":
          compareValue =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "count":
          compareValue = a.dreamLogs.length - b.dreamLogs.length;
          break;
      }

      return sortOrder === "asc" ? compareValue : -compareValue;
    });
  }, [tags, sortField, sortOrder]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  if (tags.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          No tags yet. Tags are automatically created when you add them to your
          dream logs.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="flex items-center font-medium hover:bg-transparent"
                >
                  Tag Name
                  <SortIcon field="name" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("count")}
                  className="flex items-center font-medium hover:bg-transparent"
                >
                  Dream Count
                  <SortIcon field="count" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center font-medium hover:bg-transparent"
                >
                  Created
                  <SortIcon field="createdAt" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-medium">
                      {tag.name}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {tag.dreamLogs.length}{" "}
                    {tag.dreamLogs.length === 1 ? "dream" : "dreams"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {format(new Date(tag.createdAt), "MMM d, yyyy")}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {tag.dreamLogs.length > 0 ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          View Dreams
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="end">
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <h4 className="font-medium leading-none">
                              Dreams tagged with &quot;{tag.name}&quot;
                            </h4>
                            <p className="text-muted-foreground text-sm">
                              {tag.dreamLogs.length}{" "}
                              {tag.dreamLogs.length === 1 ? "entry" : "entries"}
                            </p>
                          </div>
                          <div className="max-h-[300px] space-y-2 overflow-y-auto">
                            {tag.dreamLogs.map((dreamLog) => (
                              <Link
                                key={dreamLog.id}
                                href={`/dashboard/logs/${dreamLog.id}`}
                                className="block rounded-md border p-3 transition-colors hover:bg-accent"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 space-y-1">
                                    <p className="line-clamp-2 text-sm">
                                      {dreamLog.description.length > 80
                                        ? `${dreamLog.description.slice(
                                            0,
                                            80
                                          )}...`
                                        : dreamLog.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      {format(
                                        new Date(dreamLog.dreamDate),
                                        "MMM d, yyyy"
                                      )}
                                      {dreamLog.isNap && (
                                        <Badge
                                          variant="outline"
                                          className="h-5 text-xs"
                                        >
                                          <Moon className="mr-1 h-3 w-3" />
                                          Nap
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <DeleteTagDialog id={tag.id} name={tag.name} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {sortedTags.length} {sortedTags.length === 1 ? "tag" : "tags"}
        </div>
        <div>
          Total dreams:{" "}
          {sortedTags.reduce((acc, tag) => acc + tag.dreamLogs.length, 0)}
        </div>
      </div>
    </div>
  );
}
