"use client";
import { login } from "@/src/app/login/actions";
import { Button, Input, Link } from "@nextui-org/react";
import Logo from "Components/Logo/Logo";
import React, { useState } from "react";
import { EyeFilledIcon } from "Components/Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "Components/Icons/EyeSlashFilledIcon";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
export default function Reset() {
  const router = useRouter();
  const supabase = createClient();

  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false); // State for toggling password visibility
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const confirmPasswords = async () => {
    if (password !== confirmPassword) return alert("Passwords do not match");
    const { data: resetData, error } = await supabase.auth.updateUser({
      password: password,
    });
    if (resetData) {
      router.push("/login");
    }
    if (error) console.log(error);
  };
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleConfirmVisibility = () => {
    setIsConfirmVisible(!isConfirmVisible);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4 w-full max-w-md p-8">
        <Logo alt="Purple Logo" color="purple" className="w-full md-4" />

        <div className="relative w-full">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={isVisible ? "text" : "password"} // Toggle between text and password
            label="Password"
            placeholder="Enter your new password"
            className="w-full md-4"
          />

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 focus:outline-none"
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
        </div>
        {/* <div className="mt-2">  */}
        <div className="relative w-full">
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={isConfirmVisible ? "text" : "password"} // Toggle between text and password
            label="Password"
            placeholder="Confirm your new password"
            className="w-full md-4"
          />

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 focus:outline-none"
            type="button"
            onClick={toggleConfirmVisibility}
            aria-label="toggle confirm password visibility"
          >
            {isConfirmVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        </div>

        <Button
          size="lg"
          className="w-full md-4 btn-primary"
          aria-label="login-button"
          type="submit"
          onClick={confirmPasswords}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
