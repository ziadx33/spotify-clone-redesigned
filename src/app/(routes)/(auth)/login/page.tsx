import { Login } from "@/components/(auth)/login";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Spotify Clone",
  description:
    "Don't have an account?Sign up for Spotify. This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.",
};

export default function LoginPage() {
  return <Login />;
}
