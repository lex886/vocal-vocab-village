import { useState } from "react";
import { TopicInput } from "@/components/TopicInput";
import { WordCard } from "@/components/WordCard";
import { Navigation } from "@/components/Navigation";

// Temporary mock data for initial development
const mockWords = [
  {
    word: "Dog",
    phonetic: "/dɔɡ/",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
  },
  {
    word: "Cat",
    phonetic: "/kæt/",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
  },
];

const Index = () => {
  const [words, setWords] = useState(mockWords);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleTopicSubmit = (topic: string) => {
    console.log("Generating words for topic:", topic);
    // TODO: Implement API call to generate words
  };

  const handlePlayAudio = () => {
    console.log("Playing audio for:", words[currentIndex].word);
    // TODO: Implement audio playback
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(words.length - 1, prev + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-accent/50 py-8">
      <div className="container max-w-4xl mx-auto space-y-8">
        <TopicInput onSubmit={handleTopicSubmit} />
        
        {words.length > 0 && (
          <>
            <WordCard
              {...words[currentIndex]}
              onPlayAudio={handlePlayAudio}
              total={words.length}
              current={currentIndex + 1}
            />
            <Navigation
              onPrevious={handlePrevious}
              onNext={handleNext}
              canGoPrevious={currentIndex > 0}
              canGoNext={currentIndex < words.length - 1}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;