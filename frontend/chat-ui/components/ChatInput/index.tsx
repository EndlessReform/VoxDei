"use client";
import { useAutosizeTextArea } from "@/hooks/useAutosizeTextArea";
import { ChangeEvent, FormEvent, KeyboardEvent, useRef } from "react";

interface IChatInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
}

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  placeholder,
}: IChatInputProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, value);

  const onEnterPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <div className="fixed bottom-0 w-full max-w-xl bg-gray-50">
      <textarea
        ref={textAreaRef}
        className="box-border w-full p-2 mb-8 text-gray-700 border border-gray-200 resize-none bg-bg rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent no-scrollbar"
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        onKeyDown={onEnterPress}
        rows={1}
      />
    </div>
  );
};
