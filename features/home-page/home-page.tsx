import { Markdown } from "../common/markdown";
import { Images } from "./images";

export const HomePage = () => {
  return (
    <div className=" h-svh max-h-svh">
      <div className="container max-w-4xl mx-auto xl:px-0 px-3 flex flex-col gap-4 pb-40">
        <div className="py-8">
          <h1 className="text-4xl font-semibold">Focal</h1>
          <h4 className="text-sm">
            Generating alt text and descriptions for images using Azure OpenAI
          </h4>
        </div>
        <Images />

        <div className="flex flex-col gap-2 py-6">
          <h1 className="text-2xl xl:text-4xl font-semibold text-slate-200">
            Descriptions
          </h1>
          <h4 className="text-sm">
            Descriptions are generated using Azure OpenAI{" "}
            <span className="p-[2px] px-2 rounded-full bg-slate-600">
              GPT-4o
            </span>
          </h4>
        </div>
        <Markdown content="# Hello" />
      </div>
    </div>
  );
};
