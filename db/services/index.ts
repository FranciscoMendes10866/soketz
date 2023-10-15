"use server";

import { redirect } from "next/navigation";
import { nanoid } from "nanoid";

import type { FormValues as IAddUser } from "@/app/page";
import { db } from "../client";
import { conversations, participants, users } from "../schema";

////////////////////////

export async function addUserAction(data: IAddUser) {
  let userId: number | undefined;

  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.username, data.username),
  });

  userId = user?.id;

  if (!userId) {
    const result = await db.insert(users).values(data);
    const rowId = result.lastInsertRowid;
    if (rowId < 1 || typeof rowId !== "number") {
      throw Error("An error has occurred.");
    } else {
      userId = rowId;
    }
  }

  redirect(`/conversations/${userId}`);
}

export async function bootstrapNewConversation(userId: number) {
  const conversation = await db
    .insert(conversations)
    .values({ name: nanoid() });

  const conversationId = conversation.lastInsertRowid;

  if (typeof conversationId !== "number") {
    throw new Error("An error has occurred.");
  }

  const result = await db
    .insert(participants)
    .values({ userId, conversationId });

  if (result.changes < 1) {
    throw new Error("An error has occurred.");
  }

  redirect(`/conversations/${userId}/${conversationId}`);
}