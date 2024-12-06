"use client";
import { INotification,useNotifications } from "@/utils/store/notifications";
import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowDown } from "lucide-react";
import LoadMoreNotifications from "./LoadMoreNotifications";
import { useUser } from "@/utils/store/user";

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
          .select("*")
          .order("created_at", { ascending: false })
          // .limit(20);

        if (error) {
          console.error("Error fetching notifications:", error);
        } else {
          setNotifications(data as INotification[]);
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
  // const handleUpdateNotification = async (id: string, status: string) => {
  //   try {
  //     const { data, error } = await supabase
  //       .from("notifications")
  //       .update({ status })
  //       .eq("id", id);

  //     if (error) {
  //       console.error("Error updating notification:", error);
  //     } else {
  //       setNotifications((prevNotifications) =>
  //         prevNotifications.map((notification) =>
  //           notification.id === id ? { ...notification, status } : notification
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Unexpected error updating notification:", error);
  //   }
  // };
  const handleAcceptRequest = async (fromWhoId: string, toWhoId:string) => {
    try {
      const { data, error } = await supabase.rpc('accept_friend_request', {
        requester: fromWhoId,
        recipient: toWhoId,
      });
      if (error) {
        console.error('Error accepting friend request:', error);
      } else {
        console.log('Requester:', fromWhoId);
        console.log('Recipient:', toWhoId);
        console.log('Friend request accepted:', data);
      }
    } catch (error) {
      console.error('Unexpected error accepting friend request:', error);
    }
  };

  const handleRejectRequest = async (fromWhoId: string, toWhoId:string) => {
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
          <LoadMoreNotifications />
        </div>
        <div className="space-y-7">
          {notifications.map((notification, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg">
              <p>{notification.content}</p>
              {notification.notification_type === 'FriendshipRequest' && (
                <div>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                    onClick={() => handleAcceptRequest(notification.from_who,notification.to_who)}
                  >
                    Accept
                  </button>
                  <button

                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={() => handleRejectRequest(notification.from_who, notification.to_who)}
                  >
                    Reject
                  </button>
                </div>
              )}
              <small className="text-gray-500">
                From: {notification.from_who}, Date: {new Date(notification.created_at).toLocaleString()}
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
              <ArrowDown />
            </div>
          )}
        </div>
      )}
    </>
  );
}