"use client";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

import { Input, Button } from "@nextui-org/react";

import Logo from "Components/Logo/Logo";

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

    router.push(`/register/${accessToken}`);
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4 w-full max-w-md p-8">
        <Logo alt="Purple Logo" color="purple" className="w-full md-4" />
        {error && <p className="text-red-500">{error}</p>}
        <Input
          type="text"
          label="Access Token"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="w-full md-4"
          onChange={(e) => setAccessToken(e.target.value)}
        />

        <Link
          className="w-full flex justify-center text-sm font-semibold text-primary"
          href="./register/request-access"
          replace
        >
          <span>Request an access token!</span>
        </Link>

        <Button
          size="lg"
          className="w-full md-4 btn-primary font-semibold"
          aria-label="register-button"
          onClick={handleStartRegistration}
        >
          Start my registration
        </Button>
      </div>
    </main>
  );
}

export default Page;
