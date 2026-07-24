"use client"

import { useSession } from "next-auth/react";


export default function Dashboard() {
  const session = useSession();
  return (
    <div>
      {JSON.stringify(  session.data?.user)}
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard</p>
    </div>
  );
}