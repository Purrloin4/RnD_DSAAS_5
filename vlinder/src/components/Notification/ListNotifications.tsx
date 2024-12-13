"use client";
import { INotification, useNotifications } from "@/utils/store/notifications";
import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowUp } from "lucide-react";
import { useUser } from "@/utils/store/user";
import { ButtonGroup, Button, Avatar } from "@nextui-org/react";
import { User, Skeleton } from "@nextui-org/react";
import dayjs from "dayjs";
import EnviromentStrings from "@/src/enums/envStrings";

interface Notification {
  id: string;
  created_at: string;
  content: string;
  notification_type: string;
  profiles?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  from_who_details?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

export default function ListNotifications() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScrolled, setUserScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { notifications, setNotifications } = useNotifications(
    (state) => state
  );
  const user = useUser((state) => state.user);
  const supabase = createClient();

  const groupedNotifications = notifications.reduce(
    (acc: Record<string, any[]>, notification) => {
      const createdAt = dayjs(notification.created_at);
      const now = dayjs();

      if (createdAt.isSame(now, "day")) {
        acc.Today.push(notification);
      } else if (createdAt.isSame(now, "week")) {
        acc.ThisWeek.push(notification);
      } else if (createdAt.isSame(now, "month")) {
        acc.ThisMonth.push(notification);
      }

      return acc;
    },
    { Today: [], ThisWeek: [], ThisMonth: [] }
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select(
            `
            *,
            profiles:from_who (
              id,
              username,
              avatar_url
            )
          `
          )
          .order("created_at", { ascending: false });

        if (error) {
          if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
            console.error("Error fetching notifications:", error);
          }
        } else {
          const enrichedNotifications = data.map((notification) => ({
            ...notification,
            from_who_details: {
              id: notification.profiles?.id || "Unknown",
              username: notification.profiles?.username || "Unknown",
              avatar_url: notification.profiles?.avatar_url || null,
            },
          }));
          setNotifications(enrichedNotifications);
        }
      } catch (error) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Unexpected error fetching notifications:", error);
        }
      } finally {
        setLoading(false);
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
  const handleAcceptRequest = async (
    fromWhoId: string,
    toWhoId: string,
    notificationId: string
  ) => {
    try {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.log("notificaitonId:", notificationId);
      }
      // Accept the friend request
      const { error: acceptError } = await supabase.rpc(
        "accept_friend_request",
        {
          requester: fromWhoId,
          recipient: toWhoId,
        }
      );

      if (acceptError) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error accepting friend request:", acceptError);
        }
        return;
      }

      // Retrieve the username of the requester (fromWhoId)
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", fromWhoId)
        .single();

      if (userError || !userData) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error fetching user details:", userError);
        }
        return;
      }

      const username = userData.username || "Unknown";

      // Update the notification using the SQL function
      const { error: updateError } = await supabase
        .from("notifications")
        .update({
          content: `You are now friends with ${username}`,
          notification_type: "FriendshipAccept", // Update the notification type
        })
        .eq("id", notificationId);
      if (updateError) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error updating notification:", updateError);
        }
        return;
      }
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.log("Notification updated successfully.");
      }

      // Create a DM room
      const roomName = `DM_${fromWhoId}_${toWhoId}`;
      const { data: roomData, error: roomError } = await supabase.rpc(
        "create_individual_room",
        {
          room_name: roomName,
          other_user_id: fromWhoId,
        }
      );

      if (roomError) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error creating DM room:", roomError);
        }
      } else {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.log("DM room created successfully:", roomData);
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.error("Unexpected error accepting friend request:", error);
      }
    }
  };

  const handleRejectRequest = async (
    fromWhoId: string,
    toWhoId: string,
    notificationId: string
  ) => {
    try {
      const { data, error } = await supabase.rpc("reject_friend_request", {
        requester: fromWhoId,
        recipient: toWhoId,
      });

      if (error) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error rejecting friend request:", error);
        }
      } else {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.log("Friend request rejected:", data);
        }
      }
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", fromWhoId)
        .single();

      if (userError || !userData) {
        console.error("Error fetching user details:", userError);
        return;
      }

      const username = userData.username || "Unknown";

      // Update the notification using the SQL function
      const { error: updateError } = await supabase
        .from("notifications")
        .update({
          content: `You declined friend request from ${username}`,
          notification_type: "FriendshipReject", // Update the notification type
        })
        .eq("id", notificationId);
      if (updateError) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error updating notification:", updateError);
        }
        return;
      }

      console.log("Notification updated successfully.");
    } catch (error) {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.error("Unexpected error rejecting friend request:", error);
      }
    }
  };

  const formatText = (text: string): string =>
    text.replace(/([a-z])([A-Z])/g, "$1 $2");

  return (
    <div
      className="flex-1 p-5 h-full overflow-y-auto space-y-4 scrollbar-none"
      ref={scrollRef}
    >
      {Object.entries(groupedNotifications).map(([section, items]) => (
        <div key={section}>
          <h2 className="text-lg font-bold mb-4">{formatText(section)}</h2>
          {items.length === 0 ? (
            <p className="text-gray-500">
              No notifications {formatText(section)}!{" "}
            </p>
          ) : (
            items.map((notification) => (
              <div
                key={notification.id}
                className="bg-white p-4 rounded-lg mb-2"
              >
                <Skeleton className="rounded-lg" isLoaded={!loading}>
                  <User
                    avatarProps={{
                      src:
                        notification.from_who_details?.avatar_url ||
                        "/default-avatar.png",
                    }}
                    name={
                      notification.from_who_details?.username || "Unknown User"
                    }
                    description={
                      notification.content || "No description available"
                    }
                  />
                  {notification.notification_type === "FriendshipRequest" && (
                    <ButtonGroup>
                      <Button
                        onPress={() =>
                          handleAcceptRequest(
                            notification.from_who,
                            notification.to_who,
                            notification.id
                          )
                        }
                        size="sm"
                        color="success"
                        variant="flat"
                      >
                        Accept
                      </Button>

                      <Button
                        // className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onPress={() =>
                          handleRejectRequest(
                            notification.from_who,
                            notification.to_who,
                            notification.id
                          )
                        }
                        size="sm"
                        color="danger"
                        variant="flat"
                      >
                        Reject
                      </Button>
                    </ButtonGroup>
                  )}
                </Skeleton>
                <Skeleton className="rounded-lg mt-2" isLoaded={!loading}>
                  <small className="text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </small>
                </Skeleton>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );

  {
    /*}
      return (
        <div className="flex-1 p-5 h-full overflow-y-auto space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-gray-100 p-4 rounded-lg">
              <User
                avatarProps={{
                  src: notification.from_who_details?.avatar_url || "/default-avatar.png",
                }}
                name={notification.from_who_details?.username || "Unknown User"}
                description={notification.content || "No description available"}
              />
              <small className="text-gray-500">
                {new Date(notification.created_at).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      );*/
  }

  {
    /*return (
        <div> 
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
        </div>
      );*/
  }
}
