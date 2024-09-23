"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";
import { login } from "@/utils/login";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ShowInput } from "../ui/show-input";
import { useRouter } from "next/navigation";

export function SubmitForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const formHandler = (data: z.infer<typeof loginSchema>) => {
    setDisabled(true);
    const loginFn = async (data: z.infer<typeof loginSchema>) => {
      await login(data);
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      router.push("/");
    };
    toast.promise(loginFn(data), {
      loading: "logging in...",
      success: "logged in successfully!",
      error: (err) => {
        setDisabled(false);
        return (err as { error: string }).error;
      },
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <ShowInput
                      show
                      id="password"
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button disabled={disabled} asChild variant="outline">
            <Link href="/register">register</Link>
          </Button>
          <Button disabled={disabled} type="submit">
            Log In
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
