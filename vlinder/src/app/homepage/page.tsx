// 'use client';

// import { createClient } from '@/utils/supabase/client'
// import { useState, useEffect, useCallback } from 'react';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Switch, Spacer } from '@nextui-org/react';
// const supabase = createClient()

// async function fetchProfilesApi(){
//     const {data: profiles} = await supabase
//             .from('profiles')
//             .select('id, username, avatar_url');
//     return profiles || []
// }

// export default async function HomePage() {

//     const [visible, setVisible] = useState(false);

//     const openModal = () => setVisible(true);
//     const closeModal = () => setVisible(false);

//     var profiles = await fetchProfilesApi()

//     return (
//         <div style={{ padding: '2rem' }}>
//             <h1>User Profiles</h1>


//             <Button color="primary" onPress={openModal}>
//                 Open Filters
//             </Button>

//             <Modal closeButton onClose={closeModal}>
//                 <ModalHeader>
//                     <h3>Filters</h3>
//                 </ModalHeader>
//                 <ModalBody>
//                     <div>
//                         <h4>Is Smoker</h4>
//                         <Switch />
//                     </div>
//                     <Spacer y={1} />
//                     <div>
//                         <h4>Needs Assistance</h4>
//                         <Switch />
//                     </div>
//                 </ModalBody>
//                 <ModalFooter>
//                     <Button color="primary" onPress={closeModal}>
//                         Close
//                     </Button>
//                     <Button  color="success">
//                         Apply Filters
//                     </Button>
//                 </ModalFooter>
//             </Modal>
//             <div>
//                 <h3>Results</h3>
//                 <ul>
//                 {profiles.map((profile) => (
//                     <li key={profile.id}>{profile.username}</li>
//                 ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }

// const homePage = () => {}

'use client';

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect, useCallback } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Switch, Spacer } from '@nextui-org/react';
const supabase = createClient()

interface Profile{
    id: string;
    username: string;
    avatar_url: string,
}


export default function HomePage() {
    const [visible, setVisible] = useState(false);
    const [profiles, setProfiles] =  useState<Profile[]>([]);


    const openModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    async function fetchProfilesApi(){
        const {data: profiles} = await supabase
                .from('profiles')
                .select('id, username, avatar_url');
            
            if (profiles){
                if (profiles) {
                    setProfiles(profiles);
                  }
            }
           
    }

    useEffect(() => {
        fetchProfilesApi()
    }, [])

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
                        <h4>Is Smoker</h4>
                        <Switch />
                    </div>
                    <Spacer y={1} />
                    <div>
                        <h4>Needs Assistance</h4>
                        <Switch />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onPress={closeModal}>
                        Close
                    </Button>
                    <Button  color="success">
                        Apply Filters
                    </Button>
                </ModalFooter>
            </Modal>

            
            <div>
                <h3>Results</h3>
                <ul>
                    {profiles.map((profile) => (
                        <li key={profile.id}>{profile.username}</li> // Use `id` or a unique field as the key
                    ))}
                </ul>
            </div>
        </div>
    );
}

const homePage = () => {}