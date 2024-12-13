"use client";

import { timeStamp } from "console";
import { ReactNode } from "react";

type ChatListProps = {
  children: ReactNode;
  className?: string;
  timestamp?: string;
};

export default function ChatBubbleGroup({
  children,
  className,
  timestamp,
}: ChatListProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex justify-center flex-row w-full">
        <span className="mt-1 mb-2 text-xs text-gray-500">
          {timestamp || ""}
        </span>
      </div>
      {children}
    </div>
  );
}
