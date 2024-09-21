import { getServerAuthSession } from "@/server/auth";
import { PrefrencesProvider } from "./components/prefrences-provider";
import { getPrefrence } from "@/server/actions/prefrence";
import { notFound } from "next/navigation";

export async function Home() {
  const user = await getServerAuthSession();
  if (!user?.user.id) notFound();
  const userPrefrence = await getPrefrence(user?.user.id);

  return (
    <div className="flex flex-col px-4 py-8 pb-4">
      <PrefrencesProvider userId={user.user.id} data={userPrefrence} />
    </div>
  );
}
