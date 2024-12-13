"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import { Button, Skeleton } from "@nextui-org/react";

const supabase = createClient();

interface HealthcareWorker {
  id: string;
  name: string;
  organization_id: string;
}

export default function GreetingPage({ params }: { params: { id: string } }) {
  const [worker, setWorker] = useState<HealthcareWorker | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [accessDenied, setAccessDenied] = useState(false); // State to track if access is denied
  const router = useRouter();

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      router.push("/login");
    } else {
      setUserId(data.user.id);
    }
  };

  const fetchUserRole = async () => {
    if (userId) {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
      } else {
        setIsAdmin(data?.role === "admin");
      }
    }
  };

  const fetchWorkerData = async () => {
    const { data, error } = await supabase
      .from("healthcare_workers")
      .select("name, organization_id") // Fetch name and organization_id
      .eq("id", params.id)
      .single();

    if (data) {
      setWorker({ id: params.id, ...data }); // Add 'id' manually
    } else {
      console.error("Error fetching healthcare worker data:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserRole(); // Fetch the role after userId is set
    }
  }, [userId]);

  useEffect(() => {
    if (isAdmin === false) {
      setAccessDenied(true); // Set accessDenied to true if user is not an admin
    } else if (isAdmin === true) {
      fetchWorkerData();
    }
  }, [isAdmin]);

  const handleCheckActivitiesClick = () => {
    if (worker && worker.organization_id) {
      router.push(
        `/admin/${params.id}/checkactivities/${worker.organization_id}`
      );
    } else {
      alert("Organization ID not found!");
    }
  };

  const handleProfileClick = () => {
    if (worker && worker.organization_id) {
      router.push(`/admin/${params.id}/checkprofile/${worker.organization_id}`);
    } else {
      alert("Organization ID not found!");
    }
  };

  const handleCreateActivityClick = () => {
    router.push("/createactivity");
  };

  const handleInviteUserClick = () => {
    router.push("/invite");
  };

  if (accessDenied) {
    return (
      <div>
        <p>You do not have access to this page.</p>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen flex justify-center items-center">
      <div className="md:w-1/5 w-3/4">
        <h2 className="w-full text-center mb-4">Hi! {worker?.name}</h2>
        <div className="flex flex-col gap-2 w-full">
          {!worker && !accessDenied ? (
            <>
              <Skeleton className="w-full h-10 rounded-lg" />
              <Skeleton className="w-full h-10 rounded-lg" />
              <Skeleton className="w-full h-10 rounded-lg" />
              <Skeleton className="w-full h-10 rounded-lg" />
            </>
          ) : (
            <>
              <Button
                className="w-full"
                color="primary"
                onClick={handleProfileClick}
              >
                Check Profiles
              </Button>
              <Button
                className="w-full"
                color="primary"
                onClick={handleInviteUserClick}
              >
                Invite a New User
              </Button>
              <Button
                className="w-full"
                color="primary"
                onClick={handleCheckActivitiesClick}
              >
                Check Activities
              </Button>
              <Button
                className="w-full"
                color="primary"
                onClick={handleCreateActivityClick}
              >
                Create Activity
              </Button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
