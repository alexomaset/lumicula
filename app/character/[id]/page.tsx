'use client';
import { useEffect, useState } from "react";
import React from "react";
import Image from 'next/image';
import CharacterPage from "../../components/CharacterPage";
import Footer from "../../footer/page";
import type { Character } from "../../db/schema";
import { motion } from "framer-motion";

export default function CharacterDescriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const response = await fetch(`/api/characters/${id}`);
        const data = await response.json();
        setCharacter(data);
      } catch (error) {
        console.error("Error fetching character:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCharacter();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-grow bg-gradient-to-b from-blue-50 to-yellow-50 flex items-center justify-center">
          <div className="animate-pulse text-2xl text-yellow-600">
            Loading Character...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-grow bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center">
          <div className="text-3xl text-red-500 mb-4">⚠️ Character Not Found</div>
          <p className="text-gray-600 text-lg">The requested character could not be loaded.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-24"> {/* Increased vertical padding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden relative z-10" // Added z-index
          >
            <div className="flex flex-col md:flex-row">
              {/* Character Image */}
              <div className="md:w-1/3 relative">
                <Image
                  src={character.profileImage || "/default-profile.png"}
                  alt={character.name}
                  width={400}
                  height={500}
                  className="w-full h-64 md:h-full object-cover border-b-4 md:border-b-0 md:border-r-4 border-yellow-200"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h1 className="text-3xl font-bold text-yellow-500">
                    {character.name || "Unknown Character"}
                  </h1>
                </div>
              </div>

              {/* Character Details */}
              <div className="md:w-2/3 p-6 space-y-6">
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Character Description
                  </h2>
                  <p className="text-gray-600 font-serif text-lg leading-relaxed">
                    {character.description || "No description available"}
                  </p>
                </div>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`/chat/${character.id || "unknown"}`}
                  className="inline-block w-full md:w-auto bg-gray-600 hover:bg-yellow-900 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-center"
                >
                  💬 Start Chatting
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-yellow-100 px-4 py-2 rounded-full text-sm text-purple-600">
              🎭 Character Profile
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}