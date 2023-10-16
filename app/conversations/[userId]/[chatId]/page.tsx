import { clsx } from "clsx";

import { ConversationInviteAction } from "@/app/components/ConversationInviteAction";
import { ConversationTextField } from "@/app/components/ConversationTextField";
import { db } from "@/db/client";

interface Props {
  params: {
    userId: string;
    chatId: string;
  };
}

export default async function Page({ params }: Props) {
  const chatId = Number(params.chatId);
  const userId = Number(params.userId);

  if (!params || !params.userId || !params.chatId || isNaN(chatId)) {
    throw Error("The conversation and user identifiers must be provided.");
  }

  const result = await db.query.messages.findMany({
    where: (message, { eq }) => eq(message.conversationId, chatId),
  });

  const isEmpty = result.length === 0;

  return (
    <div className="h-full flex flex-col justify-end items-end">
      <div className="w-full h-24 flex items-center justify-end border-b-1.5">
        <div className="mx-4">
          <ConversationInviteAction chatId={chatId} />
        </div>
      </div>

      {isEmpty ? (
        <div className="h-full w-full flex flex-col items-center justify-center space-y-1">
          <span className="text-lg leading-relaxed text-gray-500">
            Be the first one to send the first text
          </span>
          <small className="text-gray-400 leading-relaxed">or just wait</small>
        </div>
      ) : (
        <div className="h-full w-full flex flex-col overflow-y-auto">
          {result.map((item, index) => (
            <div
              key={item.id}
              className={clsx([
                "mt-1.5 flex",
                item.senderId === userId ? "justify-end" : "justify-start",
                result.length - 1 === index && "mb-3",
              ])}
            >
              <div
                className={clsx([
                  "max-w-md rounded-xl p-3",
                  item.senderId === userId
                    ? "bg-blue-500 text-white rounded-br-none mr-4"
                    : "bg-gray-300 text-gray-800 rounded-bl-none ml-4",
                ])}
              >
                {item.body}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="w-full h-24 border-t-1.5">
        <ConversationTextField chatId={chatId} userId={userId} />
      </div>
    </div>
  );
}
