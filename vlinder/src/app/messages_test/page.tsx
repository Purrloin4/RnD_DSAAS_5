import ChatMessagesContainer from "@/src/components/Messages/ChatMessagesContainer";

import ChatBubbleGroup from "@/src/components/Messages/ChatBubbleGroep";
import ChatBubble from "@/src/components/Messages/ChatBubble";

export default function Page() {
  return (
    <main className="max-h-screen max-w-screen flex flex-row overflow-hidden">
      <ChatList className="w-[400px]">
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later?"
          time="10:45 AM"
          isOnline={false}
          isGroupChat={false}
        />
        <ChatListItem
          name="Jane Doe"
          lastMessage="Hey, are we meeting later? Hey, are we meeting later? Hey, are we meeting later? "
          time="10:45 AM"
          isOnline={true}
          isGroupChat={false}
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
