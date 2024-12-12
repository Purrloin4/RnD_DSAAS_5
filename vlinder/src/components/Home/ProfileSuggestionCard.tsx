import { Card, Button, Chip } from "@nextui-org/react";
import Image from "next/image";
import PlaceholderImage from "Images/Profile_avatar_placeholder.png";
import { GenderChip } from "./GenderChip";
import SexPositiveChip from "./SexPositiveChip";
import { SexualOrientationChip } from "./SexualOrientationChip";
import SmokerChip from "./SmokerChip";
import Link from "next/link";

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  sexual_orientation: string;
  sex_positive: boolean;
  gender: string;
  smoker: boolean | undefined;
  display_disability: boolean;
  disability: string[];
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

export default function ProfileSuggestionCard({ className, profile }: { className?: string; profile: Profile }) {
  //console.log(profile);
  return (
    <Card
      className={`flex flex-col p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow ${className}`}
    >
      <div className="flex-grow">
        <div className="relative w-full aspect-square overflow-hidden rounded-md mb-4">
          <Image
            alt={`${profile.username}'s avatar`}
            src={profile.avatar_url || PlaceholderImage.src}
            width={500}
            height={500}
            className="w-full h-full object-cover object-center border-r-medium"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{profile.username || "Unnamed User"}</h3>
        <div className="flex flex-wrap gap-2 w-full mb-2">
          <GenderChip gender={profile.gender} />
          <SexPositiveChip sex_positive={profile.sex_positive} />
          <SexualOrientationChip sexual_orientation={profile.sexual_orientation} />
          <SmokerChip Smoker={profile.smoker} />
          {profile.display_disability
            ? profile.disability.map((dis, index) => (
                <Chip key={index} size="sm" className="bg-sky-200 text-black">
                  {dis}
                </Chip>
              ))
            : ""}
          {profile.profile_hobbies.map((ph, index) => (
            <Chip key={index} size="sm">
              {ph.hobbies.name}
            </Chip>
          ))}
        </div>
        <p className="text-gray-600 line-clamp-3 overflow-hidden text-ellipsis text-wrap truncate break-all mb-4">
          description
        </p>
      </div>
      <Button className="justify-self-end bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition-colors mb-2">
        Add Friend
      </Button>
      <Link href={`/profile/${profile.id}`} replace>
        <Button className="justify-self-end w-full py-2 rounded-md">See Profile</Button>
      </Link>
    </Card>
  );
}
