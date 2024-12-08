"use client";
import React from "react";
import { useState, useEffect } from "react";

//Enums
import LookingFor, { LookingForDisplayNames } from "@/src/enums/LookingFor";

//Components
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

///backend
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { b, tr } from "framer-motion/client";
const supabase = createClient();

export default function Page() {
  const [lookingFor, setLookingFor] = React.useState<LookingFor | undefined>(undefined);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const pathName = usePathname();

  const lookingForChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.target as HTMLButtonElement;
    const dataValue = button.getAttribute("data-gender") as LookingFor;
    setLookingFor(dataValue);
  };

  const handleStepFourRegistration = async () => {
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
      setMessage("PLease first enter your credentials");
      router.push(`/register/${accessToken}`);
      return;
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();


    if (!profileError && profileData) {
      var lookingFor = profileData.sex_positive === "true" ? LookingFor.PartnerAndFriends : LookingFor.Friends;
      setLookingFor(lookingFor);
    }
  };

  useEffect(() => {
    handleStepFourRegistration();
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

    var sex_positive = lookingFor == "Friends" ? "false" : "true";

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: userData.user.id,
        sex_positive: sex_positive,
      });

    if (error) {
      setError("Error saving data");
      console.log(error);
      return;
    }
    else {
      setMessage("Information saved successfully");
    }
  };

  return (
    <section className="w-full h-96 flex flex-col justify-start items-center p-4">
      <h2>What Are You Looking For?</h2>
      <div className="w-full max-w-md p-8 h-fit">
        {Object.values(LookingFor).map((l) => (
          <Button
            color={lookingFor === l ? "primary" : "default"}
            className="w-full mb-4"
            data-gender={l}
            key={l}
            onClick={lookingForChange}
          >
            {LookingForDisplayNames[l]}
          </Button>
        ))}
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <Button className="w-full mt-8" color="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </section>
  );
}
