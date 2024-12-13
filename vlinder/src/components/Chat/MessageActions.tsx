"use client";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

import { Imessage, useMessage } from "@/utils/store/messages";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@nextui-org/input";

import { useRef } from "react";

export function DeleteAlert() {
  const actionMessage = useMessage((state) => state.actionMessage);
  const optimisticDeleteMessage = useMessage((state) => state.optimisticDeleteMessage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDeleteMessage = async () => {
    const supabase = createClient();
    optimisticDeleteMessage(actionMessage?.id!);

    const { error } = await supabase.from("messages").delete().eq("id", actionMessage?.id!);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully delete a message");
    }

    // Close the modal after handling delete
    setIsModalOpen(false);
  };
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Button color="danger" onPress={handleOpenModal}>
        Delete Message
      </Button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalContent>
          <ModalHeader>
            <h3>Are you absolutely sure?</h3>
          </ModalHeader>
          <ModalBody>
            <p>
              This action cannot be undone. This will permanently delete the message and remove it from our records.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={handleCloseModal} variant="flat">
              Cancel
            </Button>
            <Button color="danger" onPress={handleDeleteMessage}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export function EditAlert() {
  const actionMessage = useMessage((state) => state.actionMessage);
  const optimisticUpdateMessage = useMessage((state) => state.optimisticUpdateMessage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditMessage = async () => {
    const supabase = createClient();
    const text = inputRef.current?.value.trim();

    if (!text) {
      toast.error("Message cannot be empty");
      return;
    }

    // Optimistic Update
    optimisticUpdateMessage({
      ...actionMessage,
      content: text,
      is_edit: true,
    } as Imessage);

    const { error } = await supabase.from("messages").update({ text, is_edit: true }).eq("id", actionMessage?.id!);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Message updated successfully");
    }

    // Close the modal after handling edit
    setIsModalOpen(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Trigger Button */}
      <Button color="primary" onPress={handleOpenModal}>
        Edit Message
      </Button>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalContent>
          <ModalHeader>
            <h3>Edit Message</h3>
          </ModalHeader>
          <ModalBody>
            <Input fullWidth placeholder="Enter new message" defaultValue={actionMessage?.content} ref={inputRef} />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={handleCloseModal}>
              Cancel
            </Button>
            <Button color="success" onPress={handleEditMessage}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
