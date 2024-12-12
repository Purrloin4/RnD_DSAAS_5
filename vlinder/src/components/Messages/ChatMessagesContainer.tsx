"use client";

// import { IRoomParticipant, useRoomParticipant } from "@/utils/store/roomParticipant";

import { Avatar, Input, Chip } from "@nextui-org/react";
import { ReactNode } from "react";
import { Skeleton } from "@nextui-org/react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";
import { Alert } from "@nextui-org/alert";
import MessageInput from "./MessageInput";
import { User } from "@supabase/supabase-js";
import toast, { Toaster } from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import RoomParticipantList from "@/src/components/Messages/RoomParticipantsList";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { sup } from "framer-motion/client";
import ChatPresence from "@/src/components/Chat/ChatPresence";
import AddNewParticipant from "@/src/components/Messages/AddNewParticipant";
import EditChatName from "@/src/components/Messages/EditChatName";
import { EllipsisIcon } from "../Icons/EllipsisIcon";

type ChatListProps = {
  children?: ReactNode;
  className?: string;
  last_online?: string;
  isOnline?: boolean;
  loading?: boolean;
  name: string;
  roomId: string;
  user: string;
  type: string;
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
  type,
}: ChatListProps) {
  const supabase = createClient();

  const isGroupChat = type === "gc";
  const [chatName, setChatName] = useState(name); // Dynamically displayed chat name

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
  const fetchOtherUsername = async (roomId: string) => {
    try {
      const { data, error } = await supabase.rpc("get_other_username", {
        input_room_id: roomId,
      });

      if (error) {
        console.error("Error fetching other user's username:", error);
        return;
      }

      if (data) {
        setChatName(data); // Update chat name to the other user's username
      }
    } catch (error) {
      console.error("Unexpected error fetching other user's username:", error);
    }
  };
  useEffect(() => {
    if (!isGroupChat) {
      fetchOtherUsername(roomId); // Only fetch for direct messages
    }
  }, [roomId]);

  return (
    <div className={`flex flex-col pr-4 ${className}`}>
      <div className="flex items-center justify-start p-4 border-b border-gray-300 overflow-x-hidden">
        <Avatar size="md" color="success" className="mr-4" />

        <div className="flex-grow">
          {loading ? (
            <Skeleton className="h-4 rounded-lg">Name is Loading</Skeleton> // for some reason w-xx is not woriking...
          ) : (
            <h3 className="font-semibold text-lg">{chatName}</h3>
          )}

          <ChatPresence />
        </div>
        <div className="">
          <Popover color="default" placement="left">
            <PopoverTrigger>
              <Button className="" variant="flat" onPress={onOpen}>
                Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2 p-4">
              <Button className="w-full" color="danger" onPress={onOpen}>
                Leave Room
              </Button>
              <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">Leaving "{name}"</ModalHeader>
                      <ModalBody>
                        {/* Are you sure you want to leave the room? */}
                        <div className="w-full flex items-center my-3">
                          <Alert
                            color="danger"
                            variant="flat"
                            radius="full"
                            title="Are you sure you want to leave the room?"
                          />
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button onPress={onClose}>Cancel</Button>
                        <Button color="danger" onPress={() => handleLeaveGroup(roomId)}>
                          Yes, I am sure
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
              {isGroupChat && (
                <>
                  <RoomParticipantList roomId={roomId} />
                  <AddNewParticipant roomId={roomId} />
                  <EditChatName roomId={roomId} roomName={name} />
                </>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="relative flex-1 w-full overflow-y-auto p-4 overflow-x-hidden">{children}</div>

      <div className="flex items-center p-4 border-t border-gray-300 overflow-x-hidden">
        <MessageInput roomId={roomId} />
      </div>
      <div className="h-28 w-full">{/* Do not remove fix for floting navbar */}</div>
    </div>
  );
}
