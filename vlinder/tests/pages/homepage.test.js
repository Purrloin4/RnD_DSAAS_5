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
      sexual_orientation: 'heterosexual',
      sex_positive: true,
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
      sexual_orientation: 'asexual',
      sex_positive: false,
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
      sexual_orientation: 'heterosexual',
      sex_positive: true,
      profile_hobbies: [
        { hobbies: { id: 5, name: 'Swimming', emoji: '🏊' } },
        { hobbies: { id: 6, name: 'Traveling', emoji: '✈️' } }
      ]
    }
  ];

describe('HomePage', () => {
    it('renders loading state initially', () => {
    render(<HomePage />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

  it('fetches and sets user profile on mount', async () => {
    render(<HomePage />);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(screen.getByText('User Profiles')).toBeInTheDocument();
  });

  it('renders profiles after loading', async () => {
    render(<HomePage />);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(screen.getByText('User Profiles')).toBeInTheDocument();
  });

    it('renders profiles after loading', async () => {
      render(<HomePage/>);
      await waitFor(() => expect(screen.getByText('dragon')).toBeInTheDocument());
      expect(screen.getByText('unicorn')).toBeInTheDocument();
      expect(screen.getByText('mamaBear')).toBeInTheDocument();
  });


  it('toggles lover filter', async () => {
    render(<HomePage />);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    fireEvent.click(screen.getByTestId('lover-switch'));
    expect(screen.getByTestId('lover-switch')).toBeChecked();
  });

  it('fetches hobbies on mount', async () => {
    render(<HomePage />);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(screen.getByText('Hobbies')).toBeInTheDocument();
  });

  it('toggles hobby selection', async () => {
    render(<HomePage />);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    const hobbyChip = screen.getByText('Hobby 1');
    fireEvent.click(hobbyChip);
    expect(hobbyChip).toHaveClass('bg-secondary');
  });
});
