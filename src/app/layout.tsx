import "@/styles/globals.css";
import { Layout } from "@/components/layout";

export const metadata = {
  title: "Spotiq",
  description:
    "A fully custom music streaming platform built with React, Next.js, TypeScript, and Tailwind CSS. Designed from the ground up with a unique UI and essential features like playback, queue management, and user profiles.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
