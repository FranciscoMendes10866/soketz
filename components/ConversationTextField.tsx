"use client";

import { useCallback } from "react";
import { Button, Input } from "@nextui-org/react";
import { minLength, object, string, number, Input as Infer } from "valibot";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { sendMessageAction } from "@/services";

const schema = object({
  body: string([minLength(1)]),
  chatId: number(),
  userId: number(),
});

export type TextFieldFormValues = Infer<typeof schema>;

type Props = Pick<TextFieldFormValues, "chatId" | "userId">;

export function ConversationTextField({ chatId, userId }: Props) {
  const { handleSubmit, control, setError, reset } =
    useForm<TextFieldFormValues>({
      defaultValues: {
        body: "",
        chatId: Number(chatId),
        userId: Number(userId),
      },
      mode: "onSubmit",
      resolver: valibotResolver(schema),
    });

  const onSubmit: SubmitHandler<TextFieldFormValues> = useCallback(
    async (data) => {
      try {
        await sendMessageAction(data);
        reset();
      } catch (cause) {
        if (cause instanceof Error) {
          setError("body", { message: cause.message });
        }
      }
    },
    [reset, setError]
  );

  return (
    <div className="flex flex-row items-center justify-center space-x-4 h-full w-full">
      <div className="w-4/6">
        <Controller
          name="body"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              isInvalid={!!formState.errors.body?.message}
              errorMessage={formState.errors.body?.message}
              placeholder="Type your message..."
            />
          )}
        />
      </div>
      <Button
        type="button"
        onClick={handleSubmit(onSubmit)}
        color="primary"
        variant="shadow"
      >
        Send
      </Button>
    </div>
  );
}
