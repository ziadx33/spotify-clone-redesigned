"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ShowInput } from "@/components/ui/show-input";
import { sendEmail } from "@/lib/send-email";
import { forgotPasswordSchema } from "@/schemas";
import { generateVerificationToken } from "@/server/actions/verification-token";
import { getUser } from "@/server/queries/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

export function SubmitForm() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const formHandler = ({ email }: z.infer<typeof forgotPasswordSchema>) => {
    const req = async () => {
      const user = await getUser({ email });
      if (!user?.email) {
        throw "";
      }
      const token = await generateVerificationToken(
        user.email,
        "RESET_PASSWORD",
      );
      const confirmationLink = `${location.origin}/verification-token?token=${token?.token}`;
      await sendEmail({
        to: user.email,
        from: "hatemziad384@gmail.com",
        subject: "your code",
        html: `your verification link: <a href="${confirmationLink}">Link</a>`,
      });
    };
    toast.promise(req(), {
      loading: "sending reset email...",
      success: "reset email sent!",
      error: "email not found",
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)}>
        <CardContent>
          <div className="w-full space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <ShowInput id="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="outline" type="button">
            <Link href="/login">login</Link>
          </Button>
          <Button type="submit">Reset</Button>
        </CardFooter>
      </form>
    </Form>
  );
}
