"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signUpEmail } from "@/lib/actions";
import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import GoogleAuthForm from "./google-auth-form";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [message, formAction, isPending] = useActionState(signUpEmail, null);

  return (
    <Card
      className={cn("flex flex-col gap-6 w-full max-w-md", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Enter your details below to sign up.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="jane.doe@example.com"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="********"
                minLength={8}
                maxLength={100}
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              {message && <p className="text-red-500 text-sm">{message}</p>}
              <Button type="submit" className="w-full" disabled={isPending}>
                Sign Up
                {isPending && <LoaderCircle className="animate-spin" />}
              </Button>
            </div>
          </div>
        </form>
        <GoogleAuthForm />
      </CardContent>
      <CardFooter className="justify-center">
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
