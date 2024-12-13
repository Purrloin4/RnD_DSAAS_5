"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function Page() {
  const router = useRouter();
  const supabase = createClient();

  const route = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      router.push("/login");
    } else {
      router.push("/homepage");
    }
  };

  useEffect(() => {
    route();
  }, []);

  return (
    <div className="w-1/2 h-1/2">
      <Card>
        <CardBody>
          <p>Redirecting you...</p>
        </CardBody>
      </Card>
    </div>
  );
}

export default Page;
