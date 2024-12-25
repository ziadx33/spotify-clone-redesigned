import { CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitForm } from "./components/submit-form";

export function ForgotPassword() {
  return (
    <>
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
      </CardHeader>
      <SubmitForm />
    </>
  );
}
