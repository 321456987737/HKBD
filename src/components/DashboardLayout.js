"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ← Step 1
import {
  ChartBarIcon,
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CogIcon,
  TrashIcon 
} from "@heroicons/react/24/outline";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname(); // ← Step 2

  const linkClass = (path) =>
    `flex items-center px-6 py-3 hover:bg-gray-50 ${
      pathname === path ? "bg-gray-100 text-indigo-600" : "text-gray-600"
    }`; // ← Step 3

  return (
    <div className="min-h-screen flex bg-[#FDFAF6]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-indigo-600">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            <ChartBarIcon className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/dashboard/product" className={linkClass("/dashboard/product")}>
            <ShoppingBagIcon className="w-5 h-5 mr-3" />
            Add Products
          </Link>
          <Link href="/dashboard/removeProduct" className={linkClass("/dashboard/removeProduct")}>
            <TrashIcon className="w-5 h-5 mr-3" />
            Remove, Edit Products
          </Link>
          <Link href="/dashboard/users" className={linkClass("/dashboard/users")}>
            <UsersIcon className="w-5 h-5 mr-3" />
            Users
          </Link>
          <Link href="/dashboard/orders" className={linkClass("/dashboard/orders")}>
            <CurrencyDollarIcon className="w-5 h-5 mr-3" />
            Orders
          </Link>
          <Link href="/dashboard/reports" className={linkClass("/dashboard/reports")}>
            <DocumentTextIcon className="w-5 h-5 mr-3" />
            Reports
          </Link>
          <Link href="/dashboard/settings" className={linkClass("/dashboard/settings")}>
            <CogIcon className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-grow transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        } lg:ml-64`}
      >
        <button
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
