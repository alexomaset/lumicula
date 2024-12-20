import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import type { Character } from "../db/schema";

export default function CharacterGrid() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCharacters() {
      try {
        const response = await fetch('/api/characters');
        const data = await response.json();
        setCharacters(data);
      } catch (error) {
        console.error('Error loading characters:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCharacters();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-8 bg-amber-50">
      <main className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold mb-8 px-4 text-center">
          Support from higher powers. Connect with your counselor and get support.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 mt-8">
          {characters.map((character) => (
            <Link href={`/chat/${character.id}`} key={character.id}>
              <div className="flex flex-col items-center bg-white p-6 w-80">
                <div className="w-full h-48 bg-stone-400 flex items-center justify-center overflow-hidden">
                  {character.profileImage ? (
                    <Image
                      src={character.profileImage}
                      alt={character.name}
                      className="object-cover h-full w-full"
                      width={600}
                      height={300}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-center text-black">{character.name}</p>
                <button className="mt-4 bg-black hover:text-yellow-300 active:bg-blue-800 text-white py-2 px-4 rounded">
                  Connect
                </button>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}