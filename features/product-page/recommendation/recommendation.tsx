"use client";

import { useEffect } from "react";
import { useAltImages, useRecommendation } from "../store";
import { speakText } from "../../common/speech";
import { Markdown } from "../../common/markdown";

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

  // Speak only once when recommendation.text is set and not loading
  useEffect(() => {
    if (recommendation.text && !recommendation.isLoading) {
      // Strip all ** from the spoken text
      const plainText = recommendation.text.replace(/\*/g, "");
      speakText(plainText);
    }
  }, [recommendation.text, recommendation.isLoading]);

  // For now, let's display the passed props and the store content if available
  // We'll need to integrate the actual recommendation fetching logic later

  if (!imageSrc && images.length === 0) {
    return (
      <div className="text-center text-slate-500">
        Generating AI recommendation...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 items-center">
      <h2 className="text-2xl font-semibold text-red-700">
        AI Recommendation:
      </h2>
      {recommendation.isLoading ? (
        <>
          <div className="text-slate-900">Generating recommendation...</div>
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
          <div className="container mx-auto max-w-xl flex flex-col px-4 rounded-lg">
            <Markdown content={recommendation.text} />
          </div>
          {recommendation.products && recommendation.products.length > 0 && (
            <div className="w-full flex flex-col items-center gap-2 mt-4">
              <h3 className="text-lg font-semibold">Recommended Products:</h3>
              {recommendation.products.map((p, i) => (
                <div key={p.productId || i} className="border rounded p-2 w-full max-w-md text-center">
                  <strong>Product:</strong> <span>{p.productId}</span>
                </div>
              ))}
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
