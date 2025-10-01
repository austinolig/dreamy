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
import { useRouter } from "next/navigation";

export function DeleteDreamDialog({
  id,
  redirectPath,
}: {
  id: number;
  redirectPath?: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [result, formAction, isPending] = useActionState(deleteDreamLog, {
    success: false,
    message: "",
  });

  useEffect(() => {
    result.message = "";
    if (result.success) {
      setOpen(false);
      if (redirectPath) {
        router.push(redirectPath);
      }
    }
  }, [result, redirectPath, router]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="relative z-2" variant="outline" size="icon">
          <TrashIcon className="size-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Dream Log?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete this dream log? This
            action cannot be undone.
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
