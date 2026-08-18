import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { QueryProvider } from "@/api/query-provider";
import { ToastProvider } from "@/components/toast";
import "@/styles/global.css";
import { app } from "./layout.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const notoSansMonoCjkKr = localFont({
  src: "./fonts/NotoSansMonoCJKkr-VF.subset.woff2",
  display: "swap",
  weight: "400 700",
  preload: false,
  variable: "--font-noto-sans-mono-cjk-kr",
});

export const metadata: Metadata = {
  title: {
    default: "모이면",
    template: "%s | 모이면",
  },
  description: "함께 준비하는 모의면접 플랫폼, 모이면",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { color: "#F8F8F8", media: "(prefers-color-scheme: light)" },
    { color: "#1B1B1B", media: "(prefers-color-scheme: dark)" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${notoSansMonoCjkKr.variable}`}>
      <body>
        <QueryProvider>
          <ToastProvider>
            <div className={app}>{children}</div>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
