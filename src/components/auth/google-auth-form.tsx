"use client";

import { Button } from "../ui/button";
import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

export default function GoogleAuthForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [message, formAction, isPending] = useActionState(async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error(error);
      return "Failed to login";
    }
  }, null);
  return (
    <form action={formAction} className={cn("mt-3", className)} {...props}>
      <div className="flex flex-col gap-3">
        {message && <p className="text-red-500 text-sm">{message}</p>}
        <Button
          type="submit"
          className="w-full"
          variant="outline"
          disabled={isPending}
        >
          Continue with Google
          {isPending && <LoaderCircle className="animate-spin" />}
        </Button>
      </div>
    </form>
  );
}
