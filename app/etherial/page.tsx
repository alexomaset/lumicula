"use client";

import ChatInterface from "../components/ChatInterface";
import { CharacterConfigs } from "../lib/Characters";

export default function EtherealVisionsPage() {
  return (
    <ChatInterface 
      character={CharacterConfigs.etherealVisions} 
    />
  );
}