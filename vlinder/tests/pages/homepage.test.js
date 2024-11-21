import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '@/app/homepage/page';
import { createClient } from '@/utils/supabase/server-testing';

import '@testing-library/jest-dom';



const supabase = createClient();
export default supabase;

// jest.mock('@/utils/supabase/client');

// const mockProfiles = [
//     { id: '1', username: 'user1', avatar_url: 'avatar1.png' },
//     { id: '2', username: 'user2', avatar_url: 'avatar2.png' },
// ];

describe('HomePage', () => {
    // beforeEach(() => {
    //     createClient.mockReturnValue({
    //         from: jest.fn().mockReturnThis(),
    //         select: jest.fn().mockReturnThis(),
    //         eq: jest.fn().mockReturnThis(),
    //         then: jest.fn().mockResolvedValue({ data: mockProfiles }),
    //     });
    // });

    it('renders loading state initially', () => {
        render(<HomePage />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders profiles after loading', async () => {
        render(<HomePage />);
        await waitFor(() => expect(screen.getByText('dragon')).toBeInTheDocument());
        expect(screen.getByText('unicorn')).toBeInTheDocument();
    });

    it('opens and closes filters modal', () => {
        render(<HomePage />);
        fireEvent.click(screen.getByText('Open Filters'));
        expect(screen.getByText('Filters')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Close'));
        expect(screen.queryByText('Filters')).not.toBeInTheDocument();
    });

    it('applies filters and fetches profiles', async () => {
        render(<HomePage />);
        fireEvent.click(screen.getByText('Open Filters'));
        fireEvent.click(screen.getByText('Apply Filters'));
        await waitFor(() => expect(screen.getByText('user1')).toBeInTheDocument());
        expect(screen.getByText('user2')).toBeInTheDocument();
    });
});
