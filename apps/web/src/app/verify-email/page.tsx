"use client";

import { Button } from "@chakra-ui/react/button";
import { Container } from "@chakra-ui/react/container";
import { Heading } from "@chakra-ui/react/heading";
import { Link } from "@chakra-ui/react/link";
import { Stack } from "@chakra-ui/react/stack";
import { Text } from "@chakra-ui/react/text";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";

type VerificationState =
  | { status: "loading" | "invalid" | "success" }
  | { status: "ready" | "submitting" | "unavailable"; token: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export default function VerifyEmailPage() {
  const [state, setState] = useState<VerificationState>({ status: "loading" });
  const currentToken = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    function readToken() {
      const token = new URLSearchParams(window.location.hash.slice(1)).get(
        "token",
      );
      currentToken.current = token;
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname + window.location.search,
      );
      setState((previous) => {
        if (previous.status === "submitting" && previous.token === token) {
          return previous;
        }
        return token && token.length <= 128
          ? { status: "ready", token }
          : { status: "invalid" };
      });
    }

    if (currentToken.current === undefined) readToken();
    window.addEventListener("hashchange", readToken);
    return () => window.removeEventListener("hashchange", readToken);
  }, []);

  async function verify() {
    if (state.status !== "ready" && state.status !== "unavailable") return;
    const token = state.token;
    setState({ status: "submitting", token });

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:4000/graphql",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Protection": "1",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            query: `mutation VerifyEmail($input: VerifyEmailRequestDto_Input!) {
              result: verifyEmail(input: $input) { id }
            }`,
            variables: { input: { token } },
          }),
        },
      );
      const body: unknown = await response.json();
      if (currentToken.current !== token) return;
      if (!isRecord(body)) throw new Error("Invalid verification response");

      if (Array.isArray(body.errors) && body.errors.length > 0) {
        const error: unknown = body.errors[0];
        if (
          isRecord(error) &&
          isRecord(error.extensions) &&
          error.extensions.code === "INVALID_EMAIL_VERIFICATION_TOKEN"
        ) {
          setState({ status: "invalid" });
          return;
        }
        throw new Error("Verification request failed");
      }
      if (
        !response.ok ||
        !isRecord(body.data) ||
        !isRecord(body.data.result) ||
        typeof body.data.result.id !== "string"
      ) {
        throw new Error("Invalid verification response");
      }
      setState({ status: "success" });
    } catch {
      if (currentToken.current === token) {
        setState({ status: "unavailable", token });
      }
    }
  }

  const canVerify =
    state.status === "ready" ||
    state.status === "submitting" ||
    state.status === "unavailable";

  return (
    <Container as="main" maxW="md" py={{ base: "12", md: "24" }}>
      <Stack gap="6">
        <Heading as="h1" size="2xl">
          Verify your email
        </Heading>
        {state.status === "loading" ? (
          <Text role="status">Reading your verification link...</Text>
        ) : null}
        {state.status === "success" ? (
          <Text role="status">
            Your email is verified. You can now sign in.
          </Text>
        ) : null}
        {state.status === "invalid" ? (
          <Text role="alert">
            This verification link is invalid, has expired, or has already been
            used. Request a new verification email and open its link.
          </Text>
        ) : null}
        {canVerify ? (
          <Stack gap="4">
            <Text>
              Confirm your email address to finish setting up your account.
            </Text>
            {state.status === "unavailable" ? (
              <Text role="alert">
                We could not verify your email. Try again without closing this
                page.
              </Text>
            ) : null}
            <Button
              colorPalette="purple"
              onClick={verify}
              disabled={state.status === "submitting"}
              loading={state.status === "submitting"}
              loadingText="Verifying email"
            >
              {state.status === "unavailable" ? "Try again" : "Verify email"}
            </Button>
          </Stack>
        ) : null}
        <Link asChild alignSelf="start">
          <NextLink href="/login">Go to login</NextLink>
        </Link>
      </Stack>
    </Container>
  );
}
