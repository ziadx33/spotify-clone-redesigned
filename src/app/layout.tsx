import "@/styles/globals.css";
import { Layout } from "@/components/layout";

export const metadata = {
  title: "Spotify clone",
  description: "spotify clone, ziadx3 project",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
