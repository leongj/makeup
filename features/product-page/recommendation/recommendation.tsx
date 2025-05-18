"use client";


import { useEffect } from "react";
import { useAltImages, useRecommendation } from "../store";
import { speakText } from "../../common/speech";
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

  // Speak only once when recommendation.text is set and not loading
  useEffect(() => {
    if (recommendation.text && !recommendation.isLoading) {
      // Strip all ** from the spoken text
      const plainText = recommendation.text.replace(/\*/g, "");
      speakText(plainText);
    }
  }, [recommendation.text, recommendation.isLoading]);

  // Helper to find product and shade info by shade id
  function findProductAndShade(productId: string) {
    let productInfo = null;
    let shadeInfo = null;
    for (const prod of LIPSTICK_PRODUCTS) {
      if (prod.shades) {
        const foundShade = prod.shades.find((s) => s.id === productId);
        if (foundShade) {
          productInfo = prod;
          shadeInfo = foundShade;
          break;
        }
      }
    }
    return { productInfo, shadeInfo };
  }

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
    <div className="flex flex-col py-2 items-center">
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
          <h2 className="text-2xl font-semibold text-red-700">
            AI Recommendation:
          </h2>
          <div className="container mx-auto max-w-xl flex flex-col px-4 rounded-lg">
            <Markdown content={recommendation.text} />
          </div>
          {recommendation.products && recommendation.products.length > 0 && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-lg text-black font-semibold mb-2">
                {/* Use brand and productName from recommendation if available */}
                {typeof recommendation.brand === 'string' && typeof recommendation.productName === 'string' && recommendation.brand && recommendation.productName
                  ? `${recommendation.brand} - ${recommendation.productName}`
                  : "Recommended Products:"}
              </h3>
              {recommendation.products.map((p, i) => {
                // Find the product and shade info from LIPSTICK_PRODUCTS
                const { productInfo, shadeInfo } = findProductAndShade(p.productId);
                const imageUrl = p.productId ? `/${p.productId}.jpg` : undefined;
                return (
                  <div
                    key={p.productId || i}
                    className="border rounded p-2 w-full max-w-md flex items-center gap-4"
                  >
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={shadeInfo ? shadeInfo.name : p.productId}
                        className="h-24 w-24 object-contain rounded bg-white border"
                        style={{ minWidth: 64 }}
                      />
                    )}
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-black">
                        {shadeInfo ? shadeInfo.name : p.productId}
                      </div>
                    </div>
                  </div>
                );
              })}
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
