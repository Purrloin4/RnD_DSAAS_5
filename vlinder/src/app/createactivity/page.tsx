"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface Organization {
  id: string;
  name: string;
}

export default function CreateActivityPage() {
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [visibleOrganizations, setVisibleOrganizations] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        router.push("/login");
        return;
      }

      setUserId(userData.user.id);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching user role:", profileError);
      } else {
        setIsAdmin(profileData?.role === "admin");

        if (profileData?.role === "admin") {
          const { data: workerData, error: workerError } = await supabase
            .from("healthcare_workers")
            .select("organization_id")
            .eq("id", userData.user.id)
            .single();

          if (workerData) {
            setOrganizationId(workerData.organization_id);
            setVisibleOrganizations([workerData.organization_id]);
          } else {
            console.error("Error fetching organization ID:", workerError);
          }
        }
      }
    };

    const fetchOrganizations = async () => {
      const { data, error } = await supabase.from("organizations").select("*");
      if (data) {
        setOrganizations(data);
      } else {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchUserRole();
    fetchOrganizations();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleOrganizationToggle = (orgId: string) => {
    if (orgId === organizationId) return;

    setVisibleOrganizations((prev) => (prev.includes(orgId) ? prev.filter((id) => id !== orgId) : [...prev, orgId]));
  };

  const handleSelectAllOrganizations = () => {
    const allOrgIds = organizations.map((org) => org.id);
    setVisibleOrganizations((prev) => (allOrgIds.every((id) => prev.includes(id)) ? [organizationId!] : allOrgIds));
  };

  const handleSave = async () => {
    if (!organizationId) {
      console.error("Organization ID not found for the user");
      return;
    }

    try {
      const { data: activityData, error: activityError } = await supabase
        .from("activities")
        .insert([
          {
            title,
            place,
            time,
            description,
            organization_id: organizationId,
          },
        ])
        .select()
        .single();

      if (activityError || !activityData) {
        console.error("Failed to create activity:", activityError);
        return;
      }

      const activityId = activityData.id;

      let pictureUrl = null;
      if (imageFile) {
        pictureUrl = await uploadImage(activityId);
        if (pictureUrl) {
          await supabase.from("activities").update({ picture_url: pictureUrl }).eq("id", activityId);
        }
      }

      await Promise.all(
        visibleOrganizations.map((orgId) =>
          supabase.from("activity_organization").insert([{ activity_id: activityId, organization_id: orgId }])
        )
      );

      router.push(`/admin/${userId}/checkactivities/${organizationId}`);
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  const uploadImage = async (activityId: string): Promise<string | null> => {
    if (!imageFile) return null;

    const fileName = `${activityId}-${Date.now()}.${imageFile.name.split(".").pop()}`;
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("activity")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Failed to upload image:", uploadError.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage.from("activity").getPublicUrl(fileName);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error("Failed to retrieve public URL");
        return null;
      }

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Unexpected error during image upload:", err);
      return null;
    }
  };

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  if (isAdmin === false) {
    return <div>You do not have access to this page.</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.inputContainer}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} />
      </div>
      <div style={styles.inputContainer}>
        <label>Place:</label>
        <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} style={styles.input} />
      </div>
      <div style={styles.inputContainer}>
        <label>Time:</label>
        <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} style={styles.input} />
      </div>
      <div style={styles.inputContainer}>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={styles.textarea} />
      </div>
      <div style={styles.inputContainer}>
        <label>Upload Picture:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
      </div>
      <div style={styles.inputContainer}>
        <label>Visible Organizations:</label>
        <ul>
          {organizations.map((org) => (
            <li key={org.id}>
              <label>
                <input
                  type="checkbox"
                  checked={visibleOrganizations.includes(org.id)}
                  disabled={org.id === organizationId}
                  onChange={() => handleOrganizationToggle(org.id)}
                />
                {org.name}
                {org.id === organizationId && " (Your Organization)"}
              </label>
            </li>
          ))}
        </ul>
        <button onClick={handleSelectAllOrganizations} style={styles.selectAllButton}>
          Select All
        </button>
      </div>
      <button onClick={handleSave} style={styles.saveButton}>
        Create Activity
      </button>
      <div style={styles.emptySpace}></div>
    </div>
  );
}

const styles = {
  page: {
    width: "400px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  inputContainer: {
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "8px",
    marginTop: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  fileInput: {
    marginTop: "10px",
  },
  saveButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  selectAllButton: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  emptySpace: {
    height: "100px",
  },
};
