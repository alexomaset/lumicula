"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          {session ? (
            <>
              <p>Signed in as {session.user.email}</p>
              <button onClick={() => signOut()}>Sign out</button>
            </>
          ) : (
            <button
              onClick={() =>
                signIn("google", { callbackUrl: "https://lumicula.vercel.app/" })
              }
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
