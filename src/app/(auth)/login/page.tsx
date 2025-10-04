import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Log In",
  description:
    "Log in to your Dreamy account to access your dream journal and insights.",
};

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
