import { Register } from "@/components/(auth)/register";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up - Spotiq",
  description:
    "Sign up to start listening. Email address Next. or Sign up with Google. Sign up with Facebook. Sign up with Apple. Already have an account? Log in here.",
};

export default function LoginPage() {
  return <Register />;
}
