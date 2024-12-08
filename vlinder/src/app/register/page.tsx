"use client";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

//Next-ui components
import { Input, Button } from "@nextui-org/react";

//Components
import Logo from "Components/Logo/Logo";

//backend
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

function Page() {
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleStartRegistration = async () => {
    setError("");

    const { data, error } = await supabase
      .from("accessToken")
      .select("*")
      .eq("id", accessToken)
      .eq("is_used", false)
      .single();

    if (error || !data) {
      setError("Invalid or used access token.");
      return;
    }

    // Redirect to the registration page
    router.push(`/register/${accessToken}`);
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 h-fit bg-white rounded-md shadow-md">
        <Logo alt="logo vlinder" className="pb-8 mx-auto" />
        {error && <p className="text-red-500">{error}</p>}
        <Input
          type="text"
          label="Access Token"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="max-w-full"
          onChange={(e) => setAccessToken(e.target.value)}
        />
        <Link className="block mt-2 text-sm text-blue-500" href="./register/request-access" replace>
          Request an access token
        </Link>
        <Button className="w-full mt-8" color="primary" onClick={handleStartRegistration}>
          Start my registration
        </Button>
      </div>
    </main>
  );
}

export default Page;
