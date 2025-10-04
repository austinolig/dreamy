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
import { deleteTag } from "@/lib/actions";
import { useActionState, useEffect, useState } from "react";

export function DeleteTagDialog({ id, name }: { id: number; name: string }) {
  const [open, setOpen] = useState(false);

  const [result, formAction, isPending] = useActionState(deleteTag, {
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
        <Button variant="outline" size="sm">
          <TrashIcon className="size-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tag?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete the tag &quot;{name}
            &quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={formAction} className="space-y-4">
          {!result.success && result.message && (
            <p className="text-sm text-destructive">{result.message}</p>
          )}
          <input type="hidden" name="id" value={id} />
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? (
                <>
                  Deleting
                  <LoaderCircle className="size-4 animate-spin" />
                </>
              ) : (
                <>Delete</>
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
