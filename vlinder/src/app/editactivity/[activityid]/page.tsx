"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface Activity {
  id: string;
  title: string;
  place: string;
  time: string;
  description: string;
  picture_url: string | null;
}

interface Organization {
  id: string;
  name: string;
}

export default function EditActivityPage() {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [visibleOrganizations, setVisibleOrganizations] = useState<string[]>(
    []
  );
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const params = useParams();
  const activityId = params.activityid;

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
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
          } else {
            console.error("Error fetching organization ID:", workerError);
          }
        }
      }
    };

    fetchUserRole();
  }, [router]);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!activityId) return;

      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("id", activityId)
        .single();

      if (data) {
        setActivity(data);
      } else {
        console.error("Error fetching activity:", error);
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

    const fetchVisibleOrganizations = async () => {
      if (!activityId) return;

      const { data, error } = await supabase
        .from("activity_organization")
        .select("organization_id")
        .eq("activity_id", activityId);

      if (data) {
        setVisibleOrganizations(data.map((item) => item.organization_id));
      } else {
        console.error("Error fetching visible organizations:", error);
      }
    };

    if (isAdmin) {
      fetchActivity();
      fetchOrganizations();
      fetchVisibleOrganizations();
    }
  }, [activityId, isAdmin]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setActivity((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleOrganizationToggle = async (orgId: string) => {
    if (orgId === organizationId) return;

    const isCurrentlyVisible = visibleOrganizations.includes(orgId);

    if (isCurrentlyVisible) {
      const { error } = await supabase
        .from("activity_organization")
        .delete()
        .eq("activity_id", activityId)
        .eq("organization_id", orgId);

      if (!error) {
        setVisibleOrganizations((prev) => prev.filter((id) => id !== orgId));
      } else {
        console.error("Error removing visibility:", error);
      }
    } else {
      const { error } = await supabase
        .from("activity_organization")
        .insert([{ activity_id: activityId, organization_id: orgId }]);

      if (!error) {
        setVisibleOrganizations((prev) => [...prev, orgId]);
      } else {
        console.error("Error adding visibility:", error);
      }
    }
  };

  const handleSelectAllOrganizations = async () => {
    const allOrgIds = organizations.map((org) => org.id);
    const visibleOrgIds = new Set(visibleOrganizations);

    const orgsToAdd = allOrgIds.filter((id) => !visibleOrgIds.has(id));

    try {
      await Promise.all(
        orgsToAdd.map((orgId) =>
          supabase
            .from("activity_organization")
            .insert([{ activity_id: activityId, organization_id: orgId }])
        )
      );
      setVisibleOrganizations(allOrgIds);
    } catch (error) {
      console.error("Error making all organizations visible:", error);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !activity) return null;

    const fileName = `${activity.id}-${Date.now()}.${imageFile.name.split(".").pop()}`;
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("activity")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Failed to upload image:", uploadError.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from("activity")
        .getPublicUrl(fileName);

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

  const handleSave = async () => {
    let pictureUrl = activity?.picture_url || null;

    if (imageFile) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) pictureUrl = uploadedUrl;
    }

    if (activity && organizationId && userId) {
      const { error } = await supabase
        .from("activities")
        .update({ ...activity, picture_url: pictureUrl })
        .eq("id", activity.id);

      if (error) {
        console.error("Failed to update activity:", error.message);
      } else {
        router.push(`/admin/${userId}/checkactivities/${organizationId}`);
      }
    }
  };

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  if (isAdmin === false) {
    return <div>You do not have access to this page.</div>;
  }

  if (!activity) {
    return <div>Loading activity...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.inputContainer}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={activity.title}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.inputContainer}>
        <label>Place:</label>
        <input
          type="text"
          name="place"
          value={activity.place}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.inputContainer}>
        <label>Time:</label>
        <input
          type="datetime-local"
          name="time"
          value={activity.time.replace(" ", "T")}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.inputContainer}>
        <label>Description:</label>
        <textarea
          name="description"
          value={activity.description}
          onChange={handleChange}
          style={styles.textarea}
        />
      </div>
      <div style={styles.inputContainer}>
        <label>Current Picture:</label>
        {activity.picture_url ? (
          <img
            src={activity.picture_url}
            alt="Activity"
            style={{ width: "200px", height: "150px", objectFit: "cover" }}
          />
        ) : (
          <div>No picture uploaded</div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.fileInput}
        />
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
        <button
          onClick={handleSelectAllOrganizations}
          style={styles.selectAllButton}
        >
          Select All
        </button>
      </div>
      <button onClick={handleSave} style={styles.saveButton}>
        Save
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
