import { Markdown } from "../common/markdown";

export const HomePage = () => {
  return (
    <div className=" h-svh max-h-svh">
      <div className="container max-w-4xl mx-auto xl:px-0 px-3 flex flex-col gap-12 pb-40">
        <div className="flex flex-col gap-2 py-6">
          <h1 className="text-2xl xl:text-4xl font-semibold text-slate-200">
            Images
          </h1>
          <h4 className="text-sm">
            Alt descriptions are generated using Azure OpenAI{" "}
            <span className="p-[2px] px-2 rounded-full bg-slate-600">
              GPT-4o Mini
            </span>
          </h4>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800/40 rounded-xl p-6 text-sm flex flex-col gap-6 border border-slate-800  "
            >
              <img
                className="rounded-lg"
                src="https://cdn.dribbble.com/userupload/17051481/file/still-47d28eb3599ba9d8c689c2b5090e2e60.png?format=webp&resize=320x240&vertical=center"
              />
              <p className="text-slate-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                in sapien nec sapien vehicula ultricies. Nullam nec metus eget
                nunc fermentum ultrices. Nullam auctor, purus nec dictum
                ultricies, nunc erat vehicula purus, nec faucibus eros elit sit
                amet justo. Nullam ut justo nec justo ultricies viverra. Donec
                eget lacus ac elit tincidunt ultricies. Nullam nec nunc nec
                augue tincidunt vestibulum. Nullam nec sapien nec velit
              </p>
            </div>
          ))}
        </div>

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
