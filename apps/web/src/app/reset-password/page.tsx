"use client";

import { Button } from "@chakra-ui/react/button";
import { Container } from "@chakra-ui/react/container";
import { Field } from "@chakra-ui/react/field";
import { Heading } from "@chakra-ui/react/heading";
import { Input } from "@chakra-ui/react/input";
import { Link } from "@chakra-ui/react/link";
import { Stack } from "@chakra-ui/react/stack";
import { Text } from "@chakra-ui/react/text";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { PasswordResetError, passwordResetRequest } from "~/lib/password-reset";

type ResetState =
  | { status: "checking" | "invalid" | "unavailable" | "success" }
  | { status: "ready"; token: string; error?: "mismatch" | "request" }
  | { status: "submitting"; token: string };

export default function ResetPasswordPage() {
  const [state, setState] = useState<ResetState>({ status: "checking" });
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    async function verify() {
      const token = new URLSearchParams(window.location.hash.slice(1)).get(
        "token",
      );
      if (!token || token.length > 128) {
        setState({ status: "invalid" });
        return;
      }

      try {
        await passwordResetRequest(
          "verifyResetToken",
          { token },
          controller.signal,
        );
        if (!controller.signal.aborted) setState({ status: "ready", token });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({
          status:
            error instanceof PasswordResetError &&
            error.code === "INVALID_PASSWORD_RESET_TOKEN"
              ? "invalid"
              : "unavailable",
        });
      }
    }

    function reloadChangedLink() {
      controller.abort();
      setState({ status: "checking" });
      window.location.reload();
    }

    window.addEventListener("hashchange", reloadChangedLink);
    void verify();
    return () => {
      controller.abort();
      window.removeEventListener("hashchange", reloadChangedLink);
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status !== "ready") return;

    const data = new FormData(event.currentTarget);
    const password = data.get("password");
    const passwordConfirm = data.get("password_confirm");
    if (typeof password !== "string" || typeof passwordConfirm !== "string")
      return;
    if (password !== passwordConfirm) {
      setState({ ...state, error: "mismatch" });
      return;
    }

    const token = state.token;
    setState({ status: "submitting", token });
    try {
      await passwordResetRequest("resetPassword", {
        token,
        password,
        password_confirm: passwordConfirm,
      });
      setState({ status: "success" });
      router.replace("/login?passwordReset=success");
    } catch (error) {
      if (
        error instanceof PasswordResetError &&
        error.code === "INVALID_PASSWORD_RESET_TOKEN"
      ) {
        setState({ status: "invalid" });
      } else {
        setState({
          status: "ready",
          token,
          error: "request",
        });
      }
    }
  }

  const hasForm = state.status === "ready" || state.status === "submitting";

  return (
    <Container as="main" maxW="md" py={{ base: "12", md: "24" }}>
      <Stack gap="6">
        <Heading as="h1" size="2xl">
          Reset your password
        </Heading>
        {state.status === "checking" ? (
          <Text role="status">Checking your reset link...</Text>
        ) : null}
        {state.status === "invalid" ? (
          <Stack gap="4">
            <Text role="alert">This reset link is invalid or has expired.</Text>
            <Link asChild alignSelf="start">
              <NextLink href="/forgot-password">
                Request a new reset link
              </NextLink>
            </Link>
          </Stack>
        ) : null}
        {state.status === "unavailable" ? (
          <Stack gap="4">
            <Text role="alert">
              We could not check your reset link. Please try again.
            </Text>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </Stack>
        ) : null}
        {state.status === "success" ? (
          <Text role="status">Password changed. Returning to login...</Text>
        ) : null}
        {hasForm ? (
          <form onSubmit={submit} aria-busy={state.status === "submitting"}>
            <Stack gap="5">
              <Text color="fg.muted">
                Choose a new password between 6 and 128 characters.
              </Text>
              <Field.Root required disabled={state.status === "submitting"}>
                <Field.Label>New password</Field.Label>
                <Input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  maxLength={128}
                  required
                />
              </Field.Root>
              <Field.Root
                required
                disabled={state.status === "submitting"}
                invalid={state.status === "ready" && state.error === "mismatch"}
              >
                <Field.Label>Confirm new password</Field.Label>
                <Input
                  name="password_confirm"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  maxLength={128}
                  required
                />
                {state.status === "ready" && state.error === "mismatch" ? (
                  <Field.ErrorText role="alert">
                    Passwords do not match.
                  </Field.ErrorText>
                ) : null}
              </Field.Root>
              {state.status === "ready" && state.error === "request" ? (
                <Text role="alert" color="fg.error">
                  We could not reset your password. Please try again.
                </Text>
              ) : null}
              <Button
                type="submit"
                colorPalette="purple"
                loading={state.status === "submitting"}
                loadingText="Resetting password"
              >
                Reset password
              </Button>
            </Stack>
          </form>
        ) : null}
        <Link asChild alignSelf="start">
          <NextLink href="/login">Back to login</NextLink>
        </Link>
      </Stack>
    </Container>
  );
}
