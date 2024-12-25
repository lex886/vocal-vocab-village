import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2 } from "lucide-react";

interface WordCardProps {
  word: string;
  phonetic: string;
  imageUrl: string;
  onPlayAudio: () => void;
  total: number;
  current: number;
}

export const WordCard = ({
  word,
  phonetic,
  imageUrl,
  onPlayAudio,
  total,
  current,
}: WordCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden animate-fade-in">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={imageUrl}
          alt={word}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-primary">{word}</h2>
            <p className="text-sm text-gray-500">{phonetic}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onPlayAudio}
            className="hover:bg-primary/10"
          >
            <Volume2 className="w-6 h-6 text-primary" />
          </Button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
        <p className="text-center text-sm text-gray-500">
          {current} of {total} words
        </p>
      </div>
    </Card>
  );
};