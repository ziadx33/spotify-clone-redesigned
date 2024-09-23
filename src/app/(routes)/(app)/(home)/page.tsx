import dynamic from "next/dynamic";

const Home = dynamic(
  () => import("@/components/home").then((file) => file.Home),
  {
    ssr: false,
  },
);

export default function HomePage() {
  return <Home />;
}
