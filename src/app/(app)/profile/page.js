"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  UserCircleIcon,
  ShoppingBagIcon,
  HeartIcon,
  MapPinIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

export default function UserProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: UserCircleIcon },
    { id: 'orders', label: 'My Orders', icon: ShoppingBagIcon },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon },
    { id: 'addresses', label: 'Addresses', icon: MapPinIcon },
    { id: 'settings', label: 'Account Settings', icon: Cog6ToothIcon },
    { id: 'payments', label: 'Payment Methods', icon: CreditCardIcon },
  ];

  // Helper for sign-in prompt inside each tab
  const SignInPrompt = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-16">
      <UserCircleIcon className="h-14 w-14 text-gray-300 mb-4" />
      <h2 className="text-xl font-bold mb-2 text-gray-800">Sign in to your account</h2>
      <p className="text-gray-500 mb-6 text-center">{message}</p>
      <button
        onClick={() => router.push('/signin')}
        className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-gray-800 transition"
      >
        Sign In
      </button>
      <p className="text-gray-400 text-xs mt-6">
        New here? <a href="/signup" className="text-blue-600 hover:underline">Create an account</a>
      </p>
    </div>
  );

  const renderTabContent = () => {
    if (!session) {
      switch(activeTab) {
        case 'dashboard':
          return <SignInPrompt message="Access your dashboard by signing in." />;
        case 'orders':
          return <SignInPrompt message="View your order history by signing in." />;
        case 'wishlist':
          return <SignInPrompt message="See your wishlist after signing in." />;
        case 'addresses':
          return <SignInPrompt message="Manage your addresses by signing in." />;
        case 'settings':
          return <SignInPrompt message="Update your account settings by signing in." />;
        case 'payments':
          return <SignInPrompt message="Manage your payment methods by signing in." />;
        default:
          return <SignInPrompt message="Sign in to access your account." />;
      }
    }

    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 ">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Welcome Back, {session?.user?.name?.split(' ')[0]}!</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-gray-500">Wishlist Items</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-gray-500">Account Status</p>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-gray-500">Member Since</p>
                  <p className="text-2xl font-bold">2024</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <div className="border rounded-lg p-4 text-center">
                <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="text-gray-500 mt-2">No recent activity</p>
              </div>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Order History</h2>
            <div className="border rounded-lg p-8 text-center">
              <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">You haven't placed any orders yet</p>
              <button
                onClick={() => router.push('/shop')}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Start Shopping
              </button>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      defaultValue={session?.user?.name?.split(' ')[0] || ''}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      defaultValue={session?.user?.name?.split(' ').slice(1).join(' ') || ''}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue={session?.user?.email || ''}
                      disabled
                      className="w-full p-3 border rounded-lg bg-gray-100"
                    />
                  </div>
                </div>
              </div>
              <div >
                <h3 className="text-lg font-semibold mb-4">Password Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>
              <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
                Save Changes
              </button>
            </div>
          </div>
        );
      // Add other cases similarly...
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAF6]">
      {/* Desktop Layout */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 py-8 gap-8 mt-12">
        {/* Sidebar */}
        <div className="w-80 shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    width={64}
                    height={64}
                    alt="Profile"
                    className="rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div>
                <h2 className="font-semibold">{session?.user?.username || session?.user?.name}</h2>
                <p className="text-sm text-gray-500">{session?.user?.email || "Not signed in"}</p>
              </div>
            </div>
            <nav className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg text-left ${
                    activeTab === item.id 
                      ? 'bg-black text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              ))}
              {session && (
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center p-3 rounded-lg text-left text-red-600 hover:bg-red-50"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  Log Out
                </button>
              )}
            </nav>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="bg-white p-4 shadow-sm ">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center p-3 rounded-lg ${
                    activeTab === item.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
        {/* Mobile Content */}
        <div className="p-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}