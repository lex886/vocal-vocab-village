import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopicInputProps {
  onSubmit: (topic: string) => void;
}

export const TopicInput = ({ onSubmit }: TopicInputProps) => {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
      setTopic("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center text-primary">English Vocabulary Learning</h1>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter a topic (e.g., animals, weather)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          Generate
        </Button>
      </div>
    </form>
  );
};