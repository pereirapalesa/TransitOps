"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import {
  Controller,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import { PasswordInput } from "@/components/auth/PasswordInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useLogin } from "@/hooks/useLogin";
import {
  loginRoleValues,
  loginSchema,
  type LoginFormValues,
} from "@/lib/validators/auth";

export default function LoginForm() {
  const loginMutation = useLogin();

export function LoginForm() {
  type LoginFormInput = z.input<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: undefined,
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
      remember_me: values.rememberMe ?? false,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
    >
      {loginMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {loginMutation.error instanceof Error
              ? loginMutation.error.message
              : "Login failed. Please check your credentials."}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Work Email</Label>

        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>

          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <PasswordInput
          id="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>

        <Select id="role" defaultValue="" {...register("role")} aria-invalid={!!errors.role}>
          <option value="" disabled>
            Select your role
          </option>
          {loginRoleValues.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </Select>

        {errors.role && (
          <p className="text-sm text-destructive">
            {errors.role.message}
          </p>
        )}
      </div>

      <Controller
        name="rememberMe"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              checked={field.value}
              onCheckedChange={(checked) =>
                field.onChange(checked === true)
              }
            />

            <Label
              htmlFor="rememberMe"
              className="cursor-pointer font-normal"
            >
              Keep me signed in
            </Label>
          </div>
        )}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending
          ? "Signing in..."
          : "Sign In"}
      </Button>
    </form>
  );
}