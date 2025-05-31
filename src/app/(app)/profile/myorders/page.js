"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import React from 'react'

const Myorders = () => {
   const { data: session, status } = useSession();
   const [orders, setOrders] = useState([]);
   const userID = session?.user?.id;
   console.log(userID,"userID");
   useEffect(() => {
      if (userID) {
         getuserorders();
      }
   }, [userID]);
   const getuserorders = async () => {
      try {
         // const response = await axios.get("/api/orders?");
         // console.log(response.data);
      } catch (error) {
         console.log(error);
      }
   };
   return (
   <div>a</div>
  )
}

export default Myorders