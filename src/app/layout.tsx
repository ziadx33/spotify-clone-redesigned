import "@/styles/globals.css";
import { Layout } from "@/components/layout";

export const metadata = {
  title: "Spotiq",
  description:
    "A modern music app, built using React, Next.js, TypeScript, and Tailwind CSS. This project mimics Spotify's core functionalities with a fresh, sleek interface.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
