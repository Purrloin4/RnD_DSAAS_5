import React from 'react';
import Link from 'next/link';

// Import your icon components
import Navbar_Logo from 'Components/Icons/Navbar_Logo';
import Communities_Icon from 'Components/Icons/Communities_Icon';
import Settings_Icon from 'Components/Icons/Settings_Icon';
import Messages_Icon from 'Components/Icons/Messages_Icon';
import Profile_Icon from 'Components/Icons/Profile_Icon';
import Notifications_Icon from 'Components/Icons/Notifications_Icon';

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-2xl px-6 py-4 w-[90%] max-w-md">
      <div className="flex justify-around items-center">
      <Link href="/messages" className="flex flex-col items-center text-gray-700 hover:text-purple-600" replace>
          <Messages_Icon alt="messages icon" className="w-6 h-6" />
        </Link>
        
        <Link href="/communities" className="flex flex-col items-center text-gray-700 hover:text-purple-600" replace>
          <Communities_Icon alt="communities icon" className="w-6 h-6" />
        </Link>

        <Link href="/settings" className="flex flex-col items-center text-gray-700 hover:text-purple-600" replace>
          <Navbar_Logo alt="navbar logo" className="w-6 h-6 text-black"  />
        </Link>

        <Link href="/profile" className="flex flex-col items-center text-gray-700 hover:text-purple-600" replace>
          <Profile_Icon alt="profile icon" className="w-6 h-6" />
        </Link>


        <Link href="/notifications" className="flex flex-col items-center text-gray-700 hover:text-purple-600" replace>
          <Notifications_Icon alt="notifications icon" className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
}