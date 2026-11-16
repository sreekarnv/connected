"use client";

import {
  chakra,
  Button,
  Field,
  Fieldset,
  HStack,
  Link,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthMessage } from "~/components/auth/auth-message";
import { PasswordInput } from "~/components/auth/password-input";
import {
  useResetPasswordMutation,
  useVerifyResetTokenMutation,
} from "~/graphql/generated/graphql";
import { authErrorMessage, hasAuthErrorCode } from "~/lib/auth-feedback";
import { authTokenFromHash } from "~/lib/auth-token";

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password must be at most 128 characters"),
    password_confirm: z
      .string()
      .min(6, "Please confirm your password with at least 6 characters")
      .max(128, "Password must be at most 128 characters"),
  })
  .refine((values) => values.password === values.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  });

type ResetState =
  | { status: "checking" | "invalid" | "success" }
  | { status: "unavailable" | "submitting"; token: string }
  | { status: "ready"; token: string; message?: string };

export default function ResetPasswordClientPage() {
  const [, verifyResetToken] = useVerifyResetTokenMutation();
  const [, resetPassword] = useResetPasswordMutation();
  const [state, setState] = useState<ResetState>({ status: "checking" });
  const generation = useRef(0);
  const mounted = useRef(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", password_confirm: "" },
  });

  const checkToken = useCallback(
    async (token: string | null) => {
      const request = ++generation.current;
      reset();
      if (!token) {
        setState({ status: "invalid" });
        return;
      }
      setState({ status: "checking" });
      try {
        const result = await verifyResetToken({ input: { token } });
        if (!mounted.current || request !== generation.current) return;
        if (hasAuthErrorCode(result.error, "INVALID_PASSWORD_RESET_TOKEN")) {
          setState({ status: "invalid" });
        } else if (
          result.error ||
          result.data?.verifyResetToken?.status !== "success"
        ) {
          setState({ status: "unavailable", token });
        } else {
          setState({ status: "ready", token });
        }
      } catch {
        if (mounted.current && request === generation.current) {
          setState({ status: "unavailable", token });
        }
      }
    },
    [reset, verifyResetToken],
  );

  useEffect(() => {
    mounted.current = true;

    const readToken = () => {
      void checkToken(authTokenFromHash(window.location.hash));
    };

    readToken();

    window.addEventListener("hashchange", readToken);

    return () => {
      mounted.current = false;
      generation.current += 1;
      window.removeEventListener("hashchange", readToken);
    };
  }, [checkToken]);

  const hasForm = state.status === "ready" || state.status === "submitting";
  const submitting = isSubmitting || state.status === "submitting";

  return (
    <>
      {state.status === "checking" && (
        <HStack gap="3" color="fg.muted" role="status">
          <Spinner size="sm" aria-hidden="true" />
          <Text srOnly>Checking your reset link...</Text>
        </HStack>
      )}
      {state.status === "invalid" && (
        <Stack gap="4">
          <AuthMessage status="error" title="Invalid reset link">
            This reset link is invalid or has expired.
          </AuthMessage>
          <Link asChild alignSelf="start" colorPalette="blue">
            <NextLink href="/forgot-password">
              Request a new reset link
            </NextLink>
          </Link>
        </Stack>
      )}
      {state.status === "unavailable" && (
        <Stack gap="4">
          <AuthMessage status="error" title="Unable to check link">
            We could not check your reset link. Please try again.
          </AuthMessage>
          <Button
            size="lg"
            rounded="lg"
            w="full"
            variant="outline"
            onClick={() => {
              void checkToken(state.token);
            }}
          >
            Try again
          </Button>
        </Stack>
      )}
      {state.status === "success" && (
        <AuthMessage status="success" title="Password updated">
          Password changed. Returning to sign in...
        </AuthMessage>
      )}
      {hasForm && (
        <chakra.form
          noValidate
          aria-busy={submitting}
          onSubmit={(event) => {
            event.preventDefault();
            if (state.status !== "ready") return;
            const request = ++generation.current;
            void handleSubmit(
              async (input) => {
                if (!mounted.current || request !== generation.current) return;
                const token = state.token;
                setState({ status: "submitting", token });
                try {
                  const result = await resetPassword({
                    input: { token, ...input },
                  });
                  if (!mounted.current || request !== generation.current)
                    return;
                  if (
                    hasAuthErrorCode(
                      result.error,
                      "INVALID_PASSWORD_RESET_TOKEN",
                    )
                  ) {
                    setState({ status: "invalid" });
                  } else if (
                    result.error ||
                    result.data?.resetPassword?.status !== "success"
                  ) {
                    setState({
                      status: "ready",
                      token,
                      message: authErrorMessage(result.error),
                    });
                  } else {
                    setState({ status: "success" });
                    router.replace("/login?passwordReset=success");
                  }
                } catch {
                  if (mounted.current && request === generation.current) {
                    setState({
                      status: "ready",
                      token,
                      message: authErrorMessage(),
                    });
                  }
                }
              },
              () => {
                if (mounted.current && request === generation.current) {
                  setState((previous) =>
                    previous.status === "ready"
                      ? { status: "ready", token: previous.token }
                      : previous,
                  );
                }
              },
            )(event);
          }}
        >
          <Fieldset.Root disabled={submitting}>
            <Stack gap="5">
              <Field.Root required invalid={!!errors.password}>
                <Field.Label>New password</Field.Label>
                <PasswordInput
                  autoComplete="new-password"
                  visibilityLabel="new password"
                  {...register("password")}
                />
                <Field.HelperText>Use 6 to 128 characters.</Field.HelperText>
                {errors.password && (
                  <Field.ErrorText color="red.fg">
                    {errors.password.message}
                  </Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root required invalid={!!errors.password_confirm}>
                <Field.Label>Confirm new password</Field.Label>
                <PasswordInput
                  autoComplete="new-password"
                  visibilityLabel="new password confirmation"
                  {...register("password_confirm")}
                />
                {errors.password_confirm && (
                  <Field.ErrorText color="red.fg">
                    {errors.password_confirm.message}
                  </Field.ErrorText>
                )}
              </Field.Root>
              {state.status === "ready" && state.message && (
                <AuthMessage status="error" title="Unable to reset password">
                  {state.message}
                </AuthMessage>
              )}
              <Button
                size="lg"
                rounded="lg"
                w="full"
                type="submit"
                disabled={submitting}
                loading={submitting}
                loadingText="Resetting password"
              >
                Reset password
              </Button>
            </Stack>
          </Fieldset.Root>
        </chakra.form>
      )}
    </>
  );
}
