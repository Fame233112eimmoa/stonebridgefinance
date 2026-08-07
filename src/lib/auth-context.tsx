"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PROFILES, type ProfileSeed } from "./mock-data";

type AuthStatus = "signed-out" | "otp-pending" | "authenticated";

type AuthResult = { ok: boolean; error?: string };

type AuthContextValue = {
  status: AuthStatus;
  activeProfile: ProfileSeed | null;
  pendingProfile: ProfileSeed | null;
  isLoaded: boolean;
  login: (customerId: string, password: string) => AuthResult;
  verifyOtp: (code: string) => AuthResult;
  resendOtp: () => void;
  logout: () => void;
  register: () => AuthResult;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "stonebridge-demo-session";
const OTP_PENDING_KEY = "stonebridge-demo-otp-pending";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("signed-out");
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [pendingProfileId, setPendingProfileId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const session = window.localStorage.getItem(STORAGE_KEY);
    const otpPending = window.sessionStorage.getItem(OTP_PENDING_KEY);
    if (session && PROFILES.some((p) => p.id === session)) {
      setActiveProfileId(session);
      setStatus("authenticated");
    } else if (otpPending && PROFILES.some((p) => p.id === otpPending)) {
      setPendingProfileId(otpPending);
      setStatus("otp-pending");
    }
    setIsLoaded(true);
  }, []);

  const login = useCallback((customerId: string, password: string): AuthResult => {
    const normalized = customerId.trim().toUpperCase();
    const match = PROFILES.find((p) => p.customerId.toUpperCase() === normalized);
    if (!match) {
      return { ok: false, error: "We couldn't find an account with that Customer ID." };
    }
    if (password !== match.password) {
      return { ok: false, error: "Incorrect password. Please try again." };
    }
    window.sessionStorage.setItem(OTP_PENDING_KEY, match.id);
    setPendingProfileId(match.id);
    setStatus("otp-pending");
    return { ok: true };
  }, []);

  const verifyOtp = useCallback((code: string): AuthResult => {
    const pendingId = window.sessionStorage.getItem(OTP_PENDING_KEY);
    const match = pendingId ? PROFILES.find((p) => p.id === pendingId) : undefined;
    if (!match) {
      return { ok: false, error: "Your session expired. Please sign in again." };
    }
    if (code.trim() !== match.otp) {
      return { ok: false, error: "That code doesn't match. Please try again." };
    }
    window.sessionStorage.removeItem(OTP_PENDING_KEY);
    window.localStorage.setItem(STORAGE_KEY, match.id);
    setActiveProfileId(match.id);
    setPendingProfileId(null);
    setStatus("authenticated");
    return { ok: true };
  }, []);

  const resendOtp = useCallback(() => {
    // Demo only — each profile's code is static, so there's nothing to resend.
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(OTP_PENDING_KEY);
    setActiveProfileId(null);
    setPendingProfileId(null);
    setStatus("signed-out");
  }, []);

  const register = useCallback((): AuthResult => {
    // Demo only — new registrations aren't persisted; only the seeded
    // sample profiles can actually sign in.
    return { ok: true };
  }, []);

  const activeProfile = useMemo(
    () => PROFILES.find((p) => p.id === activeProfileId) ?? null,
    [activeProfileId]
  );
  const pendingProfile = useMemo(
    () => PROFILES.find((p) => p.id === pendingProfileId) ?? null,
    [pendingProfileId]
  );

  const value = useMemo(
    () => ({
      status,
      activeProfile,
      pendingProfile,
      isLoaded,
      login,
      verifyOtp,
      resendOtp,
      logout,
      register,
    }),
    [status, activeProfile, pendingProfile, isLoaded, login, verifyOtp, resendOtp, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
