"use client";

import { Button } from "@nextui-org/react";

interface Props {
  chatId: number;
}

export function ConversationInviteAction({ chatId }: Props) {
  return (
    <Button
      color="primary"
      variant="flat"
      onClick={(evt) => {
        evt.stopPropagation();
        navigator.clipboard.writeText(`http://localhost:3000/invite/${chatId}`);
      }}
    >
      Invite Link
    </Button>
  );
}
