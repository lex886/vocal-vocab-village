import { useState } from "react";
import { TopicInput } from "@/components/TopicInput";
import { WordCard } from "@/components/WordCard";
import { startRecording, recognizeSpeech, compareWithTarget } from "@/utils/speechRecognition";
import { toast } from "@/components/ui/use-toast";

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);

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

  const handleRecord = async () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Please speak the word clearly",
      });
      try {
        const audioBlob = await startRecording();
        setRecordingBlob(audioBlob);
        
        const result = await recognizeSpeech(audioBlob);
        
        if (!result.success || !result.text) {
          toast({
            title: "Error",
            description: "Could not recognize speech. Please try again.",
            variant: "destructive",
          });
          return;
        }

        const isCorrect = compareWithTarget(result.text, words[currentIndex].word);
        const newStatuses = [...wordStatuses];
        newStatuses[currentIndex] = isCorrect ? 'correct' : 'incorrect';
        setWordStatuses(newStatuses);

        toast({
          title: isCorrect ? "Great job!" : "Keep practicing!",
          description: isCorrect 
            ? "Your pronunciation was correct!" 
            : "Try again - you're getting better!",
          variant: "default",
        });

      } catch (error) {
        console.error('Recording error:', error);
        toast({
          title: "Error",
          description: "There was a problem with the recording. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsRecording(false);
        setRecordingBlob(null);
      }
    }
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
            isRecording={isRecording}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
