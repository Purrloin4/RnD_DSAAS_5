"use client";

import { Avatar, Input, Chip } from "@nextui-org/react";
import { ReactNode } from "react";
import { Skeleton } from "@nextui-org/react";
import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import {Alert} from "@nextui-org/alert";
import MessageInput from "./MessageInput";
import { User } from "@supabase/supabase-js";
import toast,{ Toaster } from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect,useState} from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { sup } from "framer-motion/client";
import ChatPresence from "@/src/components/Chat/ChatPresence";

type ChatListProps = {
  children?: ReactNode;
  className?: string;
  last_online?: string;
  isOnline?: boolean;
  loading?: boolean;
  name: string;
  roomId: string;
  user:string;

};

export default function ChatMessagesContainer({
  children,
  className,
  last_online,
  name,
  isOnline,
  loading,
  roomId,
  user,
}: ChatListProps) 
{
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const router = useRouter();

  const handleLeaveGroup = async (roomId: string) => {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("room_participants")
        .delete()
        .eq("room_id", roomId)
        .eq("profile_id", user);

      if (error) {
        console.error("Error leaving room:", error.message);
        toast.error("Failed to leave the chat.");
        return;
      }

    //   if (data.length === 0) {
    //     toast.error("You were not part of this chat.");
    //   } else {
        toast.success("You have successfully left the chat.");
        router.push("/messages"); // Redirect to the chatrooms page
    //   }
    } catch (error) {
      console.error("Unexpected error leaving the room:", error);
      toast.error("An error occurred while leaving the chat.");
    }
  };


  return (
    <div className={`flex flex-col pr-4 ${className}`}>
      <div className="flex items-center justify-start p-4 border-b border-gray-300 overflow-x-hidden">
 
     
        <Avatar size="md" color="success" className="mr-4" />
        <ChatPresence/>

  
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
        <div className="float-end">
      <Popover  color="default" placement="left">
          <PopoverTrigger>
            <Button className="capitalize" variant="flat" onPress={onOpen}>
              open
                </Button>
              
          </PopoverTrigger>
          <PopoverContent>
       <Button color="danger" onPress={onOpen}>LEAVE ROOM</Button>
       <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                {/* Are you sure you want to leave the room? */}
                <div className="w-full flex items-center my-3">
                <Alert color="danger" variant = "flat" radius ="full" title="Are you sure you want to leave the room?" />
                </div>
            
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={() => handleLeaveGroup(roomId)}>Yes, I am sure</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
       <Button> ADD OTHERS </Button>
          </PopoverContent>
        </Popover>
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
