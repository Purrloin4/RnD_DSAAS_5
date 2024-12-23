"use client";
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";

import ProfilePlaceholderImage from "Images/Profile_avatar_placeholder.png";

import { Chip, user } from "@nextui-org/react";
import { Textarea, Button } from "@nextui-org/react";

import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface Hobby {
  id: number;
  name: string;
  emoji: string;
}

export default function Page() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const pathName = usePathname();
  const supabase = createClient();

  const [userId, setUserId] = useState("");
  const [userName, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [allHobbies, setHobbies] = useState<Hobby[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function calculateAge(birthday: string) {
    const birthDate = new Date(birthday);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const m = new Date().getMonth() - birthDate.getMonth();
    return m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate()) ? age - 1 : age;
  }

  const srcProfileImage = ProfilePlaceholderImage;

  const fetchUser = async () => {
    const accessToken = pathName.split("/").pop();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data) {
      setError("Please first enter your credentials");
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
      .select(
        `*
        `
      )
      .eq("id", userId)
      .single();

    setUsername(profileData?.username);
    setAge(calculateAge(profileData?.birthday));
    setLocation(profileData?.location);
    setDescription(profileData?.description);

    console.log("userId", userId);
    const { data: profileHobbiesData, error: profileHobbiesError } = await supabase
      .from("profile_hobbies")
      .select("hobby_id")
      .eq("profile_id", userId);
    if (profileHobbiesError) {
      console.error("Failed to fetch profile hobbies:", profileHobbiesError.message);
      return;
    }
    setSelectedHobbies(profileHobbiesData.map((h) => h.hobby_id));
  };

  const fetchHobbies = async () => {
    const { data, error } = await supabase.from("hobbies").select("*");

    if (data) {
      setHobbies(data);
    } else {
      console.error("Error fetching hobbies:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchProfile();
      await fetchHobbies();
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  const toggleHobby = (id: number) => {
    setSelectedHobbies((prevSelectedHobbies) =>
      prevSelectedHobbies.includes(id)
        ? prevSelectedHobbies.filter((hobbyId) => hobbyId !== id)
        : [...prevSelectedHobbies, id]
    );
  };

  const handleSave = async () => {
    setError("");
    setMessage("");
    try {
      console.log("selectedHobbies", selectedHobbies);
      console.log("description", description);

      const { error } = await supabase
        .from("profiles")
        .update({
          description: description,
        })
        .eq("id", userId);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError || !profileData) {
        console.error("Failed to fetch profile:", profileError?.message);
        setError("Failed to fetch profile. Please try again.");
        return;
      }

      const { profile_hobbies, ...profileDataWithoutHobbies } = profileData;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          ...profileDataWithoutHobbies,
          description: description,
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Failed to update profile:", updateError.message);
        setError("Failed to save profile. Please try again.");
        return;
      }

      const { data: currentHobbies, error: fetchError } = await supabase
        .from("profile_hobbies")
        .select("hobby_id")
        .eq("profile_id", userId);

      if (fetchError) {
        console.error("Failed to fetch current hobbies:", fetchError.message);
        setError("Failed to fetch current hobbies. Please try again.");
        return;
      }

      const currentHobbyIds = currentHobbies.map((h) => h.hobby_id);
      const updatedHobbyIds = selectedHobbies;

      const hobbiesToDelete = currentHobbyIds.filter((id) => !updatedHobbyIds.includes(id));

      if (hobbiesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("profile_hobbies")
          .delete()
          .in("hobby_id", hobbiesToDelete)
          .eq("profile_id", userId);

        if (deleteError) {
          console.error("Failed to delete hobbies:", deleteError.message);
          setError("Failed to delete hobbies. Please try again.");
          return;
        }
      }

      const hobbiesToAdd = updatedHobbyIds.filter((id) => !currentHobbyIds.includes(id));

      if (hobbiesToAdd.length > 0) {
        const { error: insertError } = await supabase.from("profile_hobbies").insert(
          hobbiesToAdd.map((hobbyId) => ({
            profile_id: userId,
            hobby_id: hobbyId,
          }))
        );

        if (insertError) {
          console.error("Failed to add hobbies:", insertError.message);
          setError("Failed to add hobbies. Please try again.");
          return;
        }
      }

      setMessage("Profile saved successfully! You will be redirected to the homepage.");

      const accessToken = pathName.split("/").pop();

      const { data: tokenData, error: tokenError } = await supabase
        .from("accessToken")
        .update({ is_used: true })
        .eq("id", accessToken);

      router.push("/homepage");
    } catch (error) {
      console.error("Failed to save profile:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col justify-start items-center p-4">
      <h2>It's Time Setup Your Profile!</h2>
      <div className="w-full max-w-md h-fit">
        <div className="p-6 mt-4 flex flex-col items-center bg-white rounded-md shadow-md">
          <Image className="w-1/3 rounded-full" alt="Profile picture" src={srcProfileImage} />
          <h2 className="mt-2 text-lg font-medium">
            {loading ? "Loading..." : userName}
            <span className="font-light text-sm"> {loading ? "" : age}</span>
          </h2>
          <p className="text-sm text-gray-600">{loading ? "Loading..." : location}</p>
          <hr className="border w-full my-2" />
          <Textarea
            label="Description"
            placeholder="Enter your description"
            className="max-w-full w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          <hr className="border w-full my-2" />
          <h2 className="text-lg font-medium">Hobbies</h2>
          <div
            className="mt-2 flex flex-wrap gap-2 overflow-y-auto scrollbar-none"
            style={{ maxHeight: "calc(3 * 2.5rem)" }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : (
              allHobbies.map((hobby) => (
                <Chip
                  key={hobby.id}
                  onClick={() => toggleHobby(hobby.id)}
                  className={`m-1 ${
                    selectedHobbies.includes(hobby.id) ? "bg-purple-500 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {hobby.name} {hobby.emoji}
                </Chip>
              ))
            )}
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <Button className="w-full mt-8 text-black btn-primary font-semibold" onClick={handleSave} disabled={loading}>
          Save And Finish Setup
        </Button>
      </div>
    </main>
  );
}
