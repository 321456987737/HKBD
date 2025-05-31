"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const Whishlist = () => {
   const { data: session, status } = useSession();
   const [whishlist, setWhishlist] = useState([]);
   const userID = session?.user?.id;
   console.log(userID,"userID");
   useEffect(() => {
      if (userID) {
         getuserwhishlist();
      }
   }, [userID]);
   const getuserwhishlist = async () => {
      try {
         // const response = await axios.get("/api/whishlist?");
         // console.log(response.data);
      } catch (error) {
         console.log(error);
      }
   };
   return (
    <div>wishlist</div>
  )
}

export default Whishlist
