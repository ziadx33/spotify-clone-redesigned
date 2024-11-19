"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import Link from "next/link";
import { ShowInput } from "../ui/show-input";
import { comparePassword, hashPassword } from "@/server/actions/user";
import { type User } from "@prisma/client";
import { toast } from "sonner";
import { useUpdateUser } from "@/hooks/use-update-user";

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(3).max(20),
  newPassword: z.string().min(3).max(20),
});

export function ChangePassword({ user }: { user: User }) {
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });
  const [disabled, setDisabled] = useState(false);
  const { update } = useUpdateUser();

  const formHandler = async (data: z.infer<typeof changePasswordSchema>) => {
    try {
      setDisabled(true);
      const isCorrectPassword = await comparePassword(
        data.currentPassword,
        user.password,
      );

      if (!isCorrectPassword) {
        return toast.error("wrong password!");
      }

      await update({
        data: { password: await hashPassword(data.newPassword) },
      });

      toast.success("updated password successfully!");
    } catch {
      toast.error("something went wrong!");
    } finally {
      setDisabled(false);
    }
  };

  return (
    <main className="absolute grid size-full place-items-center">
      <Card className="w-[40%]">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(formHandler)}>
            <CardContent>
              <div className="w-full space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="currentPassword">
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <ShowInput
                          show
                          id="currentPassword"
                          type="currentPassword"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="newPassword">New Password</FormLabel>
                      <FormControl>
                        <ShowInput
                          show
                          id="newPassword"
                          type="newPassword"
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
                <Link href="/">Go home</Link>
              </Button>
              <Button disabled={disabled} type="submit">
                Change
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
}
