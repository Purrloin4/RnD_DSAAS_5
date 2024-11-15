// src/app/profile/[id]/page.tsx
import React from 'react';
import { createClient } from '@/utils/supabase/server';

type UserProfile = {
    id: string;
    updated_at: string;
    username: string;
    full_name: string;
    avatar_url: string;
    sexual_orientation: string;
    sex_positive: boolean;
    display_disability: boolean;
    disability: string[];
    hobbies: string[];
    smoker: boolean;
    birthday: string;
    gender: string;
    need_assistance: boolean;
};

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !data) {
        return <div>No profile found.</div>;
    }
    

    const profileData = data as UserProfile;

    return (
        <div className="profile-page">
            <h1>{profileData.full_name}</h1>
            <img src={profileData.avatar_url}  />
            <p>Username: {profileData.username}</p>
            <p>Gender: {profileData.gender}</p>
            <p>Birthday: {profileData.birthday}</p>
            <p>Sexual Orientation: {profileData.sexual_orientation}</p>
            <p>Smoker: {profileData.smoker ? 'Yes' : 'No'}</p>
            {profileData.display_disability && (
                <p>Disabilities: {profileData.disability.join(', ')}</p>
                )}
            <p>Hobbies: {profileData.hobbies.join(', ')}</p>
            <p>Needs Assistance: {profileData.need_assistance ? 'Yes' : 'No'}</p>
        </div>
    );
}
