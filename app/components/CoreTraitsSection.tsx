import React from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Plus, Trash2 } from 'lucide-react';

interface CoreTraitsProps {
  coreTraits: Array<{ title: string; description: string }>;
  onAddTrait: () => void;
  onRemoveTrait: (index: number) => void;
  onUpdateTrait: (index: number, field: 'title' | 'description', value: string) => void;
}

export const CoreTraitsSection: React.FC<CoreTraitsProps> = ({
  coreTraits,
  onAddTrait,
  onRemoveTrait,
  onUpdateTrait
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Core Traits</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onAddTrait}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Trait
        </Button>
      </div>
      {coreTraits.map((trait, index) => (
        <div key={index} className="mb-4 p-3 border rounded">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Trait {index + 1}</h4>
            {coreTraits.length > 1 && (
              <Button 
                type="button"
                variant="destructive" 
                size="icon"
                onClick={() => onRemoveTrait(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              value={trait.title}
              onChange={(e) => onUpdateTrait(index, 'title', e.target.value)}
              placeholder="Trait Title (e.g., Socratic Questioning)"
            />
            <Input 
              value={trait.description}
              onChange={(e) => onUpdateTrait(index, 'description', e.target.value)}
              placeholder="Trait Description"
            />
          </div>
        </div>
      ))}
    </div>
  );
};