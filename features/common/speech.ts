import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const SPEECH_TOKEN_EXPIRY_MS = 9 * 60 * 1000; // 9 minutes

let speechConfig: SpeechSDK.SpeechConfig | undefined;
let synthesizer: SpeechSDK.SpeechSynthesizer | undefined;
let lastTokenFetchTime = 0;

import { GetSpeechToken } from "./speech-service";

async function getToken(): Promise<{ token: string; region: string } | null> {
  try {
    const data = await GetSpeechToken();
    console.log("GetSpeechToken success");
    if (data.error) {
      console.error("Error in speech token response:", data.errorMessage);
      return null;
    }
    return { token: data.token, region: data.region };
  } catch (error) {
    console.error("Error fetching or parsing speech token:", error);
    return null;
  }
}

export async function getSpeechConfig(): Promise<SpeechSDK.SpeechConfig | undefined> {
  const now = Date.now();
  if (speechConfig) {
    console.log("Existing speech config.");
  }

  if (!speechConfig || (now - lastTokenFetchTime > SPEECH_TOKEN_EXPIRY_MS)) {
    console.log("Speech token expired or not set, attempting to refresh...");
    const tokenData = await getToken();
    if (tokenData) {
      speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(tokenData.token, tokenData.region);
      speechConfig.speechSynthesisVoiceName = "en-AU-TinaNeural";
      lastTokenFetchTime = now;
      console.log("Speech token refreshed successfully.");
    } else {
      console.error("Failed to refresh speech token.");
      // Invalidate existing config if token fetch fails
      speechConfig = undefined;
    }
  }
  return speechConfig;
}

export async function speakText(textToSpeak: string): Promise<void> {
  console.log(`speakText called with: "${textToSpeak}"`);
  const config = await getSpeechConfig();
  if (!config) {
    console.error("Speech SDK config not available. Cannot speak text.");
    return;
  }

  // Use PullAudioOutputStream and Web Audio API for maximum compatibility
  const audioStream = SpeechSDK.PullAudioOutputStream.create();
  const audioConfig = SpeechSDK.AudioConfig.fromStreamOutput(audioStream);
  const localSynthesizer = new SpeechSDK.SpeechSynthesizer(config, audioConfig);

  // Web Audio API setup
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  localSynthesizer.speakTextAsync(
    textToSpeak,
    result => {
      if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
        console.log("Speech synthesis completed successfully.");
        // Decode and play audio using Web Audio API
        const audioData = result.audioData;
        audioContext.decodeAudioData(
          audioData,
          buffer => {
            const bufferSource = audioContext.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.connect(audioContext.destination);
            bufferSource.start(0);
          },
          error => {
            console.error("Error decoding audio data:", error);
          }
        );
      } else {
        console.error("Speech synthesis canceled, " + result.errorDetails);
      }
      localSynthesizer.close();
    },
    err => {
      console.trace("Error during synthesis - " + err);
      localSynthesizer.close();
    }
  );
}

// Optional: Function to explicitly close/release resources if the page/component is unmounted
export function cleanupSpeechServices() {
  if (synthesizer) {
    synthesizer.close();
    synthesizer = undefined;
  }
  speechConfig = undefined; // Clear the config
  lastTokenFetchTime = 0;
  console.log("Speech services cleaned up.");
}
