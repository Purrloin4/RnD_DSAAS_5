'use client';

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect, useCallback } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Switch, Spacer } from '@nextui-org/react';

interface Profile{
    id: string;
    username: string;
    avatar_url: string,
}


export default function HomePage() {
    const supabase = createClient()
    const [visible, setVisible] = useState(false);
    const [profiles, setProfiles] =  useState<Profile[]>([]);
    const [smokerFilter, setSmokerFilter] = useState(false);
    const [assistanceFilter, setAssistanceFilter] = useState(false);
    const [loading, setLoading] = useState(true); 

    const openModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    async function fetchProfiles(){
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
        closeModal();
      };
      
    return (
        <div style={{ padding: '2rem' }}>
            <h1>User Profiles</h1>

            <Button color="primary" onPress={openModal}>
                Open Filters
            </Button>

            <Modal closeButton isOpen = {visible} onClose={closeModal}>
                <ModalHeader>
                    <h3>Filters</h3>
                </ModalHeader>
                <ModalBody>
                    <div>
                        <h4>Not A Smoker</h4>
                        <Switch isSelected = {smokerFilter} onValueChange={setSmokerFilter}/>
                    </div>
                    <Spacer y={1} />
                    <div>
                        <h4>Does Not Need Assistance</h4>
                        <Switch isSelected = {assistanceFilter} onValueChange ={setAssistanceFilter}/>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onPress={closeModal}>
                        Close
                    </Button>
                    <Button  color="success" onPress={handleApplyFilters}>
                        Apply Filters
                    </Button>
                </ModalFooter>
            </Modal>

            
            
            <div>
                <h3>Results</h3>
                {loading ? (
                <p>Loading...</p> // Display loading state while fetching profiles
                ) : (
                <ul>
                    {profiles.map((profile) => (
                    <li key={profile.id}>{profile.username}</li>
                    ))}
                </ul>
                )}
            </div>
        </div>
    );
}

const homePage = () => {}