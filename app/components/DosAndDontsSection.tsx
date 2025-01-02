import React from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Plus, Trash2 } from "lucide-react";

interface DosAndDontsProps {
  dos: string[];
  donts: string[];
  onAddDosOrDonts: (type: "dos" | "donts") => void;
  onRemoveDosOrDonts: (type: "dos" | "donts", index: number) => void;
  onUpdateDosOrDonts: (
    type: "dos" | "donts",
    index: number,
    value: string
  ) => void;
}

export const DosAndDontsSection: React.FC<DosAndDontsProps> = ({
  dos,
  donts,
  onAddDosOrDonts,
  onRemoveDosOrDonts,
  onUpdateDosOrDonts,
}) => {
  const renderSection = (type: "dos" | "donts", items: string[]) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">
          {type === "dos" ? "Dos" : "Don'ts"}
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onAddDosOrDonts(type)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add{" "}
          {type === "dos" ? "Do" : "Don't"}
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="flex items-center mb-2 space-x-2">
          <Input
            value={item}
            onChange={(e) => onUpdateDosOrDonts(type, index, e.target.value)}
            placeholder={`${type === "dos" ? "Do" : "Don't"} ${index + 1}`}
            className="flex-grow"
          />
          {items.length > 1 && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onRemoveDosOrDonts(type, index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {renderSection("dos", dos)}
      {renderSection("donts", donts)}
    </div>
  );
};
