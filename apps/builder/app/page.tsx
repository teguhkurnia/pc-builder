"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/builder");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          PC Builder
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Redirecting...</p>
      </div>
    </div>
  );
}
