"use client";
import { INotification, useNotifications } from "@/utils/store/notifications";
import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {ArrowUp } from "lucide-react";
import { useUser } from "@/utils/store/user";
import {ButtonGroup, Button, Avatar} from "@nextui-org/react";
export default function ListNotifications() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScrolled, setUserScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { notifications, setNotifications } = useNotifications((state) => state);
  const user = useUser((state) => state.user);
  const supabase = createClient();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select(`
            *,
            profiles:from_who (
              id,
              username,
              avatar_url
            )
          `)
          // .eq("to_who", user?.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching notifications:", error);
        } else {
          // Map notifications to include `from_who_details`
          const enrichedNotifications = data.map((notification) => ({
            ...notification,
            from_who_details: {
              id: notification.profiles?.id || "Unknown",
              username: notification.profiles?.username || "Unknown",
              avatar_url: notification.profiles?.avatar_url || null,
            },
          }));
          setNotifications(enrichedNotifications as INotification[]);
          console.log('notification ids:', enrichedNotifications.map((notification) => notification.id));
        }
      } catch (error) {
        console.error("Unexpected error fetching notifications:", error);
        
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = 0;
    }
  }, [notifications]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScrolled(isScroll);
      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotificationCount(0);
      }
    }
  };

  const scrollUp = () => {
    setNotificationCount(0);
    scrollRef.current.scrollTop = 0;
  };
  const handleAcceptRequest = async (fromWhoId: string, toWhoId: string, notificationId: string) => {
    try {
      console.log('notificaitonId:', notificationId);
      // Accept the friend request
      const { error: acceptError } = await supabase.rpc('accept_friend_request', {
        requester: fromWhoId,
        recipient: toWhoId,
      });
  
      if (acceptError) {
        console.error('Error accepting friend request:', acceptError);
        return;
      }
  
      // Retrieve the username of the requester (fromWhoId)
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', fromWhoId)
        .single();
  
      if (userError || !userData) {
        console.error('Error fetching user details:', userError);
        return;
      }
  
      const username = userData.username || 'Unknown';
  
      // Update the notification using the SQL function
      const { error: updateError } = await supabase
      .from('notifications')
      .update({
        content: `You are now friends with ${username}`,
        notification_type: 'FriendshipAccept', // Update the notification type
      })
      .eq('id', notificationId);
      if (updateError) {
        console.error('Error updating notification:', updateError);
        return;
      }
  
      console.log('Notification updated successfully.');
  
      // Create a DM room
      const roomName = `DM_${fromWhoId}_${toWhoId}`;
      const { data: roomData, error: roomError } = await supabase.rpc('create_individual_room', {
        room_name: roomName,
        other_user_id: fromWhoId,
      });
  
      if (roomError) {
        console.error('Error creating DM room:', roomError);
      } else {
        console.log('DM room created successfully:', roomData);
      }
    } catch (error) {
      console.error('Unexpected error accepting friend request:', error);
    }
  };
  
      const handleRejectRequest = async (fromWhoId: string, toWhoId:string, notificationId: string) => {
        try {
          const { data, error } = await supabase.rpc('reject_friend_request', {
            requester: fromWhoId ,
            recipient: toWhoId,
          });
          
          if (error) {
            console.error('Error rejecting friend request:', error);
          } else {
            console.log('Friend request rejected:', data);
          }
          const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', fromWhoId)
          .single();
    
        if (userError || !userData) {
          console.error('Error fetching user details:', userError);
          return;
        }
    
        const username = userData.username || 'Unknown';


             // Update the notification using the SQL function
      const { error: updateError } = await supabase
      .from('notifications')
      .update({
        content: `You declined friend request from ${username}`,
        notification_type: 'FriendshipReject', // Update the notification type
      })
      .eq('id', notificationId);
      if (updateError) {
        console.error('Error updating notification:', updateError);
        return;
      }
  
      console.log('Notification updated successfully.');
        } catch (error) {
          console.error('Unexpected error rejecting friend request:', error);
        }
      };
  return (
        <> {notifications.map((notification) => {
          console.log('From:', notification.from_who, 'To:', notification.to_who);
        })}
          <div
            className="flex-1 flex flex-col p-5 h-full overflow-y-auto"
            ref={scrollRef}
            onScroll={handleOnScroll}
          >
            <div className="flex-1 pb-5">
            </div>
            <div className="space-y-7">
              {notifications.map((notification, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                  <p>{notification.content}</p>
                  {notification.notification_type === 'FriendshipRequest' && (
                    <ButtonGroup>

<Button
  onPress={() => handleAcceptRequest(notification.from_who, notification.to_who, notification.id)}
  size="sm"
  color="success"
  variant="flat"
>
  Accept
</Button>

                      <Button
    
                        // className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onPress={() => handleRejectRequest(notification.from_who, notification.to_who,notification.id)}
                        size="sm"
                        color="danger"
                        variant="flat"
                      >
                        Reject
                      </Button>
                      </ButtonGroup>
                    
                  )}
                    <Avatar
                    src={notification.from_who_details?.avatar_url || '/default-avatar.png'} 
                      // alt={notification.from_who_details?.username}
                            size="sm"
                            className="cursor-pointer"
                        />
                  <small className="text-gray-500">
                  . {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
              ))}
            </div>
          </div>
          {userScrolled && (
            <div className="absolute top-20 w-full">
              {notificationCount ? (
                <div
                  className="w-36 mx-auto bg-indigo-500 p-1 rounded-md cursor-pointer"
                  onClick={scrollUp}
                >
                  <h1>New {notificationCount} notifications</h1>
                </div>
              ) : (
                <div
                  className="w-10 h-10 bg-blue-500 rounded-full justify-center items-center flex mx-auto border cursor-pointer hover:scale-110 transition-all"
                  onClick={scrollUp}
                >
                  <ArrowUp />
                </div>
              )}
            </div>
          )}
        </>
      );
    }
    