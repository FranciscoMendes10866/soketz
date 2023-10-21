"use client";

import { useCallback } from "react";
import { Button, Input } from "@nextui-org/react";
import { minLength, object, string, number, Input as Infer } from "valibot";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { joinConversationAction } from "@/services";

const schema = object({
  username: string([minLength(3)]),
  chatId: number(),
});

export type InvitationFormValues = Infer<typeof schema>;

interface Props {
  params: {
    chatId: string;
  };
}

export default function Index({ params }: Props) {
  const { handleSubmit, control, setError } = useForm<InvitationFormValues>({
    defaultValues: {
      username: "",
      chatId: Number(params.chatId),
    },
    mode: "onSubmit",
    resolver: valibotResolver(schema),
  });

  const onSubmit: SubmitHandler<InvitationFormValues> = useCallback(
    async (data) => {
      try {
        await joinConversationAction(data);
      } catch (cause) {
        if (cause instanceof Error) {
          setError("username", { message: cause.message });
        }
      }
    },
    [setError]
  );

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4 w-1/5">
        <h3 className="text-lg leading-relaxed">Invitation link</h3>
        <Controller
          name="username"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              label="Username"
              isInvalid={!!formState.errors.username?.message}
              errorMessage={formState.errors.username?.message}
            />
          )}
        />
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          color="primary"
          variant="shadow"
          fullWidth
        >
          Join
        </Button>
      </div>
    </div>
  );
}
