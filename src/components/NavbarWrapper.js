"use client";

import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function NavbarWrapper() {
  const pathname = usePathname();

  const excludePatterns = ["/checkout", "/signin", "/signup", "/dashboard"];

  const showNavbar = !excludePatterns.some((path) =>
    pathname.startsWith(path)
  );

  return showNavbar ? <Navbar /> : null;
}
