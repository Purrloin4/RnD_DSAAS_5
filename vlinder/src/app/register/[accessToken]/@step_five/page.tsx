"use client";
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";

//Images
import ProfilePlaceholderImage from "Images/Profile_avatar_placeholder.png";

//Components
import { Chip } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";

// Backend
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

interface Hobby {
  id: number;
  name: string;
  emoji: string;
}

interface ProfileHobby {
  hobbies: Hobby;
}

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

export default function Page() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const pathName = usePathname();

  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  function calculateAge(birthday: string) {
    const birthDate = new Date(birthday);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const m = new Date().getMonth() - birthDate.getMonth();
    return m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate()) ? age - 1 : age;
  }

  const fullName = "John Doe";
  const age = 21;
  const city = "Leuven";
  const country = "Belgium";
  const srcProfileImage = ProfilePlaceholderImage;
  // Hobby data
  const Intrests = [
    {
      id: 1,
      name: "Reading",
    },
    {
      id: 2,
      name: "Traveling",
    },
    {
      id: 3,
      name: "Cooking",
    },
    {
      id: 4,
      name: "Photography",
    },
  ];
  ///

  const fetchUser = async () => {
    const accessToken = pathName.split("/").pop();

    const { data: tokenData, error: tokenError } = await supabase
    .from("accessToken")
    .select("*")
    .eq("id", accessToken)
    .eq("is_used", false)
    .single();


    if (tokenError || !tokenData) {
      router.push(`/register`);
      return;
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data) {
      setMessage("PLease first enter your credentials");
      router.push(`/register/${accessToken}`);
      return;
    } else {
        setUserId(data.user.id);
        }
    };
    fetchUser();

  const fetchProfile = async () => {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    setProfile(profileData || null);
    console.log("profileData", profileData);

  };

  const handleStepFiveRegistration = async () => {
    console.log("profile", profile);
  }

  useEffect(() => {
    const fetchData = async () => {
        await fetchProfile();
        handleStepFiveRegistration();
    };
    fetchData();
}, [userId]);

  const [selectedHobbysItems, setSelectedHobbysItems] = useState<number[]>([]);
  const toggleHobby = (id: number) => {
    if (selectedHobbysItems.includes(id)) {
      // If ID exists, remove it
      setSelectedHobbysItems(selectedHobbysItems.filter((item: number) => item !== id));
    } else {
      // If ID does not exist, add it
      setSelectedHobbysItems([...selectedHobbysItems, id]);
    }
  };

  return (
    <section className="w-full h-96 flex flex-col justify-start items-center p-4">
      <h2>It's Time Setup Your Profile!</h2>
      <div className="w-full max-w-md h-fit">
        <div className="p-8 mt-4 flex flex-col items-center bg-white rounded-md shadow-md">
          <Image className="w-1/2 rounded-full" alt="Profile picture" src={srcProfileImage} />
          <h2 className="mt-2">
            {fullName}
            <span className="font-light"> {age}</span>
          </h2>
          <p>
            {city}, {country}
          </p>
          <hr className="border w-full my-4" />
          <Textarea label="Description" placeholder="Enter your description" className="max-w-full w-full" />
          <hr className="border w-full my-4" />
          <h2>Intrests</h2>
          <div className="mt-2 flex flex-wrap gap-4">
            {Intrests.map((i) => (
              <Chip
                className="cursor-pointer"
                key={i.id}
                onClick={() => toggleHobby(i.id)}
                color={selectedHobbysItems.includes(i.id) ? "primary" : "default"}
              >
                {i.name}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
