"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md w-96">
        <input 
          type="email" 
          placeholder="Email"
          className="w-full px-3 py-2 border rounded-md mb-4"
        />
        <input 
          type="password" 
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-md mb-4"
        />
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
