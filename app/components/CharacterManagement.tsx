import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Input';
import { Save, Loader2 } from 'lucide-react';
import { PromptsSection } from './PromptsSection';
import { Character, INITIAL_CHARACTER } from '../types/types';
import { ProfileImageUploader } from './ProfileImageUploader';
import { CoreTraitsSection } from './CoreTraitsSection';
import { DosAndDontsSection } from './DosAndDontsSection';
import { CharacterList } from './CharacterList';
import { useToast } from './ui/usetoast';
import { 
  getCharacters, 
  createCharacter, 
  updateCharacter, 
  deleteCharacter 
} from '../lib/api';

const CharacterManagement: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [characters, setCharacters] = useState<Record<string, Character>>({});
  const [currentCharacter, setCurrentCharacter] = useState<Character>(INITIAL_CHARACTER);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  // Fetch characters on component mount
  const fetchCharacters = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedCharacters = await getCharacters();
      const charactersRecord = fetchedCharacters.reduce((acc: Record<string, Character>, char: Character) => {
        acc[char.id!] = char;
        return acc;
      }, {});
      setCharacters(charactersRecord);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch characters",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  // Utility function to update a specific field

  const updateField = <K extends keyof Character>(field: K, value: Character[K]) => {
    setCurrentCharacter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Core Traits Methods
  const updateCoreTrait = (index: number, field: 'title' | 'description', value: string) => {
    setCurrentCharacter(prev => {
      const updatedTraits = [...prev.coreTraits];
      updatedTraits[index] = {
        ...updatedTraits[index],
        [field]: value
      };
      return { ...prev, coreTraits: updatedTraits };
    });
  };

  const addCoreTrait = () => {
    setCurrentCharacter(prev => ({
      ...prev,
      coreTraits: [...prev.coreTraits, { title: '', description: '' }]
    }));
  };

  const removeCoreTrait = (index: number) => {
    setCurrentCharacter(prev => ({
      ...prev,
      coreTraits: prev.coreTraits.filter((_, i) => i !== index)
    }));
  };

  // Prompts Methods
  const updatePrompt = (index: number, field: keyof Character['prompts'][0], value: string) => {
    setCurrentCharacter(prev => {
      const updatedPrompts = [...prev.prompts];
      updatedPrompts[index] = {
        ...updatedPrompts[index],
        [field]: value
      };
      return { ...prev, prompts: updatedPrompts };
    });
  };

  const addPrompt = () => {
    setCurrentCharacter(prev => ({
      ...prev,
      prompts: [...prev.prompts, { category: '', prompt: '', exampleResponse: '' }]
    }));
  };

  const removePrompt = (index: number) => {
    setCurrentCharacter(prev => ({
      ...prev,
      prompts: prev.prompts.filter((_, i) => i !== index)
    }));
  };

  // Dos and Don'ts Methods
  const updateDosAndDonts = (type: 'dos' | 'donts', index: number, value: string) => {
    setCurrentCharacter(prev => {
      const updatedSection = [...prev.dosAndDonts[type]];
      updatedSection[index] = value;
      return {
        ...prev,
        dosAndDonts: {
          ...prev.dosAndDonts,
          [type]: updatedSection
        }
      };
    });
  };

  const addDosOrDonts = (type: 'dos' | 'donts') => {
    setCurrentCharacter(prev => ({
      ...prev,
      dosAndDonts: {
        ...prev.dosAndDonts,
        [type]: [...prev.dosAndDonts[type], '']
      }
    }));
  };

  const removeDosOrDonts = (type: 'dos' | 'donts', index: number) => {
    setCurrentCharacter(prev => ({
      ...prev,
      dosAndDonts: {
        ...prev.dosAndDonts,
        [type]: prev.dosAndDonts[type].filter((_, i) => i !== index)
      }
    }));
  };

  const handleProfileImageUpload = (file: File) => {
    setCurrentCharacter(prev => ({
      ...prev,
      profileImage: file
    }));
  };

  const handleRemoveProfileImage = () => {
    setCurrentCharacter(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  // Character Management Methods
  const handleAddCharacter = async () => {
    if (!currentCharacter.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a character name",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const newCharacter = await createCharacter(
        currentCharacter, 
        currentCharacter.profileImage instanceof File ? currentCharacter.profileImage : undefined
      );
      
      setCharacters(prev => ({
        ...prev,
        [newCharacter.id]: newCharacter,
      }));

      toast({
        title: "Success",
        description: "Character created successfully",
      });

      // Reset form and switch to list view
      setCurrentCharacter(INITIAL_CHARACTER);
      setActiveTab('list');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create character",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCharacter = async () => {
    if (!selectedCharacterId) return;
    
    if (!currentCharacter.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a character name",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedCharacter = await updateCharacter(
        selectedCharacterId,
        currentCharacter,
        currentCharacter.profileImage instanceof File ? currentCharacter.profileImage : undefined
      );

      setCharacters(prev => ({
        ...prev,
        [selectedCharacterId]: updatedCharacter,
      }));
      
      toast({
        title: "Success",
        description: "Character updated successfully",
      });

      setEditMode(false);
      setSelectedCharacterId(null);
      setCurrentCharacter(INITIAL_CHARACTER);
      setActiveTab('list');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update character",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCharacter = (characterId: string) => {
    const character = characters[characterId];
    setCurrentCharacter(character);
    setSelectedCharacterId(characterId);
    setEditMode(true);
    setActiveTab('add');
  };

  const handleDeleteCharacter = async (characterId: string) => {
    try {
      await deleteCharacter(characterId);
      
      const updatedCharacters = { ...characters };
      delete updatedCharacters[characterId];
      setCharacters(updatedCharacters);
      
      toast({
        title: "Success",
        description: "Character deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete character",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Character Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Character List</TabsTrigger>
            <TabsTrigger value="add">Add/Edit Character</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <CharacterList 
                characters={characters}
                onEditCharacter={handleEditCharacter}
                onDeleteCharacter={handleDeleteCharacter}
              />
            )}
          </TabsContent>

          <TabsContent value="add">
            <div className="space-y-4">
              {/* Profile Image Upload */}
              <ProfileImageUploader 
               profileImage={
                currentCharacter.profileImage instanceof File 
                  ? currentCharacter.profileImage 
                  : undefined
              }
              onUpload={handleProfileImageUpload}
              onRemove={handleRemoveProfileImage}
              />

              {/* Character Form */}
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Character Name</label>
                    <Input 
                      value={currentCharacter.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Enter character name"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Description</label>
                    <Textarea 
                      value={currentCharacter.description ?? ''}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Describe your character"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Core Traits Section */}
                <CoreTraitsSection 
                  coreTraits={currentCharacter.coreTraits}
                  onAddTrait={addCoreTrait}
                  onRemoveTrait={removeCoreTrait}
                  onUpdateTrait={updateCoreTrait}
                />

                {/* Language Style */}
                <div>
                  <label className="block mb-2">Language Style</label>
                  <Textarea 
                    value={currentCharacter.description ?? ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Describe your character"
                    rows={3}
                  />
                </div>

                {/* Prompts Section */}
                <PromptsSection 
                  prompts={currentCharacter.prompts}
                  onAddPrompt={addPrompt}
                  onRemovePrompt={removePrompt}
                  onUpdatePrompt={updatePrompt}
                />

                {/* Dos and Don'ts Section */}
                <DosAndDontsSection 
                  dos={currentCharacter.dosAndDonts.dos}
                  donts={currentCharacter.dosAndDonts.donts}
                  onAddDosOrDonts={addDosOrDonts}
                  onRemoveDosOrDonts={removeDosOrDonts}
                  onUpdateDosOrDonts={updateDosAndDonts}
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-4">
                {editMode ? (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleUpdateCharacter} 
                      className="flex-grow"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Update Character
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => {
                        setEditMode(false);
                        setCurrentCharacter(INITIAL_CHARACTER);
                        setActiveTab('list');
                      }}
                      className="flex-grow"
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleAddCharacter} 
                    className="w-full"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Character
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CharacterManagement;