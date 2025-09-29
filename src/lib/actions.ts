"use server";

import { redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

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

export const createDreamLog = async (formData: FormData) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return "Unauthorized";
  }

  const description = formData.get("description");
  const dreamDate = formData.get("dreamDate");
  const isNap = formData.get("isNap");

  if (!description || !dreamDate) {
    return "Missing required fields";
  }

  try {
    await prisma.dreamLog.create({
      data: {
        description: description.toString(),
        dreamDate: new Date(dreamDate.toString()),
        isNap: isNap === "on",
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error(error);
    return "Failed to create dream log";
  }

  revalidatePath("/dashboard");
  return null;
};
