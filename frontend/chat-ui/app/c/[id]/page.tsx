"use client";
import { useChat, Message } from "ai/react";
import { ChatInput, MessagesPreview } from "@/components";
import { v4 } from "uuid";
import { persist_message } from "@/app/page";
import { useEffect } from "react";

const getChatData = async (id: string): Promise<Message[]> => {
  const res = await fetch(`/api/chat/${id}`, {
    next: {
      tags: [id],
    },
  });
  if (res.status == 200) {
    const data: Message[] = await res.json();
    return data;
  } else {
    // Reject promise
    throw new Error(`Data failed; error: ${res.statusText}`);
  }
};

export default function Chat({ params }: { params: { id: string } }) {
  const { handleSubmit, input, handleInputChange, setMessages } = useChat({
    id: params.id,
    body: {
      convo_id: params.id,
    },
    sendExtraMessageFields: true,
    generateId: () => v4(),
    onFinish: (m) => {
      persist_message(m, params.id);
    },
  });

  useEffect(() => {
    /* Yes, I know this is a hack. Too bad!
     * Blame Javascript and Next.js
     */
    const getMessages = async () => {
      try {
        const messages = await getChatData(params.id);
        setMessages(messages);
      } catch (e) {
        console.log(e);
      }
    };
    getMessages();
  }, []);

  return (
    <div className="relative max-w-xl pt-6 pb-1 mx-auto max-md:px-4">
      <div className="flex items-center border-b border-gray-200 ">
        <button className="relative text-2xl font-semibold">LaURA</button>
        <p className="ml-auto">β0.3</p>
      </div>
      <div className="pb-24 mt-6">
        <MessagesPreview convoId={params.id} />
        <form onSubmit={handleSubmit}>
          <ChatInput
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </form>
      </div>
    </div>
  );
}
