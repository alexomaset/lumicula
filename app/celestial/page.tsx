"use client";

import ChatInterface from "../components/ChatInterface";
import { CharacterConfigs } from "../lib/Characters";

export default function CelestialOraclePage() {
  return (
    <ChatInterface 
      character={CharacterConfigs.celestialOracle} 
    />
  );
}