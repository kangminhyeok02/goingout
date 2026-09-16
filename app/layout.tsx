import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "슬기로운 퇴사생활",
    template: "%s | 슬기로운 퇴사생활",
  },
  description:
    "퇴사를 고민 중이라면, 결정부터 이후의 삶까지 도와주는 실용 도구 모음",
  openGraph: {
    title: "슬기로운 퇴사생활",
    description:
      "퇴사를 고민 중이라면, 결정부터 이후의 삶까지 도와주는 실용 도구 모음",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <SidebarProvider>
          <Header />
          <Sidebar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SidebarProvider>
      </body>
    </html>
  );
}
