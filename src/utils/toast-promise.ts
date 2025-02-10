import { toast } from "sonner";

export const handleToastPromise = (
  promiseFunction: () => Promise<unknown>,
  messages: Parameters<typeof toast.promise>["1"],
) => {
  return new Promise((resolve, reject) => {
    toast.promise(promiseFunction().then(resolve).catch(reject), {
      loading: messages?.loading ?? "Processing...",
      success: messages?.success ?? "Operation successful!",
      error: messages?.error ?? "An error occurred, please try again.",
    });
  });
};
