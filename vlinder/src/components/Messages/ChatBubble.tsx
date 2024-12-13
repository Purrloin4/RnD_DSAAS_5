"use client";

import { ReactNode } from "react";
import { useState } from "react";

type ChatListProps = {
  children: ReactNode;
  timestamp: string;
  type?: "t" | "b" | "bt" | undefined;
  isOwnMessage: boolean;
};

export default function ChatBubble({ children, timestamp, type, isOwnMessage }: ChatListProps) {
  const [isInFocus, setIsInFocus] = useState<boolean>(false);

  const getRoundings = () => {
    if (isOwnMessage) {
      if (type == "bt") return "rounded-2xl";
      if (type == "t") return "rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl";
      if (type == "b") return "rounded-tl-2xl rounded-bl-2xl rounded-br-2xl";
      if (type == undefined) return "rounded-tl-2xl rounded-bl-2xl";
    } else {
      if (type == "bt") return "rounded-2xl";
      if (type == "t") return "rounded-tr-2xl rounded-br-2xl rounded-tl-2xl";
      if (type == "b") return "rounded-tr-2xl rounded-br-2xl rounded-bl-2xl";
      if (type == undefined) return "rounded-tr-2xl rounded-br-2xl";
    }
  };

  return (
    <div className={`mb-1 flex flex-col ${isOwnMessage ? "items-end" : "items-start"} w-full`}>
      <div
        onClick={() => setIsInFocus(!isInFocus)}
        className={`${
          isOwnMessage ? "bg-primary-500 text-white" : "bg-gray-300 text-black"
        } py-3 px-6 ${getRoundings()} max-w-[75%] w-fit relative cursor-pointer text-wrap break-words`}
      >
        {children}
      </div>
      {isInFocus && <span className="mt-1 mb-2 text-xs text-gray-500">{timestamp}</span>}
    </div>
  );
}
