"use client";
import React from "react";
import { useState } from "react";

//Enums
import LookingFor, { LookingForDisplayNames } from "@/src/enums/LookingFor";

//Components
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

//Icons

export default function Page() {
  const [lookingFor, setLookingFor] = React.useState<LookingFor | undefined>(undefined);

  const genderChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.target as HTMLButtonElement;
    const dataValue = button.getAttribute("data-gender") as LookingFor;
    setLookingFor(dataValue);
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
            onClick={genderChange}
          >
            {LookingForDisplayNames[l]}
          </Button>
        ))}
      </div>
    </section>
  );
}
