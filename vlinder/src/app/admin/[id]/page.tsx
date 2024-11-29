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
    const router = useRouter();

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
        fetchWorkerData();
    }, []);

    const handleCheckActivitiesClick = () => {
        if (worker && worker.organization_id) {
            // Navigate to the Check Activities page
            router.push(`/admin/${params.id}/checkactivities/${worker.organization_id}`);
        } else {
            alert('Organization ID not found!');
        }
    };

    const handleProfileClick = () => {
        if (worker && worker.organization_id) {
            // Navigate to the Organization Profile page
            router.push(`/admin/${params.id}/checkprofile/${worker.organization_id}`);
        } else {
            alert('Organization ID not found!');
        }
    };

    if (!worker) {
        return <div style={styles.container}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.greeting}>Hello! {worker.name}</h1>

            {/* Go to Organization Profile Button */}
            <button style={styles.button} onClick={handleProfileClick}>
                Check Profiles
            </button>

            {/* Check Activities Button */}
            <button style={styles.button} onClick={handleCheckActivitiesClick}>
                Check Activities
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
