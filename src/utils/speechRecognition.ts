import { toast } from "@/components/ui/use-toast";

const VOLCANO_API_URL = "wss://openspeech.bytedance.com/api/v2/asr";
const APP_ID = "2399138187";
const TOKEN = "FJ4Rlp-7DOFEnrGH_uFBQOVF2K2ObuWt";
const CLUSTER = "volcano_tts";

interface RecognitionResult {
  success: boolean;
  text?: string;
  error?: string;
}

export const startRecording = async (): Promise<Blob> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: Blob[] = [];

    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        stream.getTracks().forEach(track => track.stop());
        resolve(audioBlob);
      };

      mediaRecorder.onerror = (error) => {
        reject(error);
      };

      // Record for 3 seconds
      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 3000);
    });
  } catch (error) {
    console.error('Error accessing microphone:', error);
    throw error;
  }
};

export const recognizeSpeech = async (audioBlob: Blob): Promise<RecognitionResult> => {
  try {
    // Convert blob to base64
    const reader = new FileReader();
    const base64Audio = await new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.readAsDataURL(audioBlob);
    });

    const response = await fetch('/api/speech-recognition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio: base64Audio,
        appId: APP_ID,
        token: TOKEN,
        cluster: CLUSTER,
      }),
    });

    if (!response.ok) {
      throw new Error('Speech recognition failed');
    }

    const data = await response.json();
    return {
      success: true,
      text: data.result.payload_msg.result.texts[0],
    };
  } catch (error) {
    console.error('Speech recognition error:', error);
    return {
      success: false,
      error: 'Failed to recognize speech',
    };
  }
};

export const compareWithTarget = (recognized: string, target: string): boolean => {
  // Simple comparison - can be made more sophisticated
  return recognized.toLowerCase().trim() === target.toLowerCase().trim();
};