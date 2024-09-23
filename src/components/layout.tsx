import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";
import { Toaster } from "./ui/sonner";
import { ReduxProvider } from "@/providers/redux-provider";
import { QueryProvider } from "@/providers/query-provider";
import { mainFont } from "@/fonts";
import { QueueProvider } from "@/providers/queue-provider";
import { AuthProvider } from "@/providers/auth-provider";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={mainFont.className}>
        <AuthProvider>
          <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              forcedTheme="dark"
              disableTransitionOnChange
            >
              <QueryProvider>
                <QueueProvider>{children}</QueueProvider>
              </QueryProvider>
              <Toaster />
            </ThemeProvider>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
