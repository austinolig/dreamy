"use server";

import type { Prisma, Tag as TagModel } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "./prisma";

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

type SessionResult = Awaited<ReturnType<typeof auth.getSession>>;
type AuthenticatedUser = SessionResult extends { user: infer U }
  ? U & { id: string }
  : { id: string };

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

type BooleanInput = boolean | string | number | null | undefined;

type DreamLogWithTags = Prisma.DreamLogGetPayload<{ include: { tags: true } }>;

type TagDTO = {
  id: number;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type DreamLogDTO = {
  id: number;
  description: string;
  dreamDate: string;
  isNap: boolean;
  createdAt: string;
  updatedAt: string;
  tags: TagDTO[];
};

export type CreateDreamLogInput = {
  description: string;
  dreamDate: string;
  isNap?: BooleanInput;
  tagIds?: Array<number | string>;
};

export type UpdateDreamLogInput = {
  id: number | string;
  description?: string;
  dreamDate?: string;
  isNap?: BooleanInput;
  tagIds?: Array<number | string>;
};

export type DeleteDreamLogInput = {
  id: number | string;
};

export type CreateTagInput = {
  name: string;
};

export type UpdateTagInput = {
  id: number | string;
  name: string;
};

export type DeleteTagInput = {
  id: number | string;
};

const toTagDTO = (tag: TagModel): TagDTO => ({
  id: tag.id,
  name: tag.name,
  userId: tag.userId,
  createdAt: tag.createdAt.toISOString(),
  updatedAt: tag.updatedAt.toISOString(),
});

const toDreamLogDTO = (dreamLog: DreamLogWithTags): DreamLogDTO => ({
  id: dreamLog.id,
  description: dreamLog.description,
  dreamDate: dreamLog.dreamDate.toISOString(),
  isNap: dreamLog.isNap,
  createdAt: dreamLog.createdAt.toISOString(),
  updatedAt: dreamLog.updatedAt.toISOString(),
  tags: dreamLog.tags.map(toTagDTO),
});

const isPrismaKnownError = (
  error: unknown
): error is Prisma.PrismaClientKnownRequestError =>
  error instanceof Prisma.PrismaClientKnownRequestError;

const parseBoolean = (value: BooleanInput): boolean | null => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "on"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no", "off"].includes(normalized)) {
      return false;
    }
  }

  return null;
};

const parseId = (value: number | string | null | undefined): number | null => {
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0 ? value : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") {
      return null;
    }

    const parsed = Number.parseInt(trimmed, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
};

const parseTagIds = (
  tagIds?: Array<number | string>
): number[] | null => {
  if (!tagIds || tagIds.length === 0) {
    return [];
  }

  const parsed = tagIds.map((tagId) => parseId(tagId));

  if (parsed.some((value): value is null => value === null)) {
    return null;
  }

  return Array.from(new Set(parsed as number[]));
};

const getAuthenticatedUser = async (): Promise<AuthenticatedUser | null> => {
  try {
    const session = await auth.getSession();

    if (!session?.user || !("id" in session.user)) {
      return null;
    }

    return session.user as AuthenticatedUser;
  } catch (error) {
    console.error("Failed to resolve session", error);
    return null;
  }
};

export const createDreamLog = async (
  input: CreateDreamLogInput
): Promise<ActionResult<DreamLogDTO>> => {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const description = input.description?.trim();

  if (!description) {
    return { success: false, error: "Description is required" };
  }

  const dreamDate = new Date(input.dreamDate);

  if (Number.isNaN(dreamDate.getTime())) {
    return { success: false, error: "Invalid dream date" };
  }

  const tagIds = parseTagIds(input.tagIds);

  if (tagIds === null) {
    return { success: false, error: "Invalid tag identifiers" };
  }

  if (tagIds.length > 0) {
    const validTags = await prisma.tag.findMany({
      where: {
        id: { in: tagIds },
        userId: user.id,
      },
    });

    if (validTags.length !== tagIds.length) {
      return { success: false, error: "One or more tags could not be found" };
    }
  }

  const isNap = parseBoolean(input.isNap) ?? false;

  try {
    const dreamLog = await prisma.dreamLog.create({
      data: {
        description,
        dreamDate,
        isNap,
        tags:
          tagIds.length > 0
            ? { connect: tagIds.map((id) => ({ id })) }
            : undefined,
      },
      include: { tags: true },
    });

    return { success: true, data: toDreamLogDTO(dreamLog) };
  } catch (error) {
    console.error("Failed to create dream log", error);
    return { success: false, error: "Failed to create dream log" };
  }
};

export const updateDreamLog = async (
  input: UpdateDreamLogInput
): Promise<ActionResult<DreamLogDTO>> => {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const dreamLogId = parseId(input.id);

  if (!dreamLogId) {
    return { success: false, error: "Invalid dream log identifier" };
  }

  const data: Prisma.DreamLogUpdateInput = {};

  if (typeof input.description === "string") {
    const trimmed = input.description.trim();

    if (!trimmed) {
      return { success: false, error: "Description cannot be empty" };
    }

    data.description = trimmed;
  }

  if (typeof input.dreamDate === "string") {
    const dreamDate = new Date(input.dreamDate);

    if (Number.isNaN(dreamDate.getTime())) {
      return { success: false, error: "Invalid dream date" };
    }

    data.dreamDate = dreamDate;
  }

  const isNap = parseBoolean(input.isNap);

  if (isNap !== null) {
    data.isNap = isNap;
  }

  if (Array.isArray(input.tagIds)) {
    const tagIds = parseTagIds(input.tagIds);

    if (tagIds === null) {
      return { success: false, error: "Invalid tag identifiers" };
    }

    if (tagIds.length > 0) {
      const validTags = await prisma.tag.findMany({
        where: {
          id: { in: tagIds },
          userId: user.id,
        },
      });

      if (validTags.length !== tagIds.length) {
        return { success: false, error: "One or more tags could not be found" };
      }
    }

    data.tags = { set: tagIds.map((id) => ({ id })) };
  }

  if (Object.keys(data).length === 0) {
    return { success: false, error: "No updates provided" };
  }

  try {
    const dreamLog = await prisma.dreamLog.update({
      where: { id: dreamLogId },
      data,
      include: { tags: true },
    });

    return { success: true, data: toDreamLogDTO(dreamLog) };
  } catch (error) {
    if (isPrismaKnownError(error) && error.code === "P2025") {
      return { success: false, error: "Dream log not found" };
    }

    console.error("Failed to update dream log", error);
    return { success: false, error: "Failed to update dream log" };
  }
};

export const deleteDreamLog = async (
  input: DeleteDreamLogInput
): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const dreamLogId = parseId(input.id);

  if (!dreamLogId) {
    return { success: false, error: "Invalid dream log identifier" };
  }

  try {
    await prisma.dreamLog.delete({
      where: { id: dreamLogId },
    });

    return { success: true };
  } catch (error) {
    if (isPrismaKnownError(error) && error.code === "P2025") {
      return { success: false, error: "Dream log not found" };
    }

    console.error("Failed to delete dream log", error);
    return { success: false, error: "Failed to delete dream log" };
  }
};

export const createTag = async (
  input: CreateTagInput
): Promise<ActionResult<TagDTO>> => {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const name = input.name?.trim();

  if (!name) {
    return { success: false, error: "Tag name is required" };
  }

  try {
    const tag = await prisma.tag.create({
      data: {
        name,
        userId: user.id,
      },
    });

    return { success: true, data: toTagDTO(tag) };
  } catch (error) {
    if (isPrismaKnownError(error) && error.code === "P2002") {
      return { success: false, error: "Tag name already exists" };
    }

    console.error("Failed to create tag", error);
    return { success: false, error: "Failed to create tag" };
  }
};

export const updateTag = async (
  input: UpdateTagInput
): Promise<ActionResult<TagDTO>> => {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const tagId = parseId(input.id);

  if (!tagId) {
    return { success: false, error: "Invalid tag identifier" };
  }

  const name = input.name?.trim();

  if (!name) {
    return { success: false, error: "Tag name is required" };
  }

  const existingTag = await prisma.tag.findUnique({
    where: { id: tagId },
  });

  if (!existingTag || existingTag.userId !== user.id) {
    return { success: false, error: "Tag not found" };
  }

  try {
    const tag = await prisma.tag.update({
      where: { id: tagId },
      data: { name },
    });

    return { success: true, data: toTagDTO(tag) };
  } catch (error) {
    if (isPrismaKnownError(error) && error.code === "P2002") {
      return { success: false, error: "Tag name already exists" };
    }

    console.error("Failed to update tag", error);
    return { success: false, error: "Failed to update tag" };
  }
};

export const deleteTag = async (
  input: DeleteTagInput
): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const tagId = parseId(input.id);

  if (!tagId) {
    return { success: false, error: "Invalid tag identifier" };
  }

  const deleted = await prisma.tag.deleteMany({
    where: {
      id: tagId,
      userId: user.id,
    },
  });

  if (deleted.count === 0) {
    return { success: false, error: "Tag not found" };
  }

  return { success: true };
};
