import { type SearchQueryReturn } from "@/server/actions/search";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSearch } from "@/hooks/use-search";
import { AllContent } from "./all-content";

export function SearchContent(props: SearchQueryReturn) {
  const tabs = ["all", ...Object.keys(props)] as const;
  const { values, setQuery } = useSearch({
    data: { tab: "all" },
  });

  console.log("valuing", values, props.tracks, props.tracks.tracks?.length);

  return (
    <Tabs
      defaultValue={values.tab ?? "all"}
      className="w-full"
      onValueChange={(e) => setQuery({ name: "tab", value: e })}
    >
      <TabsList className="mb-4">
        {tabs.map((tab) => (
          <TabsTrigger value={tab} key={tab} className="capitalize">
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="all">
        {props.tracks.tracks?.length > 0 && <AllContent {...props} />}
      </TabsContent>
      <TabsContent value="password"></TabsContent>
    </Tabs>
  );
}
