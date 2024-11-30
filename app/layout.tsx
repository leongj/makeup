import { AI } from "@/features/home-page/ai-context";
import { HomeAppBar } from "@/features/home-page/app-bar/app-bar";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Focal",
  description: "Multimodal AI App to gain insights from images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AI>
      <html lang="en">
        <body
          className={`${poppins.className}  antialiased bg-slate-100 text-slate-300`}
        >
          {children}
          <HomeAppBar />
        </body>
      </html>
    </AI>
  );
}
