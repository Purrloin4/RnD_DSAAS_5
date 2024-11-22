'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

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

export default function EditProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const router = useRouter();

    const userId = document.cookie.split('; ').find(row => row.startsWith('userId='))?.split('=')[1] || '637465ac-0729-442c-8dc8-441d2303f560';

    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        setProfile((prev) => prev ? { ...prev, [name]: type === 'checkbox' ? !!checked : value } : null);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const uploadAvatar = async (): Promise<string | null> => {
        if (!avatarFile || !profile) return null;

        const fileName = `${profile.id}-${Date.now()}.${avatarFile.name.split('.').pop()}`;
        try {
            // Upload the file to the 'avatars' bucket
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatarFile);

            if (uploadError) {
                console.error('Failed to upload avatar:', uploadError.message);
                return null;
            }

            // Get the public URL for the uploaded file
            const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            if (!publicUrlData || !publicUrlData.publicUrl) {
                console.error('Failed to retrieve public URL');
                return null;
            }

            return publicUrlData.publicUrl;
        } catch (err) {
            console.error('Unexpected error during avatar upload:', err);
            return null;
        }
    };

    const handleSave = async () => {
        let avatarUrl = profile?.avatar_url || null;

        if (avatarFile) {
            const uploadedUrl = await uploadAvatar();
            if (uploadedUrl) avatarUrl = uploadedUrl;
        }

        if (profile) {
            const { error } = await supabase
                .from('profiles')
                .update({
                    ...profile,
                    avatar_url: avatarUrl,
                })
                .eq('id', profile.id);

            if (error) {
                console.error('Failed to update profile:', error.message);
            } else {
                router.push(`/profile/${profile.id}`);
            }
        }
    };

    if (!profile) {
        return <div>Loading profile...</div>;
    }

    return (
        <div style={styles.profilePage}>
            <h2>Edit Profile</h2>
            <div style={styles.avatarContainer}>
                {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" style={styles.avatar} />
                ) : (
                    <div style={styles.placeholder}>No Avatar</div>
                )}
                <input type="file" accept="image/*" onChange={handleAvatarChange} style={styles.fileInput} />
            </div>
            <div style={styles.inputContainer}>
                <label>Full Name:</label>
                <input
                    type="text"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleChange}
                    style={styles.input}
                />
            </div>
            <div style={styles.inputContainer}>
                <label>Gender:</label>
                <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    style={styles.select}
                >
                    <option value="" disabled>
                        Select your gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div style={styles.inputContainer}>
                <label>Birthday:</label>
                <input
                    type="date"
                    name="birthday"
                    value={profile.birthday}
                    onChange={handleChange}
                    style={styles.input}
                />
            </div>
            <div style={styles.inputContainer}>
                <label>Sexual Orientation:</label>
                <input
                    type="text"
                    name="sexual_orientation"
                    value={profile.sexual_orientation}
                    onChange={handleChange}
                    style={styles.input}
                />
            </div>
            <div style={styles.inputContainer}>
                <label>Smoker:</label>
                <input
                    type="checkbox"
                    name="smoker"
                    checked={profile.smoker}
                    onChange={handleChange}
                />
            </div>
            <div style={styles.inputContainer}>
                <label>Display Disability:</label>
                <input
                    type="checkbox"
                    name="display_disability"
                    checked={profile.display_disability}
                    onChange={handleChange}
                />
            </div>
            <div style={styles.inputContainer}>
                <label>Disabilities:</label>
                <textarea
                    name="disability"
                    value={profile.disability.join(', ')}
                    onChange={(e) => setProfile(prevProfile => prevProfile ? { ...prevProfile, disability: e.target.value.split(', ') } : null)}
                    style={styles.textarea}
                />
            </div>
            <div style={styles.inputContainer}>
                <label>Hobbies:</label>
                <textarea
                    name="hobbies"
                    value={profile.hobbies.join(', ')}
                    onChange={(e) => setProfile(prevProfile => prevProfile ? { ...prevProfile, hobbies: e.target.value.split(', ') } : null)}
                    style={styles.textarea}
                />
            </div>
            <div style={styles.inputContainer}>
                <label>Needs Assistance:</label>
                <input
                    type="checkbox"
                    name="need_assistance"
                    checked={profile.need_assistance}
                    onChange={handleChange}
                />
            </div>
            <button onClick={handleSave} style={styles.saveButton}>Save Changes</button>
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
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        marginBottom: '20px',
    },
    avatar: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover' as const,
        marginBottom: '10px',
    },
    placeholder: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: '#ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10px',
    },
    fileInput: {
        marginTop: '10px',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        marginBottom: '15px',
        width: '300px',
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    textarea: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        height: '80px',
    },
    select: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    saveButton: {
        padding: '10px 20px',
        backgroundColor: '#ffd42f',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

