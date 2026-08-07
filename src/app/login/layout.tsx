import type { Metadata } from "next";
import type { ReactNode } from "react";

// Sign-in / OTP pages carry no unique content for search — keep them out
// of the index.
export const metadata: Metadata = {
  title: "Log In",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
