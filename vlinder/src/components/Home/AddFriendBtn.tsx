import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/utils/store/user";
import toast, { Toaster } from "react-hot-toast";
import EndFriendBtn from "./EndFriendBtn";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
  useDisclosure,
} from "@nextui-org/react";

export default function AddFriendBtn({ profile_id }: { profile_id: string }) {
  const supabase = createClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [friendStatus, setFriendStatus] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
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
        console.error(
          "Unexpected error fetching friend request status:",
          error
        );
        setFriendStatus(null);
      }
    };

    const checkAdminStatus = async () => {
      const userResponse = await supabase.auth.getUser();
      if (userResponse.error || !userResponse.data?.user) {
        console.error("Error fetching current user:", userResponse.error);
        return;
      }

      const userId = userResponse.data.user.id;
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (data?.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      if (error) {
        console.error("Error checking admin role:", error);
      }
    };

    const sendFriendRequest = async () => {
      try {
        if (user?.id === profile_id) {
          toast.error("You cannot send a friend request to yourself.");
          return;
        } else {
          const { data, error } = await supabase.rpc("send_friend_request", {
            profile_2_id: profile_id,
          });

          if (error) {
            console.error("Error sending friend request:", error);
          } else {
            await fetchFriendStatus(profile_id);
            toast.success("Friend request sent successfully!");
          }
        }
      } catch (error) {
        console.error("Unexpected error sending friend request:", error);
      }
    };
    const cancelFriendRequest = async () => {
      try {
        if (user?.id === profile_id) {
          toast.error("You cannot send a friend request to yourself.");
          return;
        } else {
          const { data, error } = await supabase.rpc(
            "cancel_sending_friend_request",
            {
              recipient_id: profile_id,
            }
          );

          if (error) {
            console.error("Error cancelling friend request:", error);
          } else {
            onOpenChange();
            await fetchFriendStatus(profile_id);
            toast.success("Friend request cancelled successfully!");
          }
        }
      } catch (error) {
        console.error("Unexpected error cancelling friend request:", error);
      }
    };
    useEffect(() => {
      fetchFriendStatus(profile_id);
      checkAdminStatus();
    }, [user?.id, profile_id]);

    return (
      <>
        {!isAdmin && (
          <div className="w-full max-w-md mt-8">
            {friendStatus === "accepted" ? (
              // <Button disabled className="w-full bg-green-500 text-white py-2 rounded-md">
              //   Connected
              // </Button>
              <EndFriendBtn profile_id={profile_id} />
            ) : friendStatus === "pending" ? (
              // <Button disabled className="w-full bg-yellow-500 text-white py-2 rounded-md">
              //   Pending
              // </Button>
              <>
                <Button className="w-full" color="primary" onPress={onOpen}>
                  Pending
                </Button>
                <Modal isOpen={isOpen} size="md" onOpenChange={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader>
                          Cancelling your friend request?
                        </ModalHeader>
                        <ModalBody>
                          Are you sure you want to cancel your friend request?
                        </ModalBody>
                        <ModalFooter>
                          <Button onPress={onClose}>Cancel</Button>
                          <Button
                            color="danger"
                            variant="flat"
                            onPress={cancelFriendRequest}
                          >
                            Yes, I am sure
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </>
            ) : friendStatus === "rejected" ? (
              <Button
                disabled
                className="w-full bg-red-500 text-white py-2 rounded-md"
              >
                Rejected
              </Button>
            ) : (
              <Button
                className="w-full bg-purple-500 text-white py-2 rounded-md"
                onClick={sendFriendRequest}
              >
                Connect
              </Button>
            )}
          </div>
        )}
      </>
    );
  };

