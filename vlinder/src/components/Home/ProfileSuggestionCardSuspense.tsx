import { Card, Button, Skeleton } from "@nextui-org/react";
import Image from "next/image";
import PlaceholderImage from "Images/Profile_avatar_placeholder.png";

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  sexual_orientation: string;
  sex_positive: boolean;
  gender: string;
  display_disability: boolean;
  disability: string;
  profile_hobbies: ProfileHobby[];
}

interface Hobby {
  id: number;
  name: string;
  emoji: string;
}

interface ProfileHobby {
  hobbies: Hobby;
}

export default function ProfileSuggestionCardSuspense({ className }: { className?: string }) {
  return (
    <Card
      className={`p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow ${className}`}
      data-testid="skeleton-card"
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-md mb-4">
        <Skeleton className="w-full h-full object-cover object-center border-r-medium" />
      </div>
      <Skeleton className="text-lg rounded-full mb-2">Unnamed User</Skeleton>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="text-sm rounded-full mb-2 w-14">----</Skeleton>
        <Skeleton className="text-sm rounded-full mb-2 w-14">----</Skeleton>
        <Skeleton className="text-sm rounded-full mb-2 w-14">----</Skeleton>
      </div>
      <Skeleton className="text-sm rounded-full mb-1 w-full">------------------</Skeleton>
      <Skeleton className="text-sm rounded-full mb-1 w-3/5">------------------</Skeleton>
      <Skeleton className="text-sm rounded-full mb-4 w-4/5">------------------</Skeleton>
      <Skeleton className="h-10 text-white w-full py-2 rounded-md hover:bg-blue-600 transition-colors mb-2" />
      <Skeleton className="h-10 text-white w-full py-2 rounded-md hover:bg-blue-600 transition-colors" />
    </Card>
  );
}
