import { Card, Button, Skeleton } from "@nextui-org/react";
import { format } from "date-fns";
import Image from "next/image";

export default function ActivityCardSkeleton() {
  const formatActivityTime = (isoString: string): string[] => {
    const date = new Date(isoString);
    const formattedDate = format(date, "EEEE, MMM d, yyyy");
    const formattedTime = format(date, "HH:mm");
    return [formattedDate, formattedTime];
  };

  return (
    <Card className="relative flex-shrink-0 w-[85%] sm:w-[42.5%] md:w-[28.33%] h-[30vh] bg-white border border-gray-200 shadow-xl rounded-lg flex flex-col">
      <div className="w-full h-2/3 overflow-hidden rounded-lg">
        <Skeleton className="w-full h-full object-cover" />
      </div>

      <div className="w-full flex flex-col gap- items-start justify-between p-4">
        <div className="flex flex-col flex-1 w-full gap-1 mb-4">
          <Skeleton className="text-lg font-semibold rounded-full w-1/2 ">-------------</Skeleton>
          <Skeleton className="text-sm rounded-full w-4/5 text-gray-500">--------------</Skeleton>
          <Skeleton className="text-gray-600 rounded-full w-2/3 h-4 overflow-hidden text-ellipsis mb-1">
            -------------------------
          </Skeleton>
        </div>

        <div className="w-full justify-end flex flex-row gap-2">
          <Skeleton className="w-20 h-8 rounded-lg">Show Users</Skeleton>
          <Skeleton className="w-20 h-8 rounded-lg">Show Users</Skeleton>
          <Skeleton className="w-20 h-8 rounded-lg">Show Users</Skeleton>
        </div>
      </div>
    </Card>
  );
}
