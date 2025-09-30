"use client";

import { LoaderCircle, TrashIcon } from "lucide-react";

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
import { deleteDreamLog } from "@/lib/actions";
import { useActionState, useEffect, useState } from "react";

export function DeleteDreamDialog({ id }: { id: number }) {
  const [open, setOpen] = useState(false);

  const [result, formAction, isPending] = useActionState(deleteDreamLog, {
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
        <Button className="relative z-1" variant="outline" size="icon">
          <TrashIcon className="text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Dream Log?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this dream log?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={formAction} className="space-y-4">
          {!result.success && (
            <p className="text-sm text-destructive">{result.message}</p>
          )}
          <input type="hidden" name="id" value={id} />
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <Button type="submit" variant="destructive" disabled={isPending}>
              Delete
              {isPending && <LoaderCircle className="animate-spin" />}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
