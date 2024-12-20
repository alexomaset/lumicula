import { Character as DbCharacter } from '@/app/db/schema';

export interface CoreTrait {
  title: string;
  description: string;
}

export interface Prompt {
  category: string;
  prompt: string;
  exampleResponse: string;
}

export interface DosAndDonts {
  dos: string[];
  donts: string[];
}

// UI Character type
export interface Character {
  id: string;
  name: string;
  description?: string | null;
  profileImage?: string | File | null;
  languageStyle?: string | null;
  coreTraits: CoreTrait[];
  prompts: Prompt[];
  dosAndDonts: DosAndDonts;
}

// API Character type (for sending to the server)
export interface ApiCharacter {
  name: string;
  description?: string | null;
  profileImage?: string | null;
  languageStyle?: string | null;
  coreTraits: CoreTrait[];
  prompts: Prompt[];
  dosAndDonts: DosAndDonts;
}

export const INITIAL_CHARACTER: Character = {
  id: '',
  name: '',
  description: '',
  languageStyle: '',
  coreTraits: [],
  prompts: [],
  dosAndDonts: {
    dos: [],
    donts: []
  }
};