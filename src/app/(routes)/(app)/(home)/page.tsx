import { type Metadata } from "next";
import dynamic from "next/dynamic";

const Home = dynamic(() =>
  import("@/components/home").then((file) => file.Home),
);

export const metadata: Metadata = {
  title: "Spotiq - Web Player: Music for everyone",
  description:
    "A web-based music streaming platform that lets users play tracks, manage queues, follow artists, and enjoy a personalized listening experience.",
};

export default function HomePage() {
  return <Home />;
}
