'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import ProfileDetail from 'Components/ProfileDetail';

const supabase = createClient();

interface UserProfile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    sexual_orientation: string;
    display_disability: boolean;
    disability: string[];
    hobbies: string[];
    smoker: boolean;
    birthday: string;
    gender: string;
    need_assistance: boolean;
}


function calculateAge(birthday: string) {
    const birthDate = new Date(birthday);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const m = new Date().getMonth() - birthDate.getMonth();
    return m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate()) ? age - 1 : age;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url, sexual_orientation, display_disability, disability, hobbies, smoker, birthday, gender, need_assistance')
            .eq('id', params.id)
            .single();

        if (data) {
            setProfile(data);
        } else {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (!profile) {
        return <div>No profile found.</div>;
    }

    return (
        <div style={styles.profilePage}>
            <div style={styles.avatarContainer}>
                <img src={profile.avatar_url || '/default-avatar.png'} alt="Avatar" style={styles.avatar} />
            </div>
            <ProfileDetail label="NAME" value={profile.full_name} />
            <ProfileDetail label="USERNAME" value={profile.username} />
            <ProfileDetail label="GENDER" value={profile.gender} />
            <ProfileDetail label="AGE" value={calculateAge(profile.birthday).toString()} />
            <ProfileDetail label="SEXUAL ORIENTATION" value={profile.sexual_orientation} />
            <ProfileDetail label="SMOKER" value={profile.smoker ? 'YES' : 'NO'} />
            {profile.display_disability && (
                <ProfileDetail label="DISABILITIES" value={profile.disability.join(', ') || 'None'} />
            )}
            <ProfileDetail label="HOBBY" value={profile.hobbies.join(', ')} />
            <ProfileDetail label="NEEDS ASSISTANCE" value={profile.need_assistance ? 'YES' : 'NO'} />
        </div>
    );
}

const styles = {
    profilePage: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8e8ff', 
        minHeight: '100vh',
    },
    avatarContainer: {
        backgroundColor: '#ffd42f',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        borderRadius: '50%',
        width: '60px',
        height: '60px',
    },
};

