import OpenAI from "openai";

export const AzureOpenAI = () => {
  const resourceName = process.env.AZURE_OPENAI_RESOURCE_NAME!;
  const apiKey = process.env.AZURE_OPENAI_API_KEY!;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT!;
  const version = process.env.AZURE_OPENAI_API_VERSION!;

  const client = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    baseURL: `https://${resourceName}.openai.azure.com/openai/deployments/${deployment}`,
    defaultQuery: { "api-version": version },
    defaultHeaders: { "api-key": apiKey },
  });

  return client;
};
