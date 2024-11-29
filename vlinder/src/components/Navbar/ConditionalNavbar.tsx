"use client";

import Navbar from "Components/Navbar/Navbar";
import { usePathname } from "next/navigation";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Define routes without Navbar
  const noNavbarRoutes = ["/", "/login", "/register"];
  const showNavbar = !noNavbarRoutes.includes(pathname);

  return showNavbar ? <Navbar /> : null;
}
