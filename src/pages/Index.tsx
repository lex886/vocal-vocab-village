import { useState } from "react";
import { TopicInput } from "@/components/TopicInput";
import { WordCard } from "@/components/WordCard";

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

type WordStatus = 'unread' | 'correct' | 'incorrect';

const Index = () => {
  const [words, setWords] = useState(mockWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordStatuses, setWordStatuses] = useState<WordStatus[]>(
    new Array(mockWords.length).fill('unread')
  );

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

  const handleRecord = () => {
    console.log("Recording started for:", words[currentIndex].word);
    // TODO: Implement recording functionality
    // This is where we'll update the word status after speech recognition
    const newStatuses = [...wordStatuses];
    // For demo purposes, we'll randomly set the status
    newStatuses[currentIndex] = Math.random() > 0.5 ? 'correct' : 'incorrect';
    setWordStatuses(newStatuses);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-accent/50 py-8">
      <div className="container max-w-4xl mx-auto space-y-8">
        <TopicInput onSubmit={handleTopicSubmit} />
        
        {words.length > 0 && (
          <WordCard
            {...words[currentIndex]}
            onPlayAudio={handlePlayAudio}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onRecord={handleRecord}
            total={words.length}
            current={currentIndex + 1}
            canGoPrevious={currentIndex > 0}
            canGoNext={currentIndex < words.length - 1}
            wordStatuses={wordStatuses}
          />
        )}
      </div>
    </div>
  );
};

export default Index;