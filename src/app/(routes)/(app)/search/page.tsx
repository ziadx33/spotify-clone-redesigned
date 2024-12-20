import dynamic from "next/dynamic";

const Search = dynamic(() =>
  import("@/components/search").then((file) => file.Search),
);

export default function SearchPage() {
  return <Search />;
}
