"use client";
import { AppBar, AppBarButton } from "@/features/ui/app-bar/app-bar";
import { UploadImage } from "../upload-file";
import { showAppBarSection, useAppBardSection } from "./app-bar-store";
import { SettingsIcon } from "./app-icons";
import { SettingsSection } from "./settings-section";

export const HomeAppBar = () => {
  const section = useAppBardSection();
  return (
    <AppBar section={section}>
      {/* <RealTimeButton /> */}
      <UploadImage />
      <AppBarButton
        onClick={() => {
          showAppBarSection(<SettingsSection />);
        }}
      >
        <SettingsIcon />
      </AppBarButton>
    </AppBar>
  );
};
