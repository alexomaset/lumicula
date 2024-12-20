import React from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Input';
import { Plus, Trash2 } from 'lucide-react';

interface PromptsProps {
  prompts: Array<{
    category: string;
    prompt: string;
    exampleResponse: string;
  }>;
  onAddPrompt: () => void;
  onRemovePrompt: (index: number) => void;
  onUpdatePrompt: (index: number, field: keyof PromptsProps['prompts'][0], value: string) => void;
}

export const PromptsSection: React.FC<PromptsProps> = ({
  prompts,
  onAddPrompt,
  onRemovePrompt,
  onUpdatePrompt
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Prompts</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onAddPrompt}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Prompt
        </Button>
      </div>
      {prompts.map((prompt, index) => (
        <div key={index} className="mb-4 p-3 border rounded">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Prompt {index + 1}</h4>
            {prompts.length > 1 && (
              <Button 
                type="button"
                variant="destructive" 
                size="icon"
                onClick={() => onRemovePrompt(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input 
              value={prompt.category}
              onChange={(e) => onUpdatePrompt(index, 'category', e.target.value)}
              placeholder="Prompt Category"
            />
            <Input 
              value={prompt.prompt}
              onChange={(e) => onUpdatePrompt(index, 'prompt', e.target.value)}
              placeholder="Prompt Text"
            />
            <Textarea 
              value={prompt.exampleResponse}
              onChange={(e) => onUpdatePrompt(index, 'exampleResponse', e.target.value)}
              placeholder="Example Response"
              rows={3}
            />
          </div>
        </div>
      ))}
    </div>
  );
};