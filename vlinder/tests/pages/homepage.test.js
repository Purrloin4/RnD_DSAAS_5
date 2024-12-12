import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '@/app/homepage/page';
import { createClient } from '@/utils/supabase/client';



jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: {id: 'test-user-id'} } })
    },
    from: jest.fn((table) => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: table === 'profiles' ? mockProfiles[0] : null }),
      then: jest.fn((cb) => {
        if (table === 'profiles') cb({ data: mockProfiles });
      })
    }))
  }))
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
  }));

  const mockProfiles = [
    {
      id: '1',
      username: 'dragon',
      avatar_url: null,
      birthday: '1990-01-01',
      gender: 'Male',
      smoker: false,
      sexual_orientation: 'heterosexual',
      sex_positive: true,
      display_disability: true,
      disability: ['vision'],
      description: 'Profile description',
      need_assistance: false,
      profile_hobbies: [
        { hobbies: { id: 1, name: 'Reading', emoji: '📚' } },
        { hobbies: { id: 2, name: 'Gaming', emoji: '🎮' } }
      ]
    },
    {
      id: '2',
      username: 'unicorn',
      avatar_url: null,
      birthday: '1995-05-15',
      gender: 'Other',
      smoker: true,
      sexual_orientation: 'asexual',
      sex_positive: false,
      display_disability: false,
      disability: [],
      description: 'Profile description',
      need_assistance: true,
      profile_hobbies: [
        { hobbies: { id: 3, name: 'Cooking', emoji: '🍳' } },
        { hobbies: { id: 4, name: 'Hiking', emoji: '🥾' } }
      ]
    },
    {
      id: '3',
      username: 'mamaBear',
      avatar_url: null,
      birthday: '1985-10-10',
      gender: 'Female',
      smoker: false,
      sexual_orientation: 'heterosexual',
      sex_positive: true,
      display_disability: true,
      disability: ['hearing'],
      description: 'Profile description',
      need_assistance: false,
      profile_hobbies: [
        { hobbies: { id: 5, name: 'Swimming', emoji: '🏊' } },
        { hobbies: { id: 6, name: 'Traveling', emoji: '✈️' } }
      ]
    }
  ];

  describe('HomePage', () => {


    it('renders loading state initially with skeleton cards', () => {
      render(<HomePage />);
      expect(screen.getAllByTestId('skeleton-card')).toHaveLength(8);
    });
  
    it('renders profiles cards after loading', async () => {
      render(<HomePage />);
      await waitFor(() => expect(screen.queryByTestId('skeleton-card')).not.toBeInTheDocument());
      expect(screen.getAllByTestId('profile-suggestion-card')).toHaveLength(3);
    });
  
    it('renders profiles after loading', async () => {
      render(<HomePage />);
      await waitFor(() => expect(screen.queryByTestId('skeleton-card')).not.toBeInTheDocument());
      expect(screen.getByText('dragon')).toBeInTheDocument();
      expect(screen.getByText('unicorn')).toBeInTheDocument();
      expect(screen.getByText('mamaBear')).toBeInTheDocument();
    });
  
    it('toggles lover filter', async () => {
      render(<HomePage />);
      await waitFor(() => expect(screen.queryByTestId('skeleton-card')).not.toBeInTheDocument());
      fireEvent.click(screen.getByTestId('lover-switch'));
      expect(screen.queryByText('unicorn')).not.toBeInTheDocument();
    });

    it('renders profile details', async () => {
      render(<HomePage />);
      await waitFor(() => expect(screen.queryByTestId('skeleton-card')).not.toBeInTheDocument());
      expect(screen.getByText('Cooking')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
      expect(screen.getByText('Need Assistance')).toBeInTheDocument();
    });
  });
