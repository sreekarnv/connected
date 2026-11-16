"use client";

import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  HStack,
  Input,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import { useRef, useState } from "react";
import {
  useMyFollowersQuery,
  useMyFollowingQuery,
  useProfileByHandleQuery,
} from "~/graphql/generated/graphql";
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
} from "./social-ui";

function HandleLookup({ handle }: { handle: string }) {
  const { context } = useSocialSession();
  const [result, refresh] = useProfileByHandleQuery({
    context,
    variables: { handle },
    requestPolicy: "network-only",
  });
  if (result.fetching)
    return (
      <LoadingSkeleton variant="person">
        Looking up this handle...
      </LoadingSkeleton>
    );
  if (hasAuthErrorCode(result.error, "PROFILE_NOT_FOUND"))
    return (
      <Text role="status" fontSize="sm" color="fg.muted">
        This profile is unavailable. Check the exact handle and try again.
      </Text>
    );
  if (result.error || !result.data?.socialProfileByHandle)
    return (
      <RequestError
        error={result.error}
        message="We couldn't look up this handle."
        onRetry={() => refresh({ requestPolicy: "network-only" })}
      />
    );
  return <PersonRow profile={result.data.socialProfileByHandle} />;
}

function RelationshipLists({ onFind }: { onFind: () => void }) {
  const { context } = useSocialSession();
  const [tab, setTab] = useState<"following" | "followers">("following");
  const [pages, setPages] = useState<{
    following?: string;
    followers?: string;
  }>({});
  const after = pages[tab];
  const setAfter = (after?: string) =>
    setPages((previous) => ({ ...previous, [tab]: after }));
  const [following, refreshFollowing] = useMyFollowingQuery({
    context,
    variables: { after: pages.following },
    pause: tab !== "following",
    requestPolicy: "network-only",
  });
  const [followers, refreshFollowers] = useMyFollowersQuery({
    context,
    variables: { after: pages.followers },
    pause: tab !== "followers",
    requestPolicy: "network-only",
  });
  const result = tab === "following" ? following : followers;
  const refresh = tab === "following" ? refreshFollowing : refreshFollowers;
  const page = result.data?.profiles;
  const people = page?.items.filter((person) => person !== null) ?? [];
  return (
    <Stack gap="5">
      <HStack
        gap="1"
        as="nav"
        aria-label="Connection lists"
        bg="bg.muted"
        rounded="full"
        p="1"
        alignSelf="start"
      >
        {(["following", "followers"] as const).map((choice) => (
          <Button
            key={choice}
            variant={tab === choice ? "subtle" : "ghost"}
            colorPalette="blue"
            minH="11"
            rounded="full"
            bg={tab === choice ? "bg.panel" : undefined}
            aria-pressed={tab === choice}
            onClick={() => setTab(choice)}
          >
            {choice === "following" ? "Following" : "Followers"}
          </Button>
        ))}
      </HStack>
      {result.fetching ? (
        <LoadingSkeleton variant="person" rows={3}>
          Loading connections...
        </LoadingSkeleton>
      ) : result.error || !page ? (
        <RequestError
          error={result.error}
          message="We couldn't load your connections."
          onRetry={() => refresh({ requestPolicy: "network-only" })}
          retryLabel="Retry connections"
        />
      ) : (
        <>
          {people.length ? (
            <Stack gap="0" separator={<Separator />}>
              {people.map((person) => (
                <PersonRow key={person.id} profile={person} />
              ))}
            </Stack>
          ) : (
            <EmptyState
              title={
                after
                  ? "No connections on this page."
                  : tab === "following"
                    ? "You're not following anyone yet."
                    : "No followers yet."
              }
              action={
                !after &&
                tab === "following" && (
                  <Button variant="outline" rounded="full" onClick={onFind}>
                    Find someone
                  </Button>
                )
              }
            >
              {page.next_cursor
                ? "There may be more connections on the next page."
                : after
                  ? "Go back to the first page to see your connections."
                  : tab === "following"
                    ? "Find a handle above and open the profile to follow them."
                    : "People who follow you will appear here."}
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

export function ConnectionsScreen() {
  const { profile, profileLoading, profileError, refreshProfile } =
    useSocialSession();
  const [handle, setHandle] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const [lookup, setLookup] = useState<{ handle: string; sequence: number }>();
  return (
    <Stack gap="7">
      <PageHeading title="Connections">
        Good conversations start with your people.
      </PageHeading>
      <Box
        bg="blue.subtle"
        borderWidth="1px"
        borderColor="border.subtle"
        rounded="2xl"
        p={{ base: "4", md: "6" }}
      >
        <Stack gap="4">
          <Heading as="h2" fontSize="lg" color="blue.fg">
            Find someone by handle
          </Heading>
          <Box
            as="form"
            onSubmit={(event) => {
              event.preventDefault();
              if (handle && handle.length <= 30)
                setLookup({
                  handle,
                  sequence: (lookup?.sequence ?? 0) + 1,
                });
            }}
          >
            <Flex gap="3" align="end" direction={{ base: "column", sm: "row" }}>
              <Field.Root required>
                <Field.Label>Handle</Field.Label>
                <Input
                  ref={input}
                  value={handle}
                  onChange={(event) => setHandle(event.target.value)}
                  fontSize="md"
                  minH="12"
                  rounded="xl"
                  bg="bg.panel"
                  maxLength={30}
                  placeholder="Enter their exact handle"
                  autoComplete="off"
                />
                <Field.HelperText>
                  Match the capitalization, spaces, and punctuation exactly.
                </Field.HelperText>
              </Field.Root>
              <Button
                type="submit"
                rounded="full"
                minH="12"
                disabled={!handle}
                flexShrink="0"
                alignSelf={{ base: "stretch", sm: "center" }}
              >
                <Search size={16} aria-hidden="true" />
                Find profile
              </Button>
            </Flex>
          </Box>
          {lookup && (
            <HandleLookup key={lookup.sequence} handle={lookup.handle} />
          )}
        </Stack>
      </Box>
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border.subtle"
        rounded="2xl"
        p={{ base: "4", md: "6" }}
      >
        {profileLoading ? (
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
        ) : (
          <RelationshipLists onFind={() => input.current?.focus()} />
        )}
      </Box>
    </Stack>
  );
}
