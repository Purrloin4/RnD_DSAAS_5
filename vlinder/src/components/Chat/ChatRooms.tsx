"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/utils/store/user";
import { useFriendships, IFriendship } from "@/utils/store/friendships"; // Import the Zustand store
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";

interface Room {
  id: string;
  name: string | null;
  created_at: string;
}

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[360px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

export default function ChatRooms() {
  const user = useUser((state) => state.user);
  const { friendships, setFriendships } = useFriendships(); // Access Zustand store
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>());
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const supabase = createClient();

  const fetchFriendships = async () => {
    try {
      const { data, error } = await supabase.rpc("show_friends");
      if (error) {
        console.error("Error fetching friendships:", error);
        return;
      }

      const formattedData: IFriendship[] = (data || []).map((friend: any) => ({
        id: friend.id,
        username: friend.username,
        friend_id: friend.profile_id,
        friend_avatar: friend.avatar_url || null,
      }));

      setFriendships(formattedData); // Store friendships in Zustand
    } catch (error) {
      console.error("Unexpected error fetching friendships:", error);
    }
  };

  const fetchUserRooms = async () => {
    try {
      const { data, error } = await supabase.rpc("get_user_rooms", {
        user_id: user?.id,
      });

      if (error) {
        console.error("Error fetching user rooms:", error);
        return;
      }

      if (data.length > 0) {
        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("id, name, created_at")
          .in(
            "id",
            data.map((room: { room_id: string }) => room.room_id)
          );

        if (roomError) {
          console.error("Error fetching room details:", roomError);
          return;
        }
        setRooms(roomData);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const createGroupChat = async (): Promise<void> => {
    try {
      if (!groupName.trim() || selectedKeys.size === 0) {
        alert("Please provide a group name and select at least one friend.");
        return;
      }

      const selectedFriendIds = Array.from(selectedKeys);

      const { data, error: roomError } = await supabase.rpc("create_new_room", {
        room_name: groupName,
      });

      if (roomError) {
        console.error("Error creating group chat:", roomError);
        return;
      }

      const roomId = data[0]?.id;
      if (!roomId) {
        console.error("Room ID not found after creation.");
        return;
      }

      const participantIds = [...selectedFriendIds, user?.id];

      for (const participantId of participantIds) {
        const { error: participantError } = await supabase.from("room_participants").insert({
          profile_id: participantId,
          room_id: roomId,
        });

        if (participantError) {
          console.error(`Error adding participant (ID: ${participantId}) to room:`, participantError);
        }
      }

      console.log("Group chat created successfully.");
      fetchUserRooms(); // Refresh the rooms after creation
    } catch (error) {
      console.error("Unexpected error creating group chat:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserRooms();
      fetchFriendships();
    }
  }, [user]);

  if (loading) {
    return <div>Loading rooms...</div>;
  }

  return (
    <>
      <Button onPress={onOpen}>Create Group Chat</Button>
      <Modal isOpen={isOpen} size="sm" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create Group Chat</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <ListboxWrapper>
                    <Listbox
                      disallowEmptySelection
                      aria-label="Select friends"
                      selectedKeys={selectedKeys}
                      selectionMode="multiple"
                      variant="flat"
                      onSelectionChange={(keys) => setSelectedKeys(new Set<string>(keys as Set<string>))}
                    >
                      {friendships.map((friend) => (
                        <ListboxItem key={friend.friend_id}>
                          <div className="flex items-center gap-3">
                            <img
                              src={friend.friend_avatar || "/default-avatar.png"}
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
                <Button color="primary" onPress={createGroupChat}>
                  Create
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div>
        {rooms.length === 0 ? (
          <div>No rooms found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Room Name</th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    {room.name || "Unnamed Room"}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    <Button color="primary" onPress={() => router.push(`/chat/${room.id}`)}>
                      Enter Room
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
