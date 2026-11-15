"use client";

import { Button, HStack, Link, Spinner, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import { AuthMessage } from "~/components/auth/auth-message";
import { useVerifyEmailMutation } from "~/graphql/generated/graphql";
import { hasAuthErrorCode } from "~/lib/auth-feedback";
import { authTokenFromHash } from "~/lib/auth-token";

type VerificationState =
  | { status: "loading" | "invalid" | "success" }
  | { status: "ready" | "submitting" | "unavailable"; token: string };

export default function VerifyEmailClientPage() {
  const [, verifyEmail] = useVerifyEmailMutation();
  const [state, setState] = useState<VerificationState>({ status: "loading" });
  const initialToken = useRef<string | null | undefined>(undefined);
  const generation = useRef(0);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    function readToken() {
      generation.current += 1;
      initialToken.current = authTokenFromHash(window.location.hash);
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname + window.location.search,
      );

      setState(
        initialToken.current
          ? { status: "ready", token: initialToken.current }
          : { status: "invalid" },
      );
    }

    if (initialToken.current === undefined) {
      readToken();
    } else {
      setState(
        initialToken.current
          ? { status: "ready", token: initialToken.current }
          : { status: "invalid" },
      );
    }

    window.addEventListener("hashchange", readToken);

    return () => {
      mounted.current = false;
      generation.current += 1;
      window.removeEventListener("hashchange", readToken);
    };
  }, []);

  async function verify() {
    if (state.status !== "ready" && state.status !== "unavailable") return;
    const token = state.token;
    const request = generation.current;
    setState({ status: "submitting", token });
    try {
      const result = await verifyEmail({ input: { token } });
      if (!mounted.current || request !== generation.current) return;
      if (hasAuthErrorCode(result.error, "INVALID_EMAIL_VERIFICATION_TOKEN")) {
        setState({ status: "invalid" });
      } else if (result.error || !result.data?.verifyEmail) {
        setState({ status: "unavailable", token });
      } else {
        setState({ status: "success" });
      }
    } catch {
      if (mounted.current && request === generation.current) {
        setState({ status: "unavailable", token });
      }
    }
  }

  const canVerify =
    state.status === "ready" ||
    state.status === "submitting" ||
    state.status === "unavailable";

  return (
    <Stack gap="5">
      {state.status === "loading" && (
        <HStack gap="3" color="fg.muted" role="status">
          <Spinner size="sm" />
          <Text>Reading your verification link...</Text>
        </HStack>
      )}
      {state.status === "success" && (
        <AuthMessage status="success" title="Email verified">
          Your email is verified. You can now sign in.
        </AuthMessage>
      )}
      {state.status === "invalid" && (
        <AuthMessage status="error" title="Invalid verification link">
          <Stack gap="3">
            <Text>
              This verification link is invalid, has expired, or has already
              been used. Request a new verification email and open its link.
            </Text>
            <Link
              asChild
              alignSelf="start"
              fontWeight="medium"
              colorPalette="blue"
            >
              <NextLink href="/resend-verification">
                Resend verification email
              </NextLink>
            </Link>
          </Stack>
        </AuthMessage>
      )}
      {canVerify && (
        <Stack gap="5">
          {state.status === "unavailable" && (
            <AuthMessage status="error" title="Unable to verify email">
              We could not verify your email. Try again without closing this
              page.
            </AuthMessage>
          )}
          <Button
            size="lg"
            rounded="lg"
            w="full"
            onClick={verify}
            disabled={state.status === "submitting"}
            loading={state.status === "submitting"}
            loadingText="Verifying email"
          >
            {state.status === "unavailable" ? "Try again" : "Verify email"}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
