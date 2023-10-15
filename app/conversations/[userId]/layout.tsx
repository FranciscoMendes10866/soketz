import type { PropsWithChildren } from "react";
import Link from "next/link";

import { CreateConversation } from "@/app/components/CreateConversation";
import { db } from "@/db/client";

interface Props {
  params: {
    userId: string;
  };
}

export default async function Layout({
  params,
  children,
}: PropsWithChildren<Props>) {
  const userId = Number(params.userId);

  if (!params || !params.userId || isNaN(userId)) {
    throw Error("The user identifier must be provided.");
  }

  const result = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    with: {
      participants: {
        with: {
          conversation: true,
        },
      },
    },
  });

  return (
    <div className="h-screen w-screen flex">
      <div className="w-2/6 h-full flex flex-col items-center justify-center space-y-4">
        <div className="w-[90%]">
          <CreateConversation userId={userId} />
        </div>

        <div className="bg-white w-[90%] h-5/6 p-2 flex flex-col space-y-4">
          {result?.participants.map((item) => (
            <Link
              key={item.conversationId}
              href={`/conversations/${userId}/${item.conversationId}`}
              className="h-16 w-full flex items-center justify-start bg-purple-500"
            >
              <span className="mx-4 truncate text-white">
                {item.conversation.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-4/6 h-full bg-blue-500">{children}</div>
    </div>
  );
}
