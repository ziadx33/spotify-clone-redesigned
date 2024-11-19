import { type Metadata } from "next";
import dynamic from "next/dynamic";

const Explore = dynamic(
  () => import("@/components/explore").then((file) => file.Explore),
  {
    ssr: false,
  },
);

export const metadata: Metadata = {
  title: "Spotify Clone - Explore",
  description:
    "Spotify is a digital music service that gives you access to millions of songs in reels.",
};

export default function ExplorePage() {
  return <Explore />;
}
