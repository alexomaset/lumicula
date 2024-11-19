"use client";

import ChatInterface from "../components/ChatInterface";
import { CharacterConfigs } from "../lib/Characters";

export default function CosmicHorizons() {
  return (
    <ChatInterface 
      character={CharacterConfigs.cosmicHorizons} 
    />
  );
}