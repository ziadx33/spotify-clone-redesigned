import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";
import { Toaster } from "./ui/sonner";
import { GeistSans } from "geist/font/sans";

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
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
