"use client";

import { useCallback, type FC, type MouseEventHandler } from "react";
import { Button } from "@nextui-org/react";
import { bootstrapNewConversation } from "@/db/services";

interface Props {
  userId: number;
}

export const CreateConversation: FC<Props> = ({ userId }) => {
  const onClickHandler: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (evt) => {
      evt.stopPropagation();
      try {
        await bootstrapNewConversation(userId);
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
