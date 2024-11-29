import React from 'react';
import Link from 'next/link';

// Import your icon components
import Logo from 'Components/Logo/Logo';
import Communities_Icon from 'Components/Icons/Communities_Icon';
import Settings_Icon from 'Components/Icons/Settings_Icon';
import Messages_Icon from 'Components/Icons/Messages_Icon';
import Profile_Icon from 'Components/Icons/Profile_Icon';

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-2xl px-4 py-2 w-[90%] max-w-md">
      <div
        className="relative flex justify-between items-center"
        style={{ height: '7vh' }}
      >
        {/* Messages Icon */}
        <Link
          href="/messages"
          className="flex items-center justify-center text-gray-700 hover:text-purple-600 w-[20%]"
          replace
        >
          <Messages_Icon alt="messages icon" className="w-6 h-6" />
        </Link>

        {/* Communities Icon */}
        <Link
          href="/communities"
          className="flex items-center justify-center text-gray-700 hover:text-purple-600 w-[20%]"
          replace
        >
          <Communities_Icon alt="communities icon" className="w-6 h-6" />
        </Link>

                {/* Action Button */}
                <div
          className="relative flex items-center justify-center"
          style={{
            top: '-30px', // Elevate the button slightly more
            width: '75px', // Button size
            height: '75px',
            zIndex: 10, // Ensure it's above other elements
          }}
        >
          <Link
            href="/homepage"
            className="flex items-center justify-center w-full h-full"
            replace
          >
            <div
              className="bg-yellow-500 rounded-full border-4 border-white flex items-center justify-center"
              style={{
                aspectRatio: '1 / 1', // Keeps it circular
                width: '100%',
                height: '100%',
              }}
            >
              <Logo
                alt="logo"
                className="flex items-center justify-center w-[95%] h-[95%]"
              />
            </div>
          </Link>
        </div>




        {/* Profile Icon */}
        <Link
          href="/profile"
          className="flex items-center justify-center text-gray-700 hover:text-purple-600 w-[20%]"
          replace
        >
          <Profile_Icon alt="profile icon" className="w-6 h-6" />
        </Link>

        {/* Settings Icon */}
        <Link
          href="/settings"
          className="flex items-center justify-center text-gray-700 hover:text-purple-600 w-[20%]"
          replace
        >
          <Settings_Icon alt="settings icon" className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
}
