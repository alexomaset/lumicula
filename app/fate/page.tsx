"use client";

import ChatInterface from "../components/ChatInterface";
import { CharacterConfigs } from "../lib/Characters";

export default function FateWhispererPage() {
  return (
    <ChatInterface 
      character={CharacterConfigs.fateWhisperer} 
    />
  );
}