'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const supabase = createClient();

interface Profile {
    id: string;
    full_name: string;
    avatar_url: string;
}

export default function CheckProfilePage({ params }: { params: { id: string; organizationid: string } }) {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [organizationName, setOrganizationName] = useState<string | null>(null);
    const router = useRouter();

    // Fetch profiles from the profiles table
    const fetchProfiles = async () => {
        const { data, error } = await supabase
            .from('profiles') // Fetch profiles
            .select('id, full_name, avatar_url')
            .eq('organization_id', params.organizationid); // Filter by organization_id

        if (data) {
            setProfiles(data); // Update state with the fetched profiles
        } else {
            console.error('Error fetching profiles:', error);
        }
    };

    // Fetch organization name from the organizations table
    const fetchOrganizationName = async () => {
        const { data, error } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', params.organizationid)
            .single();

        if (data) {
            setOrganizationName(data.name); // Update state with the organization name
        } else {
            console.error('Error fetching organization name:', error);
        }
    };

    useEffect(() => {
        fetchProfiles();
        fetchOrganizationName();
    }, []);

    const handleViewProfile = (id: string) => {
        router.push(`/profile/${id}`); // Navigate to the specific profile page
    };

    if (!organizationName) {
        return <div style={styles.container}>Loading organization details...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Profiles in {organizationName}</h1>
            <div style={styles.profileList}>
                {profiles.map((profile) => (
                    <div key={profile.id} style={styles.profileCard}>
                        <img
                            src={profile.avatar_url || '/default-avatar.png'}
                            alt="Avatar"
                            style={styles.avatar}
                        />
                        <div style={styles.info}>
                            <h3 style={styles.name}>{profile.full_name}</h3>
                            <button style={styles.button} onClick={() => handleViewProfile(profile.id)}>
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    },
    profileList: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '15px',
        width: '100%',
        maxWidth: '600px',
    },
    profileCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        objectFit: 'cover' as const,
    },
    info: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-start',
    },
    name: {
        margin: 0,
        fontSize: '18px',
        color: '#333',
    },
    button: {
        marginTop: '5px',
        padding: '5px 10px',
        fontSize: '14px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};
