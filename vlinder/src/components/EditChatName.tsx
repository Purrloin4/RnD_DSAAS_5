"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "sonner";

interface ChatNameProps {
  roomId: string;
  roomName: string;
}

export default function EditChatName({ roomId, roomName }: ChatNameProps) {
  const supabase = createClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newRoomName, setNewRoomName] = useState(roomName);

  const handleUpdateRoomName = async () => {
    if (!newRoomName.trim()) {
      toast.error("Room name cannot be empty.");
      return;
    }

    if (newRoomName.trim() === roomName) {
      onOpenChange(); // Close modal if the name hasn't changed
      return;
    }

    try {
      const { error } = await supabase
        .from("rooms")
        .update({ name: newRoomName.trim() })
        .eq("id", roomId);

      if (error) {
        console.error("Error updating room name:", error.message);
        toast.error("Failed to update room name.");
      } else {
        toast.success("Room name updated successfully!");
        onOpenChange(); // Close modal
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <>
      <Button color="danger" onPress={onOpen}>
        EDIT CHAT NAME
      </Button>
      <Modal isOpen={isOpen} size="md" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Enter New Chat Name</ModalHeader>
              <ModalBody>
                <Input
                  label="New Chat Name"
                  placeholder={roomName}
                  value={newRoomName}
                  onValueChange={setNewRoomName}
                  size="lg"
                  fullWidth
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleUpdateRoomName}>
                  Set
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
