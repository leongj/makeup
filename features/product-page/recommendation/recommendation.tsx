"use client";

import { useEffect } from "react";
import { useAltImages, useRecommendation } from "../store";
import { getSpeechConfig } from "../../common/speech";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { Markdown } from "../../common/markdown";
import { LIPSTICK_PRODUCTS } from "../products";

interface RecommendationProps {
  imageSrc: string | null;
  occasion: string | null;
}

export const Recommendation: React.FC<RecommendationProps> = ({
  imageSrc,
  occasion,
}) => {
  const images = useAltImages(); // This might be for alternative images, not the main one
  const recommendation = useRecommendation(); // This is likely where the AI description will live


  // Helper to strip all ** from text
  function getPlainText(text: string) {
    return text.replace(/\*/g, "");
  }

  // Speak only once when recommendation.text is set and not loading
  // Speak only once when recommendation.text is set and not loading
  useEffect(() => {
    // Optionally, you can auto-speak here if desired, but for now, do nothing (manual SPEAK only)
  }, [recommendation.text, recommendation.isLoading]);

  async function speakText(text: string) {
    if (!recommendation.text) return;
    const speechConfig = await getSpeechConfig();
    if (!speechConfig) {
      alert("Failed to get speech config. Please check your backend token service.");
      return;
    }

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    let synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);
    synthesizer.speakSsmlAsync(
      `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="en-AU-TinaNeural"><prosody rate="1.1" pitch="0%">${getPlainText(recommendation.text)}</prosody></voice></speak>`,
      function (result: any) {
        console.log("Speech Success", result);
        synthesizer.close();
      },
      function (err: any) {
        console.log("Speech Error", err);
        synthesizer.close();
      }
    );
  }


  // Helper to find product and shade info by shade id
  function findShadeName(productId: string) {
    let productInfo = null;
    let shadeName = null;
    for (const prod of LIPSTICK_PRODUCTS) {
      if (prod.shades) {
        const foundShade = prod.shades.find((s) => s.id === productId);
        if (foundShade) {
          productInfo = prod;
          shadeName = foundShade;
          break;
        }
      }
    }
    return shadeName;
  }

  if (!imageSrc && images.length === 0) {
    return (
      <div className="text-center mt-20 text-slate-500">
        Waiting for images...
      </div>
    );
  }

  return (
    <div className="flex flex-col py-2 items-center">
      {recommendation.isLoading ? (
        <>
          <div className="text-xl text-red-700 mt-20">Finding your shade...</div>
          <div className="my-4 flex justify-center">
            <img
              src="/icon-192x192.png"
              alt="Loading..."
              className="h-12 w-12 spin-flick"
              style={{ animationDuration: '0.8s', animationIterationCount: 'infinite' }}
            />
          </div>
        </>
      ) : recommendation.error ? (
        <div className="text-red-600">{recommendation.error}</div>
      ) : recommendation.text ? (

        <>
          <h2 className="text-xl font-semibold text-red-700">
            AI Recommendation:
          </h2>
          <button
            className="mb-4 mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={() => speakText(recommendation.text)}
            type="button"
          >
            SPEAK
          </button>
          <div className="container mx-auto max-w-xl flex flex-col px-4 rounded-lg">
            <Markdown content={recommendation.text} />
          </div>
          <hr className="w-full max-w-xl border-t-2 border-slate-200" />
          {recommendation.products && recommendation.products.length > 0 && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-xl text-red-700 font-semibold my-4">
                {recommendation.brand} - {recommendation.productName}
              </h3>
              {/* Display products in rows of 2, side-by-side */}
              <div className="w-full flex flex-col items-center gap-4">
                {Array.from({ length: Math.ceil(recommendation.products.length / 2) }).map((_, rowIdx) => (
                  <div key={rowIdx} className="flex flex-row w-full max-w-2xl gap-4 justify-center">
                    {recommendation.products.slice(rowIdx * 2, rowIdx * 2 + 2).map((p, colIdx) => {
                      const shadeName = findShadeName(p.productId);
                      const imageUrl = p.productId ? `/${p.productId}.jpg` : undefined;
                      return (
                        <div
                          key={p.productId || colIdx}
                          className="border rounded p-2 flex-1 min-w-[140px] max-w-xs flex flex-col items-center bg-white"
                        >
                          <div className="font-semibold text-m text-slate-700 text-center mb-2 min-h-[1.5em]">
                            {shadeName ? shadeName.name : p.productId}
                          </div>
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={shadeName ? shadeName.name : p.productId}
                              className="object-contain rounded bg-white"
                              style={{ minWidth: 64 }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-slate-900">
          {imageSrc && occasion
            ? "Generating recommendation..."
            : "Please complete previous steps."}
        </p>
      )}
    </div>
  );
};
