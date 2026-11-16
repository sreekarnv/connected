"use client";

import { Button, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLogoutMutation } from "~/graphql/generated/graphql";
import { useSession } from "~/lib/use-session";

export function HomeAuthActions() {
  const session = useSession();
  const [{ fetching }, logout] = useLogoutMutation();
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    setError(null);
    try {
      const result = await logout({});

      if (result.error || result.data?.logout?.status !== "success") {
        setError("We couldn't sign you out. Please try again.");
        return;
      }
      // Clear cached private data after the server removes the session cookie.
      window.location.replace("/");
    } catch {
      setError("We couldn't sign you out. Please try again.");
    }
  }

  if (session.status === "loading") {
    return (
      <HStack minH="11" gap="2" color="fg.muted" role="status">
        <Spinner size="sm" aria-hidden="true" />
        <Text srOnly>Checking session...</Text>
      </HStack>
    );
  }

  if (session.status === "error") {
    return (
      <Stack gap="2" align="center" maxW="xs">
        <Text fontSize="sm" role="alert">
          We couldn&apos;t check your session.
        </Text>
        <Button size="sm" minH="11" onClick={session.retry}>
          Try again
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="3" align="center" maxW="full">
      <HStack gap="3" wrap="wrap" justify="center">
        {session.status === "ready" ? (
          <>
            <Button asChild size="lg" minH="12" rounded="full">
              <Link href="/social">
                Your feed <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              minH="12"
              rounded="full"
              variant="outline"
              loading={fetching}
              loadingText="Signing out"
              disabled={fetching}
              onClick={signOut}
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button asChild size="lg" minH="12" rounded="full">
              <Link href="/signup">
                Create account <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              minH="12"
              rounded="full"
              variant="outline"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </>
        )}
      </HStack>
      {error && (
        <Text fontSize="sm" role="alert" maxW="xs">
          {error}
        </Text>
      )}
    </Stack>
  );
}
