import ChatMessagesContainer from "Components/Messages/ChatMessagesContainer";
import { Skeleton } from "@nextui-org/react";

export default function Loading() {
  const skeletons = Array.from({ length: 12 }, () => {
    const stars = Array.from({ length: Math.max(Math.round(Math.random() * 100), 15) }, () => "*").join("");
    return stars;
  });

  return (
    <ChatMessagesContainer
      roomId={""}
      className="flex-1 h-screen max-h-screen overflow-x-hidden"
      name={""}
      loading={true}
    >
      {skeletons.map((value, index) => (
        <div className={`flex flex-col ${Math.random() > 0.5 ? "items-end" : "items-start"} w-full overflow-hidden`}>
          <Skeleton key={index} className={`h-10 rounded-2xl`}>
            {value}
          </Skeleton>
        </div>
      ))}
    </ChatMessagesContainer>
  );
}
