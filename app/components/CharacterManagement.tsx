import React, { useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { 
  Paperclip, 
  Edit, 
  Trash2, 
  FileText, 
  Download, 
  X 
} from 'lucide-react';

// Types
interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
}

interface Character {
  id?: string;
  name: string;
  attachments: Attachment[];
}

const INITIAL_CHARACTER: Character = {
  name: '',
  attachments: []
};

const CharacterManagement: React.FC = () => {
  const [characters, setCharacters] = useState<Record<string, Character>>({});
  const [currentCharacter, setCurrentCharacter] = useState<Character>(INITIAL_CHARACTER);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newAttachments: Attachment[] = files.map(file => ({
      id: `attachment_${Date.now()}_${file.name}`,
      name: file.name,
      type: file.type,
      size: file.size,
      file: file
    }));

    setCurrentCharacter(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newAttachments]
    }));
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setCurrentCharacter(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter(
        attachment => attachment.id !== attachmentId
      )
    }));
  };

  const handleDownloadAttachment = (attachment: Attachment) => {
    const url = URL.createObjectURL(attachment.file);
    const link = document.createElement('a');
    link.href = url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddCharacter = () => {
    if (!currentCharacter.name.trim()) {
      alert('Please enter a character name');
      return;
    }

    const newId = `character_${Date.now()}`;
    setCharacters(prev => ({
      ...prev,
      [newId]: { ...currentCharacter, id: newId }
    }));
    setCurrentCharacter(INITIAL_CHARACTER);
  };

  const handleUpdateCharacter = () => {
    if (selectedCharacterId) {
      if (!currentCharacter.name.trim()) {
        alert('Please enter a character name');
        return;
      }

      setCharacters(prev => ({
        ...prev,
        [selectedCharacterId]: currentCharacter
      }));
      setEditMode(false);
      setSelectedCharacterId(null);
      setCurrentCharacter(INITIAL_CHARACTER);
    }
  };

  const handleEditCharacter = (characterId: string) => {
    const character = characters[characterId];
    setCurrentCharacter(character);
    setSelectedCharacterId(characterId);
    setEditMode(true);
  };

  const handleDeleteCharacter = (characterId: string) => {
    const updatedCharacters = { ...characters };
    delete updatedCharacters[characterId];
    setCharacters(updatedCharacters);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Character Management</CardTitle>
        <CardDescription>Add and manage characters with attachments</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Character List</TabsTrigger>
            <TabsTrigger value="add">Add/Edit Character</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <div className="grid gap-4">
              {Object.entries(characters).map(([id, character]) => (
                <Card key={id} className="flex justify-between items-center p-4">
                  <div>
                    <h3 className="font-bold">{character.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {character.attachments ? `${character.attachments.length} attachment(s)` : 'No attachments'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEditCharacter(id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleDeleteCharacter(id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="add">
            <div className="space-y-4">
              <Input 
                placeholder="Character Name" 
                className="w-1/2" 
                value={currentCharacter.name}
                onChange={(e) => setCurrentCharacter(prev => ({
                  ...prev, 
                  name: e.target.value
                }))}
              />

              {/* Attachments Section */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Attachments</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="mr-2 h-4 w-4" /> Upload File
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={handleFileUpload}
                  />
                </div>
                
                {currentCharacter.attachments && currentCharacter.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {currentCharacter.attachments.map((attachment) => (
                      <div 
                        key={attachment.id} 
                        className="flex justify-between items-center p-2 border rounded"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm">{attachment.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(attachment.size / 1024).toFixed(2)} KB)
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownloadAttachment(attachment)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveAttachment(attachment.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No attachments uploaded</p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4">
                {editMode ? (
                  <Button onClick={handleUpdateCharacter}>Update Character</Button>
                ) : (
                  <Button onClick={handleAddCharacter}>Add Character</Button>
                )}
                {editMode && (
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setEditMode(false);
                      setCurrentCharacter(INITIAL_CHARACTER);
                    }}
                  >
                    Cancel
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