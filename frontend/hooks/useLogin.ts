"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/auth-context";
import type { LoginRequest } from "@/types/auth";

/** Wraps AuthContext.login (a local mock — no backend in this build) in a
 * React Query mutation so LoginForm gets isPending/error/reset semantics,
 * and redirects straight to the dashboard on success. */
export function useLogin() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
}
