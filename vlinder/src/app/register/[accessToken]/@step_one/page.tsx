"use client";
import React, { use } from "react";
import { useState, useEffect } from "react";

//Components
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

//Icons
import { EyeFilledIcon } from "Components/Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "Components/Icons/EyeSlashFilledIcon";

//backend
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();


export default function Page() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const pathName = usePathname();
  const accessToken = pathName.split("/").pop();


  const handleStartRegistration = async () => {
  
    const { data, error } = await supabase
      .from("accessToken")
      .select("*")
      .eq("id", accessToken)
      .eq("is_used", false)
      .single();

  
    if (error || !data) {
      router.push(`/register`);
      return;
    }

    setEmail(data.email);
  };

  useEffect(() => {
    handleStartRegistration();
  }, [router]);

  const handleSave = async () => {
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError("Error signing up");
      console.error(error);
      return;
    }
    else {
      setMessage("You have successfully signed up");
      console.log(data);
    }

  };

  return (
    <section className="w-full flex flex-col justify-start items-center p-4">
      <h2>Enter Your Email And Password</h2>
      <div className="flex flex-col items-center w-full max-w-md p-8">
        <Input 
          className="w-full mb-4" 
          color="default" 
          type="email" 
          label="Email" 
          placeholder="Enter Your Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
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
              aria-label="toggle password1 visibility"
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          className="w-full mb-4"
          color="default"
          type={isVisible ? "text" : "password"}
          label="Repeat Password"
          placeholder="Repeat Your Password"
          
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
        {error && <p className="w-full flex justify-center text-center text-sm font-semibold text-red-500">{error}</p>}
        {message && <p className="w-full flex justify-center text-center text-sm font-semibold text-green-500">{message}</p>}
        <Button 
          size="lg"
          className="w-full mt-4 btn-primary font-semibold" 
          onClick={handleSave}>
          Save
        </Button>
      </div>
    </section>
  );
}
