"use client";
import { useRef, useEffect, useState } from "react";

import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";


export default function TestAudioIOS() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleTestAudio = () => {
    const sdkApiKey = "c285659291c54dceb780633a32bbfc80";
    const sdkRegion = "australiaeast";
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(sdkApiKey, sdkRegion);
    speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio24Khz96KBitRateMonoMp3;
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    let synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);
    synthesizer.speakSsmlAsync(
      `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="en-US-JennyNeural"><prosody rate="0%" pitch="0%">This is a test of Azure Text to Speech audio output on iOS.</prosody></voice></speak>`,
      function (result: any) {
        console.log("success", result);
        synthesizer.close();
      },
      function (err: any) {
        console.log("Error", err);
        synthesizer.close();
      }
    );
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>iOS Audio Output Test</h1>
      <p>
        This page tests Azure Text to Speech audio output on iOS. Click the button below to play a test message.
      </p>
      <button
        ref={buttonRef}
        onClick={handleTestAudio}
        style={{ fontSize: 24, padding: 16 }}
      >
        Play Test Audio
      </button>
      <p style={{ marginTop: 24, color: "#888" }}>
        <b>Note:</b> You must provide your Azure Speech key and region in the code. The Speech SDK is imported as an npm package.
      </p>
    </div>
  );
}
