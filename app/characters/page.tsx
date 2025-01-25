'use client';

import { useSession } from 'next-auth/react';
import { CharacterManagement } from '../components';

const ALLOWED_EMAILS = [
  'alexomaset711@gmail.com',    // Replace with your email
  'nevooronni@gmail.com',
  'mika.martikainen@venumia.com'
];

export default function CharactersPage() {
  const { data: session } = useSession();
  
  if (!session?.user?.email || !ALLOWED_EMAILS.includes(session.user.email)) {
    return (
      <div className="container mx-auto py-8">
        <p>Access restricted. You are not authorized to view this page.</p>
        <a
        href="/"
        className="mt-4 text-blue-500 underline"
      >
        Go to Homepage
      </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <CharacterManagement />
    </div>
  );
}