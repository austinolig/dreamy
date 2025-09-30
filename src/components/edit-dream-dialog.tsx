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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateDreamLog } from "@/lib/actions";
import { useActionState, useEffect, useState } from "react";

export function EditDreamDialog({
  id,
  description,
  dreamDate,
  isNap,
}: {
  id: number;
  description: string;
  dreamDate: Date;
  isNap: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dreamDateState, setDreamDateState] = useState<Date>(dreamDate);

  const [result, formAction, isPending] = useActionState(updateDreamLog, {
    success: false,
    message: "",
  });

  useEffect(() => {
    result.message = "";
    if (result.success) {
      setOpen(false);
    }
  }, [result]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2">
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
          <div className="flex items-center gap-2">
            <Checkbox id="isNap" name="isNap" defaultChecked={isNap} />
            <Label htmlFor="isNap" className="cursor-pointer">
              Was this a nap?
            </Label>
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
                <>
                  Save Changes
                  <Pencil className="size-4" />
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
