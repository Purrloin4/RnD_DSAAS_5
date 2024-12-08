"use client";

import { Avatar } from "@nextui-org/react";

interface ChatListItemProps {
  name: string;
  lastMessage: string;
  time: string;
  isOnline?: boolean;
  isActive?: boolean;
}

export default function ChatListItem({ name, lastMessage, time, isOnline, isActive }: ChatListItemProps) {
  return (
    <div className={`cursor-pointer flex items-center p-4 overflow-hidden ${isActive ? "bg-gray-200 rounded-lg" : ""}`}>
      <Avatar size="lg" isBordered={isOnline} color={isOnline ? "success" : undefined} className="mr-4 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg truncate">{name}</h3>
        <p className="text-gray-500 text-sm truncate">{lastMessage}</p>
      </div>
      <div className="text-gray-400 text-sm whitespace-nowrap ml-4 flex-shrink-0">
        <p>{time}</p>
      </div>
    </div>
  );
}
