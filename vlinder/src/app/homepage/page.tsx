'use client';

import React from 'react';
import { createClient } from '@/utils/supabase/client'
import { useState, useEffect, useCallback } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Switch, Spacer, useDisclosure } from '@nextui-org/react';

interface Profile{
    id: string;
    username: string;
    avatar_url: string,
}


export default function HomePage() {
    const supabase = createClient()
    const [profiles, setProfiles] =  useState<Profile[]>([]);
    const [smokerFilter, setSmokerFilter] = useState(false);
    const [assistanceFilter, setAssistanceFilter] = useState(false);
    const [loading, setLoading] = useState(true); 
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    async function fetchProfiles(){
        setLoading(true);
        let query =  supabase
            .from('profiles')
            .select('id, username, avatar_url');    

        if (smokerFilter == true) {
            query = query.eq('smoker', false);
        }
        if (assistanceFilter ==  true) {
            query = query.eq('need_assistance', false);
        }

        const { data: profiles } = await query;
        setProfiles(profiles || []);
        setLoading(false);
    }

    // Fetch profiles when the page is rendered
    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleApplyFilters = () => {
        fetchProfiles(); // Re-fetch profiles when filters are applied
      };

    if (!isMounted) {
        return null; // Render nothing on the server because otherwise it will throw a hydration error
    }
      
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
                                </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="success" onPress={() => { handleApplyFilters(); onClose(); }}>
                                    Apply Filters
                                </Button>
                                // TODO: Need help understanding filters button to have it in a more question like format
                            </ModalFooter> 
                        </>
                    )}
                </ModalContent>
            </Modal>

            <div>
                <h3>Results</h3>
                {loading ? (
                <p>Loading...</p> // Display loading state while fetching profiles
                ) : (
                <ul>
                    {profiles.map(profile => (
                            <div key={profile.id}>
                                <h2>{profile.username}</h2>
                                <img src={profile.avatar_url} alt={`${profile.username}'s avatar`} />
                            </div>
                        ))}
                </ul> // TODO: once profile pages are added we can link to them here
                )}
            </div>
        </div>
    );
}

const homePage = () => {}