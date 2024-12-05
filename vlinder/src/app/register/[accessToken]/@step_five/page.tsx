"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";

//Images
import ProfilePlaceholderImage from "Images/Profile_avatar_placeholder.png";

//Components
import { Chip } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";

//Icons

export default function Page() {
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
