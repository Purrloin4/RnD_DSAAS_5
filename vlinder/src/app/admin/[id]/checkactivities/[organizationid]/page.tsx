"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import ActivityCard from "@/src/components/Admin/ActivityCard";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";

const supabase = createClient();

interface Activity {
  id: string;
  title: string;
  time: string;
  description: string;
  place: string;
  picture_url: string;
  organization_id: string;
}

interface UserActivity {
  user_id: string;
  activity_id: string;
}

interface UserWithActivity {
  user_id: string;
  activity_id: string;
  full_name: string;
  organization_name: string;
}

interface Worker {
  organization_id: string;
}

export default function CheckActivitiesPage({ params }: { params: { id: string; organizationid: string } }) {
  const [comingActivities, setComingActivities] = useState<Activity[]>([]);
  const [pastActivities, setPastActivities] = useState<Activity[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserWithActivity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [showComingActivities, setShowComingActivities] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const fetchUserData = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      router.push("/login");
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

  const fetchActivities = async () => {
    const { data: workerData, error: workerError } = await supabase
      .from("healthcare_workers")
      .select("organization_id")
      .eq("id", params.id)
      .single();

    if (workerData) {
      setWorker(workerData);
    } else {
      console.error("Error fetching worker data:", workerError);
    }

    const { data: activityOrgData, error: activityOrgError } = await supabase
      .from("activity_organization")
      .select("activity_id")
      .eq("organization_id", params.organizationid);

    if (activityOrgData) {
      const activityIds = activityOrgData.map((item) => item.activity_id);

      const { data: comingActivitiesData, error: comingActivitiesError } = await supabase
        .from("activities")
        .select("*")
        .in("id", activityIds)
        .gt("time", new Date().toISOString());

      if (comingActivitiesData) {
        setComingActivities(comingActivitiesData);
      } else {
        console.error("Error fetching coming activities:", comingActivitiesError);
      }

      const { data: pastActivitiesData, error: pastActivitiesError } = await supabase
        .from("activities")
        .select("*")
        .in("id", activityIds)
        .lt("time", new Date().toISOString());

      if (pastActivitiesData) {
        setPastActivities(pastActivitiesData);
      } else {
        console.error("Error fetching past activities:", pastActivitiesError);
      }
    } else {
      console.error("Error fetching activity organization data:", activityOrgError);
    }
  };

  const fetchUsersForActivity = async (activityId: string) => {
    setLoadingUsers(true);
    const { data, error } = await supabase.from("user_activity").select("user_id").eq("activity_id", activityId);

    if (data) {
      const userDetails = await Promise.all(
        data.map(async (item) => {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, organization_id")
            .eq("id", item.user_id)
            .single();

          if (profileError || !profileData) {
            console.error("Error fetching profile data:", profileError);
            return null;
          }

          const { data: organizationData, error: orgError } = await supabase
            .from("organizations")
            .select("name")
            .eq("id", profileData.organization_id)
            .single();

          if (orgError || !organizationData) {
            console.error("Error fetching organization data:", orgError);
            return null;
          }

          return {
            user_id: item.user_id,
            activity_id: activityId,
            full_name: profileData.full_name,
            organization_name: organizationData.name,
          };
        })
      );

      setSelectedUsers(userDetails.filter(Boolean) as UserWithActivity[]);
    } else {
      console.error("Error fetching users for activity:", error);
    }
    setLoadingUsers(false);
  };

  const handleActivitySelect = (activityId: string) => {
    if (activityId !== selectedActivityId) {
      setSelectedActivityId(activityId);
      fetchUsersForActivity(activityId);
    }
    onOpen();
  };

  const handleTabSwitch = (showComing: boolean) => {
    setShowComingActivities(showComing);
  };

  const handleEditActivity = (activityId: string) => {
    router.push(`/editactivity/${activityId}`);
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      try {
        await supabase.from("activity_organization").delete().eq("activity_id", activityId);
        await supabase.from("user_activity").delete().eq("activity_id", activityId);

        const { error } = await supabase.from("activities").delete().eq("id", activityId);
        if (error) {
          console.error("Error deleting activity:", error);
          return;
        }

        fetchActivities();
      } catch (err) {
        console.error("Error deleting activity:", err);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (isAdmin !== null) {
      fetchActivities();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin !== null && worker) {
      setLoading(false);
    }
  }, [isAdmin, worker]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAdmin === false) {
    return <div>You do not have permission to access this page.</div>;
  }

  if (!worker) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-4">
      <Button className="w-full mb-4" color="primary" onClick={() => setShowComingActivities(!showComingActivities)}>
        {showComingActivities ? "Show Past Activities" : "Show Comming Activities"}
      </Button>
      <div className="flex justify-center flex-wrap gap-4">
        {showComingActivities
          ? comingActivities.map((activity) => (
              <ActivityCard
                picture_url={activity.picture_url}
                title={activity.title}
                time={activity.time}
                place={activity.place}
                edit={() => handleEditActivity(activity.id)}
                deleteActivity={() => handleDeleteActivity(activity.id)}
                show_users={() => handleActivitySelect(activity.id)}
                canEdit={activity.organization_id === worker.organization_id}
              />
            ))
          : pastActivities.map((activity) => (
              <ActivityCard
                picture_url={activity.picture_url}
                title={activity.title}
                time={activity.time}
                place={activity.place}
                edit={() => handleEditActivity(activity.id)}
                deleteActivity={() => handleDeleteActivity(activity.id)}
                show_users={() => handleActivitySelect(activity.id)}
                canEdit={false}
              />
            ))}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Users</ModalHeader>
              <ModalBody>
                {loadingUsers ? (
                  <p>Loading users...</p>
                ) : selectedUsers.length > 0 ? (
                  <ul>
                    {selectedUsers.map((user) => (
                      <li key={user.user_id}>
                        {user.full_name} ({user.organization_name})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No user</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
