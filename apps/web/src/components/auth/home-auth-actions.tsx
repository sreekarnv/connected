"use client";

import { Button, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import { LogInIcon, LogOutIcon } from "lucide-react";
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
        setError("We couldn't log you out. Please try again.");
        return;
      }
      // Clear cached private data after the server removes the session cookie.
      window.location.replace("/");
    } catch {
      setError("We couldn't log you out. Please try again.");
    }
  }

  if (session.status === "loading") {
    return (
      <HStack minH="11" gap="2" color="fg.muted" role="status">
        <Spinner size="sm" />
        <Text fontSize="sm">Checking session...</Text>
      </HStack>
    );
  }

  if (session.status === "error") {
    return (
      <Stack gap="2" align="start" maxW="xs">
        <Text fontSize="sm" role="alert">
          We couldn&apos;t check your session.
        </Text>
        <Button size="sm" minH="11" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="2" align="end" maxW="full">
      <HStack gap={{ base: "2", md: "4" }}>
        {session.status === "ready" ? (
          <Button
            size="sm"
            minH="11"
            rounded="lg"
            loading={fetching}
            loadingText="Logging out"
            disabled={fetching}
            onClick={signOut}
          >
            Log Out
            <LogOutIcon aria-hidden="true" />
          </Button>
        ) : (
          <>
            <Button asChild size="sm" minH="11" rounded="lg">
              <Link href="/login">
                Log In
                <LogInIcon aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="sm" minH="11" rounded="lg">
              <Link href="/signup">Sign Up</Link>
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
