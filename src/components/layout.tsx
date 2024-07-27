import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";
import { Toaster } from "./ui/sonner";
import { ReduxProvider } from "@/providers/redux-provider";
import { QueryProvider } from "@/providers/query-provider";
import { mainFont } from "@/fonts";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={mainFont.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <AuthProvider>
            <ReduxProvider>
              <QueryProvider>{children}</QueryProvider>
            </ReduxProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
