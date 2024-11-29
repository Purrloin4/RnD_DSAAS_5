"use client";
import React from "react";

//Components
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

//Icons
import { EyeFilledIcon } from "Components/Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "Components/Icons/EyeSlashFilledIcon";

export default function page() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <section className="w-full h-96 flex flex-col justify-start items-center p-4">
      <h2>Enter Your Email And Password</h2>
      <div className="w-full max-w-md p-8 h-fit">
        <Input
          className="w-full mb-4"
          color="default"
          type="email"
          label="Email"
          placeholder="Enter Your Email"
        />
        <Input
          className="w-full mb-4"
          color="default"
          type="password"
          label="Password"
          placeholder="Enter your Password"
        />
        <Input
          className="w-full mb-4"
          color="default"
          type={isVisible ? "text" : "password"}
          label="Password"
          placeholder="Enter Your Password"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
        />
        <Input
          className="w-full mb-4"
          color="default"
          type="password"
          label="Repeat Password"
          placeholder="Repeat Your Password"
        />
      </div>
    </section>
  );
}
