"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import ProfileDetail from "Components/ProfileDetail";
import { Button, Avatar } from "@nextui-org/react";
import { useUser } from "@/utils/store/user";
import toast, { Toaster } from "react-hot-toast";

import { GenderChip } from "Components/Home/GenderChip";
import SexPositiveChip from "Components/Home//SexPositiveChip";
import { SexualOrientationChip } from "Components/Home//SexualOrientationChip";
import NeedAssistanceChip from "Components/Home//NeedAssistanceChip";
import SmokerChip from "Components/Home//SmokerChip";

const supabase = createClient();

interface Hobby {
  id: number;
  name: string;
  emoji: string;
}

interface ProfileHobby {
  hobbies: Hobby;
}

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  sexual_orientation: string;
  display_disability: boolean;
  disability: string[];
  hobbies: string[];
  smoker: boolean;
  birthday: string;
  gender: string;
  need_assistance: boolean;
  profile_hobbies: ProfileHobby[];
  description: string;
  sex_positive: boolean;

}

function calculateAge(birthday: string) {
  const birthDate = new Date(birthday);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  const m = new Date().getMonth() - birthDate.getMonth();
  return m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate())
    ? age - 1
    : age;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [friendStatus, setFriendStatus] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const user = useUser((state) => state.user);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
                id, 
                username, 
                full_name, 
                avatar_url, 
                sexual_orientation, 
                display_disability, 
                disability, 
                smoker, 
                birthday, 
                gender, 
                need_assistance,
                profile_hobbies (
                    hobbies (id, name, emoji)
                )
            `
      )
      .eq("id", params.id)
      .single();

    if (data) {
      // @ts-expect-error intellisense is wrong, this works
      setProfile(data);
    } else {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchFriendStatus = async (otherUserId: string) => {
    try {
      const { data, error } = await supabase.rpc("get_friend_status", {
        other_user_id: otherUserId,
      });

      if (error) {
        console.error("Error fetching friend request status:", error);
        setFriendStatus(null);
      } else {
        setFriendStatus(data);
      }
    } catch (error) {
      console.error("Unexpected error fetching friend request status:", error);
      setFriendStatus(null);
    }
  };

  const checkAdminStatus = async () => {
    const userResponse = await supabase.auth.getUser();
    if (userResponse.error || !userResponse.data?.user) {
      console.error("Error fetching current user:", userResponse.error);
      return;
    }

    const userId = userResponse.data.user.id;
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (data?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    if (error) {
      console.error("Error checking admin role:", error);
    }
  };

  const sendFriendRequest = async () => {
    try {
      if (user?.id === params.id) {
        toast.error("You cannot send a friend request to yourself.");
        return;
      } else {
        const { data, error } = await supabase.rpc("send_friend_request", {
          profile_2_id: params.id,
        });

        if (error) {
          console.error("Error sending friend request:", error);
        } else {
          await fetchFriendStatus(params.id);
          toast.success("Friend request sent successfully!");
        }
      }
    } catch (error) {
      console.error("Unexpected error sending friend request:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchFriendStatus(params.id);
    checkAdminStatus();
  }, [user?.id, params.id]);

  if (!profile) {
    return <div>No profile found.</div>;
  }

  const renderFriendButton = () => {
    if (isAdmin) return null;

    switch (friendStatus) {
      case "accepted":
        return <Button disabled>Connected</Button>;
      case "pending":
        return <Button disabled>Pending</Button>;
      case "rejected":
        return <Button disabled>Rejected</Button>;
      default:
        return <Button onPress={sendFriendRequest}>Connect</Button>;
    }
  };

  return (
    <main className="flex flex-col items-center justify-start p-6 min-h-screen bg-purple-50">
      <div className="flex flex-col items-center space-y-4">
        <Avatar
          src={profile.avatar_url || '/default-avatar.png'}
          alt="Profile Avatar"
          className="w-24 h-24 rounded-full"
        />
        <h2 className="text-2xl font-semibold">{profile.full_name}</h2>
        <p className="text-gray-500">@{profile.username}</p>
        <p className="text-gray-700">Age: {calculateAge(profile.birthday)}</p>
      </div>

      <div className="w-full max-w-md mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Description</h3>
        <p className="text-gray-700 mt-2">{profile.description || 'No description provided.'}</p>
      </div>

      <div className="w-full max-w-md mt-6 flex flex-wrap gap-3">
        <GenderChip gender={profile.gender} />
        <SexualOrientationChip sexual_orientation={profile.sexual_orientation} />
        <SmokerChip Smoker={profile.smoker} />
        <SexPositiveChip sex_positive={profile.sex_positive} />
        <NeedAssistanceChip need_assistance={profile.need_assistance} />
      </div>

      <div className="w-full max-w-md mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Hobbies</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.profile_hobbies.map((hobby) => (
            <span
              key={hobby.hobbies.id}
              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
            >
              {hobby.hobbies.name} {hobby.hobbies.emoji}
            </span>
          ))}
        </div>
      </div>

      {!isAdmin && (
        <div className="w-full max-w-md mt-8">
          {friendStatus === 'accepted' ? (
            <Button disabled className="w-full bg-green-500 text-white py-2 rounded-md">
              Connected
            </Button>
          ) : friendStatus === 'pending' ? (
            <Button disabled className="w-full bg-yellow-500 text-white py-2 rounded-md">
              Pending
            </Button>
          ) : friendStatus === 'rejected' ? (
            <Button disabled className="w-full bg-red-500 text-white py-2 rounded-md">
              Rejected
            </Button>
          ) : (
            <Button
              className="w-full bg-purple-500 text-white py-2 rounded-md"
              onClick={sendFriendRequest}
            >
              Connect
            </Button>
          )}
        </div>
      )}
    </main>
  );
}
