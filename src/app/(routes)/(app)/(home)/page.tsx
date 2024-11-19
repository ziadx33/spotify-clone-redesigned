import { type Metadata } from "next";
import dynamic from "next/dynamic";

const Home = dynamic(
  () => import("@/components/home").then((file) => file.Home),
  {
    ssr: false,
  },
);

export const metadata: Metadata = {
  title: "Spotify Clone - Web Player: Music for everyone",
  description:
    "Spotify is a digital music service that gives you access to millions of songs.",
};

export default function HomePage() {
  return <Home />;
}
