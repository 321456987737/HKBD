"use client";
import React, { useState, useEffect } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch first batch of users on mount
  useEffect(() => {
    fetchUsers(0);
  }, []);

  // Fetch users with skip count
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = async (skip) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/users?skip=${skip}`);
      const newUsers = res.data.users;

      if (newUsers.length === 0) {
        // No more users to fetch
        setHasMore(false);
        return;
      }

      if (skip === 0) {
        setUsers(newUsers);
        setHasMore(true);
      } else {
        setUsers((prev) => [...prev, ...newUsers]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load more users on icon click
  const reloadMoreUsers = () => {
    fetchUsers(users.length);
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6 flex items-center">
        <UserIcon className="h-6 w-6 mr-2 text-indigo-600" />
        Users Management
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ minWidth: 180 }}
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ minWidth: 220 }}
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ minWidth: 250 }}
              >
                User Id
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ minWidth: 180 }}
              >
                Products
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No users found.
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 transition-colors cursor-default"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-1">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col text-sm text-gray-900">
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center mt-1 text-gray-500">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <ClipboardIcon
                      onClick={() => navigator.clipboard.writeText(user._id)}
                      className="h-4 w-4 mr-2 text-gray-400 hover:cursor-pointer hover:text-indigo-600"
                      aria-label="Copy user ID"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          navigator.clipboard.writeText(user._id);
                        }
                      }}
                    />
                    <span className="truncate max-w-[180px]" title={user._id}>
                      {user._id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{user.adress || "N/A"}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center items-center space-x-4">
        <div className="w-[60px] h-[1px] bg-gray-400"></div>
        <ArrowPathIcon
          onClick={() => {
            if (hasMore) reloadMoreUsers();
          }}
          className={`h-5 w-5 text-gray-400 cursor-pointer outline-none hover:text-indigo-600 hover:rotate-90 transition-transform duration-300 ${
            loading || !hasMore ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Reload more users"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && hasMore && !loading) {
              reloadMoreUsers();
            }
          }}
        />

        <div className="w-[60px] h-[1px] bg-gray-400"></div>
      </div>
    </div>
  );
};

export default Page;
