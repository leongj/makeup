"use client";

import { resolveAfter } from "@/features/common/util";
import {
  disposeAudioPlayer,
  initAudioPlayer,
  playAudio,
  stopAudio,
} from "@/features/real-time-page/audio-player/audio-player";
import { RealTimeSystemPrompt } from "@/features/real-time-page/realtime-client/prompt";
import {
  FormattedItem,
  RealtimeClient,
  RealtimeCustomEvents,
  RealtimeServerEvents,
} from "openai-realtime-api";
import { realTimeImageDescription } from "../actions";
import { capture } from "../camera/camera-store";
import { isMuted, setLoading } from "./realtime-store";
import { callAisleInformation } from "./server-api";

let lastActiveAssistantItem: FormattedItem | null = null;

const realtimeClient = new RealtimeClient({
  url: `${process.env.NEXT_PUBLIC_AZURE_OPENAI_REALTIME_ENDPOINT}`,
  sessionConfig: {
    instructions: RealTimeSystemPrompt,
    turn_detection: {
      type: "server_vad",
      prefix_padding_ms: 200,
      silence_duration_ms: 500,
    },
    input_audio_transcription: {
      model: "whisper-1",
    },
  },
});

realtimeClient.on("realtime.event", (realtimeEvent) => {
  const { event } = realtimeEvent;

  switch (event.type) {
    case "session.created":
      greetUser();
      addInitialTools();
      break;
    case "response.audio.delta":
      playAudio(event.delta);
      break;
    case "conversation.item.created":
      handleFunctionCallOutput(event);
      break;
    case "error":
      handleErrors(event);
      break;
    default:
  }
});

realtimeClient.on("conversation.interrupted", async () => {
  await stopConversation();
});

realtimeClient.on("conversation.updated", async (audio) => {
  updateConversation(audio);
});

export const reTryConnection = async () => {
  setLoading("reconnecting");
  await disconnectRealtime();
  await resolveAfter(800);
  await connectRealtime();
};

export const connectRealtime = async () => {
  if (realtimeClient.isConnected) {
    return;
  }

  setLoading("connecting");

  try {
    await realtimeClient.connect();
    await initAudioPlayer();
    setLoading("connected");
    // Initiate the connection here, however, only greet the user if the connection is successful
  } catch (error) {
    setLoading("error");
    console.error("Connection error:", error);
  }
};

const handleFunctionCallOutput = (
  event: RealtimeServerEvents.ConversationItemCreatedEvent
) => {
  if (event.item.type === "function_call_output") {
    console.log(event.item.output);
  }
};

export const disconnectRealtime = async () => {
  setLoading("disconnecting");

  try {
    await realtimeClient.disconnect();
    setLoading("idle");
    disposeAudioPlayer();
  } catch (error) {
    setLoading("error");
    console.error("Disconnection error:", error);
  }
};

const stopConversation = async () => {
  if (lastActiveAssistantItem !== null) {
    await stopAudio();
    lastActiveAssistantItem = null;
  }
};

export const sendAudio = (int16Array: Int16Array) => {
  if (isMuted()) {
    return;
  }

  realtimeClient.appendInputAudio(int16Array);
};

const handleErrors = (error: RealtimeServerEvents.ErrorEvent) => {
  console.error(error.error.message);
  if (error.error.message.includes("429")) {
    reTryConnection();
  }
};

export const sendUserMessage = (message: string) => {
  realtimeClient.cancelResponse();
  realtimeClient.sendUserMessageContent([
    {
      type: "input_text",
      text: message,
    },
  ]);
};

const addInitialTools = () => {
  realtimeClient.addTool(
    {
      name: "get_aisle",
      description: "Retrieves aisle information for a particular product",
      parameters: {
        type: "object",
        properties: {
          product: {
            type: "string",
            description: "Name of the product",
          },
        },
        required: ["product"],
      },
    },
    async ({ product }: { product: string }) => {
      return await callAisleInformation(product);
    }
  );

  realtimeClient.addTool(
    {
      name: "take_photo",
      description: `Use take_photo tool to take photos when the user asks for it. \n
        You can take more than one photo and there are no limitations.\n
        The tool will return a description of the photo. \n
        As soon as take_photo is called, just acknowledge the user that you've taken a photo and let them know that you're working on it.`,
      parameters: {
        type: "object",
        properties: {
          task: {
            type: "string",
            description: "The task to perform with the photo",
          },
        },
        required: [],
      },
    },
    async ({ task }: { task: string }) => {
      const photo = capture();

      if (photo) {
        const response = await realTimeImageDescription({
          image: photo,
          userRequest: task,
        });
        return `I've taken a photo and ${response}`;
      } else {
        return "I'm sorry, looks like there was an issue. You can ask by saying 'take a photo'";
      }
    }
  );
};

const greetUser = () => {
  realtimeClient.updateSession({
    instructions: RealTimeSystemPrompt,
    turn_detection: {
      type: "server_vad",
      prefix_padding_ms: 200,
      silence_duration_ms: 500,
    },
    input_audio_transcription: {
      model: "whisper-1",
    },
  });

  setLoading("connected");

  const items: {
    type: "input_text";
    text: string;
  }[] = [];

  realtimeClient.sendUserMessageContent([
    ...items,
    {
      type: "input_text",
      text: "Greet the user with a friendly message, if needed you can provide a summary of the conversation",
    },
  ]);
};

const updateConversation = async (
  audio: RealtimeCustomEvents.ConversationUpdatedEvent
) => {
  if (audio.delta) {
    if (audio.item.id && audio.item.role === "assistant") {
      lastActiveAssistantItem = audio.item;
    } else {
      if (audio.item.role === "user" && audio.item.content.length > 0) {
      }

      lastActiveAssistantItem = null;
    }
  }
};
