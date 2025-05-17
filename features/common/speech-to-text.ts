import {
  AudioConfig,
  AutoDetectSourceLanguageConfig,
  SpeechConfig,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { getSpeechConfig } from "./speech"; // Reuse token/config logic from TTS
import { setSpeechInput } from "../product-page/store";

let speechRecognizer: SpeechRecognizer | undefined = undefined;

export async function startRecognition() {
  console.log("[speech-to-text] startRecognition called");
  const speechConfig = await getSpeechConfig();
  if (!speechConfig) {
    setSpeechInput(""); // Optionally clear input on error
    return;
  }

  const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
  const autoDetectSourceLanguageConfig =
    AutoDetectSourceLanguageConfig.fromLanguages([
      "en-US"
    ]);

  const recognizer = SpeechRecognizer.FromConfig(
    speechConfig,
    autoDetectSourceLanguageConfig,
    audioConfig
  );

  speechRecognizer = recognizer;

  recognizer.recognizing = (s, e) => {
    console.log("[speech-to-text] recognizing:", e.result.text);
    setSpeechInput(e.result.text);
  };

  recognizer.recognized = (s, e) => {
    console.log("[speech-to-text] recognized:", e.result.text);
    setSpeechInput(e.result.text);
  };

  recognizer.canceled = (s, e) => {
    console.log("[speech-to-text] canceled:", e.errorDetails);
    // setSpeechInput(""); // Optionally clear input on cancel/error
  };

  // recognizer.sessionStopped = () => {
  //   console.log("[speech-to-text] session stopped");
  //   setSpeechInput("");
  // };

  recognizer.startContinuousRecognitionAsync();
}

export function stopRecognition() {
  if (speechRecognizer) {
    console.log("[speech-to-text] stopRecognition called");
    speechRecognizer.stopContinuousRecognitionAsync();
    speechRecognizer = undefined;
  }
}
