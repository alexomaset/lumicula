'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Sign out
      </button>
    );
  }

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => signIn('google')}
        className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded hover:bg-gray-100 border border-gray-300"
      >
        <span>Sign in</span>
      </button>
      <button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Sign up
      </button>
    </div>
  );
}