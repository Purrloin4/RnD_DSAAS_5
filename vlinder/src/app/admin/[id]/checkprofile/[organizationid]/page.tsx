"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import ProfileCard from "@/src/components/Admin/ProfileCard";
import ProfileCardSkeleton from "@/src/components/Admin/ProfileCardSkeleton";
import { Skeleton } from "@nextui-org/react";

const supabase = createClient();

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
}

export default function CheckProfilePage({ params }: { params: { id: string; organizationid: string } }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // Track admin status
  const router = useRouter();

  // Fetch user data and check for admin role
  const fetchUserData = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      router.push("/login"); // Redirect if user is not logged in
    } else {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      } else {
        setIsAdmin(profileData?.role === "admin");
      }
    }
  };

  // Fetch profiles from the profiles table
  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles") // Fetch profiles
      .select("id, full_name, avatar_url")
      .eq("organization_id", params.organizationid); // Filter by organization_id

    if (data) {
      setProfiles(data); // Update state with the fetched profiles
    } else {
      console.error("Error fetching profiles:", error);
    }
  };

  // Fetch organization name from the organizations table
  const fetchOrganizationName = async () => {
    const { data, error } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", params.organizationid)
      .single();

    if (data) {
      setOrganizationName(data.name); // Update state with the organization name
    } else {
      console.error("Error fetching organization name:", error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data and check for admin role
  }, []);

  useEffect(() => {
    if (isAdmin !== null) {
      fetchProfiles(); // Fetch profiles after confirming admin status
      fetchOrganizationName(); // Fetch organization name
    }
  }, [isAdmin]);

  if (isAdmin === false) {
    return <div>You do not have permission to this page.</div>; // Show message if not admin
  }

  return (
    <main className="p-4">
      <h2 className="w-full text-center">Profiles in {organizationName}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
        {(isAdmin === null || !organizationName) &&
          Array.from({ length: 10 }, (_, index) => <ProfileCardSkeleton key={index} />)}
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </main>
  );
}
