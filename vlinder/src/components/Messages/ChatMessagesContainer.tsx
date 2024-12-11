"use client";

import { Avatar, Input, Button, Chip } from "@nextui-org/react";
import { ReactNode } from "react";
import { Skeleton } from "@nextui-org/react";

import MessageInput from "./MessageInput";

type ChatListProps = {
  children?: ReactNode;
  className?: string;
  last_online?: string;
  isOnline?: boolean;
  loading?: boolean;
  name: string;
  roomId: string;
};

export default function ChatMessagesContainer({
  children,
  className,
  last_online,
  name,
  isOnline,
  loading,
  roomId,
}: ChatListProps) {
  return (
    <div className={`flex flex-col pr-4 ${className}`}>
      <div className="flex items-center justify-start p-4 border-b border-gray-300 overflow-x-hidden">
        <Avatar size="md" color={isOnline ? "success" : undefined} className="mr-4" />
        <div>
          {loading ? (
            <Skeleton className="h-4 rounded-lg">Name is Loading</Skeleton> // for some reason w-xx is not woriking...
          ) : (
            <h3 className="font-semibold text-lg">{name}</h3>
          )}
          <p className="text-sm text-gray-500">
            {isOnline ? (
              <span className="flex items-center">
                <span className="rounded-full bg-green-500 inline-block w-2 h-2 mr-1"></span> Online
              </span>
            ) : (
              last_online
            )}
          </p>
        </div>
      </div>

      <div className="flex-1 w-full overflow-y-auto p-4 overflow-x-hidden">{children}</div>

      <div className="flex items-center p-4 border-t border-gray-300 overflow-x-hidden">
        <MessageInput roomId={roomId} />
      </div>
      <div className="h-28 w-full">{/* Do not remove fix for floting navbar */}</div>
    </div>
  );
}