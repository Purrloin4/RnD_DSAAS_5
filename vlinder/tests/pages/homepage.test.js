import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '@/app/homepage/page';
import { mockProfiles } from '@/__mocks__/supabaseClientMock';

jest.mock('@/utils/supabase/client', () => {
  const createClientMock = () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } })
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
  });
  return { createClient: createClientMock };
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
