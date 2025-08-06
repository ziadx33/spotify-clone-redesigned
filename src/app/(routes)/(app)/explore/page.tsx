import { type Metadata } from "next";
import dynamic from "next/dynamic";

const Explore = dynamic(() =>
  import("@/components/explore").then((file) => file.Explore),
);

export const metadata: Metadata = {
  title: "Spotiq - Explore",
  description:
    "A web-based music streaming platform that lets users play tracks, manage queues, follow artists, and enjoy a personalized listening experience.",
};

export default function ExplorePage() {
  return <Explore />;
}
