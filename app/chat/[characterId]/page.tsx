import { notFound } from 'next/navigation';
import Image from 'next/image';
import ChatInterface from '@/app/components/ChatInterface';
import { db } from '@/app/db';
import { characters } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { Suspense } from 'react';

// Loading component remains the same
function LoadingState() {
  return (
    <div className="flex h-screen flex-col">
      <header className="bg-white border-b px-4 py-3 flex items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-48 bg-gray-200 rounded mt-2 animate-pulse" />
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <div className="text-gray-500">Loading chat...</div>
        </div>
      </div>
    </div>
  );
}

// Character content component
async function CharacterContent({
  characterId
}: {
  characterId: string;
}) {
  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.id, characterId));

  if (!character) {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="bg-white border-b px-4 py-3 flex items-center">
        <div className="flex items-center space-x-3">
          {character.profileImage ? (
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={character.profileImage}
                alt={character.name}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {character.name[0]}
            </div>
          )}
          <div>
            <h1 className="font-semibold">{character.name}</h1>
            <p className="text-sm text-gray-500">{character.description}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ChatInterface character={character} />
      </div>
    </div>
  );
}

// Main page component
export default async function ChatPage({
  params
}: {
  params: { characterId: string }
}) {
  const characterId = await params.characterId;
  
  return (
    <Suspense fallback={<LoadingState />}>
      <CharacterContent characterId={characterId} />
    </Suspense>
  );
}