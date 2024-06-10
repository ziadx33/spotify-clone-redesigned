import { CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitForm } from "./submit-form";

export function Login() {
  return (
    <>
      <CardHeader>
        <CardTitle>Log in to spotify</CardTitle>
      </CardHeader>
      <SubmitForm />
    </>
  );
}
