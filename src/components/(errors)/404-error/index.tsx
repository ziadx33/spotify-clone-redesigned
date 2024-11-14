"use client";

import { useSkipFirstEffect } from "@/hooks/use-skip-first-render";
import { editNotFoundType } from "@/state/slices/not-found";
import { type AppDispatch, type RootState } from "@/state/store";
import { usePathname, useRouter } from "next/navigation";
import { MdErrorOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

export function NotFoundPage() {
  const { type } = useSelector((state: RootState) => state.notFound);
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const router = useRouter();

  useSkipFirstEffect(() => {
    if (!type) router.push("/");
    return () => {
      dispatch(editNotFoundType(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="absolute flex size-full flex-col items-center justify-center gap-3">
      <MdErrorOutline size={100} />
      <h3 className="text-2xl font-semibold">
        {`Something went wrong while loading the ${type?.toLowerCase()}.`}
      </h3>
      <p className="text-center text-lg text-muted-foreground">
        Search for something else?
      </p>
    </div>
  );
}
