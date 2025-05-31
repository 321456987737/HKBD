import React from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
const AccountSettings = () => {
   const { data: session, status } = useSession()
   const [user, setUser] = useState({})
   const userID = session?.user?.id
   console.log(userID, "userID")
   useEffect(() => {
      if (userID) {
         getuserwhishlist()
      }
   }, [userID])
   const getuserwhishlist = async () => {
      try {
         // const response = await axios.get(`/api/singleuserdata?id=${userID}`)
         // console.log(response.data)
         // setUser(response.data.user)
      } catch (error) {
         console.log(error)
      }
   };
  return (
    <div>
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
    </div>
  )
}

export default AccountSettings