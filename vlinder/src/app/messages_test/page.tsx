import ChatMessagesContainer from "Components/Chat/ChatMessagesContainer";
import ChatList from "Components/Chat/ChatList";
import ChatListItem from "Components/Chat/ChatListItem";
import ChatBubbleGroup from "@/src/components/Chat/ChatBubbleGroep";
import ChatBubble from "@/src/components/Chat/ChatBubble";

export default function Page() {
  return (
    <main className="max-h-screen max-w-screen flex flex-row overflow-hidden">
      <ChatList className="w-[400px]">
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isActive={true}
        />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem name="Jane Doe" lastMessage="Hey, are we meeting later?" time="10:45 AM" isOnline={false} />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later? Hey, are we meeting later? Hey, are we meeting later? "
          time="10:45 AM"
          isOnline={true}
        />
      </ChatList>
      <ChatMessagesContainer
        isOnline={true}
        name="Thiewout Bekaert"
        last_online="5min Ago"
        className="flex-1 h-screen max-h-screen overflow-x-hidden"
      >
        <ChatBubbleGroup timestamp="12:45">
          <ChatBubble sendByUser={false} type="t" timestamp="12:45">
            helloww
          </ChatBubble>
          <ChatBubble sendByUser={false} type="b" timestamp="12:45">
            helloww
            hellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhellowwhelloww
          </ChatBubble>
          <ChatBubble sendByUser={true} type="bt" timestamp="12:45">
            helloww
          </ChatBubble>
        </ChatBubbleGroup>
      </ChatMessagesContainer>
    </main>
  );
}
