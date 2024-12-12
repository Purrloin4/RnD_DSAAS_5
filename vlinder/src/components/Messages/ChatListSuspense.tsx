"use client";

import { Skeleton, Avatar } from "@nextui-org/react";
import Link from "next/link";

export default function ChatListSuspense({ className }: { className?: string }) {
  const rooms = Array.from({ length: 15 }, () => false);

  return (
    <div className={`flex flex-col p-4 ${className}`}>
      <h2 className="">Chats</h2>
      <div className="flex-1 max-h-screen overflow-y-auto">
        {rooms.map((isActive, index) => (
          <div
            key={index}
            className={`flex items-center p-4 overflow-hidden ${isActive ? "bg-gray-200 rounded-lg" : ""}`}
          >
            <Skeleton className="mr-4 flex-shrink-0 rounded-full">
              <Avatar size="lg" />
            </Skeleton>
            <div className="flex-1 min-w-0">
              <Skeleton className="h-6 w-3/5 mb-2 rounded-full"> Name is loading </Skeleton>
              <Skeleton className="h-4 w-4/5 rounded-full"> This was the las message</Skeleton>
            </div>
            <Skeleton className="text-gray-400 text-sm whitespace-nowrap ml-4 flex-shrink-0 rounded-full">
              00:00
            </Skeleton>
          </div>
        ))}
      </div>
    </div>
  );
}
