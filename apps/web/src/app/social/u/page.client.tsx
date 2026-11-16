"use client";

import {
  IconButton,
  Menu,
  Portal,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Ban, Ellipsis, CalendarDays, ArrowLeft } from "lucide-react";
import type { CombinedError } from "urql";
import {
  type ProfileByHandleQuery,
  useBlockProfileMutation,
  useFollowProfileMutation,
  useProfileByHandleQuery,
  useProfilePostsQuery,
  useUnfollowProfileMutation,
} from "~/graphql/generated/graphql";
import { fieldError } from "~/lib/graphql-errors";
import { hasAuthErrorCode } from "~/lib/auth-feedback";
import { profileHref } from "~/lib/social-links";
import { PostCard } from "~/components/social/post-card";
import { useSocialSession } from "~/components/social/social-shell";
import {
  ConfirmDialog,
  PersonAvatar,
  ProfileCover,
  EmptyState,
  LoadingSkeleton,
  LoadingState,
  Pagination,
  ProfileRequired,
  RequestError,
  requestMessage,
  sessionExpired,
  SessionRecovery,
} from "~/components/social/social-ui";

type Profile = NonNullable<ProfileByHandleQuery["socialProfileByHandle"]>;

function ProfileContent({ profile }: { profile: Profile }) {
  const {
    user,
    context,
    profile: mine,
    profileLoading,
    profileError,
    refreshProfile,
    postVersion,
    openComposer,
    profilePages,
    setProfilePages,
  } = useSocialSession();
  const router = useRouter();

  const pagination = profilePages[profile.id];
  const after =
    pagination?.postVersion === postVersion ? pagination.after : undefined;
  const setAfter = (after?: string) =>
    setProfilePages((previous) => ({
      ...previous,
      [profile.id]: { after, postVersion },
    }));
  const previousPage = useRef({ after, postVersion });
  const [confirming, setConfirming] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<CombinedError>();
  const [notice, setNotice] = useState("");

  const own = user.id === profile.id;

  const [postsResult, refreshPosts] = useProfilePostsQuery({
    context,
    variables: {
      authorIds: [profile.id],
      after,
      checkFollowing: !own && !!mine,
    },
    requestPolicy: "network-only",
  });

  useEffect(() => {
    const previous = previousPage.current;
    previousPage.current = { after, postVersion };
    if (previous.postVersion !== postVersion && previous.after === after) {
      refreshPosts({ requestPolicy: "network-only" });
    }
  }, [after, postVersion, refreshPosts]);

  const followError = fieldError(postsResult.error, "socialFeedAuthorIds");
  const postsError = fieldError(postsResult.error, "posts");
  const [{ fetching: following }, follow] = useFollowProfileMutation();
  const [{ fetching: unfollowing }, unfollow] = useUnfollowProfileMutation();
  const [{ fetching: blocking }, block] = useBlockProfileMutation();

  const busy = following || unfollowing || blocking;

  const membership = postsResult.data?.socialFeedAuthorIds;
  const isFollowing = membership?.includes(profile.id) ?? false;

  const page = postsResult.data?.posts;
  const posts = page?.items.filter((post) => post !== null) ?? [];

  return (
    <Stack gap="5">
      <Button
        asChild
        variant="ghost"
        alignSelf="start"
        minH="11"
        px="0"
        color="fg.muted"
      >
        <Link href="/social/connections">
          <ArrowLeft size={17} />
          Connections
        </Link>
      </Button>
      <Box
        bg="bg.panel"
        rounded="2xl"
        borderWidth="1px"
        borderColor="border.subtle"
        overflow="hidden"
      >
        <ProfileCover />
        <Stack p={{ base: "5", md: "7" }} gap="4">
          <Box
            mt="-14"
            bg="bg.panel"
            p="1"
            rounded="3xl"
            alignSelf="start"
            position="relative"
          >
            <PersonAvatar
              name={profile.display_name}
              size="2xl"
              accent="pink"
            />
          </Box>
          <Flex justify="space-between" align="start" gap="4" wrap="wrap">
            <Stack gap="1" minW="0">
              <Heading
                as="h1"
                fontSize={{ base: "2xl", md: "3xl" }}
                overflowWrap="anywhere"
              >
                {profile.display_name}
              </Heading>
              <Text color="fg.muted" overflowWrap="anywhere">
                @{profile.handle}
              </Text>
            </Stack>
            {own ? (
              <Button asChild variant="outline" rounded="full" minH="11">
                <Link href="/social/settings">Edit profile</Link>
              </Button>
            ) : (
              mine && (
                <HStack gap="2" wrap="wrap">
                  <Button
                    rounded="full"
                    minH="11"
                    disabled={
                      busy ||
                      postsResult.fetching ||
                      !!followError ||
                      !membership
                    }
                    loading={following || unfollowing}
                    loadingText="Updating"
                    onClick={async () => {
                      setMessage(null);
                      setMutationError(undefined);
                      setNotice("");
                      try {
                        const result = isFollowing
                          ? await unfollow({ targetId: profile.id }, context)
                          : await follow({ targetId: profile.id }, context);
                        const status = result.data?.relationship?.status;
                        if (result.error || status !== "success") {
                          setMutationError(result.error);
                          setMessage(
                            requestMessage(
                              result.error,
                              "We couldn't update this connection. Please try again.",
                            ),
                          );
                          return;
                        }
                        setNotice(
                          isFollowing
                            ? "You unfollowed this profile."
                            : "You're now following this profile.",
                        );
                        refreshPosts({ requestPolicy: "network-only" });
                      } catch {
                        setMessage(
                          "We couldn't update this connection. Please try again.",
                        );
                      }
                    }}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <IconButton
                        ref={menuTrigger}
                        aria-label="Profile options"
                        disabled={busy}
                        variant="outline"
                        minH="11"
                        minW="11"
                        rounded="full"
                      >
                        <Ellipsis size={20} />
                      </IconButton>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item
                            value="block"
                            disabled={busy}
                            color="red.fg"
                            minH="11"
                            onSelect={() => setConfirming(true)}
                          >
                            <Ban size={16} />
                            Block profile
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                </HStack>
              )
            )}
          </Flex>
          <Text
            fontSize="sm"
            color="fg.muted"
            display="flex"
            alignItems="center"
            gap="2"
          >
            <CalendarDays size={15} />
            Joined{" "}
            {new Date(profile.created_at).toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </Text>
          {!own &&
            (profileLoading ? (
              <LoadingSkeleton variant="person">
                Loading your profile...
              </LoadingSkeleton>
            ) : hasAuthErrorCode(profileError, "PROFILE_NOT_FOUND") ? (
              <ProfileRequired />
            ) : !mine ? (
              <RequestError
                error={profileError}
                message="We couldn't load your profile."
                onRetry={refreshProfile}
                retryLabel="Retry profile"
              />
            ) : postsResult.fetching ? (
              <LoadingState>Checking connection...</LoadingState>
            ) : followError || !membership ? (
              <RequestError
                error={followError}
                message="We couldn't check this connection."
                onRetry={() => refreshPosts({ requestPolicy: "network-only" })}
                retryLabel="Retry connection"
              />
            ) : null)}
          {message && (
            <Text role="alert" color="red.fg" fontSize="sm">
              {message}
            </Text>
          )}
          {message && sessionExpired(mutationError) && <SessionRecovery />}
          <Text role="status" fontSize="sm" color="blue.fg">
            {notice}
          </Text>
        </Stack>
      </Box>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={`Block @${profile.handle}?`}
        confirmLabel="Block profile"
        busy={busy}
        finalFocusEl={() => menuTrigger.current}
        onConfirm={async () => {
          if (busy) return;
          setMessage(null);
          setMutationError(undefined);

          try {
            const result = await block({ targetId: profile.id }, context);

            if (
              result.error ||
              result.data?.relationship?.status !== "success"
            ) {
              setMutationError(result.error);
              setMessage(
                requestMessage(
                  result.error,
                  "We couldn't block this profile. Please try again.",
                ),
              );
              setConfirming(false);
              return;
            }
            setConfirming(false);
            router.replace("/social/connections");
          } catch {
            setMessage("We couldn't block this profile. Please try again.");
            setConfirming(false);
          }
        }}
      >
        You will no longer see each other&apos;s profiles or posts. This also
        removes follows in both directions.
      </ConfirmDialog>
      <Heading as="h2" fontSize="lg">
        {own ? "Your posts" : "Posts"}
      </Heading>
      {postsResult.fetching ? (
        <LoadingSkeleton rows={3}>Loading posts...</LoadingSkeleton>
      ) : postsError || !page ? (
        <RequestError
          error={postsError}
          message="We couldn't load these posts."
          onRetry={() => refreshPosts({ requestPolicy: "network-only" })}
          retryLabel="Retry posts"
        />
      ) : (
        <>
          {posts.length ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                author={profile}
                returnTo={profileHref(profile.handle)}
                onDeleted={() =>
                  refreshPosts({ requestPolicy: "network-only" })
                }
              />
            ))
          ) : (
            <EmptyState
              title={
                after
                  ? "No posts on this page."
                  : own
                    ? "Your story starts here."
                    : "No posts yet."
              }
              action={
                own &&
                !after &&
                !page.next_cursor && (
                  <Button rounded="full" onClick={openComposer}>
                    Write your first post
                  </Button>
                )
              }
            >
              {page.next_cursor
                ? "There may be more posts on the next page."
                : own && !after
                  ? "Share a thought. Your updates will appear here."
                  : "Posts from this profile will appear here."}
            </EmptyState>
          )}
          <Pagination
            after={after}
            next={page.next_cursor}
            onFirst={() => setAfter(undefined)}
            onNext={setAfter}
            nextLabel="Older posts"
          />
        </>
      )}
    </Stack>
  );
}

export default function ProfileClientPage({ handle }: { handle: string }) {
  const { context } = useSocialSession();
  const [result, refresh] = useProfileByHandleQuery({
    context,
    variables: { handle },
    requestPolicy: "network-only",
  });

  if (result.fetching)
    return (
      <Stack gap="4">
        <Heading as="h1" fontSize="2xl">
          Profile
        </Heading>
        <LoadingSkeleton variant="person">Loading profile...</LoadingSkeleton>
      </Stack>
    );

  if (hasAuthErrorCode(result.error, "PROFILE_NOT_FOUND"))
    return (
      <Stack gap="4">
        <Heading as="h1" fontSize="2xl">
          Profile
        </Heading>
        <EmptyState
          title="Profile unavailable."
          action={
            <Button asChild rounded="full" variant="outline">
              <Link href="/social/connections">Find someone else</Link>
            </Button>
          }
        >
          This profile may not exist or may not be available to you.
        </EmptyState>
      </Stack>
    );

  if (result.error || !result.data?.socialProfileByHandle)
    return (
      <Stack gap="4">
        <Heading as="h1" fontSize="2xl">
          Profile
        </Heading>
        <RequestError
          error={result.error}
          message="We couldn't load this profile."
          onRetry={() => refresh({ requestPolicy: "network-only" })}
          retryLabel="Retry profile"
        />
      </Stack>
    );

  return (
    <ProfileContent
      key={result.data.socialProfileByHandle.id}
      profile={result.data.socialProfileByHandle}
    />
  );
}
