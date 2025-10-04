import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a Dreamy account to start capturing and analyzing your dreams.",
};

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return <SignUpForm />;
}
