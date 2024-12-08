"use client";
import React from "react";
import { useState, useEffect } from "react";

//Enums
import Gender, { GenderDisplayNames } from "@/src/enums/Gender";
import SexualOrientation, { SexualOrientationDisplayNames } from "@/src/enums/SexualOrientation";

//Components
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

//Icons
import { EyeFilledIcon } from "Components/Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "Components/Icons/EyeSlashFilledIcon";

///backend
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { b } from "framer-motion/client";
const supabase = createClient();

export default function Page() {
  const [gender, setGender] = React.useState<Gender | undefined>(undefined);
  const [sexualOrientation, setSexualOrientation] = React.useState<SexualOrientation | undefined>(undefined);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const pathName = usePathname();

  const genderChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.target as HTMLButtonElement;
    const dataValue = button.getAttribute("data-gender") as Gender;
    setGender(dataValue);
  };

  const sexualOrientationChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.target as HTMLButtonElement;
    const dataValue = button.getAttribute("data-sexualOrientation") as SexualOrientation;
    setSexualOrientation(dataValue);
  };

  const handleStepThreeRegistration = async () => {
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

    console.log("profileData", profileData);

    if (!profileError && profileData) {
      if (profileData.gender)
        setGender(profileData.gender);

      if (profileData.sexual_orientation)
        setSexualOrientation(profileData.sexual_orientation);
    }
  };

  useEffect(() => {
    handleStepThreeRegistration();
  }, []);

  const handleSave = async () => {
    setError("");
    setMessage("");

    if (gender === null) {
      setError("Please select your gender");
      return;
    }

    if (sexualOrientation === null) {
      setError("Please select your sexual orientation");
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (!userData.user) {
      setError("User data is not available");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: userData.user.id,
        gender: gender,
        sexual_orientation: sexualOrientation,
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
      <h2>Enter Your Gender and Sexual Orientation</h2>
      <div className="w-full max-w-md p-8 h-fit">
        <h3>Gender</h3>
        {Object.values(Gender).map((g) => (
          <Button
            color={gender === g ? "primary" : "default"}
            className="w-full mb-4"
            data-gender={g}
            key={g}
            onClick={genderChange}
          >
            {GenderDisplayNames[g]}
          </Button>
        ))}

        <h3>Sexual Orientation</h3>
        {Object.values(SexualOrientation).map((o) => (
          <Button
            color={sexualOrientation === o ? "primary" : "default"}
            className="w-full mb-4"
            data-sexualorientation={o}
            key={o}
            onClick={sexualOrientationChange}
          >
            {SexualOrientationDisplayNames[o]}
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
