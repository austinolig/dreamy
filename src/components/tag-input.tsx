"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

type Tag = {
  id: number;
  name: string;
};

type TagInputProps = {
  existingTags: Tag[];
  selectedTags?: string[];
  onChange?: (tags: string[]) => void;
  name?: string;
};

export function TagInput({
  existingTags,
  selectedTags = [],
  onChange,
  name = "tags",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[]>(selectedTags);
  const [suggestions, setSuggestions] = useState<Tag[]>([]);

  useEffect(() => {
    setTags(selectedTags);
  }, [selectedTags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      const filtered = existingTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(value.toLowerCase()) &&
          !tags.includes(tag.name)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addTag = (tagName: string) => {
    const trimmedTag = tagName.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      onChange?.(newTags);
    }
    setInputValue("");
    setSuggestions([]);
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    onChange?.(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type and press Enter to add tags..."
            className="flex-1"
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => {
              if (inputValue.trim()) {
                addTag(inputValue);
              }
            }}
            disabled={!inputValue.trim()}
            className="shrink-0"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <input type="hidden" name={name} value={tags.join(",")} />
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="rounded-md border bg-popover p-2">
          <p className="mb-2 text-xs text-muted-foreground">
            Suggestions (click to add):
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => addTag(tag.name)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
