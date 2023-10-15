"use client"
import { PropsWithChildren } from "react";
import { NextUIProvider } from "@nextui-org/react";

export default function Providers({ children }: PropsWithChildren) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
