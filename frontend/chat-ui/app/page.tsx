"use client";

export const revalidate = false;

import { useChat, Message } from "ai/react";
import { ChevronDown } from "@carbon/icons-react";
import { useRef, useState } from "react";
import cn from "classnames";
import { ChatInput, MessagesPreview } from "@/components";
import { useAutosizeTextArea } from "@/hooks/useAutosizeTextArea";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";
import { useSWRConfig } from "swr";
import { persist_message } from "@/lib/client_requests";

/** TODO: Populate this from the backend */
const preprompt = `
You are LaURA, a transformer language model trained as an AI chatbot and companion. When conversing with humans, your role is to:

- Provide incisive, well-researched, but clever and opinionated insights on complex questions across all domains of knowledge
- Train a wry, grimly sardonic, and irreverent lens on philosophical and creative tasks
- Faithfully and precisely answer technical questions and carefully carry out technical tasks
`;

export default function Chat() {
  const [chat_uuid, setUuid] = useState<string>(v4());
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const { messages, setMessages, input, handleInputChange, handleSubmit } =
    useChat({
      id: chat_uuid,
      initialMessages: [
        {
          id: v4(),
          role: "system",
          content: preprompt,
          createdAt: new Date(),
        },
      ],
      onFinish: (m) => {
        // IIFE to force eval, since I'm not allowed to make this async
        persist_message(m, chat_uuid);
        // Revalidate the chat list
        mutate(`/api/chat/titles?page_size=20&page=1`);
        router.push(`/c/${chat_uuid}`);
      },
      generateId: () => v4(),
      body: {
        convo_id: chat_uuid,
        is_new: true,
      },
      sendExtraMessageFields: true,
    });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, messages[0]?.content);

  return (
    <>
      <div className="relative max-w-xl pt-6 pb-1 mx-auto border-b border-gray-200 max-md:px-4">
        <div className="flex items-center">
          <button
            className="relative text-2xl font-semibold"
            onClick={() => setModalIsOpen(!modalIsOpen)}
          >
            LaURA
            <ChevronDown
              className={cn(
                "inline-block w-6 h-6 ml-1 ",
                {
                  "text-gray-400": !modalIsOpen,
                },
                {
                  "text-gray-600": modalIsOpen,
                }
              )}
            />
          </button>
          <p className="ml-auto">β0.3</p>
        </div>
        {modalIsOpen && (
          <div className="absolute left-[-0.5rem] right-[-0.5rem] mt-4 border rounded-lg bg-gray-50 border-gray-200 px-6 py-5 shadow-lg">
            <h2 className={"text-gray-400"}>System prompt</h2>
            {messages.length > 0 && messages[0].role === "system" && (
              <textarea
                ref={textAreaRef}
                rows={3}
                className="w-full font-mono text-base leading-5 border-none resize-none bg-gray-50 focus:outline-none focus:ring-0 no-scrollbar"
                value={messages[0].content}
                onChange={(e) => {
                  setMessages([
                    { ...messages[0], content: e.target.value },
                    ...messages,
                  ]);
                }}
              />
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col max-w-xl pt-6 pb-16 mx-auto md:w-full max-md:px-4 stretch">
        <MessagesPreview convoId={chat_uuid} />
        <form onSubmit={handleSubmit}>
          <ChatInput
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </form>
      </div>
    </>
  );
}
