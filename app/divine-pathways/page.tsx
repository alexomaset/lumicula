"use client";

import ChatInterface from "../components/ChatInterface";
import { CharacterConfigs } from "../lib/Characters";

export default function DivinePathwaysPage() {
  return (
    <ChatInterface 
      character={CharacterConfigs.divinePathways} 
    />
  );
}