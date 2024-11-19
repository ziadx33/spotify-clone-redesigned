import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";
import { Toaster } from "./ui/sonner";
import { ReduxProvider } from "@/providers/redux-provider";
import { QueryProvider } from "@/providers/query-provider";
import { mainFont } from "@/fonts";
import { DataProvider } from "@/providers/data-provider";
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
                <DataProvider>{children}</DataProvider>
              </QueryProvider>
              <Toaster />
            </ThemeProvider>
          </ReduxProvider>
        </AuthProvider>
        <div
          id="drag-items-container"
          className="absolute -top-24 -z-50 flex w-full gap-2 overflow-y-scroll"
        ></div>
      </body>
    </html>
  );
}
