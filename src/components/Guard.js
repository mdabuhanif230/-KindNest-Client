"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
export default function Guard({ children }) {
  const { data, isPending } = authClient.useSession(); const router = useRouter();
  useEffect(() => { if (!isPending && !data) router.replace("/login"); }, [data, isPending, router]);
  if (isPending || !data) return <div className="max-w-5xl mx-auto p-8"><div className="skeleton h-72 w-full" /></div>;
  return children;
}
