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

    // Connect directly to Volcano API using WebSocket
    const ws = new WebSocket(VOLCANO_API_URL);
    
    return new Promise((resolve, reject) => {
      ws.onopen = () => {
        // Send the initial request with authentication and configuration
        const request = {
          app: {
            appid: APP_ID,
            cluster: CLUSTER,
            token: TOKEN,
          },
          user: {
            uid: 'user_1', // You might want to make this dynamic
          },
          audio: {
            format: 'wav',
            channel: 1,
            language: 'en-US',
            sample_rate: 16000,
          },
          request: {
            audio_data: base64Audio,
          },
        };
        
        ws.send(JSON.stringify(request));
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.result && response.result.texts) {
          resolve({
            success: true,
            text: response.result.texts[0],
          });
          ws.close();
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject({
          success: false,
          error: 'Failed to connect to speech recognition service',
        });
        ws.close();
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
    });
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