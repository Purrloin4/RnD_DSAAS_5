"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, user } from "@nextui-org/react";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { useFriendships } from "@/utils/store/friendships";
import InitFriendships from "@/utils/store/InitFriendships";
import { createClient } from "@/utils/supabase/client";
import { IRoomParticipant, useRoomParticipant } from "@/utils/store/roomParticipant";
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
import {useUser} from "@/utils/store/user";
import { u } from "framer-motion/client";
export default function roomParticipant({ roomId }: { roomId: string }) {
const supabase = createClient();

const [scrollBehavior, setScrollBehavior] =
React.useState<ModalProps["scrollBehavior"]>("inside");

const user = useUser((state) => state.user);
  const router = useRouter();
  const {participants, setParticipants,
    addParticipant, removeParticipant} = 
    useRoomParticipant((state) => state
  );
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  // Fetch friendships (optional, if not already initialized)
  useEffect(() => {
    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from('room_participants')
        .select('*,profiles(avatar_url,username,id)')
        .eq('room_id', roomId);

      if (error) {
        console.error('Error fetching participants:', error);
      } else {
        console.log('Participants:', data); 
        setParticipants(data);
      }
    };

    fetchParticipants();
  }, [roomId]);


   
  const handleNavigation = (id: string) => {
    if(id === user?.id){
    router.push(`/profile`);
    }else{
    router.push(`/profile/${id}`);
  }};

  return (
    <>
<Button color="danger" onPress={onOpen}>VIEW PARTICIPANTS</Button>
       <Modal scrollBehavior={scrollBehavior} size="sm" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"> View Participants</ModalHeader>
              <ModalBody>
               <Listbox>
       {participants.map((participant) => (
         <ListboxItem
          key={participant.profile_id}
           className="cursor-pointer hover:bg-gray-100 p-3 rounded-md"
           onClick={() => handleNavigation(participant.profile_id)}
         >
           <div className="flex items-center gap-3">
             <Avatar
               src={participant.profiles?.avatar_url || "/default-avatar.png"}
               alt={participant.profiles?.username|| "Friend"}
               size="md"
               className="cursor-pointer"
             />
        {participant.profile_id === user?.id ? (
            <span className="font-semibold">You</span>
          ) : (
             <span className="font-semibold">{participant.profiles?.username}</span>
             
          )}
             {/* <span className="font-semibold">{participant.profiles?.username}</span> */}
           </div>
         </ListboxItem>
       ))}
     </Listbox>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose} color="danger">
                    Close
                </Button>
               </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      </>
  );
}
