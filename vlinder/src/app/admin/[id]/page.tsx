'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const supabase = createClient();

interface HealthcareWorker {
    id: string;
    name: string;
    organization_id: string;
}

export default function GreetingPage({ params }: { params: { id: string } }) {
    const [worker, setWorker] = useState<HealthcareWorker | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [accessDenied, setAccessDenied] = useState(false); // State to track if access is denied
    const router = useRouter();

    const fetchUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
            router.push('/login');
        } else {
            setUserId(data.user.id);
        }
    };

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

    const fetchWorkerData = async () => {
        const { data, error } = await supabase
            .from('healthcare_workers')
            .select('name, organization_id') // Fetch name and organization_id
            .eq('id', params.id)
            .single();

        if (data) {
            setWorker({ id: params.id, ...data }); // Add 'id' manually
        } else {
            console.error('Error fetching healthcare worker data:', error);
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
            setAccessDenied(true); // Set accessDenied to true if user is not an admin
        } else if (isAdmin === true) {
            fetchWorkerData();
        }
    }, [isAdmin]);

    const handleCheckActivitiesClick = () => {
        if (worker && worker.organization_id) {
            router.push(`/admin/${params.id}/checkactivities/${worker.organization_id}`);
        } else {
            alert('Organization ID not found!');
        }
    };

    const handleProfileClick = () => {
        if (worker && worker.organization_id) {
            router.push(`/admin/${params.id}/checkprofile/${worker.organization_id}`);
        } else {
            alert('Organization ID not found!');
        }
    };

    const handleCreateActivityClick = () => {
        router.push('/createactivity');
    };

    if (!worker && !accessDenied) {
        return <div style={styles.container}>Loading...</div>;
    }

    if (accessDenied) {
        return (
            <div style={styles.container}>
                <p>You do not have access to this page.</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.greeting}>Hello! {worker?.name}</h1>

            <button style={styles.button} onClick={handleProfileClick}>
                Check Profiles
            </button>

            <button style={styles.button} onClick={handleCheckActivitiesClick}>
                Check Activities
            </button>

            <button style={styles.button} onClick={handleCreateActivityClick}>
                Create Activity
            </button>
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
    greeting: {
        fontSize: '24px',
        color: '#333',
        marginBottom: '20px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    },
};
