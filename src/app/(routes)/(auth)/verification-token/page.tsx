import { VerificationToken } from "@/components/verification-token";

export default async function VerificationTokenPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string | null }>;
}) {
  const { token } = await searchParams;
  return <VerificationToken token={token} />;
}

// http://localhost:3000/verification-token?token=e987a412-1a29-4386-936c-89631ccd3e8e
