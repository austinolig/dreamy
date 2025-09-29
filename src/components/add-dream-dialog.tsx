"use client";

import { ChevronDownIcon, LoaderCircle, Plus } from "lucide-react";

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
import { useState } from "react";

export function AddDreamDialog() {
  const [open, setOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dreamDate, setDreamDate] = useState<Date | undefined>(undefined);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setMessage(null);
    const message = await createDreamLog(formData);
    if (!message) {
      setOpen(false);
    }
    setIsPending(false);
    setMessage(message);
  };

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
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dream-description">Description</Label>
            <Textarea
              id="dream-description"
              name="description"
              placeholder="Write the highlights of your dream..."
              required
            />
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
                  <input
                    className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                    id="dreamDate"
                    name="dreamDate"
                    type="text"
                    value={dreamDate ? dreamDate.toLocaleDateString() : ""}
                    onChange={() => {}}
                    tabIndex={-1}
                    required
                  />
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
            <Checkbox id="isNap" name="isNap" />
            <Label htmlFor="isNap">Was this a nap?</Label>
          </div>
          <AlertDialogFooter>
            {message && <p className="text-sm text-destructive">{message}</p>}
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isPending}>
              Save
              {isPending && <LoaderCircle className="animate-spin" />}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
