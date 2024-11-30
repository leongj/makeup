import { useRef } from "react";
import { AppBarButton } from "./app-bar/app-bar";
import { ImageIcon } from "./app-bar/app-icons";
import { updateFiles } from "./store";

export const UploadImage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <AppBarButton
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        <ImageIcon />
      </AppBarButton>
      <input
        type="file"
        accept=".png, .jpg, .jpeg"
        hidden
        className=""
        onChange={(event) => {
          if (event.target.files) {
            updateFiles(event.target.files);
            fileInputRef.current!.value = "";
          }
        }}
        multiple
        ref={fileInputRef}
      />
    </>
  );
};
