import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import { type User } from "@prisma/client";

import { db } from "@/server/db";
import { getUserById } from "./actions/verification-token";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import { env } from "@/env";
import { getUser } from "./queries/user";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  debug: true,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById({ id: user.id });
      if (!existingUser?.emailVerified) return false;
      return true;
    },
    session: async ({ token, session }) => {
      session.user = token as unknown as User;
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: ({ token, trigger, session, user }) => {
      if (trigger === "update") {
        for (const key in session) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          token[key] = session[key as keyof typeof session];
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return { ...token, ...user };
    },
  },
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        if (!credentials.email || !credentials.password) return null;

        const user = await getUser({ email: credentials.email });

        if (!user) {
          console.error("User not found for email:", credentials.email);
          return null;
        }

        return { ...user, id: user.id };
      },
    },
    GoogleProvider({
      clientId: env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_AUTH_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: env.GITHUB_AUTH_CLIENT_ID,
      clientSecret: env.GITHUB_AUTH_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: env.DISCORD_AUTH_CLIENT_ID,
      clientSecret: env.DISCORD_AUTH_CLIENT_SECRET,
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async () =>
  (await getServerSession(authOptions)) as unknown as Promise<
    { user: User } | undefined
  >;
