"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useFriendships } from "@/utils/store/friendships";
import FriendshipList from "Components/FriendshipList";
import InitFriendships from "@/utils/store/InitFriendships";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { DatePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { Checkbox } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { logout } from "@/src/app/logout/actions";
import { Skeleton } from "@nextui-org/react";
import EnviromentStrings from "@/src/enums/envStrings";

const supabase = createClient();

interface Hobby {
  id: number;
  name: string;
  emoji: string;
}

interface ProfileHobby {
  hobbies: Hobby;
}
interface Friendship {
  id: string;
  friend_id: string;
  friend_username: string;
  friend_avatar: string | null;
}
interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  sexual_orientation: string;
  display_disability: boolean;
  disability: string[];
  smoker: boolean;
  birthday: string;
  gender: string;
  need_assistance: boolean;
  profile_hobbies: ProfileHobby[];
}

export default function EditProfilePage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { friendships, setFriendships } = useFriendships();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [allHobbies, setHobbies] = useState<Hobby[]>([]);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push("/login");
    } else {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.error("Logout failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          router.push("/login");
        } else {
          setUserId(data.user.id);
        }
      } catch (err) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error fetching user:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `id, 
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
                hobbies (id, name, emoji))
                `
      )
      .eq("id", userId)
      .single();

    if (data) {
      // @ts-expect-error err
      setProfile(data);
    } else {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.error("Error fetching profile:", error);
      }
    }
  };

  const fetchHobbies = async () => {
    const { data, error } = await supabase.from("hobbies").select("*");

    if (data) {
      setHobbies(data);
    } else {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.error("Error fetching hobbies:", error);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setProfile((prev) =>
      prev ? { ...prev, [name]: type === "checkbox" ? !!checked : value } : null
    );
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !profile) return null;

    const fileName = `${profile.id}-${Date.now()}.${avatarFile.name
      .split(".")
      .pop()}`;
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile);

      if (uploadError) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Failed to upload avatar:", uploadError.message);
        }
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Failed to retrieve public URL");
        }
        return null;
      }

      return publicUrlData.publicUrl;
    } catch (err) {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.error("Unexpected error during avatar upload:", err);
      }
      return null;
    }
  };

  const handleSave = async () => {
    let avatarUrl = profile?.avatar_url || null;

    if (avatarFile) {
      const uploadedUrl = await uploadAvatar();
      if (uploadedUrl) avatarUrl = uploadedUrl;
    }

    if (profile) {
      const { profile_hobbies, ...profileData } = profile;

      const { error } = await supabase
        .from("profiles")
        .update({
          ...profileData,
          avatar_url: avatarUrl,
        })
        .eq("id", profile.id);

      if (error) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Failed to update profile:", error.message);
        }
      }

      const { data: currentHobbies, error: fetchError } = await supabase
        .from("profile_hobbies")
        .select("hobby_id")
        .eq("profile_id", profile.id);

      if (fetchError) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Failed to fetch current hobbies:", fetchError.message);
        }
        return;
      }

      const currentHobbyIds = currentHobbies.map((h) => h.hobby_id);
      const updatedHobbyIds = profile_hobbies.map((ph) => ph.hobbies.id);

      const hobbiesToDelete = currentHobbyIds.filter(
        (id) => !updatedHobbyIds.includes(id)
      );

      if (hobbiesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("profile_hobbies")
          .delete()
          .in("hobby_id", hobbiesToDelete)
          .eq("profile_id", profile.id);

        if (deleteError) {
          if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
            console.error("Failed to delete hobbies:", deleteError.message);
          }
          return;
        }
      }

      const hobbiesToAdd = updatedHobbyIds.filter(
        (id) => !currentHobbyIds.includes(id)
      );

      if (hobbiesToAdd.length > 0) {
        const { error: insertError } = await supabase
          .from("profile_hobbies")
          .insert(
            hobbiesToAdd.map((hobbyId) => ({
              profile_id: profile.id,
              hobby_id: hobbyId,
            }))
          );

        if (insertError) {
          if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
            console.error("Failed to add hobbies:", insertError.message);
          }
          return;
        }
      }

      router.push("/profile");
      window.location.reload();
    }
  };
  const fetchFriendships = async () => {
    try {
      const { data, error } = await supabase.rpc("show_friends");
      if (error) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error fetching friendships:", error);
        }
        return;
      }

      const formattedData = data.map((friend: any) => ({
        id: friend.id,
        username: friend.username,
        friend_id: friend.profile_id,
        friend_avatar: friend.avatar_url || null,
      }));

      setFriendships(formattedData);
    } catch (error) {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.error("Unexpected error fetching friendships:", error);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchHobbies();
    fetchFriendships();
  }, [userId]);

  return (
    <main className="flex items-start justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4 w-full max-w-md p-8">
        <Skeleton isLoaded={!isLoading} className="w-24 h-24 rounded-full">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
              <span className="text-sm text-gray-700">No Avatar</span>
            </div>
          )}
        </Skeleton>

        <Skeleton isLoaded={!isLoading} className="w-full rounded-lg">
          <div className="flex flex-col items-center space-y-2">
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Choose File
            </Button>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            {avatarFile && (
              <p className="text-sm text-gray-600">{avatarFile.name}</p>
            )}
          </div>
        </Skeleton>

        <Skeleton isLoaded={!isLoading} className="w-full rounded-lg">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={profile?.full_name}
            onChange={(e) =>
              setProfile((prev) =>
                prev ? { ...prev, full_name: e.target.value } : null
              )
            }
            className="w-full"
          />
        </Skeleton>

        <Skeleton isLoaded={!isLoading} className="w-full rounded-lg">
          <Select
            label="Gender"
            placeholder="Select your gender"
            selectedKeys={
              profile?.gender ? new Set([profile.gender]) : new Set()
            }
            onSelectionChange={(selectedKey) => {
              const selectedValue = Array.from(selectedKey).join(", ");
              setProfile((prev) =>
                prev ? { ...prev, gender: selectedValue } : null
              );
            }}
            className="w-full"
          >
            <SelectItem key="Male">Male</SelectItem>
            <SelectItem key="Female">Female</SelectItem>
            <SelectItem key="Other">Other</SelectItem>
          </Select>
        </Skeleton>

        <Skeleton isLoaded={!isLoading} className="w-full rounded-lg">
          <DatePicker
            label="Birthday"
            className="w-full"
            value={profile?.birthday ? parseDate(profile.birthday) : undefined}
            onChange={(selectedDate) => {
              const isoDate = selectedDate?.toString();
              setProfile((prev) =>
                prev ? { ...prev, birthday: isoDate } : null
              );
            }}
          />
        </Skeleton>

        <Skeleton isLoaded={!isLoading} className="w-full">
          <Input
            label="Sexual Orientation"
            placeholder="Enter your sexual orientation"
            value={profile?.sexual_orientation}
            onChange={(e) =>
              setProfile((prev) =>
                prev ? { ...prev, sexual_orientation: e.target.value } : null
              )
            }
            className="w-full"
          />
        </Skeleton>

        <Skeleton isLoaded={!isLoading} className="w-full rounded-lg">
          <Checkbox
            isSelected={!!profile?.smoker}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isSelected = event.target.checked;
              setProfile((prev) =>
                prev ? { ...prev, smoker: isSelected } : null
              );
            }}
          >
            Smoker
          </Checkbox>
        </Skeleton>

        <Skeleton isLoaded={!isLoading} className="w-full">
          <Checkbox
            isSelected={!!profile?.display_disability}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isSelected = event.target.checked;
              setProfile((prev) =>
                prev ? { ...prev, display_disability: isSelected } : null
              );
            }}
          >
            Display Disability
          </Checkbox>
        </Skeleton>

        <Skeleton isLoaded={!isLoading} className="w-full rounded-lg">
          <Checkbox
            isSelected={!!profile?.need_assistance}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isSelected = event.target.checked;
              setProfile((prev) =>
                prev ? { ...prev, need_assistance: isSelected } : null
              );
            }}
          >
            Need Assistance
          </Checkbox>
        </Skeleton>

        <Skeleton isLoaded={!isLoading} className="w-full rounded-lg">
          <Textarea
            label="Disabilities"
            placeholder="Enter disabilities separated by commas"
            value={profile?.disability?.join(", ") || ""}
            onChange={(e) => {
              const value = e.target.value.split(",").map((d) => d.trim());
              setProfile((prev) =>
                prev ? { ...prev, disability: value } : null
              );
            }}
            className="w-full"
            rows={3}
          />
        </Skeleton>

        <Skeleton isLoaded={!isLoading} className="w-full">
          <Textarea
            label="Hobbies"
            readOnly
            value={
              profile?.profile_hobbies
                ?.map((h) => `${h.hobbies.name} ${h.hobbies.emoji}`)
                .join(", ") || ""
            }
            className="w-full h-24 overflow-y-auto resize-none"
          />
        </Skeleton>

        <Skeleton isLoaded={!isLoading} className="w-full rounded-lg">
          <Input
            label="Search Hobbies"
            placeholder="Type to filter hobbies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-2"
          />
        </Skeleton>

        <div className="flex flex-wrap gap-2 border p-4 rounded-md bg-white max-h-32 overflow-y-auto scrollbar-none">
          {allHobbies
            .filter((hobby) =>
              hobby.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((hobby) => {
              const isSelected = profile?.profile_hobbies.some(
                (ph) => ph.hobbies.id === hobby.id
              );
              return (
                <Button
                  key={hobby.id}
                  onClick={() => {
                    setProfile((prevProfile) => {
                      if (!prevProfile) return null;

                      const updatedHobbies = isSelected
                        ? prevProfile.profile_hobbies.filter(
                            (ph) => ph.hobbies.id !== hobby.id
                          )
                        : [...prevProfile.profile_hobbies, { hobbies: hobby }];

                      return {
                        ...prevProfile,
                        profile_hobbies: updatedHobbies,
                      };
                    });
                  }}
                  size="sm"
                  className={
                    isSelected
                      ? "bg-red-500 text-white"
                      : "bg-purple-500 text-white"
                  }
                >
                  {isSelected ? `Remove ${hobby.name}` : `Add ${hobby.name}`}{" "}
                  {hobby.emoji}
                </Button>
              );
            })}
        </div>

        <Skeleton isLoaded={!isLoading} className="w-full max-w-sm rounded-lg">
          <div>
          <Button
            onClick={handleSave}
            className="w-full max-w-sm btn-primary font-semibold"
          >
            Save Changes
          </Button>
          <Button             className="w-full max-w-sm btn-secondary font-semibold"
onPress={onOpen}>Show Friends</Button>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Friends</ModalHeader>
              <ModalBody>
              <FriendshipList/>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
            
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
            
          </div>
        </Skeleton>

        <Skeleton isLoaded={!isLoading} className="w-full max-w-sm rounded-lg">
          <Button
            onClick={handleLogout}
            color="danger"
            className="w-full max-w-sm font-semibold"
          >
            Logout
          </Button>
        </Skeleton>
        <div className="h-32"></div>
      </div>
    </main>
  );
}
