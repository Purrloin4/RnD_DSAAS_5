"use client";

import { Button } from "@nextui-org/button";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const supabase = createClient();

export default function Page() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); // Correct capitalization
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [accessDenied, setAccessDenied] = useState(false); // State to track if access is denied
  const router = useRouter();

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      router.push("/login"); // Redirect to login if user is not authenticated
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
      setAccessDenied(true); // Deny access if user is not an admin
    }
  }, [isAdmin]);

  if (accessDenied) {
    return (
      <div style={styles.container}>
        <p>You do not have access to this page.</p>
      </div>
    );
  }

  const handleButtonClick = async () => {
    try {
      // Fetch organization_id from healthcare_workers table using id
      const { data: workerData, error: workerError } = await supabase
        .from("healthcare_workers")
        .select("organization_id")
        .eq("id", userId) // Using 'id' instead of 'user_id'
        .single();

      if (workerError || !workerData) {
        console.error("Error fetching organization_id:", workerError);
        alert("Failed to fetch organization ID.");
        return;
      }

      const { organization_id } = workerData;

      // Insert a new row into accessToken table and return the id
      const { data, error } = await supabase
        .from("accessToken")
        .insert([
          {
            first_name: firstName,
            Last_name: lastName, // Correct capitalization
            email,
            organization_id,
            is_used: false, // Default value
          },
        ])
        .select("id") // Return the id of the inserted row
        .single();

      if (error || !data) {
        console.error("Error inserting into accessToken table:", error);
        alert("Failed to insert data into accessToken table.");
        return;
      }

      const { id: accessTokenId } = data;

      // Send email with accessTokenId included
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, accessTokenId }),
      });

      if (response.ok) {
        alert("Email sent and accessToken inserted successfully!");
      } else {
        alert("Email sent, but there was an error.");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <main style={styles.container}>
      <div>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email"
          />
        </label>
      </div>
      <div>
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter user first name"
          />
        </label>
      </div>
      <div>
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter user last name"
          />
        </label>
      </div>
      <Button onClick={handleButtonClick}>Send Email</Button>
    </main>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f8ff",
    fontFamily: "Arial, sans-serif",
  },
};
