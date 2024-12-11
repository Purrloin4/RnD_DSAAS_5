"use client";
import React from "react";
import { useState } from "react";

//Enums
import Gender, { GenderDisplayNames } from "@/src/enums/Gender";
import SexualOrientation, { SexualOrientationDisplayNames } from "@/src/enums/SexualOrientation";

//Components
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

//Icons
import { EyeFilledIcon } from "Components/Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "Components/Icons/EyeSlashFilledIcon";

export default function Page() {
  const [gender, setGender] = React.useState<Gender | undefined>(undefined);
  const [sexualOrientation, setSexualOrientation] = React.useState<SexualOrientation | undefined>(undefined);

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

  return (
    <section className="w-full flex flex-col justify-start items-center p-4">
      <h2 className="text-center">Enter Your Gender and Sexual Orientation</h2>
      <div className="flex flex-col items-center w-full max-w-md p-8">
        <h3 className="text-gray-800 font-bold mb-2">Gender</h3>
        {Object.values(Gender).map((g) => (
          <Button
            color={gender === g ? "secondary" : "default"}
            className="w-full mb-4 text-gray-800"
            data-gender={g}
            key={g}
            onClick={genderChange}
          >
            {GenderDisplayNames[g]}
          </Button>
        ))}

        <h3 className="text-gray-800 font-bold mb-2">Sexual Orientation</h3>
        {Object.values(SexualOrientation).map((o) => (
          <Button
            color={sexualOrientation === o ? "secondary" : "default"}
            className="w-full mb-4 text-gray-800"
            data-sexualorientation={o}
            key={o}
            onClick={sexualOrientationChange}
          >
            {SexualOrientationDisplayNames[o]}
          </Button>
        ))}
      </div>
    </section>
  );
}
