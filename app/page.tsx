"use client";

import { useCallback } from "react";
import { Button, Input } from "@nextui-org/react";
import { minLength, object, string, Input as Infer } from "valibot";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { addUserAction } from "@/db/services";

const schema = object({
  username: string([minLength(3)]),
});

export type FormValues = Infer<typeof schema>;

export default function Index() {
  const { handleSubmit, control, setError } = useForm<FormValues>({
    defaultValues: {
      username: "",
    },
    mode: "onSubmit",
    resolver: valibotResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      try {
        await addUserAction(data);
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
          fullWidth
        >
          Join
        </Button>
      </div>
    </div>
  );
}
