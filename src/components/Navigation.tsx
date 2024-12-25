import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const Navigation = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: NavigationProps) => {
  return (
    <div className="flex justify-center gap-4 p-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="w-32"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <Button
        variant="outline"
        onClick={onNext}
        disabled={!canGoNext}
        className="w-32"
      >
        Next <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};