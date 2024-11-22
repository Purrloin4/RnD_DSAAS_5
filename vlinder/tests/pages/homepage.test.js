import React from 'react';
import { render, screen, fireEvent, waitFor, user } from '@testing-library/react';
import HomePage from '@/app/homepage/page';
import { createClient } from '@/utils/supabase/client';

import '@testing-library/jest-dom';


const supabase = createClient();
export default supabase;


describe('HomePage', () => {

    it('renders loading state initially', () => {
        render(<HomePage />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders profiles after loading', async () => {
        render(<HomePage />);
        await waitFor(() => expect(screen.getByText('dragon')).toBeInTheDocument());
        expect(screen.getByText('unicorn')).toBeInTheDocument();
        expect(screen.getByText('mamaBear')).toBeInTheDocument();
    });

    // it('opens and closes filters modal', () => {
    //     render(<HomePage />);
    //     fireEvent.click(screen.getByTestId('open-filters-button'));
    //     expect(screen.getByText('Apply Filters')).toHaveStyle('transform: translateX(0px) translateY(0.18967%) translateZ(0);');
    //     fireEvent.click(screen.getByText('Close'));
    //     expect(screen.queryByText('Apply Filters')).not.toBeVisible();
    // });

    // it('applies filters and fetches profiles', async () => {
    //     render(<HomePage />);
    //     fireEvent.click(screen.getByText('Open Filters'));
    //     fireEvent.click(screen.getByTestId('smoker-switch'));
    //     fireEvent.click(screen.getByText('Apply Filters'));
    //     await waitFor(() => expect(screen.getByText('unicorn')).toBeInTheDocument());
    //     expect(screen.getByText('dragon')).not.toBeVisible();
    // });
});
