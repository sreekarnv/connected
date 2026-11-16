"use client";

import {
  Box,
  Button,
  Field,
  Flex,
  HStack,
  Input,
  Stack,
  Text,
  Heading,
} from "@chakra-ui/react";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { OperationContext } from "urql";
import {
  useCreateSocialProfileMutation,
  useSocialFollowingPostsQuery,
  useSocialPostsQuery,
} from "~/graphql/generated/graphql";
import { hasAuthErrorCode } from "~/lib/auth-feedback";
import { PostCard, type SocialPost } from "./post-card";
import {
  useSocialSession,
  type Feed,
  type PaginationState,
} from "./social-shell";
import {
  EmptyState,
  LoadingSkeleton,
  PageHeading,
  Pagination,
  PersonAvatar,
  RequestError,
  requestMessage,
  sessionExpired,
  SessionRecovery,
} from "./social-ui";

function ProfileSetup({
  name,
  context,
  onCreated,
}: {
  name: string;
  context: Partial<OperationContext>;
  onCreated: () => void;
}) {
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState(name);
  const [error, setError] = useState<{
    message: string;
    field?: "handle";
  } | null>(null);
  const [{ fetching, error: mutationError }, createProfile] =
    useCreateSocialProfileMutation();

  return (
    <Box
      id="profile-setup"
      as="form"
      onSubmit={async (event) => {
        event.preventDefault();
        if (fetching || !handle.trim() || !displayName.trim()) return;
        setError(null);
        try {
          const result = await createProfile(
            {
              input: {
                handle: handle.trim(),
                display_name: displayName.trim(),
              },
            },
            context,
          );
          if (result.error || !result.data?.socialCreateMyProfile) {
            setError(
              hasAuthErrorCode(result.error, "HANDLE_TAKEN")
                ? {
                    field: "handle",
                    message: "That handle is taken. Try another one.",
                  }
                : {
                    message: requestMessage(
                      result.error,
                      "We couldn't create your profile. Please try again.",
                    ),
                  },
            );
            return;
          }
          onCreated();
        } catch {
          setError({
            message: "We couldn't create your profile. Please try again.",
          });
        }
      }}
    >
      <Stack gap="4">
        <Stack gap="1">
          <Heading as="h2" fontSize="lg">
            Make yourself at home.
          </Heading>
          <Text fontSize="sm" color="fg.muted" lineHeight="1.7">
            Choose how people see you. Your account name and email stay private.
          </Text>
        </Stack>
        <Field.Root required>
          <Field.Label>Display name</Field.Label>
          <Input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            fontSize="md"
            minH="12"
            maxLength={100}
            disabled={fetching}
            autoComplete="nickname"
          />
          <Field.HelperText>
            You can change your display name later.
          </Field.HelperText>
        </Field.Root>
        <Field.Root required invalid={error?.field === "handle"}>
          <Field.Label>Handle</Field.Label>
          <Input
            value={handle}
            onChange={(event) => {
              setHandle(event.target.value);
              if (error?.field === "handle") setError(null);
            }}
            fontSize="md"
            minH="12"
            maxLength={30}
            disabled={fetching}
            autoComplete="username"
          />
          <Field.HelperText>
            1–30 characters. Capitalization matters. Your handle cannot be
            changed.
          </Field.HelperText>
          <Field.ErrorText role="alert">
            {error?.field === "handle" && error.message}
          </Field.ErrorText>
        </Field.Root>
        {error && !error.field && (
          <Text role="alert" fontSize="sm" color="red.fg">
            {error.message}
          </Text>
        )}
        {error && sessionExpired(mutationError) && <SessionRecovery />}
        <Button
          type="submit"
          loading={fetching}
          loadingText="Creating profile"
          disabled={fetching || !handle.trim() || !displayName.trim()}
          rounded="full"
          colorPalette="blue"
          minH="12"
        >
          Create profile
        </Button>
      </Stack>
    </Box>
  );
}

function FeedTimeline({
  feed,
  onFeedChange,
  pagination,
  onPaginationChange,
}: {
  feed: Feed;
  onFeedChange: (feed: Feed) => void;
  pagination: PaginationState;
  onPaginationChange: (page: PaginationState) => void;
}) {
  const { context, postVersion } = useSocialSession();
  const after =
    pagination.postVersion === postVersion ? pagination.after : undefined;
  const setAfter = (after?: string) =>
    onPaginationChange({ after, postVersion });
  const previousPage = useRef({ after, postVersion });
  const [community, refreshCommunity] = useSocialPostsQuery({
    context,
    variables: { after: after },
    pause: feed !== "all",
    requestPolicy: "network-only",
  });
  const [following, refreshFollowing] = useSocialFollowingPostsQuery({
    context,
    variables: { after: after },
    pause: feed !== "following",
    requestPolicy: "network-only",
  });
  const result = feed === "all" ? community : following;
  const refresh = feed === "all" ? refreshCommunity : refreshFollowing;
  useEffect(() => {
    const previous = previousPage.current;
    previousPage.current = { after, postVersion };
    if (previous.postVersion !== postVersion && previous.after === after) {
      refresh({ requestPolicy: "network-only" });
    }
  }, [after, postVersion, refresh]);
  const page = result.data?.posts;
  const authors = new Map(
    page?.authors
      ?.filter((author) => author !== null)
      .map((author) => [author.id, author]),
  );
  const posts =
    page?.items.filter(
      (post): post is SocialPost =>
        post !== null && (page.authors === null || authors.has(post.author_id)),
    ) ?? [];
  return (
    <Stack gap="4">
      <Flex align="center" justify="space-between" gap="2">
        <HStack
          as="nav"
          aria-label="Feed selection"
          gap="1"
          bg="bg.muted"
          p="1"
          rounded="full"
        >
          {(
            [
              ["all", "Community"],
              ["following", "Following"],
            ] as const
          ).map(([id, label]) => (
            <Button
              key={id}
              minH="11"
              px={{ base: "4", md: "5" }}
              variant="ghost"
              rounded="full"
              bg={feed === id ? "bg.panel" : undefined}
              color={feed === id ? "blue.fg" : "fg.muted"}
              shadow={feed === id ? "xs" : undefined}
              aria-pressed={feed === id}
              onClick={() => onFeedChange(id)}
            >
              {label}
            </Button>
          ))}
        </HStack>
        <HStack color="fg.muted" fontSize="xs" gap="1" flexShrink="0">
          <Text display={{ base: "none", sm: "block" }}>Latest first</Text>
          <ArrowDown size={15} aria-hidden="true" />
        </HStack>
      </Flex>
      {result.fetching ? (
        <LoadingSkeleton rows={3}>Loading posts...</LoadingSkeleton>
      ) : !page ? (
        <RequestError
          error={result.error}
          message="We couldn't load posts. Please try again."
          onRetry={() => refresh({ requestPolicy: "network-only" })}
          retryLabel="Retry feed"
        />
      ) : (
        <>
          {page.authors === null && (
            <RequestError
              error={result.error}
              message="Some profile details couldn't be loaded. Your posts are still here."
              onRetry={() => refresh({ requestPolicy: "network-only" })}
              retryLabel="Retry names"
            />
          )}
          {posts.length ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                author={authors.get(post.author_id)}
                onDeleted={() => refresh({ requestPolicy: "network-only" })}
              />
            ))
          ) : (
            <EmptyState
              title={
                after
                  ? "No posts on this page."
                  : feed === "following"
                    ? "Your people, right here."
                    : "Start a conversation."
              }
              action={
                !after &&
                !page.next_cursor &&
                feed === "following" && (
                  <Flex gap="3" justify="center" wrap="wrap">
                    <Button rounded="full" onClick={() => onFeedChange("all")}>
                      Browse community
                    </Button>
                    <Button asChild rounded="full" variant="outline">
                      <Link href="/social/connections">Find people</Link>
                    </Button>
                  </Flex>
                )
              }
            >
              {page.next_cursor
                ? "There may be more posts on the next page."
                : feed === "following"
                  ? "Follow someone from Connections to see their updates alongside yours."
                  : "Share a thought, a small win, or something that made your day."}
            </EmptyState>
          )}
          <Pagination
            after={after}
            next={page.next_cursor}
            onFirst={() => setAfter(undefined)}
            onNext={(after) => setAfter(after)}
            nextLabel="Older posts"
          />
        </>
      )}
    </Stack>
  );
}

export function SocialFeed() {
  const {
    user,
    context,
    profile,
    profileLoading,
    profileError,
    refreshProfile,
    openComposer,
    feedState,
    setFeedState,
  } = useSocialSession();
  const feed = feedState.selected;
  const setFeed = (selected: Feed) =>
    setFeedState((previous) => ({ ...previous, selected }));
  const missingProfile = hasAuthErrorCode(profileError, "PROFILE_NOT_FOUND");
  return (
    <Stack gap={{ base: "5", md: "6" }}>
      <PageHeading title="Your feed">
        Small updates. Real connections.
      </PageHeading>
      {missingProfile ? (
        <Box
          bg="bg.panel"
          rounded="2xl"
          borderWidth="1px"
          borderColor="border"
          p={{ base: "5", md: "6" }}
        >
          <ProfileSetup
            name={user.name}
            context={context}
            onCreated={refreshProfile}
          />
        </Box>
      ) : profileError ? (
        <RequestError
          error={profileError}
          message="We couldn't load your profile."
          onRetry={refreshProfile}
          retryLabel="Retry profile"
        />
      ) : profileLoading && !profile ? (
        <LoadingSkeleton variant="person">
          Loading your profile...
        </LoadingSkeleton>
      ) : profile ? (
        <Box
          bg="bg.panel"
          rounded="2xl"
          borderWidth="1px"
          borderColor="border"
          p={{ base: "4", md: "5" }}
        >
          <HStack gap="3">
            <PersonAvatar name={profile.display_name} accent="pink" />
            <Button
              flex="1"
              justifyContent="start"
              variant="ghost"
              minW="0"
              h="12"
              rounded="full"
              bg="bg.subtle"
              color="fg.muted"
              fontWeight="normal"
              px="4"
              onClick={openComposer}
            >
              <Text truncate>What&apos;s on your mind?</Text>
            </Button>
          </HStack>
        </Box>
      ) : null}
      <FeedTimeline
        key={feed}
        feed={feed}
        onFeedChange={setFeed}
        pagination={feedState.pages[feed]}
        onPaginationChange={(page) =>
          setFeedState((previous) => ({
            ...previous,
            pages: { ...previous.pages, [feed]: page },
          }))
        }
      />
    </Stack>
  );
}
