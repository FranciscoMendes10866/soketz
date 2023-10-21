"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

import { pusherClient } from "@/soketi";

type Message = {
  body: string;
  id: number;
  conversationId: number;
  senderId: number;
};

interface Props {
  initialMessages: Array<Message>;
  userId: number;
  chatId: number;
}

export function MessageList({ initialMessages, userId, chatId }: Props) {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Array<Message>>(() => [
    ...initialMessages,
  ]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [items]);

  useEffect(() => {
    const channel = pusherClient
      .subscribe(chatId.toString())
      .bind("evt::new-message", (datum: Message) =>
        setItems((state) => [...state, datum])
      );

    return () => {
      channel.unbind();
    };
  }, []);

  return (
    <>
      {items.length > 0 ? (
        <div className="h-full w-full flex flex-col overflow-y-auto">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={clsx([
                "mt-1.5 flex",
                item.senderId === userId ? "justify-end" : "justify-start",
                items.length - 1 === index && "mb-3",
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
          <div ref={lastMessageRef} />
        </div>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center space-y-1">
          <span className="text-lg leading-relaxed text-gray-500">
            Be the first one to send the first text
          </span>
          <small className="text-gray-400 leading-relaxed">or just wait</small>
        </div>
      )}
    </>
  );
}
