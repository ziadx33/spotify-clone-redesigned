import { getServerAuthSession } from "@/server/auth";

export async function Home() {
  const userData = await getServerAuthSession();
  const user = userData?.user;
  return <h1>Hello {user?.name}!</h1>;
}
