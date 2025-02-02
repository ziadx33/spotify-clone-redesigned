import { Input } from "@/components/ui/input";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <Input
      placeholder="Search..."
      className="mr-4"
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
}
