import { INotification,useNotifications } from "@/utils/store/notifications";
import React from "react";
import Image from "next/image";
import { useUser } from "@/utils/store/user";

export default function Notification({ notification }: { notification: INotification}) {
  const user = useUser((state) => state.user);

  // Check if the message is sent by the current user
//   const isOwnMessage = message.profiles?.id === user?.id;

  return (
    <div>
      {/* Avatar only appears for received messages */}
      
        <div>
         { notification.profiles.avatar_url?
          <Image src={notification.profiles?.avatar_url!}
           alt={notification.profiles?.username!} 
           width={40} height={40} className=" rounded-full ring-2" /> 
           :null}
        </div>
 
      {/* Message Content */}
      <div>
        {/* Username and Message Metadata */}
        <div className="flex items-center justify-between">
		<div className="flex items-center gap-1">
    <h1 className="font-bold">{notification.profiles?.username}</h1>
  
  <h1 className="text-sm text-gray-400">
    {new Date(notification.created_at).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })}
  </h1>
</div>
          {/* Message Actions (Edit/Delete) for Own Messages
          {isOwnMessage && <MessageMenu message={message} />} */}
        </div>

        {/* Message Text */}
        <p>{notification.content}</p>
      </div>
    </div>
  );
}
