"use client";

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Character } from "./db/schema";
import Footer from "./footer/page";
import AnimatedBackground from "./components/AnimatedBackground";

const Meteor = () => (
  <div className="fixed -z-10 h-[1px] w-24 bg-gradient-to-r from-transparent via-yellow-200 to-transparent rotate-[35deg] animate-meteor">
    <div className="h-full w-full bg-gradient-to-r from-transparent via-yellow-100 to-transparent" />
  </div>
);

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
      // Navigate to the character's description page
      await router.push(`/character/${character.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      setConnectingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <>
       <div className="min-h-screen flex flex-col items-center justify-between py-8 bg-amber-50 bg-opacity-80 overflow-hidden">
        <AnimatedBackground />
        {[...Array(5)].map((_, index) => (
          <Meteor key={index} />
        ))}
        {/* Increased z-index and added padding-top */}
        <main className="flex flex-col items-center text-center relative z-50 pt-16">
          <h2 className="text-3xl font-bold mb-12 px-4 text-center bg-gradient-to-r from-amber-700 to-yellow-500 bg-clip-text text-transparent relative">
            Support from higher powers. <br />
            Connect with your counselor and get support.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 mt-8">
            {Array.isArray(characters) && characters.map((character) => (
              <div key={character.id} 
                className="group relative flex flex-col items-center bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden p-6 w-80">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-full h-48 bg-stone-400 rounded-lg flex items-center justify-center overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
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
                <h3 className="mt-6 text-xl font-semibold bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-300">
                  {character.name}
                </h3>
                <button 
                  onClick={() => handleConnect(character)}
                  disabled={connectingId === character.id}
                  className="mt-4 py-2 px-6 rounded-full bg-black text-white hover:bg-amber-900 hover:text-yellow-300 active:bg-blue-800 transition-colors duration-300 flex items-center justify-center min-w-[120px] relative group overflow-hidden"
                >
                  <div className="relative z-10">
                    {connectingId === character.id ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      'Connect'
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
      <style jsx global>{`
        @keyframes meteor {
          0% { transform: translateX(-100%) translateY(-100%) rotate(35deg); }
          100% { transform: translateX(200%) translateY(200%) rotate(35deg); }
        }
        .animate-meteor {
          animation: meteor 5s linear infinite;
          animation-delay: calc(var(--delay) * 1s);
          position: absolute;
          top: calc(var(--top) * 1%);
          left: calc(var(--left) * 1%);
        }
      `}</style>
      <Footer />
    </>
  );
}