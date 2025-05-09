import { AI } from "@/features/product-page/ai-context";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lipstick",
  description: "Multimodal AI App to help find your lipstick shade",
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
        </body>
      </html>
    </AI>
  );
}
