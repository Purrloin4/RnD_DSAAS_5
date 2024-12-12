"use client";
import React from "react";
import { useState, useEffect } from "react";

import LookingFor, { LookingForDisplayNames } from "@/src/enums/LookingFor";

import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { b, tr } from "framer-motion/client";
const supabase = createClient();

export default function Page() {
  const [lookingFor, setLookingFor] = React.useState<LookingFor | undefined>(
    undefined
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const pathName = usePathname();

  const lookingForChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.target as HTMLButtonElement;
    const dataValue = button.getAttribute("data-gender") as LookingFor;
    setLookingFor(dataValue);
  };

  const handleStepFiveRegistration = async () => {
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

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData) {
      setError("Please first enter your credentials");
      router.push(`/register/${accessToken}`);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    if (!profileError && profileData) {
      const lookingFor =
        profileData.sex_positive === null
          ? null
          : profileData.sex_positive === true
          ? LookingFor.PartnerAndFriends
          : LookingFor.Friends;
      if (lookingFor) setLookingFor(lookingFor);
    }
  };

  useEffect(() => {
    handleStepFiveRegistration();
  }, []);

  const handleSave = async () => {
    setError("");
    setMessage("");

    if (lookingFor === null) {
      setError("Please select your preference");
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (!userData.user) {
      setError("User data is not available");
      return;
    }

    const sex_positive = lookingFor == "Friends" ? "false" : "true";

    const { data, error } = await supabase.from("profiles").upsert({
      id: userData.user.id,
      sex_positive: sex_positive,
    });

    if (error) {
      setError("Error saving data");
      console.log(error);
      return;
    } else {
      setMessage("Information saved successfully");
    }
  };

  return (
    <section className="w-full flex flex-col justify-start items-center p-4">
      <h2>What Are You Looking For?</h2>
      <div className="w-full max-w-md p-8 h-fit">
        <Button
          color={lookingFor === LookingFor.Friends ? "primary" : "default"}
          className={`w-full mb-4 ${
            lookingFor === LookingFor.Friends
              ? "bg-primary text-white"
              : "bg-gray-200 text-black"
          } active:text-white active:bg-primary-dark`}
          data-gender={LookingFor.Friends}
          onClick={lookingForChange}
        >
          {LookingForDisplayNames[LookingFor.Friends]}
        </Button>
        <Button
          color={
            lookingFor === LookingFor.PartnerAndFriends ? "primary" : "default"
          }
          className={`w-full mb-4 ${
            lookingFor === LookingFor.PartnerAndFriends
              ? "bg-primary text-white"
              : "bg-gray-200 text-black"
          } active:text-white active:bg-primary-dark`}
          data-gender={LookingFor.PartnerAndFriends}
          onClick={lookingForChange}
        >
          {LookingForDisplayNames[LookingFor.PartnerAndFriends]}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <Button
          className="w-full mb-4 text-white btn-primary font-semibold "
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </section>
  );
}
