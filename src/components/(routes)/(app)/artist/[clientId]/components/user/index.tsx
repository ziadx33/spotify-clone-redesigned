import { type User } from "@prisma/client";

export function User({ user }: { user: User }) {
  return <h1>User page {user.name}</h1>;
}
