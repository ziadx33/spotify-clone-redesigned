"use client";

import { useRouter } from "next/navigation";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Button } from "../../../ui/button";

export function MoveArrows() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 pr-2">
      <Button
        variant="outline"
        className="rounded-full"
        size="icon"
        onClick={() => router.back()}
      >
        <BsArrowLeft />
      </Button>
      <Button
        variant="outline"
        className="rounded-full"
        size="icon"
        onClick={() => router.forward()}
      >
        <BsArrowRight />
      </Button>
    </div>
  );
}
