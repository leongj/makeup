import { AppBarButton } from "../ui/app-bar/app-bar";
import { ImageIcon } from "../ui/app-icons";
import { setUploadRef, updateFiles, useAppStore } from "../product-page/store";

export const UploadImage = () => {
  const uploadRef = useAppStore((state) => state.uploadRef);

  return (
    <>
      <AppBarButton
        onClick={() => {
          uploadRef?.click();
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
          if (event.target.files && uploadRef) {
            updateFiles(event.target.files);
            uploadRef.value = "";
          }
        }}
        multiple
        ref={(fileInputRef) => {
          if (fileInputRef) setUploadRef(fileInputRef);
        }}
      />
    </>
  );
};
