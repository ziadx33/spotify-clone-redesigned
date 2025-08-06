import { Login } from "@/components/(auth)/login";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Spotiq",
  description:
    "Don't have an account? Create one now to start streaming. This site is protected by reCAPTCHA and is subject to Google's Privacy Policy and Terms of Service.",
};

export default function LoginPage() {
  return <Login />;
}
