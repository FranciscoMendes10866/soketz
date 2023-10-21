"use client";

import { useCallback, type FC, type MouseEventHandler } from "react";
import { Button } from "@nextui-org/react";

import { bootstrapNewConversationAction } from "@/services";

interface Props {
  userId: number;
}

export const CreateConversation: FC<Props> = ({ userId }) => {
  const onClickHandler: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (evt) => {
      evt.stopPropagation();
      try {
        await bootstrapNewConversationAction(userId);
      } catch (cause) {
        console.error(cause);
      }
    },
    [userId]
  );

  return (
    <Button
      type="button"
      color="primary"
      variant="flat"
      fullWidth
      onClick={onClickHandler}
    >
      New Conversation
    </Button>
  );
};
