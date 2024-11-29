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

export default function page() {
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
    <section className="w-full h-96 flex flex-col justify-start items-center p-4">
      <h2>Enter Your Gender and Sexual Orientation</h2>
      <div className="w-full max-w-md p-8 h-fit">
        <h3>Gender</h3>
        {Object.values(Gender).map((g) => (
          <Button
            color={gender === g ? "primary" : "default"}
            className="w-full mb-4"
            data-gender={g}
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
            data-sexualOrientation={o}
            onClick={sexualOrientationChange}
          >
            {SexualOrientationDisplayNames[o]}
          </Button>
        ))}
      </div>
    </section>
  );
}
