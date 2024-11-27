'use client';

import React from 'react';
import { createClient } from '@/utils/supabase/client'
import { useState, useEffect, useCallback } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Switch, Spacer, useDisclosure, Slider, CheckboxGroup, Checkbox } from '@nextui-org/react';

interface Profile{
    id: string;
    username: string;
    avatar_url: string,
    sexual_orientation: string;
    sex_positive: boolean;
    gender: string;
    display_disability: boolean;
    disability: string[];
}


export default function HomePage() {
    const supabase = createClient()
    var userId: string;
    if (process.env.NODE_ENV === 'test') {
        userId = '637465ac-0729-442c-8dc8-441d2303f560-id'; // unicode test user ID for testing
    }
    else {
        userId = '637465ac-0729-442c-8dc8-441d2303f560'; // Hardcoded user ID for now
    }
    const [profile, setProfile] = useState<Profile | null>(null);
    const [profiles, setProfiles] =  useState<Profile[]>([]);
    const [loverFilter, setLoverFilter] = useState(false);
    const [smokerFilter, setSmokerFilter] = useState(false);
    const [assistanceFilter, setAssistanceFilter] = useState(false);
    const [ageFilterValue, setAgeFilterValue] = useState<[number, number]>([18, 100]);
    const [loading, setLoading] = useState(true); 
    const {isOpen, onOpen, onOpenChange } = useDisclosure();
    const [genderFilter, setGenderFilter] = useState<string[]>(["Male", "Female", "Other"]);

    function calculateAge(birthday: string) {
        const birthDate = new Date(birthday);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        const m = new Date().getMonth() - birthDate.getMonth();
        return m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate()) ? age - 1 : age;
    }

    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        setProfile(data || null);
    };

    async function fetchProfiles(){
        setLoading(true);
        let query = supabase
            .from('profiles')
            .select('id, username, avatar_url, birthday, sexual_orientation, sex_positive, gender, display_disability, disability');    

        if (smokerFilter == true) {
            query = query.eq('smoker', false);
        }
        if (assistanceFilter ==  true) {
            query = query.eq('need_assistance', false);
        }

        if (loverFilter) {
            query = query.eq('sex_positive', true);

            if (profile?.sexual_orientation === 'heterosexual') {
            query = query.neq('gender', profile.gender);
            query = query.neq('sexual_orientation', 'asexual');
            } else if (profile?.sexual_orientation === 'asexual') {
            query = query.eq('gender', profile.gender);
            query = query.eq('sexual_orientation', 'asexual');
            }
        } else {
            if (!genderFilter.includes("Male")) {
                query = query.neq('gender', 'Male');
            }
            if (!genderFilter.includes("Female")) {
                query = query.neq('gender', 'Female');
            }
            if (!genderFilter.includes("Other")) {
                query = query.neq('gender', 'Other');
            }
        }

        const { data: profiles } = await query;
        const filteredProfiles = profiles?.filter(profile => {
            const age = calculateAge(profile.birthday);
            return age >= ageFilterValue[0] && age <= ageFilterValue[1];
        });

        setProfiles(filteredProfiles || []);
        setLoading(false);
    }

    // Fetch profiles when the page is rendered
    useEffect(() => {
        const fetchData = async () => {
            await fetchProfile();
            fetchProfiles();
        };
        fetchData();
    }, []);

    // Apply filters when user is looking for a lover
    useEffect(() => {
        if (!loverFilter) {
            //setGenderFilter(["Male", "Female", "Other"]);
        }
        fetchProfiles();
    }, [loverFilter]);

      
    return (
        <div style={{ padding: '2rem', overflowY: 'auto', maxHeight: '100vh' }}>
            <h1>User Profiles</h1>

            <Button 
                data-testid="open-filters-button"
                color="primary" 
                onPress={onOpen}>
                Open Filters
            </Button>

            <Modal data-testid isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <h3>Filters</h3>
                            </ModalHeader>
                                <ModalBody>
                                    <Spacer y={1} />
                                    <div>
                                        <h4>Not A Smoker</h4>
                                        <Switch 
                                            data-testid="smoker-switch"
                                            isSelected={smokerFilter}   
                                            onValueChange={setSmokerFilter} 
                                        />
                                    </div>
                                    <Spacer y={1} />
                                    <div>
                                        <h4 >Does Not Need Assistance</h4>
                                        <Switch 
                                            data-testid="assistance-switch"
                                            isSelected={assistanceFilter} 
                                            onValueChange={setAssistanceFilter} 
                                        />
                                    </div>
                                    <Spacer y={1} />
                                    <div>
                                    <CheckboxGroup
                                        label="Gender"
                                        orientation="horizontal"
                                        value = {genderFilter}
                                        onValueChange={setGenderFilter}
                                        isDisabled={loverFilter}
                                    >
                                    {!loverFilter ? (
                                        <>
                                            <Checkbox value="Male">Male</Checkbox>
                                            <Checkbox value="Female">Female</Checkbox>
                                            <Checkbox value="Other">Other</Checkbox>
                                        </>
                                    ) : (
                                        <text>Gender filter is applied based on your sexual orientation</text>
                                    )}
                                    </CheckboxGroup>
                                    </div>
                                    <Spacer y={1} />
                                    <div>
                                    <Slider
                                        data-testid="age-slider"
                                        label="Age"
                                        value={[ageFilterValue[0], ageFilterValue[1]]}
                                        onChange={(value) => {
                                            if (Array.isArray(value)) {
                                                setAgeFilterValue([value[0], value[1]]);
                                            }
                                        }}
                                        minValue={18}
                                        maxValue={100}
                                        step={1}
                                        />
                                    </div>
                                </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="success" onPress={() => { fetchProfiles(); onClose(); }}>
                                    Apply Filters
                                </Button>
                                // TODO: Need help understanding filters button to have it in a more question like format
                            </ModalFooter> 
                        </>
                    )}
                </ModalContent>
            </Modal>
            
            {profile?.sex_positive && (
                            <div>
                                <h4>Looking for a lover?</h4>
                                <Switch 
                                    data-testid="lover-switch"
                                    isSelected={loverFilter} 
                                    onValueChange={setLoverFilter} 
                                />
                            </div>
                )}
            <div>
                                <h4>Looking for a lover?</h4>
                                <Switch 
                                    data-testid="lover-switch"
                                    isSelected={loverFilter} 
                                    onValueChange={setLoverFilter} 
                                />
                            </div>
            <div>
                <h3>Results</h3>
                {loading ? (
                <p>Loading...</p> // Display loading state while fetching profiles
                ) : (
                    <>
                        <ul>
                            {profiles.map(profile => (
                                <div key={profile.id}>
                                    <h2>
                                        <a href={`/profile/${profile.id}`}>{profile.username}</a>
                                    </h2>
                                    <img src={profile.avatar_url} alt={`${profile.username}'s avatar`} />
                                </div>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

const homePage = () => {}