import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../lib/auth';
import { CharacterManagement } from '../components';
import Link from 'next/link';

const ALLOWED_EMAILS = [
  'alexomaset711@gmail.com',
  'nevooronni@gmail.com',
  'mika.martikainen@venumia.com'
];

export default async function CharactersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email || !ALLOWED_EMAILS.includes(session.user.email)) {
    return (
      <div className="container mx-auto h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 mb-4">
            Access restricted. You are not authorized to view this page.
          </p>
          <Link 
            href="/" 
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <CharacterManagement />
    </div>
  );
}