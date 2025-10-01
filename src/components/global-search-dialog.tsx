"use client";

import * as React from "react";
import {
  SearchIcon,
  MoonIcon,
  TagIcon,
  SparklesIcon,
  TrendingUpIcon,
  SettingsIcon,
  HelpCircleIcon,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "./ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";

export function GlobalSearchDialog() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const isMac =
    typeof window !== "undefined" && navigator.userAgent.includes("Mac");

  const isMobile = useIsMobile();

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              size="icon"
              variant="outline"
              className="size-10"
            >
              <SearchIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-center">
            <p>Search</p>
            {!isMobile && (
              <kbd className="flex justify-center h-5 items-center gap-1 font-mono text-xs font-medium">
                {!isMac ? <span className="text-[16px]">⌘</span> : <>Ctrl+</>}K
              </kbd>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search dreams, tags, and more..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem asChild>
              <Link href="/dashboard/logs">
                <MoonIcon className="mr-2 size-4" />
                <span>View Dream Logs</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/dashboard/tags">
                <TagIcon className="mr-2 size-4" />
                <span>Manage Tags</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/dashboard/insights">
                <SparklesIcon className="mr-2 size-4" />
                <span>View Insights</span>
              </Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem asChild>
              <Link href="/dashboard/analytics">
                <TrendingUpIcon className="mr-2 size-4" />
                <span>Analytics</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/dashboard/settings">
                <SettingsIcon className="mr-2 size-4" />
                <span>Settings</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/dashboard/help">
                <HelpCircleIcon className="mr-2 size-4" />
                <span>Get Help</span>
              </Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
