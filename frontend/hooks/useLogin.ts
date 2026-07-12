"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/lib/auth/auth-context";
import type { LoginRequest } from "@/types/auth";

const ROLE_DASHBOARD_FALLBACK = "/dashboard";

/** Wraps AuthContext.login in a React Query mutation so LoginForm gets
 * consistent isPending/error/reset semantics, and handles the post-login
 * redirect (return-to URL if present, otherwise the default dashboard).
 */
export function useLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const mutation = useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: () => {
      const returnTo = searchParams.get("returnTo");
      const destination = returnTo && returnTo.startsWith("/") ? returnTo : ROLE_DASHBOARD_FALLBACK;
      router.push(destination);
    },
  });

  return mutation;
}
