"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { type z } from "zod";
import { useCallback, useRef, useState } from "react";
import { registerSchema } from "@/schemas";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { register } from "@/utils/(routes)/(auth)/register";

export function SubmitForm() {
  const data = useRef<z.infer<typeof registerSchema>>({
    email: "",
    password: "",
    name: "",
  });
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState(false);
  const [fullProgress, setFullProgress] = useState(false);
  const progressValue = useCallback(() => {
    const dataLength = Object.keys(data.current).length;
    return (fullProgress && 100) || (currentInputIndex / dataLength) * 100;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInputIndex, fullProgress]);
  const [error, setError] = useState<null | string>(null);
  const currentInput = Object.keys(data.current)[
    currentInputIndex
  ] as keyof z.infer<typeof registerSchema>;
  const isSubmit = currentInputIndex === Object.keys(data.current).length - 1;

  const saveCurrentInputValue = () => {
    const inputValue = inputRef.current?.value;
    data.current[currentInput] = inputValue!;
  };

  const getValidationErrors = () => {
    return registerSchema
      .partial()
      .safeParse({ [currentInput]: inputRef.current?.value })
      .error?.issues.find((issue) => issue.path[0] === currentInput);
  };

  const submitHandler = () => {
    const error = getValidationErrors();
    if (error) return setError(error.message);
    else setError(null);
    saveCurrentInputValue();
    setFullProgress(true);
    setDisabled(true);
    toast.promise(register({ ...data.current, origin: location.origin }), {
      loading: "registering...",
      success: () => {
        setDisabled(false);
        return "Registered successfully, we have sent a verification link to your email.";
      },
      error: (err) => {
        setDisabled(false);
        return err as string;
      },
    });
  };

  const nextInputHandler = () => {
    const error = getValidationErrors();
    if (error) return setError(error.message);
    else setError(null);
    saveCurrentInputValue();
    setCurrentInputIndex((c) => c + 1);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <Progress value={progressValue()} className="mb-2" />
          <div className="flex flex-col space-y-1.5">
            <Label
              htmlFor={currentInput}
              className={error ? "text-destructive" : ""}
            >
              {currentInput}
            </Label>
            <Input
              type={currentInput !== "password" ? "text" : "password"}
              disabled={disabled}
              key={currentInput}
              id={currentInput}
              placeholder={currentInput}
              ref={inputRef}
            />
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button disabled={disabled} asChild variant="outline">
          <Link href="/login">login</Link>
        </Button>
        <Button
          disabled={disabled}
          type="submit"
          onClick={isSubmit ? submitHandler : nextInputHandler}
        >
          {isSubmit ? "submit" : "next"}
        </Button>
      </CardFooter>
    </form>
  );
}
