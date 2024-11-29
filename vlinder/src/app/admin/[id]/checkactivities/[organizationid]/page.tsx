'use client'

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

interface Organization {
    name: string;
}

export default function CheckActivitiesPage({
    params,
}: {
    params: { id: string; organizationid: string };
}) {
    const [comingActivities, setComingActivities] = useState<Activity[]>([]);
    const [pastActivities, setPastActivities] = useState<Activity[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserWithActivity[]>([]);
    const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
    const [showComingActivities, setShowComingActivities] = useState(true);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [worker, setWorker] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(false); // Add loading state for users
    const router = useRouter();

    // Fetch user data and check for admin role
    const fetchUserData = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
            router.push('/login');
        } else {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userData.user.id)
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
            } else {
                setIsAdmin(profileData?.role === 'admin');
            }
        }
    };

    const fetchActivities = async () => {
        // Fetch worker's organization ID
        const { data: workerData, error: workerError } = await supabase
            .from('healthcare_workers')
            .select('organization_id')
            .eq('id', params.id)
            .single();

        if (workerData) {
            setWorker(workerData); // Store worker data
        } else {
            console.error('Error fetching worker data:', workerError);
        }

        // Fetch activity IDs associated with the organization
        const { data: activityOrgData, error: activityOrgError } = await supabase
            .from('activity_organization')
            .select('activity_id')
            .eq('organization_id', params.organizationid);

        if (activityOrgData) {
            const activityIds = activityOrgData.map((item) => item.activity_id);

            // Fetch upcoming activities (future events)
            const { data: comingActivitiesData, error: comingActivitiesError } = await supabase
                .from('activities')
                .select('*')
                .in('id', activityIds)
                .gt('time', new Date().toISOString());

            if (comingActivitiesData) {
                setComingActivities(comingActivitiesData);
            } else {
                console.error('Error fetching coming activities:', comingActivitiesError);
            }

            // Fetch past activities (past events)
            const { data: pastActivitiesData, error: pastActivitiesError } = await supabase
                .from('activities')
                .select('*')
                .in('id', activityIds)
                .lt('time', new Date().toISOString());

            if (pastActivitiesData) {
                setPastActivities(pastActivitiesData);
            } else {
                console.error('Error fetching past activities:', pastActivitiesError);
            }
        } else {
            console.error('Error fetching activity organization data:', activityOrgError);
        }
    };

    const fetchUsersForActivity = async (activityId: string) => {
        setLoadingUsers(true); // Start loading users
        const { data, error } = await supabase
            .from('user_activity')
            .select('user_id')
            .eq('activity_id', activityId);

        if (data) {
            const userDetails = await Promise.all(
                data.map(async (item) => {
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('full_name, organization_id')
                        .eq('id', item.user_id)
                        .single();

                    if (profileError || !profileData) {
                        console.error('Error fetching profile data:', profileError);
                        return null;
                    }

                    const { data: organizationData, error: orgError } = await supabase
                        .from('organizations')
                        .select('name')
                        .eq('id', profileData.organization_id)
                        .single();

                    if (orgError || !organizationData) {
                        console.error('Error fetching organization data:', orgError);
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
            console.error('Error fetching users for activity:', error);
        }
        setLoadingUsers(false); // Stop loading users
    };

    const handleActivitySelect = (activityId: string) => {
        if (activityId !== selectedActivityId) {
            setSelectedActivityId(activityId);
            fetchUsersForActivity(activityId);
        }
    };

    const handleTabSwitch = (showComing: boolean) => {
        setShowComingActivities(showComing);
    };

    const handleEditActivity = (activityId: string) => {
        console.log(`Editing activity with ID: ${activityId}`);
        router.push(`/editactivity/${activityId}`);
    };

    useEffect(() => {
        fetchUserData(); // Fetch user data and check for admin role
    }, []);

    useEffect(() => {
        if (isAdmin !== null) {
            fetchActivities(); // Only fetch activities after confirming admin status
        }
    }, [isAdmin]);

    useEffect(() => {
        if (isAdmin !== null && worker) {
            setLoading(false); // Set loading to false once data is loaded
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
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <h1>Check Activities</h1>

            {/* Toggle between Coming and Past Activities */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    onClick={() => handleTabSwitch(true)}
                    style={{ padding: '10px 20px' }}
                >
                    Coming Activities
                </button>
                <button
                    onClick={() => handleTabSwitch(false)}
                    style={{ padding: '10px 20px' }}
                >
                    Past Activities
                </button>
            </div>

            {/* Display Coming Activities */}
            {showComingActivities ? (
                <div>
                    {comingActivities.length > 0 ? (
                        comingActivities.map((activity) => (
                            <div key={activity.id} style={{ marginBottom: '15px', display: 'flex' }}>
                                <div style={{ flex: 1 }}>
                                    <h3>{activity.title}</h3>
                                    <p>{activity.time}</p>
                                    <p>{activity.description}</p>
                                    <p>{activity.place}</p>

                                    {activity.organization_id === worker.organization_id && (
                                        <button
                                            onClick={() => handleEditActivity(activity.id)}
                                            style={{
                                                marginTop: '10px',
                                                padding: '5px 10px',
                                                backgroundColor: '#28a745',
                                                color: '#fff',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Edit Activity
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleActivitySelect(activity.id)}
                                        style={{
                                            marginTop: '10px',
                                            padding: '5px 10px',
                                            backgroundColor: '#17a2b8',
                                            color: '#fff',
                                            border: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Show Users
                                    </button>

                                    {selectedActivityId === activity.id && loadingUsers && (
                                        <p>Loading users...</p>
                                    )}

                                    {selectedActivityId === activity.id && !loadingUsers && selectedUsers.length > 0 && (
                                        <ul>
                                            {selectedUsers.map((user) => (
                                                <li key={user.user_id}>
                                                    {user.full_name} ({user.organization_name})
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Right-aligned Image */}
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
            ) : (
                <div>
                    {pastActivities.length > 0 ? (
                        pastActivities.map((activity) => (
                            <div key={activity.id} style={{ marginBottom: '15px', display: 'flex' }}>
                                <div style={{ flex: 1 }}>
                                    <h3>{activity.title}</h3>
                                    <p>{activity.time}</p>
                                    <p>{activity.description}</p>
                                    <p>{activity.place}</p>
                                </div>

                                {/* Right-aligned Image */}
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
                        <p>No past activities.</p>
                    )}
                </div>
            )}
        </div>
    );
}
