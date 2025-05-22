"use client";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function FooterWrapper() {
  const pathname = usePathname();

  // Exclude Footer for specific pages
  const excludePaths = ["/checkout", "/signin", "/signup", "/dashboard"];
  const showFooter = !excludePaths.some((path) => pathname.startsWith(path));

  return showFooter ? <Footer /> : null;
}

