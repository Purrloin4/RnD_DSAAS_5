'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

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
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <h1>Activities</h1>
            <div>
                {comingActivities.length > 0 ? (
                    comingActivities.map((activity) => (
                        <div key={activity.id} style={{ marginBottom: '15px', display: 'flex' }}>
                            <div style={{ flex: 1 }}>
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
                                        style={{
                                            marginTop: '10px',
                                            padding: '5px 10px',
                                            backgroundColor: '#dc3545',
                                            color: '#fff',
                                            border: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Quit
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleJoinActivity(activity.id)}
                                        style={{
                                            marginTop: '10px',
                                            padding: '5px 10px',
                                            backgroundColor: '#28a745',
                                            color: '#fff',
                                            border: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Join
                                    </button>
                                )}
                            </div>
                            <div style={{ flexShrink: 0, marginLeft: '20px' }}>
                                <img
                                    src={activity.picture_url}
                                    alt={activity.title}
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No upcoming activities.</p>
                )}
            </div>
        </div>
    );
}
