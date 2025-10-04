"use server";

import { redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { DreamLog } from "@prisma/client";

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

export const createDreamLog = async (
  prevState: { success: boolean; message: string; dreamLog?: DreamLog },
  formData: FormData
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return { success: false, message: "Unauthorized" };
  }

  const description = formData.get("description");
  const dreamDate = formData.get("dreamDate");
  const isNap = formData.get("isNap");
  const tagsString = formData.get("tags");

  if (!description || !dreamDate) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const tagNames = tagsString
      ? tagsString
          .toString()
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    const tagConnections = await Promise.all(
      tagNames.map(async (tagName) => {
        let tag = await prisma.tag.findFirst({
          where: {
            name: tagName,
            userId: session.user.id,
          },
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: tagName,
              userId: session.user.id,
            },
          });
        }

        return { id: tag.id };
      })
    );

    const dreamLog = await prisma.dreamLog.create({
      data: {
        description: description.toString(),
        dreamDate: new Date(dreamDate.toString()),
        isNap: isNap === "on",
        userId: session.user.id,
        tags: {
          connect: tagConnections,
        },
      },
    });

    return {
      success: true,
      message: "Dream log created successfully",
      dreamLog,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create dream log" };
  }
};

export const updateDreamLog = async (
  prevState: { success: boolean; message: string },
  formData: FormData
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return { success: false, message: "Unauthorized" };
  }

  const id = formData.get("id");
  const description = formData.get("description");
  const dreamDate = formData.get("dreamDate");
  const isNap = formData.get("isNap");
  const tagsString = formData.get("tags");

  if (description === null) {
    return { success: false, message: "Missing description" };
  }

  if (dreamDate === null) {
    return { success: false, message: "Missing dream date" };
  }

  try {
    const tagNames = tagsString
      ? tagsString
          .toString()
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    const tagConnections = await Promise.all(
      tagNames.map(async (tagName) => {
        let tag = await prisma.tag.findFirst({
          where: {
            name: tagName,
            userId: session.user.id,
          },
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: tagName,
              userId: session.user.id,
            },
          });
        }

        return { id: tag.id };
      })
    );

    await prisma.dreamLog.update({
      where: { id: Number(id), userId: session.user.id },
      data: {
        description: description.toString(),
        dreamDate: new Date(dreamDate.toString()),
        isNap: isNap === "on",
        tags: {
          set: [],
          connect: tagConnections,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update dream log" };
  }

  revalidatePath(`/dashboard/logs/${id}`);
  return { success: true, message: "Dream log updated successfully" };
};

export const deleteDreamLog = async (
  prevState: { success: boolean; message: string },
  formData: FormData
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return { success: false, message: "Unauthorized" };
  }

  const id = formData.get("id");

  if (!id) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    await prisma.dreamLog.delete({
      where: { id: Number(id), userId: session.user.id },
    });
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete dream log" };
  }

  revalidatePath("/dashboard");
  return { success: true, message: "Dream log deleted successfully" };
};

export const deleteTag = async (
  prevState: { success: boolean; message: string },
  formData: FormData
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return { success: false, message: "Unauthorized" };
  }

  const id = formData.get("id");

  if (!id) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    // Check if tag has any dream logs
    const tag = await prisma.tag.findUnique({
      where: { id: Number(id), userId: session.user.id },
      include: { dreamLogs: true },
    });

    if (!tag) {
      return { success: false, message: "Tag not found" };
    }

    if (tag.dreamLogs.length > 0) {
      return {
        success: false,
        message: "Cannot delete tag with associated dream logs",
      };
    }

    await prisma.tag.delete({
      where: { id: Number(id), userId: session.user.id },
    });
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete tag" };
  }

  revalidatePath("/dashboard/tags");
  return { success: true, message: "Tag deleted successfully" };
};

// TODO (Refactor): GET request + server action === bad
export const getUserTags = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return [];
  }

  try {
    const tags = await prisma.tag.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    return tags;
  } catch (error) {
    console.error(error);
    return [];
  }
};
