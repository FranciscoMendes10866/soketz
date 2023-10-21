import { ConversationInviteAction } from "@/components/ConversationInviteAction";
import { ConversationTextField } from "@/components/ConversationTextField";
import { MessageList } from "@/components/MessageList";
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

  return (
    <div className="h-full flex flex-col justify-end items-end">
      <div className="w-full h-24 flex items-center justify-end border-b-1.5">
        <div className="mx-4">
          <ConversationInviteAction chatId={chatId} />
        </div>
      </div>

      <MessageList initialMessages={result} userId={userId} chatId={chatId} />

      <div className="w-full h-24 border-t-1.5">
        <ConversationTextField chatId={chatId} userId={userId} />
      </div>
    </div>
  );
}
