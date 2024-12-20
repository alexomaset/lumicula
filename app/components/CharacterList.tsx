import React from 'react';
import { Character } from '@/app/types/types';
import { Button } from './ui/Button';
import { Edit2, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/Card';

interface CharacterListProps {
  characters: Record<string, Character>;
  onEditCharacter: (id: string) => void;
  onDeleteCharacter: (id: string) => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  onEditCharacter,
  onDeleteCharacter,
}) => {
  if (Object.keys(characters).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No characters created yet. Create your first character to get started!
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Object.values(characters).map((character) => (
        <Card key={character.id} className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{character.name}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditCharacter(character.id)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this character?')) {
                      onDeleteCharacter(character.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            {character.description && (
              <CardDescription>{character.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {character.profileImage && typeof character.profileImage === 'string' && (
                <img
                  src={character.profileImage}
                  alt={character.name}
                  className="w-full h-32 object-cover rounded-md"
                />
              )}
              <div>
                <h4 className="font-semibold">Core Traits</h4>
                <ul className="list-disc list-inside">
                  {character.coreTraits.map((trait, index) => (
                    <li key={index}>
                      {trait.title}: {trait.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};