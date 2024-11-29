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
    const [userId, setUserId] = useState<string | null>(null);

    // 获取当前用户的 ID
    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) {
                // 如果用户未登录，则重定向到登录页面
                router.push('/login');
            } else {
                setUserId(data.user.id);  // 保存用户 ID
            }
        };
        fetchUser();
    }, [router]);

    const fetchProfile = async () => {
        if (!userId) return; // 确保只有在获取到用户 ID 后才执行查询

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
        if (userId) {
            fetchProfile();
        }
    }, [userId]);

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
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatarFile);

            if (uploadError) {
                console.error('Failed to upload avatar:', uploadError.message);
                return null;
            }

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
            <div style={styles.checkboxContainer}>
                <div
                    style={{
                        ...styles.customCheckbox,
                        ...(profile.smoker ? styles.customCheckboxChecked : {}),
                    }}
                    onClick={() =>
                        setProfile((prev) =>
                            prev ? { ...prev, smoker: !prev.smoker } : null
                        )
                    }
                >
                    {profile.smoker && <span style={styles.checkmark}></span>}
                </div>
                <label
                    style={styles.label}
                    onClick={() =>
                        setProfile((prev) =>
                            prev ? { ...prev, smoker: !prev.smoker } : null
                        )
                    }
                >
                    Smoker
                </label>
            </div>
            <div style={styles.checkboxContainer}>
                <div
                    style={{
                        ...styles.customCheckbox,
                        ...(profile.display_disability ? styles.customCheckboxChecked : {}),
                    }}
                    onClick={() =>
                        setProfile((prev) =>
                            prev ? { ...prev, display_disability: !prev.display_disability } : null
                        )
                    }
                >
                    {profile.display_disability && <span style={styles.checkmark}></span>}
                </div>
                <label
                    style={styles.label}
                    onClick={() =>
                        setProfile((prev) =>
                            prev ? { ...prev, display_disability: !prev.display_disability } : null
                        )
                    }
                >
                    Display Disability
                </label>
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
            <div style={styles.checkboxContainer}>
                <div
                    style={{
                        ...styles.customCheckbox,
                        ...(profile.need_assistance ? styles.customCheckboxChecked : {}),
                    }}
                    onClick={() =>
                        setProfile((prev) =>
                            prev ? { ...prev, need_assistance: !prev.need_assistance } : null
                        )
                    }
                >
                    {profile.need_assistance && <span style={styles.checkmark}></span>}
                </div>
                <label
                    style={styles.label}
                    onClick={() =>
                        setProfile((prev) =>
                            prev ? { ...prev, need_assistance: !prev.need_assistance } : null
                        )
                    }
                >
                    Needs Assistance
                </label>
            </div>
            <button onClick={handleSave} style={styles.saveButton}>Save</button>
            <div style={styles.emptySpace}></div>
        </div>
    );
}

const styles = {
    profilePage: {
        width: '400px',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
    },
    avatarContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px',
    },
    avatar: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
    },
    placeholder: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: '#ddd',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fileInput: {
        marginTop: '10px',
    },
    inputContainer: {
        marginBottom: '10px',
    },
    input: {
        width: '100%',
        padding: '8px',
        marginTop: '5px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    select: {
        width: '100%',
        padding: '8px',
        marginTop: '5px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    textarea: {
        width: '100%',
        height: '80px',
        padding: '8px',
        marginTop: '5px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },
    customCheckbox: {
        width: '20px',
        height: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginRight: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    },
    customCheckboxChecked: {
        backgroundColor: '#007BFF',
    },
    checkmark: {
        width: '10px',
        height: '10px',
        backgroundColor: '#fff',
        borderRadius: '50%',
    },
    label: {
        cursor: 'pointer',
    },
    saveButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginBottom: '30px'
    },
    emptySpace: {
        height: '60px',
    },
};
