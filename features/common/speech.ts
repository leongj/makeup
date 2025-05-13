
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const SPEECH_TOKEN_EXPIRY_MS = 9 * 60 * 1000; // 9 minutes

let speechConfig: SpeechSDK.SpeechConfig | undefined;
let synthesizer: SpeechSDK.SpeechSynthesizer | undefined;
let lastTokenFetchTime = 0;

async function getToken(): Promise<{ token: string; region: string } | null> {
  try {
    const res = await fetch('/api/speech-token');
    if (!res.ok) {
      console.error("Failed to fetch speech token from backend:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    if (data.error) {
      console.error("Error in speech token response:", data.error);
      return null;
    }
    return { token: data.token, region: data.region };
  } catch (error) {
    console.error("Error fetching or parsing speech token:", error);
    return null;
  }
}

async function getSpeechConfig(): Promise<SpeechSDK.SpeechConfig | undefined> {
  const now = Date.now();
  if (!speechConfig || (now - lastTokenFetchTime > SPEECH_TOKEN_EXPIRY_MS)) {
    const tokenData = await getToken();
    if (tokenData) {
      speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(tokenData.token, tokenData.region);
      // The language of the voice that speaks.
      speechConfig.speechSynthesisVoiceName = "en-US-AvaMultilingualNeural";
      lastTokenFetchTime = now;
    } else {
      // Invalidate existing config if token fetch fails
      speechConfig = undefined;
    }
  }
  return speechConfig;
}

export async function speakText(textToSpeak: string): Promise<void> {
  const config = await getSpeechConfig();
  if (!config) {
    console.error("Speech SDK config not available. Cannot speak text.");
    return;
  }

  // Recreate synthesizer if it doesn't exist or if config might have changed (though less likely with token refresh)
  if (!synthesizer) {
    synthesizer = new SpeechSDK.SpeechSynthesizer(config);
  } else {
    // If the config object itself was replaced, we need a new synthesizer
    // This simple check might not be enough if the internal state of config can change without the object reference changing.
    // However, fromAuthorizationToken likely returns a new object or updates in a way that requires re-init.
    if (synthesizer.speechConfig !== config) {
        synthesizer.close();
        synthesizer = new SpeechSDK.SpeechSynthesizer(config);
    }
  }

  synthesizer.speakTextAsync(
    textToSpeak,
    result => {
      if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
        console.log("Synthesis finished.");
      } else {
        console.error("Speech synthesis canceled, " + result.errorDetails);
      }
      // Do not close the synthesizer here if we want to reuse it.
      // synthesizer.close(); 
    },
    err => {
      console.trace("Error during synthesis - " + err);
      // Potentially close and nullify synthesizer on critical error to force re-init next time
      // synthesizer.close();
      // synthesizer = undefined;
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
