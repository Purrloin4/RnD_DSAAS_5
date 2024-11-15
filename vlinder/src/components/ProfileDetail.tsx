// component/ProfileDetail.tsx

import React from 'react';

interface ProfileDetailProps {
    label: string;
    value: string;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ label, value }) => (
    <div style={styles.detailItem}>
        {label}: {value}
    </div>
);

const styles = {
    detailItem: {
        backgroundColor: '#fff8e5',
        margin: '5px 0',
        padding: '8px',
        borderRadius: '10px',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export default ProfileDetail;
