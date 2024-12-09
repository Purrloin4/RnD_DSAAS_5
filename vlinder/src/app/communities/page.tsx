'use client';

import React, { useState, useRef, useEffect } from 'react';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";


const supabase = createClient();

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
    const childWidth = scrollRef.current.firstChild
      ? (scrollRef.current.firstChild as HTMLElement).offsetWidth
      : 0;

    const currentScroll = scrollRef.current.scrollLeft;
    const snapPoint = Math.round(currentScroll / childWidth) * childWidth;

    scrollRef.current.scrollTo({
      left: snapPoint,
      behavior: "smooth",
    });
  };


    const [comingActivities, setComingActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [joinedActivities, setJoinedActivities] = useState<string[]>([]);
    const [activityOrganizations, setActivityOrganizations] = useState<Record<string, string[]>>(
        {}
    ); // Maps activity ID to organization names
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();

    const fetchUserOrganization = async () => {
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData?.user) {
                router.push('/login');
                return null;
            }

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('organization_id')
                .eq('id', userData.user.id)
                .single();

            if (profileError || !profileData) {
                console.error('Error fetching organization:', profileError);
                return null;
            }

            setUserId(userData.user.id);
            return profileData.organization_id;
        } catch (err) {
            console.error('Error fetching user organization:', err);
            return null;
        }
    };

    const fetchActivities = async (organizationId: string) => {
        try {
            const { data: activityOrgData, error: activityOrgError } = await supabase
                .from('activity_organization')
                .select('activity_id')
                .eq('organization_id', organizationId);

            if (activityOrgError || !activityOrgData) {
                console.error('Error fetching activity IDs:', activityOrgError);
                return;
            }

            const activityIds = activityOrgData.map((item) => item.activity_id);

            const { data: comingActivitiesData, error: comingActivitiesError } = await supabase
                .from('activities')
                .select('*')
                .in('id', activityIds)
                .gt('time', new Date().toISOString());

            if (comingActivitiesData) {
                setComingActivities(comingActivitiesData);
                fetchActivityOrganizations(comingActivitiesData.map((a) => a.id));
            } else {
                console.error('Error fetching coming activities:', comingActivitiesError);
            }
        } catch (err) {
            console.error('Error fetching activities:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchActivityOrganizations = async (activityIds: string[]) => {
        try {
            const { data: activityOrgData, error: activityOrgError } = await supabase
                .from('activity_organization')
                .select('activity_id, organization_id')
                .in('activity_id', activityIds);

            if (activityOrgError || !activityOrgData) {
                console.error('Error fetching activity organizations:', activityOrgError);
                return;
            }

            const organizationIds = Array.from(
                new Set(activityOrgData.map((item) => item.organization_id))
            );

            const { data: organizationsData, error: organizationsError } = await supabase
                .from('organizations')
                .select('*')
                .in('id', organizationIds);

            if (organizationsError || !organizationsData) {
                console.error('Error fetching organizations:', organizationsError);
                return;
            }

            const organizationMap: Record<string, string> = organizationsData.reduce(
                (map, org) => ({ ...map, [org.id]: org.name }),
                {}
            );

            const activityToOrganizations: Record<string, string[]> = activityOrgData.reduce(
                (map, item) => {
                    //@ts-expect-error it works
                    if (!map[item.activity_id]) map[item.activity_id] = [];
                    //@ts-expect-error it works
                    map[item.activity_id].push(organizationMap[item.organization_id]);
                    return map;
                },
                {}
            );

            setActivityOrganizations(activityToOrganizations);
        } catch (err) {
            console.error('Error fetching activity organizations:', err);
        }
    };

    const fetchJoinedActivities = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('user_activity')
                .select('activity_id')
                .eq('user_id', userId);

            if (error) {
                console.error('Error fetching joined activities:', error);
                return;
            }

            setJoinedActivities(data.map((item) => item.activity_id));
        } catch (err) {
            console.error('Error fetching joined activities:', err);
        }
    };

    const handleJoinActivity = async (activityId: string) => {
        if (!userId) return;
        try {
            const { error } = await supabase
                .from('user_activity')
                .insert([{ user_id: userId, activity_id: activityId }]);

            if (error) {
                console.error('Error joining activity:', error);
            } else {
                setJoinedActivities((prev) => [...prev, activityId]);
            }
        } catch (err) {
            console.error('Error joining activity:', err);
        }
    };

    const handleQuitActivity = async (activityId: string) => {
        if (!userId) return;
        try {
            const { error } = await supabase
                .from('user_activity')
                .delete()
                .eq('user_id', userId)
                .eq('activity_id', activityId);

            if (error) {
                console.error('Error quitting activity:', error);
            } else {
                setJoinedActivities((prev) => prev.filter((id) => id !== activityId));
            }
        } catch (err) {
            console.error('Error quitting activity:', err);
        }
    };

    useEffect(() => {
        const init = async () => {
            const organizationId = await fetchUserOrganization();
            if (organizationId) {
                fetchActivities(organizationId);
                fetchJoinedActivities(userId!);
            }
        };
        init();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='p-6 md:p-10 min-h-screenmin-h-screen'>
            <h2>Activities</h2>
            <div className='-mx-6 md:-mx-10'>
            <div 
                ref={scrollRef}
                className='flex overflow-x-scroll gap-x-4 items-start scrollbar-none scroll-snap-x-mandatory pl-6 md:pl-10'
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}>
                {comingActivities.length > 0 ? (
                    comingActivities.map((activity, index) => (
                        <Card key={activity.id} className={`flex-shrink-0 w-[85%] md:w-[45%] h-80 bg-white border border-gray-200 shadow-lg rounded-lg scroll-snap-start ${
                            index === comingActivities.length - 1 ? "mr-0" : "mr-4"
                          }`}>
                            <div>
                                <h3>{activity.title}</h3>
                                <p>{activity.time}</p>
                                <p>{activity.description}</p>
                                <p>{activity.place}</p>
                                {activityOrganizations[activity.id] && (
                                    <p>
                                        Open to: {activityOrganizations[activity.id].join(', ')}
                                    </p>
                                )}
                                {joinedActivities.includes(activity.id) ? (
                                    <button
                                        onClick={() => handleQuitActivity(activity.id)}
                                        
                                    >
                                        Quit
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleJoinActivity(activity.id)}
                                        
                                    >
                                        Join
                                    </button>
                                )}
                            </div>
                            <div>
                                <img
                                    src={activity.picture_url}
                                    alt={activity.title}
                                    
                                />
                            </div>
                        </Card>
                    ))
                ) : (
                    <p>No upcoming activities.</p>
                )}
            </div>
            </div>
        </div>
    );
}
