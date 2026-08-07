"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/Logo";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { status, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (status === "signed-out") {
      router.replace("/login");
    } else if (status === "otp-pending") {
      router.replace("/login/otp");
    }
  }, [isLoaded, status, router]);

  if (!isLoaded || status !== "authenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-sand-50">
        <Logo />
        <div className="h-1 w-40 overflow-hidden rounded-full bg-ink-900/10">
          <div className="h-full w-1/3 animate-[loadingbar_1.1s_ease-in-out_infinite] rounded-full bg-brand-500" />
        </div>
        <style>{`
          @keyframes loadingbar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
