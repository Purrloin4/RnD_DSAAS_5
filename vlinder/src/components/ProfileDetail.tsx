// component/ProfileDetail.tsx

import React from 'react';

interface ProfileDetailProps {
    label: string;
    value: string;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ label, value }) => (
    <div style={styles.detailItem}>
        <span style={styles.label}>{label}:</span>
        <span style={styles.value}>{value}</span>
    </div>
);

const styles: { [key: string]: React.CSSProperties } = {
    detailItem: {
        backgroundColor: '#fff8e5',
        margin: '5px 0',
        padding: '8px',
        borderRadius: '10px',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '300px',
    },
    label: {
        fontWeight: 'bold',
        flex: 1, 
        textAlign: 'left',
    },
    value: {
        fontWeight: 'bold',
        flex: 2,
        textAlign: 'right', 
    },
};

export default ProfileDetail;