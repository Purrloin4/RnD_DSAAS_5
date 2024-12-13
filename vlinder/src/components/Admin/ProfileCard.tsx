import { Card, Button } from "@nextui-org/react";
import PlaceholderImage from "Images/Profile_avatar_placeholder.png";
import Image from "next/image";
import Link from "next/link";

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
}

export default function ProfileCard({ profile, className }: { profile: Profile; className?: string }) {
  return (
    <Card
      className={`flex flex-col p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow ${className}`}
      data-testid="profile-suggestion-card"
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-md mb-2">
        <Image
          alt={`${profile.full_name}'s avatar`}
          src={profile.avatar_url || PlaceholderImage.src}
          width={500}
          height={500}
          className="w-full h-full object-cover object-center border-r-medium"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{profile.full_name || "Unnamed User"}</h3>

      <Link href={`/profile/${profile.id}`} replace>
        <Button className="justify-self-end w-full py-2 rounded-md">See Profile</Button>
      </Link>
    </Card>
  );
}
