import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/utils/store/user";
import toast, { Toaster } from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
  useDisclosure,
} from "@nextui-org/react";

export default function EndFriendBtn({ profile_id }: { profile_id: string }) {
  const supabase = createClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [friendStatus, setFriendStatus] = useState<string | null>(null);
  const user = useUser((state) => state.user);

  const fetchFriendStatus = async (otherUserId: string) => {
    try {
      const { data, error } = await supabase.rpc("get_friend_status", {
        other_user_id: otherUserId,
      });

      if (error) {
        console.error("Error fetching friend request status:", error);
        setFriendStatus(null);
      } else {
        setFriendStatus(data);
      }
    } catch (error) {
      console.error("Unexpected error fetching friend request status:", error);
      setFriendStatus(null);
    }
  };
  const endFriendship = async () => {
    try {
      if (user?.id === profile_id) {
        toast.error("You cannot send a friend request to yourself.");
        return;
      } else {
        const { data, error } = await supabase.rpc("end_friendship", {
          recipient_id: profile_id,
        });

        if (error) {
          console.error("Error cancelling friend request:", error);
        } else {
          await fetchFriendStatus(profile_id);
          onOpenChange();
          //   await fetchFriendStatus(profile_id);
          toast.success("Friend request cancelled successfully!");
        }
      }
    } catch (error) {
      console.error("Unexpected error cancelling friend request:", error);
    }
  };

  return (
    <>
      <Button className="w-full" color="primary" onPress={onOpen}>
        Connected
      </Button>
      <Modal isOpen={isOpen} size="md" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Ending your friendship</ModalHeader>
              <ModalBody>
                Are you sure you want to end your friendship?
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cancel</Button>
                <Button color="danger" variant="flat" onPress={endFriendship}>
                  Yes, I am sure
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
