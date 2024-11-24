// import { Imessage, useMessage } from "@/utils/store/messages";
// import React from "react";
// import Image from "next/image";

// import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
// import { MoreHorizontal } from "lucide-react";
// import { useUser } from "@/utils/store/user";

// export default function Message({ message }: { message: Imessage }) {
// 	const user = useUser((state) => state.user);

// 	return (
// 		<div className="flex gap-2">
// 			<div>
// 				<Image
// 					src={message.profiles?.avatar_url!}
// 					alt={message.profiles?.username!}
// 					width={40}
// 					height={40}
// 					className=" rounded-full ring-2"
// 				/>
// 			</div>
// 			<div className="flex-1">
// 				<div className="flex items-center justify-between">
// 					<div className="flex items-center gap-1">
// 						<h1 className="font-bold">
// 							{message.profiles?.username}
// 						</h1>
// 						<h1 className="text-sm text-gray-400">
// 							{new Date(message.created_at).toDateString()}
// 						</h1>
// 						{message.is_edit && (
// 							<h1 className="text-sm text-gray-400">edited</h1>
// 						)}
// 					</div>
// 					{message.profiles?.id === user?.id && (
// 						<MessageMenu message={message} />
// 					)}
// 				</div>
// 				<p className="text-gray-300">{message.content}</p>
// 			</div>
// 		</div>
// 	);
// }

// const MessageMenu = ({ message }: { message: Imessage }) => {
// 	const setActionMessage = useMessage((state) => state.setActionMessage);

// 	return (
// 		<Dropdown>
// 			<DropdownTrigger>
// 				<MoreHorizontal />
// 			</DropdownTrigger>
// 			<DropdownMenu aria-label="Action"> 
	
// 				<DropdownItem
// 					onClick={() => {
// 						document.getElementById("trigger-edit")?.click();
// 						setActionMessage(message);
// 					}}
// 				>
// 					Edit
// 				</DropdownItem>
// 				<DropdownItem
// 					onClick={() => {
// 						document.getElementById("trigger-delete")?.click();
// 						setActionMessage(message);
// 					}}
// 				>
// 					Delete
// 				</DropdownItem>
// 			</DropdownMenu>
// 		</Dropdown>
// 	);
// };
import { Imessage, useMessage } from "@/utils/store/messages";
import React from "react";
import Image from "next/image";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { MoreHorizontal } from "lucide-react";
import { useUser } from "@/utils/store/user";

export default function Message({ message }: { message: Imessage }) {
  const user = useUser((state) => state.user);

  // Check if the message is sent by the current user
  const isOwnMessage = message.profiles?.id === user?.id;

  return (
    <div
      className={`flex gap-2 items-start ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar only appears for received messages */}
      {!isOwnMessage && (
        <div>
          <Image
            src={message.profiles?.avatar_url!}
            alt={message.profiles?.username!}
            width={40}
            height={40}
            className="rounded-full ring-2"
          />
        </div>
      )}

      {/* Message Content */}
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isOwnMessage
            ? "bg-blue-500 text-white self-end"
            : "bg-gray-500 text-gray-300 self-start"
        }`}
      >
        {/* Username and Message Metadata */}
        <div className="flex items-center justify-between">
		<div className="flex items-center gap-1">
  {!isOwnMessage && (
    <h1 className="font-bold">{message.profiles?.username}</h1>
  )}
  <h1 className="text-sm text-gray-400">
    {new Date(message.created_at).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })}
  </h1>
  {message.is_edit && <h1 className="text-sm text-gray-400">edited</h1>}
</div>


          {/* Message Actions (Edit/Delete) for Own Messages */}
          {isOwnMessage && <MessageMenu message={message} />}
        </div>

        {/* Message Text */}
        <p>{message.content}</p>
      </div>
    </div>
  );
}

const MessageMenu = ({ message }: { message: Imessage }) => {
  const setActionMessage = useMessage((state) => state.setActionMessage);

  return (
    <Dropdown>
      <DropdownTrigger>
        <MoreHorizontal />
      </DropdownTrigger>
      <DropdownMenu aria-label="Actions">
        <DropdownItem
          onClick={() => {
            document.getElementById("trigger-edit")?.click();
            setActionMessage(message);
          }}
        >
          Edit
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            document.getElementById("trigger-delete")?.click();
            setActionMessage(message);
          }}
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
