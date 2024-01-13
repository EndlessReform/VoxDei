"use client";

import { useChat } from "ai/react";
import { Message } from "@/components";

interface IMessagesPreviewProps {
  convoId?: string;
}

export const MessagesPreview = ({ convoId }: IMessagesPreviewProps) => {
  const { messages, setMessages, isLoading, reload } = useChat({
    id: convoId,
  });

  return (
    <>
      {messages.length > 0
        ? messages
            .filter((m) => m.role !== "system")
            .map((m, i) => (
              <Message
                key={m.id}
                role={m.role}
                content={m.content}
                isLoading={
                  m.id === messages[messages.length - 1].id && isLoading
                }
                regen={() => {
                  if (i != 1 && i < messages.length - 1) {
                    setMessages(messages.slice(0, i + 1));
                  }
                  reload();
                }}
              />
            ))
        : null}
    </>
  );
};
