"use client";

import ChatInterface from "../components/ChatInterface";
import { CharacterConfigs } from "../lib/Characters";

export default function StellarWisdomPage() {
  return (
    <ChatInterface 
      character={CharacterConfigs.stellarWisdom} 
    />
  );
}