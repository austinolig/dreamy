"use client";

import * as React from "react";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { ChevronDownIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createDreamLog } from "@/lib/actions";

export function AddDreamDialog() {
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [dreamDate, setDreamDate] = React.useState<Date | undefined>(undefined);
  const [isNap, setIsNap] = React.useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!dreamDate) {
        console.warn("Dream date is required before saving a dream entry.");
        setIsDatePickerOpen(true);
        return;
      }

      const payload = {
        description: description.trim(),
        dreamDate: dreamDate.toISOString(),
        isNap,
      };

      if (!payload.description) {
        setError("Description is required");
        return;
      }

      startTransition(() => {
        void (async () => {
          setError(null);
          const result = await createDreamLog(payload);

          if (!result.success) {
            setError(result.error);
            return;
          }

          setOpen(false);
          setDescription("");
          setDreamDate(undefined);
          setIsNap(false);
          router.refresh();
        })();
      });
    },
    [description, dreamDate, isNap, router]
  );

  const handleCheckedChange = React.useCallback((checked: CheckedState) => {
    setIsNap(checked === true);
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 size-4" />
          Add
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Log a dream</AlertDialogTitle>
          <AlertDialogDescription>
            Capture the essentials for your dream journal entry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dream-description">Description</Label>
            <Textarea
              id="dream-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write the highlights of your dream..."
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dream-date">Dream date</Label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="dream-date"
                  type="button"
                  variant="outline"
                  className="w-full justify-between font-normal"
                >
                  {dreamDate ? dreamDate.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={dreamDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDreamDate(date ?? undefined);
                    if (date) {
                      setIsDatePickerOpen(false);
                    }
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="dream-nap"
              checked={isNap}
              onCheckedChange={handleCheckedChange}
            />
            <Label htmlFor="dream-nap">Was this a nap?</Label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save entry"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
