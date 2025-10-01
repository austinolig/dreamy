"use client";

import { ChevronDownIcon, LoaderCircle, Pencil } from "lucide-react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { updateDreamLog, getUserTags } from "@/lib/actions";
import { useActionState, useEffect, useState } from "react";
import { TagInput } from "@/components/tag-input";

export function EditDreamDialog({
  id,
  description,
  dreamDate,
  isNap,
  tags = [],
}: {
  id: number;
  description: string;
  dreamDate: Date;
  isNap: boolean;
  tags?: Array<{ id: number; name: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dreamDateState, setDreamDateState] = useState<Date>(dreamDate);
  const [sleepType, setSleepType] = useState<"sleep" | "nap">(
    isNap ? "nap" : "sleep"
  );
  const [existingTags, setExistingTags] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    tags.map((tag) => tag.name)
  );

  const [result, formAction, isPending] = useActionState(updateDreamLog, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (open) {
      getUserTags().then(setExistingTags);
    }
  }, [open]);

  useEffect(() => {
    result.message = "";
    if (result.success) {
      setOpen(false);
    }
  }, [result]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon" className="gap-2 md:hidden">
          <Pencil className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2 hidden md:flex">
          <Pencil className="size-4" />
          Edit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Dream Log</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to your dream journal entry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={id} />
          <div className="space-y-2">
            <Label htmlFor="dream-description">Description</Label>
            <Textarea
              id="dream-description"
              name="description"
              defaultValue={description || ""}
              placeholder="Write the highlights of your dream..."
              className="min-h-32"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dream-date">Dream date</Label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  className="w-full justify-between font-normal"
                  variant="outline"
                >
                  <input
                    className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                    id="dreamDate"
                    name="dreamDate"
                    type="text"
                    value={dreamDateState.toLocaleDateString()}
                    tabIndex={-1}
                    readOnly
                    hidden
                  />
                  {dreamDateState.toLocaleDateString()}
                  <ChevronDownIcon className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={dreamDateState}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDreamDateState(date || new Date());
                    if (date) {
                      setIsDatePickerOpen(false);
                    }
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Sleep Type</Label>
            <div className="flex h-9 w-full rounded-md border border-input bg-background p-1">
              <ToggleGroup
                type="single"
                value={sleepType}
                onValueChange={(value) => {
                  if (value) setSleepType(value as "sleep" | "nap");
                }}
                className="grid w-full grid-cols-2 gap-1"
              >
                <ToggleGroupItem
                  value="sleep"
                  aria-label="Full sleep"
                  className="h-full w-full rounded-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=off]:bg-transparent data-[state=off]:hover:bg-accent"
                >
                  Full Sleep
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="nap"
                  aria-label="Nap"
                  className="h-full w-full rounded-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=off]:bg-transparent data-[state=off]:hover:bg-accent"
                >
                  Nap
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <input
              type="hidden"
              name="isNap"
              value={sleepType === "nap" ? "on" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label>Tags (optional)</Label>
            <TagInput
              existingTags={existingTags}
              selectedTags={selectedTags}
              onChange={setSelectedTags}
              name="tags"
            />
          </div>
          <AlertDialogFooter>
            {!result.success && result.message && (
              <p className="text-sm text-destructive">{result.message}</p>
            )}
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  Saving
                  <LoaderCircle className="size-4 animate-spin" />
                </>
              ) : (
                <>Save Changes</>
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
