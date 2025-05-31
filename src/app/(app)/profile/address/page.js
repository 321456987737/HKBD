"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
const Address = () => {
   const { data: session, status } = useSession();
   const [address, setAddress] = useState([]);
   const userID = session?.user?.id;
   console.log(userID,"userID");
   useEffect(() => {
      if (userID) {
         getuseraddress();
      }
   }, [userID]);
   const getuseraddress = async () => {
      try {
         // const response = await axios.get("/api/whishlist?");
         // console.log(response.data);
      } catch (error) {
         console.log(error);
      }
   };
   return (
    <div>adress page  page</div>
  )
}

export default Address