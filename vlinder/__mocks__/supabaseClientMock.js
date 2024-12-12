const mockProfiles = [
    {
      id: '1',
      username: 'dragon',
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
  
  jest.mock('@/utils/supabase/client', () => ({
    createClient: jest.fn(() => ({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
      },
      from: jest.fn((table) => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        neq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: table === 'profiles' ? mockProfiles[0] : null }),
        then: jest.fn((cb) => {
          if (table === 'profiles') cb({ data: mockProfiles });
        }),
      })),
    })),
  }));
  
  export { mockProfiles };
  