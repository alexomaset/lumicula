import { ApiCharacter, Character } from "@/app/types/types";

// Helper function to convert UI Character to API Character
function convertToApiCharacter(character: Character): ApiCharacter {
  const { id, profileImage, ...rest } = character;
  return {
    ...rest,
    profileImage: typeof profileImage === 'string' ? profileImage : null,
  };
}

export async function getCharacters() {
  const response = await fetch('/api/characters');
  if (!response.ok) {
    throw new Error('Failed to fetch characters');
  }
  return response.json();
}

export async function createCharacter(character: Character, profileImage?: File) {
  const formData = new FormData();
  const apiCharacter = convertToApiCharacter(character);
  formData.append('character', JSON.stringify(apiCharacter));
  
  if (profileImage) {
    formData.append('profileImage', profileImage);
  }

  const response = await fetch('/api/characters', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create character');
  }
  return response.json();
}

export async function updateCharacter(id: string, character: Character, profileImage?: File) {
  const formData = new FormData();
  const apiCharacter = convertToApiCharacter(character);
  formData.append('character', JSON.stringify(apiCharacter));
  
  if (profileImage) {
    formData.append('profileImage', profileImage);
  }

  const response = await fetch(`/api/characters/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update character');
  }
  return response.json();
}

export async function deleteCharacter(id: string) {
  const response = await fetch(`/api/characters/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete character');
  }
}