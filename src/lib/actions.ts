"use server";

import { redirect } from "next/navigation";
import { auth } from "./auth";

export const signUpEmail = async (
  prevState: string | null,
  formData: FormData
) => {
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  if (!email || !password || !name) {
    return "Missing required fields";
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email: email.toString(),
        password: password.toString(),
        name: name.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    return "Failed to sign up";
  }

  redirect("/dashboard");
};

export const signInEmail = async (
  prevState: string | null,
  formData: FormData
) => {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return "Missing required fields";
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: email.toString(),
        password: password.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    return "Failed to login";
  }

  redirect("/dashboard");
};
