"use client";

import { ReactNode } from "react";

type ChatListProps = {
  children: ReactNode;
  className?: string;
};

export default function ChatList({ children, className }: ChatListProps) {
  return (
    <div className={`flex flex-col p-4 ${className}`}>
      <h2 className="">Chats</h2>
      <div className="flex-1 max-h-screen overflow-y-auto">{children}</div>
    </div>
  );
}
