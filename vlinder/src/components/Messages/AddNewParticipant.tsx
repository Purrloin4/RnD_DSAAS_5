"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@nextui-org/react";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { useFriendships } from "@/utils/store/friendships";
import InitFriendships from "@/utils/store/InitFriendships";
import { createClient } from "@/utils/supabase/client";
import {
  IRoomParticipant,
  useRoomParticipant,
} from "@/utils/store/roomParticipant";
import { toast } from "sonner";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
  useDisclosure,
} from "@nextui-org/react";

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[360px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);
export default function AddNewParticipant({ roomId }: { roomId: string }) {
  const supabase = createClient();
  const router = useRouter();

  const { participants, setParticipants, addParticipant, removeParticipant } =
    useRoomParticipant((state) => state);
  const disabledKeys = new Set(
    participants.map((participant) => participant.profile_id)
  );

  const [scrollBehavior, setScrollBehavior] =
    React.useState<ModalProps["scrollBehavior"]>("inside");
  const { friendships, setFriendships } = useFriendships(); // Access Zustand store

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>());

  const addToGroupChat = async (): Promise<void> => {
    try {
      toast.success("Adding member...");
      console.log("participants", participants);
      const selectedFriendIds = Array.from(selectedKeys);

      const participantIds = [...selectedFriendIds];

      for (const participantId of participantIds) {
        const { data: participant, error: participantError } = await supabase
          .from("room_participants")
          .insert({
            profile_id: participantId,
            room_id: roomId,
          });

        if (participantError) {
          console.error(
            `Error adding participant (ID: ${participantId}) to room:`,
            participantError
          );
        }
      }
      toast.success("Member added successfully!");
      console.log("Member added successfully!");
      onOpenChange(); // Close modal
      router.push(`/messages/${roomId}`);
      //   fetchUserRooms(); // Refresh the rooms after creation
    } catch (error) {
      toast.error("Unexpected error adding member");
    }
  };

  return (
    <>
      <Button className="w-full" color="primary" onPress={onOpen}>
        Add New Participants
      </Button>
      <Modal
        scrollBehavior={scrollBehavior}
        isOpen={isOpen}
        size="md"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add new member</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <ListboxWrapper>
                    <Listbox
                      disallowEmptySelection
                      disabledKeys={disabledKeys}
                      aria-label="Select friends"
                      selectedKeys={selectedKeys}
                      selectionMode="multiple"
                      variant="flat"
                      onSelectionChange={(keys) =>
                        setSelectedKeys(new Set<string>(keys as Set<string>))
                      }
                    >
                      {friendships.map((friend) => (
                        <ListboxItem key={friend.friend_id}>
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                friend.friend_avatar || "/default-avatar.png"
                              }
                              alt={friend.username || "Unknown"}
                              className="w-8 h-8 rounded-full"
                            />
                            <span>{friend.username || "Unknown"}</span>
                          </div>
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </ListboxWrapper>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cancel</Button>
                <Button color="primary" onPress={addToGroupChat}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
