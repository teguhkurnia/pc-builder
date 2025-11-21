"use client";
import { useListComponents } from "./hooks/api/useComponent";

export default function Home() {
  const { components } = useListComponents();
  console.log(components);
  return <></>;
}
