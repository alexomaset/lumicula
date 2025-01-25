"use client";

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Character } from "./db/schema";
import Footer from "./footer/page";

export default function CharacterGrid() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCharacters() {
      try {
        const response = await fetch('/api/characters');
        const data = await response.json();
        console.log('API Response:', data);
        
        if (Array.isArray(data)) {
          setCharacters(data);
        } else if (data?.characters && Array.isArray(data.characters)) {
          setCharacters(data.characters);
        } else {
          console.error('Invalid data format received:', data);
          setCharacters([]);
        }
      } catch (error) {
        console.error('Error loading characters:', error);
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    }
  
    loadCharacters();
  }, []);

  const handleConnect = async (character: Character) => {
    setConnectingId(character.id);
    try {
      await router.push(`/chat/${character.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      setConnectingId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-between py-8 bg-amber-50">
      <main className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold mb-8 px-4 text-center">
          Support from higher powers. Connect with your counselor and get support.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 mt-8">
          {Array.isArray(characters) && characters.map((character) => (
            <div key={character.id} className="flex flex-col items-center bg-white p-6 w-80">
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
              <button 
                onClick={() => handleConnect(character)}
                disabled={connectingId === character.id}
                className={`mt-4 py-2 px-4 rounded flex items-center justify-center min-w-[100px] ${
                  connectingId === character.id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-black hover:text-yellow-300 active:bg-blue-800 text-white'
                }`}
              >
                {connectingId === character.id ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
    <Footer />
    </>
  );
}