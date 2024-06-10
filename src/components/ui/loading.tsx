"use client";

import { RotatingLines } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="grid h-screen w-screen place-items-center">
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="70"
        visible={true}
      />
    </div>
  );
}
