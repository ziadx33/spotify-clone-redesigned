import { BsDiscord, BsGithub, BsGoogle } from "react-icons/bs";
import { AuthProvider } from "./auth-provider";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

enum PROVIDER {
  GOOGLE = "google",
  GITHUB = "github",
  X = "twitter",
  DISCORD = "discord",
}

export function AuthProviders() {
  const authHandler = async (provider: PROVIDER) => {
    toast.promise(
      signIn(provider, {
        redirect: true,
        callbackUrl: "/",
      }),
      {
        loading: `Signing you in with ${provider}...`,
        success: () => {
          return "Successfully logged in! Redirecting to home page...";
        },
        error: "Oops! Something went wrong. Please try again.",
      },
    );
  };
  return (
    <div className="mt-1.5 flex h-12 w-full gap-1.5">
      <AuthProvider onClick={() => authHandler(PROVIDER.GOOGLE)}>
        <BsGoogle size={20} />
      </AuthProvider>
      <AuthProvider onClick={() => authHandler(PROVIDER.GITHUB)}>
        <BsGithub size={20} />
      </AuthProvider>
      <AuthProvider onClick={() => authHandler(PROVIDER.DISCORD)}>
        <BsDiscord size={20} />
      </AuthProvider>
    </div>
  );
}
