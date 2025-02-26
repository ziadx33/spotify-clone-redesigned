import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/use-search";

export function SearchInput() {
  const {
    values: { query },
    setQuery,
  } = useSearch({
    debounce: true,
    data: {
      query: "",
    },
  });

  return (
    <Input
      placeholder="What do you want to play?"
      className="mb-4 hidden max-lg:block"
      defaultValue={query}
      onChange={(e) => setQuery({ name: "query", value: e.target.value })}
    />
  );
}
