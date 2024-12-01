import { Message } from "ai";
import { create } from "zustand";

type LoadingState =
  | "idle"
  | "connecting"
  | "disconnecting"
  | "reconnecting"
  | "connected"
  | "error";

interface RealtimeState {
  loading: LoadingState;
  isMuted: boolean;
  displayResults: string | undefined;
  setMessages:
    | ((messages: Message[] | ((messages: Message[]) => Message[])) => void)
    | undefined;
}

export const useRealtimeStore = create<RealtimeState>()(() => ({
  loading: "idle",
  displayResults: undefined,
  chatMessages: [],
  setMessages: undefined,
  isMuted: false,
}));

export const isMuted = () => {
  const state = useRealtimeStore.getState();
  return state.isMuted;
};

export const toggleMute = () => {
  const state = useRealtimeStore.getState();
  state.isMuted = !state.isMuted;
  useRealtimeStore.setState(() => ({ ...state }));
};

export const setLoading = (loading: LoadingState) => {
  const state = useRealtimeStore.getState();
  state.loading = loading;
  useRealtimeStore.setState(() => ({ ...state }));
};

export const setCallback = (
  callback: (messages: Message[] | ((messages: Message[]) => Message[])) => void
) => {
  const state = useRealtimeStore.getState();
  state.setMessages = callback;
  useRealtimeStore.setState(() => ({ ...state }));
};
