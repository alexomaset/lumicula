import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../lib/auth';
import { CharacterManagement } from '../components';

const ALLOWED_EMAILS = [
  'alexomasst711@gmail.com',
  'nevooronni@gmail.com',
  'mika.martikainen@venumia.com'
];

export default async function CharactersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email || !ALLOWED_EMAILS.includes(session.user.email)) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-red-500">Access restricted. You are not authorized to view this page.</p>
        <a href="/" className="mt-4 text-blue-500 underline">
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