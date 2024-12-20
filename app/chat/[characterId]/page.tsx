import { notFound } from 'next/navigation';
import Image from 'next/image';
import ChatInterface from '@/app/components/ChatInterface';
import { db } from '@/app/db';
import { characters } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export default async function ChatPage({
  params
}: {
  params: { characterId: string }
}) {
  // Fetch character directly from the database
  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.id, params.characterId));

  if (!character) {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Character Header */}
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

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface character={character} />
      </div>
    </div>
  );
}