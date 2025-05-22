"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();



  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
    </div>
  );
}