"use client";
import { HomeButton } from "@/features/home-page/home-button";
import { AppBar, AppBarButton } from "@/features/ui/app-bar/app-bar";
import { SettingsIcon } from "@/features/ui/app-icons";
import { showAppBarSection, useAppBardSection } from "./app-bar-store";
import { SettingsSection } from "./settings-section";
import { UploadImage } from "./upload-image";

export const HomeAppBar = () => {
  const section = useAppBardSection();
  return (
    <AppBar section={section}>
      <HomeButton />
    </AppBar>
  );
};
