"use client";

import {
  Box,
  Button,
  Field,
  DataList,
  ClientOnly,
  HStack,
  Skeleton,
  Heading,
  Input,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LogOut, Sun, Moon, Palette } from "lucide-react";
import { useState } from "react";
import type { CombinedError } from "urql";
import {
  type SocialViewerQuery,
  useLogoutMutation,
  useMyBlocksQuery,
  useUnblockProfileMutation,
  useUpdateSocialProfileMutation,
} from "~/graphql/generated/graphql";
import { useColorMode } from "~/components/ui/color-mode";
import { hasAuthErrorCode } from "~/lib/auth-feedback";
import { useSocialSession } from "./social-shell";
import {
  EmptyState,
  PageHeading,
  LoadingSkeleton,
  Pagination,
  PersonRow,
  ProfileRequired,
  RequestError,
  requestMessage,
  sessionExpired,
  SessionRecovery,
} from "./social-ui";

function DisplayNameForm({
  profile,
}: {
  profile: NonNullable<SocialViewerQuery["socialMyProfile"]>;
}) {
  const { context, refreshProfile } = useSocialSession();
  const [draft, setDraft] = useState<string>();
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [{ fetching, error }, updateProfile] = useUpdateSocialProfileMutation();
  const name = draft ?? profile.display_name;
  return (
    <Box
      as="form"
      onSubmit={async (event) => {
        event.preventDefault();
        if (fetching || !name.trim() || name.trim().length > 100) return;
        setMessage(null);
        setNotice("");
        try {
          const result = await updateProfile(
            { input: { display_name: name.trim() } },
            context,
          );
          if (result.error || !result.data?.socialUpdateMyProfile) {
            setMessage(
              requestMessage(
                result.error,
                "We couldn't save your display name. Your changes are still here.",
              ),
            );
            return;
          }
          setDraft(result.data.socialUpdateMyProfile.display_name);
          setNotice("Your display name is updated.");
          refreshProfile();
        } catch {
          setMessage(
            "We couldn't save your display name. Your changes are still here.",
          );
        }
      }}
    >
      <Stack gap="4">
        <Heading as="h2" fontSize="lg">
          Your profile
        </Heading>
        <Text color="fg.muted" fontSize="sm" overflowWrap="anywhere">
          @{profile.handle} · Your handle cannot be changed.
        </Text>
        <Field.Root required>
          <Field.Label>Display name</Field.Label>
          <Input
            value={name}
            onChange={(event) => setDraft(event.target.value)}
            fontSize="md"
            minH="12"
            maxLength={100}
            disabled={fetching}
            autoComplete="nickname"
          />
          <Field.HelperText>
            This is the name people see next to your posts.
          </Field.HelperText>
        </Field.Root>
        {message && (
          <Text role="alert" color="red.fg" fontSize="sm">
            {message}
          </Text>
        )}
        {message && sessionExpired(error) && <SessionRecovery />}
        <Button
          type="submit"
          alignSelf={{ base: "stretch", sm: "start" }}
          minH="12"
          rounded="full"
          loading={fetching}
          loadingText="Saving"
          disabled={
            fetching || !name.trim() || name.trim() === profile.display_name
          }
        >
          Save changes
        </Button>
        <Text role="status" color="blue.fg" fontSize="sm">
          {notice}
        </Text>
      </Stack>
    </Box>
  );
}

function BlockedPeople() {
  const { context } = useSocialSession();
  const [after, setAfter] = useState<string>();
  const [pending, setPending] = useState<string>();
  const [message, setMessage] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<CombinedError>();
  const [notice, setNotice] = useState("");
  const [result, refresh] = useMyBlocksQuery({
    context,
    variables: { after },
    requestPolicy: "network-only",
  });
  const [{ fetching }, unblock] = useUnblockProfileMutation();
  const page = result.data?.profiles;
  const people = page?.items.filter((person) => person !== null) ?? [];
  return (
    <Stack gap="4">
      <Stack gap="1">
        <Heading as="h2" fontSize="lg">
          Blocked people
        </Heading>
        <Text color="fg.muted" fontSize="sm">
          Unblocking makes profiles visible again. It does not restore follows.
        </Text>
      </Stack>
      {message && (
        <Text role="alert" color="red.fg" fontSize="sm">
          {message}
        </Text>
      )}
      {message && sessionExpired(mutationError) && <SessionRecovery />}
      <Text role="status" color="blue.fg" fontSize="sm">
        {notice}
      </Text>
      {result.fetching ? (
        <LoadingSkeleton variant="person" rows={3}>
          Loading blocked people...
        </LoadingSkeleton>
      ) : result.error || !page ? (
        <RequestError
          error={result.error}
          message="We couldn't load blocked people."
          onRetry={() => refresh({ requestPolicy: "network-only" })}
          retryLabel="Retry blocked people"
        />
      ) : (
        <>
          {people.length ? (
            <Stack gap="0" separator={<Separator />}>
              {people.map((person) => (
                <PersonRow key={person.id} profile={person} linked={false}>
                  <Button
                    size="sm"
                    variant="outline"
                    rounded="full"
                    minH="11"
                    disabled={fetching}
                    loading={fetching && pending === person.id}
                    loadingText="Unblocking"
                    aria-label={`Unblock ${person.display_name}`}
                    onClick={async () => {
                      setPending(person.id);
                      setMessage(null);
                      setMutationError(undefined);
                      setNotice("");
                      try {
                        const response = await unblock(
                          { targetId: person.id },
                          context,
                        );
                        if (
                          response.error ||
                          response.data?.relationship?.status !== "success"
                        ) {
                          setMutationError(response.error);
                          setMessage(
                            requestMessage(
                              response.error,
                              "We couldn't unblock this profile. Please try again.",
                            ),
                          );
                          return;
                        }
                        setNotice(`${person.display_name} is unblocked.`);
                        refresh({ requestPolicy: "network-only" });
                      } catch {
                        setMessage(
                          "We couldn't unblock this profile. Please try again.",
                        );
                      } finally {
                        setPending(undefined);
                      }
                    }}
                  >
                    Unblock
                  </Button>
                </PersonRow>
              ))}
            </Stack>
          ) : (
            <EmptyState
              title={
                after ? "No blocked people on this page." : "No blocked people."
              }
            >
              {after
                ? "Go back to the first page to see your blocked profiles."
                : "Profiles you block will appear here. You can unblock them at any time."}
            </EmptyState>
          )}
          <Pagination
            after={after}
            next={page.next_cursor}
            onFirst={() => setAfter(undefined)}
            onNext={setAfter}
          />
        </>
      )}
    </Stack>
  );
}

function SignOut() {
  const [{ fetching }, logout] = useLogoutMutation();
  const [error, setError] = useState<string | null>(null);
  return (
    <Stack gap="4" align="start">
      <Stack gap="1">
        <Heading as="h2" fontSize="lg">
          Your session
        </Heading>
        <Text color="fg.muted" fontSize="sm">
          Sign out of Connected on this browser.
        </Text>
      </Stack>
      <Button
        variant="outline"
        rounded="full"
        disabled={fetching}
        loading={fetching}
        loadingText="Signing out"
        onClick={async () => {
          setError(null);
          try {
            const result = await logout({});
            if (result.error || result.data?.logout?.status !== "success") {
              setError("We couldn't sign you out. Please try again.");
              return;
            }
            window.location.replace("/");
          } catch {
            setError("We couldn't sign you out. Please try again.");
          }
        }}
      >
        <LogOut size={16} />
        Sign out
      </Button>
      {error && (
        <Text role="alert" color="red.fg" fontSize="sm">
          {error}
        </Text>
      )}
    </Stack>
  );
}

export function SettingsScreen() {
  const { user, profile, profileLoading, profileError, refreshProfile } =
    useSocialSession();
  return (
    <Stack gap="7" maxW="3xl">
      <PageHeading title="Settings">
        Your profile, your preferences, your space.
      </PageHeading>
      <Stack
        as="section"
        aria-labelledby="account-heading"
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border.subtle"
        rounded="2xl"
        p={{ base: "4", md: "6" }}
        gap="4"
      >
        <Heading as="h2" id="account-heading" fontSize="lg">
          Your account
        </Heading>
        <DataList.Root orientation={{ base: "vertical", md: "horizontal" }}>
          <DataList.Item
            flexDirection={{ base: "column", md: "row" }}
            alignItems="start"
          >
            <DataList.ItemLabel>Account name</DataList.ItemLabel>
            <DataList.ItemValue overflowWrap="anywhere">
              {user.name}
            </DataList.ItemValue>
          </DataList.Item>
          <DataList.Item
            flexDirection={{ base: "column", md: "row" }}
            alignItems="start"
          >
            <DataList.ItemLabel>Email</DataList.ItemLabel>
            <DataList.ItemValue overflowWrap="anywhere">
              {user.email}
            </DataList.ItemValue>
          </DataList.Item>
          <DataList.Item
            flexDirection={{ base: "column", md: "row" }}
            alignItems="start"
          >
            <DataList.ItemLabel>Email verification</DataList.ItemLabel>
            <DataList.ItemValue>
              {user.email_verified_at ? "Verified" : "Not verified"}
            </DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
        <Text fontSize="sm" color="fg.muted">
          Only you can see these account details.
        </Text>
      </Stack>
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border.subtle"
        rounded="2xl"
        p={{ base: "4", md: "6" }}
      >
        {profile ? (
          <DisplayNameForm key={profile.id} profile={profile} />
        ) : profileLoading ? (
          <LoadingSkeleton variant="person">
            Loading your profile...
          </LoadingSkeleton>
        ) : hasAuthErrorCode(profileError, "PROFILE_NOT_FOUND") ? (
          <ProfileRequired />
        ) : profileError || !profile ? (
          <RequestError
            error={profileError}
            message="We couldn't load your profile."
            onRetry={refreshProfile}
            retryLabel="Retry profile"
          />
        ) : null}
      </Box>
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        rounded="2xl"
        p={{ base: "4", md: "6" }}
      >
        <Appearance />
      </Box>
      {profile && (
        <Box
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border.subtle"
          rounded="2xl"
          p={{ base: "4", md: "6" }}
        >
          <BlockedPeople />
        </Box>
      )}
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border.subtle"
        rounded="2xl"
        p={{ base: "4", md: "6" }}
      >
        <SignOut />
      </Box>
    </Stack>
  );
}

function Appearance() {
  const { colorMode, setColorMode } = useColorMode();
  return (
    <Stack gap="4">
      <HStack gap="2">
        <Palette size={19} />
        <Heading as="h2" fontSize="lg">
          Appearance
        </Heading>
      </HStack>
      <Text color="fg.muted" fontSize="sm">
        Choose the view that feels right for you.
      </Text>
      <ClientOnly fallback={<Skeleton h="12" />}>
        <HStack gap="3">
          {(
            [
              ["light", "Light", Sun],
              ["dark", "Dark", Moon],
            ] as const
          ).map(([mode, label, Icon]) => (
            <Button
              key={mode}
              flex="1"
              minH="12"
              variant={colorMode === mode ? "subtle" : "outline"}
              aria-pressed={colorMode === mode}
              onClick={() => setColorMode(mode)}
            >
              <Icon size={18} />
              {label}
            </Button>
          ))}
        </HStack>
      </ClientOnly>
    </Stack>
  );
}
