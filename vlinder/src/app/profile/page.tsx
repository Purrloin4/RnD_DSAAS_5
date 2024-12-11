'use client';

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { useFriendships } from "@/utils/store/friendships"; // Import Zustand store
import FriendshipList from "Components/FriendshipList"
import InitFriendships from "@/utils/store/InitFriendships";

const supabase = createClient();

interface Hobby {
    id: number;
    name: string;
    emoji: string;
}

interface ProfileHobby {
    hobbies: Hobby;
}
interface Friendship {
    id: string;
    friend_id: string;
    friend_username: string;
    friend_avatar: string | null;
}
interface UserProfile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    sexual_orientation: string;
    display_disability: boolean;
    disability: string[];
    smoker: boolean;
    birthday: string;
    gender: string;
    need_assistance: boolean;
    profile_hobbies: ProfileHobby[];
}


export default function EditProfilePage() {
  

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { friendships, setFriendships } = useFriendships(); // Access friendships from Zustand store
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [allHobbies, setHobbies] = useState<Hobby[]>([]);
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
  
    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) {
                router.push('/login');
            } else {
                setUserId(data.user.id);
            }
        };
        fetchUser();
    }, [router]);

    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select(`id, 
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
                hobbies (id, name, emoji))
                `)
            .eq('id', userId)
            .single();

        if (data) {
            // @ts-expect-error intellisense is wrong, this works
            setProfile(data);
        } else {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchHobbies = async () => {
        const { data, error } = await supabase.from('hobbies').select('*');

        if (data) {
            setHobbies(data);
        } else {
            console.error('Error fetching hobbies:', error);
        }
    }


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
            // Exclude hobbies from the profile object
            const { profile_hobbies, ...profileData } = profile;

            const { error } = await supabase
                .from('profiles')
                .update({
                    ...profileData,
                    avatar_url: avatarUrl,
                })
                .eq('id', profile.id);

            if (error) {
                console.error('Failed to update profile:', error.message);
            } 
            
            // Get the current hobbies from the database
            const { data: currentHobbies, error: fetchError } = await supabase
            .from('profile_hobbies')
            .select('hobby_id')
            .eq('profile_id', profile.id);

            if (fetchError) {
            console.error('Failed to fetch current hobbies:', fetchError.message);
            return;
            }

            const currentHobbyIds = currentHobbies.map((h) => h.hobby_id);
            const updatedHobbyIds = profile_hobbies.map((ph) => ph.hobbies.id);
            
            // Delete hobbies that are no longer in the updated profile
            const hobbiesToDelete = currentHobbyIds.filter(
                (id) => !updatedHobbyIds.includes(id)
            );
        
            if (hobbiesToDelete.length > 0) {
                const { error: deleteError } = await supabase
                .from('profile_hobbies')
                .delete()
                .in('hobby_id', hobbiesToDelete)
                .eq('profile_id', profile.id);
        
                if (deleteError) {
                console.error('Failed to delete hobbies:', deleteError.message);
                return;
                }
            }

            // Add hobbies that are newly added to the updated profile
            const hobbiesToAdd = updatedHobbyIds.filter(
                (id) => !currentHobbyIds.includes(id)
            );
        
            if (hobbiesToAdd.length > 0) {
                const { error: insertError } = await supabase
                .from('profile_hobbies')
                .insert(
                    hobbiesToAdd.map((hobbyId) => ({
                    profile_id: profile.id,
                    hobby_id: hobbyId,
                    }))
                );
        
                if (insertError) {
                console.error('Failed to add hobbies:', insertError.message);
                return;
                }
            }

            router.push('/profile');
        }
    };
    const fetchFriendships = async () => {
        try {
          const { data, error } = await supabase.rpc("show_friends");
          if (error) {
            console.error("Error fetching friendships:", error);
            return;
          }
    
          const formattedData = data.map((friend: any) => ({
            id: friend.id,
            username: friend.username,
            friend_id: friend.profile_id,
            friend_avatar: friend.avatar_url || null,
          }));
    
          setFriendships(formattedData); // Update Zustand store
        } catch (error) {
          console.error("Unexpected error fetching friendships:", error);
        }
      };


      useEffect(() => {
    
            fetchProfile();
            fetchHobbies();
            fetchFriendships();
        
    }, [userId]);

    if (!profile) {
        return <div>Loading profile...</div>;
    }
    

    return (
        <>

         <Button onPress={onOpen}>Friends</Button>
      <Modal isOpen={isOpen} size='sm' onOpenChange={onOpenChange}>
        <ModalContent>
        {(onClose) => (
            <>
             <ModalHeader>Friends</ModalHeader>
              <ModalBody>
                <FriendshipList/>
                <InitFriendships friendships={friendships} />

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
              </>
          )}
        </ModalContent>
      </Modal>
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
                    value={profile.disability?.join(', ')}
                    onChange={(e) => setProfile(prevProfile => prevProfile ? { ...prevProfile, disability: e.target.value.split(', ') } : null)}
                    style={styles.textarea}
                />
            </div>
            <div>
                <label>Hobbies:<br/></label>
                <textarea
                    readOnly
                    name="hobbies"
                    value={profile.profile_hobbies.map((h) => `${h.hobbies.name} ${h.hobbies.emoji}`).join(', ')}
                    style={styles.textarea}
                />
            </div>
            <div style={styles.inputContainer}>
    <label>Add Hobbies:</label>
    <div style={styles.scrollableContainer}>
        {allHobbies.map((hobby) => (
            <div key={hobby.id} style={styles.checkboxItem}>
                <input
                    type="checkbox"
                    value={hobby.id}
                    checked={profile.profile_hobbies?.some(ph => ph.hobbies.id === hobby.id) || false}
                    onChange={(e) => {
                        const { checked, value } = e.target;
                        const hobbyId = parseInt(value);
    
                        setProfile((prevProfile) => {
                            if (!prevProfile) return null;

                            const updatedHobbies = checked
                                ? [
                                    ...prevProfile.profile_hobbies,
                                    { hobbies: allHobbies.find(h => h.id === hobbyId) as Hobby }
                                ]
                                : prevProfile.profile_hobbies.filter(ph => ph.hobbies.id !== hobbyId);

                            return {
                                ...prevProfile,
                                profile_hobbies: updatedHobbies,
                            };
                        });
                    }}
                />
                <label style={styles.checkboxLabel}>
                    {hobby.name} {hobby.emoji}
                </label>
            </div>
        ))}
    </div>
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
            <button onClick={handleSave} style={styles.saveButton}>Save Changes</button>
        </div>
        </>
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
        width: '300px',
    },
    select: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
        cursor: 'pointer',
    },
    label: {
        marginLeft: '10px',
        cursor: 'pointer',
    },
    customCheckbox: {
        position: 'relative' as const,
        width: '20px',
        height: '20px',
        backgroundColor: '#fff',
        border: '2px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'inline-block',
        flexShrink: 0,
        marginRight: '10px',
        transition: 'all 0.2s ease',
    },
    customCheckboxChecked: {
        backgroundColor: '#ffd42f',
        borderColor: '#ffd42f',
    },
    checkmark: {
        position: 'absolute' as const,
        content: '""',
        width: '8px',
        height: '14px',
        border: 'solid #fff',
        borderWidth: '0 2px 2px 0',
        transform: 'rotate(45deg)',
        top: '2px',
        left: '6px',
    },
    scrollableContainer: {
        maxHeight: '150px',
        overflowY: 'auto' as const,
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        backgroundColor: '#fff',
    },
    checkboxItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },
    saveButton: {
        padding: '10px 20px',
        backgroundColor: '#ffd42f',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '100px',
    },
    checkboxLabel: {
        marginLeft: '10px',
    },
};