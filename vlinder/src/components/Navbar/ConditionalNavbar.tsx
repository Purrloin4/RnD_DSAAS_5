"use client";

import Navbar from "Components/Navbar/Navbar";
import { usePathname } from "next/navigation";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Define routes without Navbar
  const noNavbarRoutes = [
    "/",
    "/login",
    "/register",
    "/register/*",
    "/admin/*",
    "/invite",
    "/createactivity",
    "/forgot-password",
    "/reset_password",
    "/editactivity/*",
  ];
  const showNavbar = !noNavbarRoutes.some((route) => {
    const regex = new RegExp(`^${route.replace("*", ".*")}$`);
    return regex.test(pathname);
  });

  return showNavbar ? <Navbar /> : null;
}
