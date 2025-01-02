import { notFound } from 'next/navigation';
import Image from 'next/image';
import ChatInterface from '@/app/components/ChatInterface';
import { db } from '@/app/db';
import { characters } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ characterId: string }> | { characterId: string };
};

// Generate metadata for the page
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  
  const character = await db.query.characters.findFirst({
    where: eq(characters.id, resolvedParams.characterId),
  });

  if (!character) {
    return {
      title: 'Character Not Found',
    };
  }

  return {
    title: `Chat with ${character.name}`,
    description: character.description || undefined,
  };
}

// Main page component
export default async function ChatPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  
  // Fetch character using the new syntax
  const character = await db.query.characters.findFirst({
    where: eq(characters.id, resolvedParams.characterId),
  });

  // Handle non-existent character
  if (!character) {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Character Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center shadow-sm">
        <div className="flex items-center space-x-3">
          {character.profileImage ? (
            <div className="w-10 h-10 rounded-full overflow-hidden relative">
              <Image
                src={character.profileImage}
                alt={character.name}
                fill
                className="object-cover"
                sizes="40px"
                priority
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {character.name[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="font-semibold">{character.name}</h1>
            {character.description && (
              <p className="text-sm text-gray-500 line-clamp-1">
                {character.description}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface character={character} />
      </div>
    </div>
  );
}