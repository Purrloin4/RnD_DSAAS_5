import React, { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { Badge } from "@nextui-org/react";

import Navbar_Logo from "Components/Icons/Navbar_Logo";
import Communities_Icon from "Components/Icons/Communities_Icon";
import Settings_Icon from "Components/Icons/Settings_Icon";
import Messages_Icon from "Components/Icons/Messages_Icon";
import Profile_Icon from "Components/Icons/Profile_Icon";
import Notifications_Icon from "Components/Icons/Notifications_Icon";

import { createClient } from "@/utils/supabase/client";
import dayjs from "dayjs";

export default function Navbar() {
  const [todayNotificationCount, setTodayNotificationCount] = useState(0);

  useEffect(() => {
    const fetchTodayNotificationCount = async () => {
      const supabase = createClient();
      try {
        const todayStart = dayjs().startOf("day").toISOString();
        const todayEnd = dayjs().endOf("day").toISOString();

        const { count, error } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .gte("created_at", todayStart)
          .lte("created_at", todayEnd);

        if (error) {
          console.error("Error fetching today's notification count:", error);
        } else {
          console.log("Today's notification count:", count);
          setTodayNotificationCount(count || 0);
        }
      } catch (error) {
        console.error("Unexpected error fetching today's notification count:", error);
      }
    };

    fetchTodayNotificationCount();

    // Optional: Poll for updates periodically
    const interval = setInterval(fetchTodayNotificationCount, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-2xl px-6 py-4 w-[90%] max-w-md z-50">
      <div className="flex justify-around items-center">
        <Link href="/messages" className="flex flex-col items-center text-gray-700 hover:text-purple-600" replace>
          <Messages_Icon alt="messages icon" className="w-6 h-6" />
        </Link>

        <Link href="/communities" className="flex flex-col items-center text-gray-700 hover:text-purple-600" replace>
          <Communities_Icon alt="communities icon" className="w-6 h-6" />
        </Link>

        <Link href="/homepage" className="flex flex-col items-center text-gray-700 hover:text-purple-600" replace>
          <Navbar_Logo alt="navbar logo" className="w-6 h-6 text-black" />
        </Link>

        <Link href="/profile" className="flex flex-col items-center text-gray-700 hover:text-purple-600" replace>
          <Profile_Icon alt="profile icon" className="w-6 h-6" />
        </Link>

        <Link href="/notifications" className="flex flex-col items-center text-gray-700 hover:text-purple-600" replace>
          <Badge
            content={todayNotificationCount}
            isInvisible={todayNotificationCount === 0}
            color="primary"
            placement="top-right"
          >
            <Notifications_Icon alt="notifications icon" className="w-6 h-6" />
          </Badge>
        </Link>
      </div>
    </nav>
  );
}
