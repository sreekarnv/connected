"use client";

import {
  Button,
  Card,
  Container,
  DataList,
  Flex,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthMessage } from "~/components/auth/auth-message";
import { ColorModeButton } from "~/components/ui/color-mode";
import { useSession } from "~/lib/use-session";

export default function DashboardClientPage() {
  const router = useRouter();
  const state = useSession();

  useEffect(() => {
    if (state.status === "signed-out") router.replace("/login");
  }, [state.status, router]);

  return (
    <Container as="main" maxW="3xl" py={{ base: "6", md: "12" }}>
      <Stack gap={{ base: "6", md: "8" }}>
        <Flex align="center" justify="space-between" gap="4">
          <Heading as="h1" fontSize={{ base: "2xl", md: "3xl" }}>
            Dashboard
          </Heading>
          <ColorModeButton />
        </Flex>
        {(state.status === "loading" || state.status === "signed-out") && (
          <HStack gap="3" color="fg.muted" role="status">
            <Spinner size="sm" />
            <Text>Loading your account...</Text>
          </HStack>
        )}
        {state.status === "error" && (
          <Stack gap="4">
            <AuthMessage status="error" title="Unable to load your account">
              We couldn’t load your details. Please try again.
            </AuthMessage>
            <Button alignSelf="start" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </Stack>
        )}
        {state.status === "ready" && (
          <Card.Root bg="bg.panel" borderColor="border.subtle" rounded="2xl">
            <Card.Header>
              <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }}>
                Welcome, {state.user.name}
              </Heading>
              <Text color="fg.muted">Your account details</Text>
            </Card.Header>
            <Card.Body>
              <DataList.Root orientation="horizontal" gap="5">
                {[
                  ["Name", state.user.name],
                  ["Email address", state.user.email],
                  ["User ID", state.user.id],
                  [
                    "Email verified",
                    state.user.email_verified_at
                      ? new Date(state.user.email_verified_at).toLocaleString()
                      : "Not verified",
                  ],
                  ["Joined", new Date(state.user.created_at).toLocaleString()],
                  [
                    "Last updated",
                    new Date(state.user.updated_at).toLocaleString(),
                  ],
                ].map(([label, value]) => (
                  <DataList.Item
                    key={label}
                    flexDirection={{ base: "column", md: "row" }}
                    alignItems="start"
                    gap={{ base: "1", md: "4" }}
                  >
                    <DataList.ItemLabel>{label}</DataList.ItemLabel>
                    <DataList.ItemValue overflowWrap="anywhere">
                      {value}
                    </DataList.ItemValue>
                  </DataList.Item>
                ))}
              </DataList.Root>
            </Card.Body>
          </Card.Root>
        )}
      </Stack>
    </Container>
  );
}
