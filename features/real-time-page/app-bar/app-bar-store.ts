import { ReactNode } from "react";
import { create } from "zustand";

type AppBarState = {
  sectionIsOpen: boolean;
  section?: ReactNode;
};

const initialState: AppBarState = {
  sectionIsOpen: false,
  section: null,
};

const useAppBarStore = create<AppBarState>(() => initialState);

export const showAppBarSection = (section: ReactNode) => {
  useAppBarStore.setState({ sectionIsOpen: !!section, section });
};

export const closeAppBarSection = () => {
  useAppBarStore.setState({ sectionIsOpen: false, section: null });
};

export const useSectionIsOpen = () => {
  const state = useAppBarStore((state) => state.sectionIsOpen);
  return state;
};

export const useAppBardSection = () => {
  const state = useAppBarStore((state) => state.section);
  return state;
};
