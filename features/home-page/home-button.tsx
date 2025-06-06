import { useRouter } from "next/navigation";
import { AppBarButton } from "../ui/app-bar/app-bar";
// import { HomeIcon } from "../ui/app-icons";
import { resetAppStore } from "@/features/product-page/store";

export const HomeButton = () => {
  const router = useRouter();

  return (
    <AppBarButton
      onClick={() => {
        resetAppStore();
        router.push("/");
      }}
    >
      {/* <HomeIcon /> */}
      <img src="/icon-192x192.png" alt="Home" width={40} height={40} style={{ transform: 'rotate(20deg)' }} />
    </AppBarButton>
  );
};
