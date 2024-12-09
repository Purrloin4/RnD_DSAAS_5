"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/utils/store/user";
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

interface Friendship {
  profile_id: string;
  username: string;
  avatar_url: string | null;
}

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[360px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

export default function ChatRooms() {
  const user = useUser((state) => state.user);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
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
      console.log("Friendships fetched:", data);
      setFriendships(
        data.map((friend: any) => ({
          profile_id: friend.profile_id,
          username: friend.username,
          avatar_url: friend.avatar_url,
        }))
      );
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
          .in("id", data.map((room: { room_id: string }) => room.room_id));

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
  
      // Step 1: Create the new room
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
  
      // Step 2: Add participants (including the authenticated user)
      const participantIds = [...selectedFriendIds, user?.id];
  
      for (const participantId of participantIds) {
        const { error: participantError } = await supabase
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
        } else {
          console.log(`Participant (ID: ${participantId}) added successfully.`);
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
                      onSelectionChange={(keys) =>
                        setSelectedKeys(new Set<string>(keys as Set<string>))
                      }
                    >
                      {friendships.map((friend) => (
                        <ListboxItem key={friend.profile_id}>
                          <div className="flex items-center gap-3">
                            <img
                              src={friend.avatar_url || "/default-avatar.png"}
                              alt={friend.username}
                              className="w-8 h-8 rounded-full"
                            />
                            <span>{friend.username}</span>
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
        {/* <Button color="success" onPress={fetchUserRooms}>
          Refresh Rooms
        </Button> */}
        {rooms.length === 0 ? (
          <div>No rooms found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Room Name
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Actions
                </th>
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
                    <Button
                      color="primary"
                      onPress={() => router.push(`/chat/${room.id}`)}
                    >
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
