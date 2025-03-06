import LoadingSpinner from "./LoadingSpinner";
import { useState } from "react";

interface ChatInputFormProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  className?: string;
  onFocusChange?: (isFocused: boolean) => void;
}

export default function ChatInputForm({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  onFocusChange,
}: ChatInputFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex gap-2 z-10 max-w-4xl mx-auto"
    >
      <input
        name="prompt"
        value={input}
        onChange={handleInputChange}
        onFocus={() => onFocusChange?.(true)}
        onBlur={() => onFocusChange?.(false)}
        className="flex-1 p-3 border rounded-lg text-base"
        placeholder="Type your message..."
        disabled={isLoading}
      />
      <button
        type="submit"
        className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-base"
        disabled={isLoading}
      >
        {isLoading ? <LoadingSpinner /> : "Send"}
      </button>
    </form>
  );
}