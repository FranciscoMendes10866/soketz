import { db } from "@/db/client";

interface Props {
  params: {
    userId: string;
    chatId: string;
  };
}

export default async function Page({ params }: Props) {
  const chatId = Number(params.chatId);

  if (!params || !params.userId || !params.chatId || isNaN(chatId)) {
    throw Error("The conversation and user identifiers must be provided.");
  }

  const result = await db.query.messages.findMany({
    where: (message, { eq }) => eq(message.conversationId, chatId),
  });

  return (
    <div className="h-full flex flex-col justify-end items-end">
      <div className="w-full h-24 bg-red-500">
        User {params.userId}, Chat {params.chatId}
      </div>

      <div className="h-full w-full flex flex-col overflow-y-auto">
        {result.map((item) => (
          <span key={item.id}>{item.body}</span>
        ))}
      </div>

      <div className="w-full h-24 bg-orange-500"></div>
    </div>
  );
}
