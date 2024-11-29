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
    organization_ids: string[];  // Store related organization_ids
}

export default function EditActivityPage({ params }: { params: { activityId: string } }) {
    const [activity, setActivity] = useState<Activity | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [accessDenied, setAccessDenied] = useState(false); // Track access denial
    const [loading, setLoading] = useState(true);  // To handle loading state
    const router = useRouter();

    // Fetch current user and check if they are an admin
    const fetchUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
            router.push('/login');
        } else {
            setUserId(data.user.id);
        }
    };

    // Fetch user role to check if they are admin
    const fetchUserRole = async () => {
        if (userId) {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user role:', error);
            } else {
                setIsAdmin(data?.role === 'admin');
            }
        }
    };

    // Fetch activity details from the activities table and related organizations
    const fetchActivityData = async () => {
        console.log('Fetching activity data...');  // Debugging line

        // Fetch basic activity details
        const { data: activityData, error: activityError } = await supabase
            .from('activities')
            .select('id, title, time, description, place, picture_url')
            .eq('id', params.activityId)
            .single();

        if (activityError) {
            console.error('Error fetching activity:', activityError);
            setLoading(false);
            return;
        }

        console.log('Activity data:', activityData);  // Debugging line to check activity data

        // Set activity data
        setActivity({
            id: activityData.id,
            title: activityData.title,
            time: activityData.time,
            description: activityData.description,
            place: activityData.place,
            picture_url: activityData.picture_url,
            organization_ids: [],  // Initialize with an empty array for organization IDs
        });

        // Fetch related organizations from activity_organization
        const { data: organizationsData, error: orgError } = await supabase
            .from('activity_organization')
            .select('organization_id')
            .eq('activity_id', params.activityId);

        if (orgError) {
            console.error('Error fetching activity organizations:', orgError);
            setLoading(false);
            return;
        }

        console.log('Organization data:', organizationsData);  // Debugging line to check organization data

        // Update the activity with the organization_ids
        setActivity((prevState) => ({
            ...prevState!,
            organization_ids: organizationsData.map((org) => org.organization_id),
        }));

        setLoading(false);  // Finished loading
    };

    useEffect(() => {
        fetchUser();  // Fetch current user details
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUserRole();  // Fetch user role after user ID is available
        }
    }, [userId]);

    useEffect(() => {
        if (isAdmin === false) {
            setAccessDenied(true);  // If not admin, deny access
        } else if (isAdmin === true) {
            fetchActivityData();  // Fetch activity data if user is admin
        }
    }, [isAdmin]);

    useEffect(() => {
        if (accessDenied) {
            console.log('Access Denied. User is not an admin.');
        }
    }, [accessDenied]);

    // Handle saving changes to the activity
    const handleSaveChanges = async () => {
        if (activity) {
            // Update activity details in the activities table
            const { error: updateError } = await supabase
                .from('activities')
                .update({
                    title: activity.title,
                    time: activity.time,
                    description: activity.description,
                    place: activity.place,
                    picture_url: activity.picture_url,
                })
                .eq('id', params.activityId);

            if (updateError) {
                console.error('Error updating activity:', updateError);
                alert('Failed to update activity');
                return;
            }

            // Remove old associations in activity_organization table
            const { error: deleteError } = await supabase
                .from('activity_organization')
                .delete()
                .eq('activity_id', params.activityId);

            if (deleteError) {
                console.error('Error deleting old organizations:', deleteError);
                alert('Failed to delete old organizations');
                return;
            }

            // Add new associations for organizations selected by user
            const organizationInserts = activity.organization_ids.map((orgId) => ({
                activity_id: params.activityId,
                organization_id: orgId,
            }));

            const { error: insertError } = await supabase
                .from('activity_organization')
                .upsert(organizationInserts);

            if (insertError) {
                console.error('Error inserting new organizations:', insertError);
                alert('Failed to update organizations');
                return;
            }

            alert('Activity updated successfully');
            router.push(`/admin/activities`);  // Redirect to activities list page
        }
    };

    if (accessDenied) {
        return (
            <div style={styles.container}>
                <p>You do not have permission to edit this activity.</p>
            </div>
        );
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h1>Edit Activity</h1>
            <div style={styles.formContainer}>
                <label style={styles.label}>
                    Title:
                    <input
                        style={styles.input}
                        type="text"
                        value={activity?.title || ''}
                        onChange={(e) => setActivity({ ...activity!, title: e.target.value })}
                    />
                </label>
                <label style={styles.label}>
                    Time:
                    <input
                        style={styles.input}
                        type="datetime-local"
                        value={activity?.time || ''}
                        onChange={(e) => setActivity({ ...activity!, time: e.target.value })}
                    />
                </label>
                <label style={styles.label}>
                    Description:
                    <textarea
                        style={styles.textarea}
                        value={activity?.description || ''}
                        onChange={(e) => setActivity({ ...activity!, description: e.target.value })}
                    />
                </label>
                <label style={styles.label}>
                    Place:
                    <input
                        style={styles.input}
                        type="text"
                        value={activity?.place || ''}
                        onChange={(e) => setActivity({ ...activity!, place: e.target.value })}
                    />
                </label>
                <label style={styles.label}>
                    Picture URL:
                    <input
                        style={styles.input}
                        type="text"
                        value={activity?.picture_url || ''}
                        onChange={(e) => setActivity({ ...activity!, picture_url: e.target.value })}
                    />
                </label>
                <label style={styles.label}>
                    Organizations:
                    <input
                        style={styles.input}
                        type="text"
                        value={activity?.organization_ids.join(', ') || ''}
                        onChange={(e) => setActivity({ ...activity!, organization_ids: e.target.value.split(',').map(id => id.trim()) })}
                    />
                </label>

                <button style={styles.button} onClick={handleSaveChanges}>Save Changes</button>
            </div>
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
        backgroundColor: '#f0f8ff',
        fontFamily: 'Arial, sans-serif',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        width: '400px',  // Adjust width for a cleaner form
    },
    label: {
        marginBottom: '15px',  // Space between form fields
    },
    input: {
        padding: '8px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    textarea: {
        padding: '8px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        height: '100px',  // Adjust height for textarea
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
    },
};
