'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import ProfileDetail from 'Components/ProfileDetail';
import { Button, Avatar } from '@nextui-org/react';
import { useUser } from '@/utils/store/user';
import toast, { Toaster } from 'react-hot-toast';

const supabase = createClient();

interface Hobby {
    id: number;
    name: string;
    emoji: string;
}

interface ProfileHobby {
    hobbies: Hobby;
}

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
    profile_hobbies: ProfileHobby[];
}

function calculateAge(birthday: string) {
    const birthDate = new Date(birthday);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const m = new Date().getMonth() - birthDate.getMonth();
    return m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate()) ? age - 1 : age;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [friendStatus, setFriendStatus] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const user = useUser((state) => state.user);

    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                id, 
                username, 
                full_name, 
                avatar_url, 
                sexual_orientation, 
                display_disability, 
                disability, 
                smoker, 
                birthday, 
                gender, 
                need_assistance,
                profile_hobbies (
                    hobbies (id, name, emoji)
                )
            `)
            .eq('id', params.id)
            .single();

        if (data) {
            // @ts-expect-error intellisense is wrong, this works
            setProfile(data);
        } else {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchFriendStatus = async (otherUserId: string) => {
        try {
            const { data, error } = await supabase.rpc('get_friend_status', {
                other_user_id: otherUserId,
            });

            if (error) {
                console.error('Error fetching friend request status:', error);
                setFriendStatus(null);
            } else {
                setFriendStatus(data);
            }
        } catch (error) {
            console.error('Unexpected error fetching friend request status:', error);
            setFriendStatus(null);
        }
    };

    const checkAdminStatus = async () => {
        const userResponse = await supabase.auth.getUser();
        if (userResponse.error || !userResponse.data?.user) {
            console.error('Error fetching current user:', userResponse.error);
            return;
        }

        const userId = userResponse.data.user.id;
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (data?.role === 'admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }

        if (error) {
            console.error('Error checking admin role:', error);
        }
    };

    const sendFriendRequest = async () => {
        try {
            if (user?.id === params.id) {
                toast.error('You cannot send a friend request to yourself.');
                return;
            } else {
                const { data, error } = await supabase.rpc('send_friend_request', {
                    profile_2_id: params.id,
                });

                if (error) {
                    console.error('Error sending friend request:', error);
                } else {
                    await fetchFriendStatus(params.id);
                    toast.success('Friend request sent successfully!');
                }
            }
        } catch (error) {
            console.error('Unexpected error sending friend request:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchFriendStatus(params.id);
        checkAdminStatus();
    }, [user?.id, params.id]);

    if (!profile) {
        return <div>No profile found.</div>;
    }

    const renderFriendButton = () => {
        if (isAdmin) return null;

        switch (friendStatus) {
            case 'accepted':
                return <Button disabled>Connected</Button>;
            case 'pending':
                return <Button disabled>Pending</Button>;
            case 'rejected':
                return <Button disabled>Rejected</Button>;
            default:
                return <Button onPress={sendFriendRequest}>Connect</Button>;
        }
    };

    return (
        <div style={styles.profilePage}>
            <Avatar
                isBordered
                color="warning"
                src={profile.avatar_url || '/default-avatar.png'}
                alt={profile.id}
                className="w-20 h-20 text-large"
            />
            <ProfileDetail label="NAME" value={profile.full_name} />
            <ProfileDetail label="USERNAME" value={profile.username} />
            <ProfileDetail label="GENDER" value={profile.gender} />
            <ProfileDetail label="AGE" value={calculateAge(profile.birthday).toString()} />
            <ProfileDetail label="SEXUAL ORIENTATION" value={profile.sexual_orientation} />
            <ProfileDetail label="SMOKER" value={profile.smoker ? 'YES' : 'NO'} />
            {profile.display_disability && (
                <ProfileDetail label="DISABILITIES" value={profile.disability.join(', ') || 'None'} />
            )}
            <ProfileDetail
                label="HOBBIES"
                value={profile.profile_hobbies
                    .map((h) => `${h.hobbies.name} ${h.hobbies.emoji}`)
                    .join(', ')}
            />
            <ProfileDetail label="NEEDS ASSISTANCE" value={profile.need_assistance ? 'YES' : 'NO'} />

            <div style={{ marginTop: '20px' }}>{renderFriendButton()}</div>
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
};
