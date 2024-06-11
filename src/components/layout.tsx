import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";
import { Toaster } from "./ui/sonner";
import { GeistSans } from "geist/font/sans";
import { ReduxProvider } from "@/providers/redux-provider";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <AuthProvider>
            <ReduxProvider>{children}</ReduxProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
