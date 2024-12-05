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


export default function ChatRooms() {

  const user = useUser((state) => state.user);
  const router = useRouter();
  const [rooms, setRooms] = useState<{ id: string; name: string | null; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserRooms = async () => {
    try {
      // Call the function to get the room_ids the user is participating in
      const supabase = createClient()
      const { data, error } = await supabase
        .rpc('get_user_rooms', { user_id: user?.id });

      if (error) {
        console.error('Error fetching user rooms:', error);
        return;
      }


      // Fetch detailed information for each room
      if (data.length > 0) {
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('id, name, created_at')
          .in('id', data.map((room) => room.room_id));

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
  const createNewRoom = async () => {
    try {
      // Initialize Supabase client
      const supabase = createClient();

      // Call the function to create a new room
      const { data, error } = await supabase.rpc('create_new_room', { room_name: 'New Room' });

      if (error) {
        console.error('Error creating new room:', error);
        return;
      }

      // Redirect user to the newly created room
    //   if (data) {
    //     router.push(`/chat/${data.id}`);
    //   }
    fetchUserRooms();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };
  return (
    <>
    <div>
    <Button color="success" onPress={createNewRoom}>Create New Chat</Button>
      {/* <h2>Your Rooms</h2> */}
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
{/* <InitRoomParticipant participants={data || []} /> */}
                </>
  );
}
