// import React, { Suspense } from "react";
// import ListMessages from "./ListMessages";
// import { createClient } from "@/utils/supabase/server";
// import InitMessages from "@/utils/store/InitMessages";


// export default async function ChatRooms() {
// 	const supabase = createClient();

// 	const { data } = await supabase
// 		.from("room_participants")
// 		.select("*,")
//         .eq('profile_id','637465ac-0729-442c-8dc8-441d2303f560')
// 		// .range(0, LIMIT_MESSAGE)
// 		.order("created_at", { ascending: false });

// 	return (
// 		<Suspense fallback={"loading.."}>
// 			<ListMessages />
// 			<InitMessages messages={data?.reverse() || []} />
// 		</Suspense>
// 	);
// }
// Import necessary dependencies
// Import necessary dependencies
"use client"
import React, { useEffect, useState } from 'react';
import {createClient} from '@/utils/supabase/client';
import { useUser } from '@/utils/store/user';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import InitRoomParticipant from '@/utils/store/InitRoomParticipant';


interface Room {
  id: string;
  name: string | null;
  created_at: string;
}

interface User {
  id: string;
}

export default function ChatRooms() {
  const user = useUser((state) => state.user);
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserRooms = async (): Promise<void> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('get_user_rooms', { user_id: user?.id });

      if (error) {
        console.error('Error fetching user rooms:', error);
        return;
      }

      if (data.length > 0) {

        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('id, name, created_at')
          .in('id', data.map((room: { room_id: string }) => room.room_id));

        if (roomError) {
          console.error('Error fetching room details:', roomError);
          return;
        }
        setRooms(roomData);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserRooms();
    }
  }, [user]);

  if (loading) {
    return <div>Loading rooms...</div>;
  }

  const createNewRoom = async (): Promise<void> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('create_new_room', { room_name: 'New Room' });

      if (error) {
        console.error('Error creating new room:', error);
        return;
      }

      fetchUserRooms();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <>
      <div>
        <Button color="success" onPress={createNewRoom}>Create New Chat</Button>
        {rooms.length === 0 ? (
          <div>No rooms found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Room Name</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{room.name || 'Unnamed Room'}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                    <Button color="primary" onPress={() => router.push(`/chat/${room.id}`)}>Enter Room</Button>
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
