"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import {
  Cog6ToothIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  LockClosedIcon,
  TrashIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import axios from "axios";

const SettingsPage = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [user, setUser] = useState({
    email: "",
    username: "",
    id: "",
    role: "",
    avatar: "",
  });
  const id = session?.user?.id || "";
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    role: "moderator",
  });

  const [admins, setAdmins] = useState([]);
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchUserData = async () => {
        try {
          const res = await axios.get(
            `/api/singleuserdata?id=${session.user.id}`
          );
          setUser(res.data.user);
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      };

      fetchUserData();
    }
  }, [status, session]);
  useEffect(() => {
     const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/chooseadmin");
      setAdmins(response.data.admins);
    } catch (error) {
      setMessage({ text: "Failed to fetch admins", type: "error" });
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAdmins();
  }, [])

 
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const response = await axios.post("/api/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser({ ...user, avatar: response.data.avatarUrl });
      setMessage({ text: "Avatar updated successfully", type: "success" });
    } catch (error) {
      setMessage({ text: "Failed to upload avatar", type: "error" });
      console.error("Error uploading avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/chooseadmin", newAdmin);
      setAdmins([...admins, response.data.admin]);
      setNewAdmin({ email: "", role: "moderator" });
      setMessage({ text: "Admin created successfully", type: "success" });
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to create admin",
        type: "error",
      });
      console.error("Error creating admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;

    try {
      setLoading(true);
      await axios.delete(`/api/chooseadmin?id=${adminId}`);
      setAdmins(admins.filter((admin) => admin._id !== adminId));
      setMessage({ text: "Admin removed successfully", type: "success" });
    } catch (error) {
      setMessage({ text: "Failed to remove admin", type: "error" });
      console.error("Error removing admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    alert("Password change functionality would be implemented here");
  };

  const handleEnable2FA = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/enable-2fa", { userId: user.id });
      alert(
        "2FA setup would be implemented here. Response: " +
          JSON.stringify(response.data)
      );
    } catch (error) {
      setMessage({ text: "Failed to enable 2FA", type: "error" });
      console.error("Error enabling 2FA:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;

    try {
      setLoading(true);
      await axios.delete(`/api/users?id=${user.id}`);
      alert(
        "Account deletion would be implemented here. User would be signed out and redirected."
      );
    } catch (error) {
      setMessage({ text: "Failed to delete account", type: "error" });
      console.error("Error deleting account:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while session is loading
  if (status === "loading") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Optionally, redirect or show message if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-lg text-red-600">
          You must be signed in to view this page.
        </div>
      </div>
    );
  }

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
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <UserCircleIcon className="h-5 w-5 mr-2" />
                Profile
              </button>

              <button
                onClick={() => setActiveTab("admins")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "admins"
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                Admin Management
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "security"
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <LockClosedIcon className="h-5 w-5 mr-2" />
                Security
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {message.text && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  message.type === "error"
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600"
                }`}
              >
                {message.text}
              </div>
            )}

            {loading && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-lg">
                Loading...
              </div>
            )}

            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-22 h-22 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-22 h-22 p-4 bg-gray-200 rounded-full" />
                    )}
                    <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        accept="image/*"
                      />
                      <UserPlusIcon className="h-5 w-5 text-blue-600" />
                    </label>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{user.username}</h2>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <span className="bg-slate-50 px-6 py-2 rounded-md">
                      {user.username}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <span className="bg-slate-50 px-6 py-2 rounded-md">
                      {user.email}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      User ID
                    </label>
                    <span className="bg-slate-50 px-6 py-2 rounded-md">
                      {user.id}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Role
                    </label>
                    <span className="bg-slate-50 px-6 py-2 rounded-md capitalize">
                      {user.role}
                    </span>
                  </div>
                </form>
              </div>
            )}

            {/* Admin Management */}
            {activeTab === "admins" && (
              <div className="space-y-6">
                <form
                  onSubmit={handleCreateAdmin}
                  className="bg-gray-50 p-4 rounded-lg space-y-4"
                >
                  <h3 className="text-lg font-semibold flex items-center">
                    <UserPlusIcon className="h-5 w-5 mr-2 text-green-600" />
                    Create New Admin
                  </h3>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, email: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Role
                    </label>
                    <select
                      value={newAdmin.role}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, role: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="super-admin">Super Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="editor">Editor</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Admin"}
                  </button>
                </form>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Existing Admins</h3>
                  {admins.length === 0 ? (
                    <p className="text-gray-500">No admins found</p>
                  ) : (
                    admins.map((admin) => (
                      <div
                        key={admin._id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{admin.email}</p>
                          <p className="text-sm text-gray-600 capitalize">
                            {admin.role}
                          </p>
                        </div>
                        {admin._id !== user.id && (
                          <button
                            onClick={() => handleDeleteAdmin(admin._id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={loading}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
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
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security
                        </p>
                      </div>
                      <button
                        onClick={handleEnable2FA}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Enable 2FA"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-gray-600">
                          Update your account password
                        </p>
                      </div>
                      <button
                        onClick={handleChangePassword}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:bg-gray-100"
                        disabled={loading}
                      >
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
                      Deleting your account will remove all data and cannot be
                      undone
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300"
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Delete Account"}
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
