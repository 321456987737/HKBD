"use client"
import { useState } from 'react';
import {
  Cog6ToothIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  LockClosedIcon,
  TrashIcon,
  EnvelopeIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'super-admin' }
  ]);
  
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    role: 'moderator',
    permissions: []
  });

  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    profileImage: null
  });

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    setAdmins([...admins, { ...newAdmin, id: Date.now() }]);
    setNewAdmin({ email: '', role: 'moderator', permissions: [] });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserProfile({ ...userProfile, profileImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold flex items-center">
            <Cog6ToothIcon className="h-6 w-6 mr-2 text-gray-600" />
            Account Settings
          </h1>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 border-r p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <UserCircleIcon className="h-5 w-5 mr-2" />
                Profile
              </button>
              
              <button
                onClick={() => setActiveTab('admins')}
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'admins' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                Admin Management
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <LockClosedIcon className="h-5 w-5 mr-2" />
                Security
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Image 
                    width={100}
                    height={100} 
                      src={userProfile.profileImage || '/placeholder-user.jpg'} 
                      className="w-24 h-24 rounded-full object-cover border"
                      alt="Profile"
                    />
                    <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm cursor-pointer">
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                      <UserPlusIcon className="h-5 w-5 text-blue-600" />
                    </label>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                    <p className="text-gray-600">{userProfile.email}</p>
                  </div>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </form>
              </div>
            )}

            {/* Admin Management */}
            {activeTab === 'admins' && (
              <div className="space-y-6">
                <form onSubmit={handleCreateAdmin} className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <UserPlusIcon className="h-5 w-5 mr-2 text-green-600" />
                    Create New Admin
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                      value={newAdmin.role}
                      onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="super-admin">Super Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="editor">Editor</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Admin
                  </button>
                </form>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Existing Admins</h3>
                  {admins.map(admin => (
                    <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{admin.email}</p>
                        <p className="text-sm text-gray-600 capitalize">{admin.role}</p>
                      </div>
                      <button className="text-red-600 hover:text-red-700">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <KeyIcon className="h-5 w-5 mr-2 text-purple-600" />
                    Password & Security
                  </h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-gray-600">Last changed 3 days ago</p>
                      </div>
                      <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border border-red-100 bg-red-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-600 flex items-center">
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Danger Zone
                  </h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-red-600">
                      Deleting your account will remove all data and cannot be undone
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;