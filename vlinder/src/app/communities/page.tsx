"use client";

import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, Skeleton } from "@nextui-org/react";
import { Button, Input, Link } from "@nextui-org/react";
import { Calendar } from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { format } from "date-fns";
import Image from "next/image";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";

import EnviromentStrings from "@/src/enums/envStrings";

const supabase = createClient();

interface UserActivity {
  activity_id: string;
  activities: {
    time: string;
  };
}

interface Activity {
  id: string;
  title: string;
  time: string;
  description: string;
  place: string;
  picture_url: string;
}

interface Organization {
  id: string;
  name: string;
}

export default function UserActivitiesPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [comingActivities, setComingActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [joinedActivities, setJoinedActivities] = useState<string[]>([]);
  const [activityOrganizations, setActivityOrganizations] = useState<Record<string, string[]>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const defaultDate = today(getLocalTimeZone());
  const [activityDates, setActivityDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.clientX - startX;
    scrollRef.current.scrollLeft = scrollLeft - x;
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    if (!scrollRef.current) return;

    const containerWidth = scrollRef.current.offsetWidth;
    const childWidth = scrollRef.current.firstChild ? (scrollRef.current.firstChild as HTMLElement).offsetWidth : 0;

    const currentScroll = scrollRef.current.scrollLeft;
    const snapPoint = Math.round(currentScroll / childWidth) * childWidth;

    scrollRef.current.scrollTo({
      left: snapPoint,
      behavior: "smooth",
    });
  };

  const fetchUserOrganization = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        router.push("/login");
        return null;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", userData.user.id)
        .single();

      if (profileError || !profileData) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error fetching organization:", profileError);
        }
        return null;
      }

      setUserId(userData.user.id);
      return profileData.organization_id;
    } catch (err) {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.error("Error fetching user organization:", err);
      }
      return null;
    }
  };

  const fetchActivities = async (organizationId: string) => {
    try {
      const { data: activityOrgData, error: activityOrgError } = await supabase
        .from("activity_organization")
        .select("activity_id")
        .eq("organization_id", organizationId);

      if (activityOrgError || !activityOrgData) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error fetching activity IDs:", activityOrgError);
        }
        return;
      }

      const activityIds = activityOrgData.map((item) => item.activity_id);

      const { data: comingActivitiesData, error: comingActivitiesError } = await supabase
        .from("activities")
        .select("*")
        .in("id", activityIds)
        .gt("time", new Date().toISOString());

      if (comingActivitiesData) {
        setComingActivities(comingActivitiesData);
        fetchActivityOrganizations(comingActivitiesData.map((a) => a.id));
      } else {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error fetching coming activities:", comingActivitiesError);
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.error("Error fetching activities:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityOrganizations = async (activityIds: string[]) => {
    try {
      const { data: activityOrgData, error: activityOrgError } = await supabase
        .from("activity_organization")
        .select("activity_id, organization_id")
        .in("activity_id", activityIds);

      if (activityOrgError || !activityOrgData) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error fetching activity organizations:", activityOrgError);
        }
        return;
      }

      const organizationIds = Array.from(new Set(activityOrgData.map((item) => item.organization_id)));

      const { data: organizationsData, error: organizationsError } = await supabase
        .from("organizations")
        .select("*")
        .in("id", organizationIds);

      if (organizationsError || !organizationsData) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error fetching organizations:", organizationsError);
        }
        return;
      }

      const organizationMap: Record<string, string> = organizationsData.reduce(
        (map, org) => ({ ...map, [org.id]: org.name }),
        {}
      );

      const activityToOrganizations: Record<string, string[]> = activityOrgData.reduce((map, item) => {
        //@ts-expect-error err
        if (!map[item.activity_id]) map[item.activity_id] = [];
        //@ts-expect-error err
        map[item.activity_id].push(organizationMap[item.organization_id]);
        return map;
      }, {});

      setActivityOrganizations(activityToOrganizations);
    } catch (err) {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.error("Error fetching activity organizations:", err);
      }
    }
  };

  const fetchJoinedActivities = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("user_activity").select("activity_id").eq("user_id", userId);

      if (error) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error fetching joined activities:", error);
        }
        return;
      }

      setJoinedActivities(data.map((item) => item.activity_id));
    } catch (err) {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.error("Error fetching joined activities:", err);
      }
    }
  };

  const handleJoinActivity = async (activityId: string) => {
    if (!userId) return;
    try {
      const { error } = await supabase.from("user_activity").insert([{ user_id: userId, activity_id: activityId }]);

      if (error) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error joining activity:", error);
        }
      } else {
        setJoinedActivities((prev) => [...prev, activityId]); // Update the state
      }
    } catch (err) {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.error("Error joining activity:", err);
      }
    }
  };

  const handleQuitActivity = async (activityId: string) => {
    if (!userId) return;
    try {
      const { error } = await supabase
        .from("user_activity")
        .delete()
        .eq("user_id", userId)
        .eq("activity_id", activityId);

      if (error) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error quitting activity:", error);
        }
      } else {
        setJoinedActivities((prev) => prev.filter((id) => id !== activityId));
      }
    } catch (err) {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.error("Error quitting activity:", err);
      }
    }
  };

  const fetchActivityDates = async (userId: string): Promise<string[]> => {
    try {
      const { data, error } = (await supabase
        .from("user_activity")
        .select(
          `
                    activity_id,
                    activities (time)
                `
        )
        .eq("user_id", userId)) as { data: UserActivity[] | null; error: any };

      if (error) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error fetching activity dates:", error);
        }
        return [];
      }

      if (!data) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.warn("No activity dates found for this user.");
        }
        return [];
      }

      const dates = data.map((item) => item.activities.time.split("T")[0]);
      return dates;
    } catch (err) {
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.error("Error in fetchActivityDates:", err);
      }
      return [];
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading1(true);
      try {
        const organizationId = await fetchUserOrganization();
        if (organizationId) {
          fetchActivities(organizationId);
          fetchJoinedActivities(userId!);
        }
      } catch (error) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Unexpected error fetching activities:", error);
        }
      } finally {
        setLoading1(false);
      }
    };
    init();
  }, [userId]);

  useEffect(() => {
    const updateActivityDates = async () => {
      setLoading2(true);
      try {
        const { data: userData, error } = await supabase.auth.getUser();
        if (error || !userData?.user) {
          if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
            console.error("Error fetching user or no user logged in:", error);
          }
          return;
        }

        const userId = userData.user.id;
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.log("Fetched User ID:", userId);
        }

        const dates = await fetchActivityDates(userId);

        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.log("Updated Activity Dates for User:", dates);
        }
        setActivityDates(dates);
      } catch (err) {
        if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
          console.error("Error updating activity dates:", err);
        }
      } finally {
        setLoading2(false);
      }
    };

    updateActivityDates();
  }, [joinedActivities]);

  const formatActivityTime = (isoString: string): string[] => {
    const date = new Date(isoString);
    const formattedDate = format(date, "EEEE, MMM d, yyyy");
    const formattedTime = format(date, "HH:mm");
    return [formattedDate, formattedTime];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-6 md:p-10 min-h-screenmin-h-screen">
      <h2>Activities</h2>
      <div className="-mx-6 md:-mx-10">
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll gap-x-4 items-start scrollbar-none scroll-snap-x-mandatory pl-6 md:pl-10"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {comingActivities.length > 0 ? (
            comingActivities.map((activity, index) => (
              <Card
                key={activity.id}
                className="relative flex-shrink-0 w-[85%] sm:w-[42.5%] md:w-[28.33%] h-[30vh] bg-white border border-gray-200 shadow-xl rounded-lg scroll-snap-start flex flex-col"
              >
                <div className="absolute top-4 right-4 bg-purple-500 text-white text-sm font-bold rounded-lg p-2">
                  {activityOrganizations[activity.id]
                    ? activityOrganizations[activity.id].join(", ")
                    : "Unknown Organizer"}
                </div>

                <div className="w-full h-2/3 overflow-hidden rounded-t-lg">
                  <Image
                    width={1000}
                    height={1000}
                    src={activity.picture_url}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full flex flex-col justify-start items-start p-4">
                  <div className="flex flex-col flex-1">
                    <h3 className="text-lg font-semibold truncate">{activity.title}</h3>
                    {(() => {
                      const [formattedDate, formattedTime] = formatActivityTime(activity.time);
                      return (
                        <p className="text-sm text-gray-500">{`At ${activity.place}, ${formattedTime} ${formattedDate}`}</p>
                      );
                    })()}
                    <p className="text-gray-600 line-clamp-3 overflow-hidden text-ellipsis text-wrap truncate break-all mb-4">
                      {activity.description}
                    </p>
                  </div>

                  <div className="w-full flex flex-row justify-end">
                    {joinedActivities.includes(activity.id) ? (
                      <Button
                        size="md"
                        className="bg-red-500"
                        aria-label="quit-button"
                        onClick={() => handleQuitActivity(activity.id)}
                      >
                        Quit
                      </Button>
                    ) : (
                      <Button
                        size="md"
                        className="btn-primary"
                        aria-label="join-button"
                        onClick={() => handleJoinActivity(activity.id)}
                      >
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p>No upcoming activities.</p>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h2>Your Calendar</h2>

        <div className="mt-8 flex flex-col items-center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              shouldDisableDate={(date) => {
                const formattedDate = date?.format("YYYY-MM-DD");
                return !activityDates.includes(formattedDate);
              }}
            />
          </LocalizationProvider>
        </div>
      </div>
    </main>
  );
}
