"use server";

export const GetSpeechToken = async () => {
  if (
    process.env.SPEECH_REGION === undefined ||
    process.env.SPEECH_KEY === undefined
  ) {
    return {
      error: true,
      errorMessage: "Missing Azure Speech credentials",
      token: "",
      region: "",
    };
  }

  const response = await fetch(
    `https://${process.env.SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.SPEECH_KEY!,
      },
      cache: "no-store",
    }
  );

  return {
    error: response.status !== 200,
    errorMessage: response.statusText,
    token: await response.text(),
    region: process.env.SPEECH_REGION,
  };
};