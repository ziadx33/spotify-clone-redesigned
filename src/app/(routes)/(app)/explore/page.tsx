"use client";

import dynamic from "next/dynamic";

const Explore = dynamic(
  () => import("@/components/explore").then((file) => file.Explore),
  {
    ssr: false,
  },
);

export default function ExplorePage() {
  return <Explore />;
}
