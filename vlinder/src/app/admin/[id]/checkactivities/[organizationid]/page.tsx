'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const supabase = createClient();

interface Activity {
    id: string;
    title: string;
    time: string;
    visibility: string;
    visible_to_organizations: string[];
    organization_id: string;
}

interface UserActivity {
    user_id: string;
    activity_id: string;  // Ensure activity_id is part of the interface
}

export default function CheckActivitiesPage({
    params,
}: {
    params: { id: string; organizationid: string };
}) {
    const [comingActivities, setComingActivities] = useState<Activity[]>([]);
    const [pastActivities, setPastActivities] = useState<Activity[]>([]);
    const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
    const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
    const [worker, setWorker] = useState<any | null>(null);
    const [showComingActivities, setShowComingActivities] = useState(true); // Track the selected tab
    const router = useRouter();

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

        // Fetch coming activities (visibility = 'all' or visibility = 'specific')
        const { data: allActivities, error: activitiesError } = await supabase
            .from('activities')
            .select('*')
            .or(`visibility.eq.all,visibility.eq.specific`)
            .filter('visible_to_organizations', 'cs', `{${params.organizationid}}`)
            .gt('time', new Date().toISOString()); // Fetch activities after current time

        // Fetch coming activities with visibility = 'all'
        const { data: allActivitiesNoFilter, error: activitiesErrorNoFilter } = await supabase
            .from('activities')
            .select('*')
            .eq('visibility', 'all')
            .gt('time', new Date().toISOString()); // Fetch activities after current time

        // Merge both results into one list for coming activities
        const mergedActivities = [
            ...(allActivities || []), // activities with visibility = 'specific'
            ...(allActivitiesNoFilter || []), // activities with visibility = 'all'
        ];

        if (mergedActivities) {
            setComingActivities(mergedActivities);
        } else {
            console.error('Error fetching coming activities:', activitiesError || activitiesErrorNoFilter);
        }

        // Fetch past activities
        const { data: pastActivitiesData, error: pastActivitiesError } = await supabase
            .from('activities')
            .select('*')
            .lt('time', new Date().toISOString()); // Fetch activities before current time

        if (pastActivitiesData) {
            setPastActivities(pastActivitiesData);
        } else {
            console.error('Error fetching past activities:', pastActivitiesError);
        }
    };

    const fetchUserActivities = async (activityId: string) => {
        const { data, error } = await supabase
            .from('user_activity')
            .select('user_id, activity_id')  // Make sure both user_id and activity_id are fetched
            .eq('activity_id', activityId);

        if (data) {
            setUserActivities(data);  // Set the data to userActivities state
        } else {
            console.error('Error fetching user activities:', error);
        }
    };

    const handleActivitySelect = (activityId: string) => {
        setSelectedActivityId(activityId);
        fetchUserActivities(activityId);  // Fetch user activities when an activity is selected
    };

    const handleEditActivity = (activityId: string) => {
        if (worker && worker.organization_id) {
            router.push(`/admin/${params.id}/editactivity/${activityId}`);
        } else {
            alert('Activity ID not found!');
        }
    };

    const handleTabSwitch = (showComing: boolean) => {
        setShowComingActivities(showComing);
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    if (!worker) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Check Activities</h1>
            
            {/* Toggle between Coming and Past Activities */}
            <div style={styles.tabs}>
                <button 
                    style={styles.tabButton} 
                    onClick={() => handleTabSwitch(true)}
                >
                    Coming Activities
                </button>
                <button 
                    style={styles.tabButton} 
                    onClick={() => handleTabSwitch(false)}
                >
                    Past Activities
                </button>
            </div>

            {/* Display Coming Activities */}
            {showComingActivities ? (
                <div style={styles.activitiesList}>
                    {comingActivities.length > 0 ? (
                        comingActivities.map((activity) => (
                            <div key={activity.id} style={styles.activityItem}>
                                <h3>{activity.title}</h3>
                                <p>{activity.time}</p>

                                {/* If activity belongs to the user's organization, show the edit button */}
                                {activity.organization_id === worker.organization_id && (
                                    <button
                                        onClick={() => handleEditActivity(activity.id)}
                                        style={styles.editButton}
                                    >
                                        Edit Activity
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No upcoming activities.</p>
                    )}
                </div>
            ) : (
                <div style={styles.activitiesList}>
                    {pastActivities.length > 0 ? (
                        pastActivities.map((activity) => (
                            <div key={activity.id} style={styles.activityItem}>
                                <h3>{activity.title}</h3>
                                <p>{activity.time}</p>
                            </div>
                        ))
                    ) : (
                        <p>No past activities.</p>
                    )}
                </div>
            )}

            {/* Dropdown to select an activity and view users */}
            {selectedActivityId && (
                <div style={styles.userList}>
                    <h3>Users Interested in {comingActivities.find(a => a.id === selectedActivityId)?.title}</h3>
                    <ul>
                        {userActivities.map((userActivity) => (
                            <li key={userActivity.user_id}>
                                User ID: {userActivity.user_id}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '24px',
        color: '#333',
        marginBottom: '20px',
    },
    tabs: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
    },
    tabButton: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
    },
    activitiesList: {
        width: '100%',
        marginTop: '20px',
        padding: '0 20px',
    },
    activityItem: {
        borderBottom: '1px solid #ccc',
        padding: '10px 0',
    },
    editButton: {
        marginTop: '10px',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    userList: {
        marginTop: '30px',
    },
};
