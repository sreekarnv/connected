"use client";

import {
  Box,
  HStack,
  IconButton,
  Menu,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Ellipsis, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  type SocialPostsQuery,
  useDeleteSocialPostMutation,
} from "~/graphql/generated/graphql";
import { useSocialSession } from "./social-shell";
import { profileHref } from "~/lib/social-links";
import {
  ConfirmDialog,
  PersonAvatar,
  requestMessage,
  sessionExpired,
  SessionRecovery,
} from "./social-ui";

export type SocialPost = NonNullable<
  NonNullable<SocialPostsQuery["posts"]>["items"][number]
>;

export function PostCard({
  post,
  author,
  onDeleted,
  detail = false,
  returnTo = "/social",
}: {
  post: SocialPost;
  author?: { handle: string; display_name: string };
  onDeleted: () => void;
  detail?: boolean;
  returnTo?: string;
}) {
  const { user, context } = useSocialSession();
  const [{ fetching, error: mutationError }, deletePost] =
    useDeleteSocialPostMutation();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const own = post.author_id === user.id;
  return (
    <Box
      as="article"
      bg="bg.panel"
      rounded="2xl"
      borderWidth="1px"
      borderColor="border"
      p={{ base: "4", md: "6" }}
    >
      <Stack gap="4">
        <HStack gap="3" align="start">
          <PersonAvatar
            name={author?.display_name}
            accent={own ? "pink" : "blue"}
          />
          <Stack gap="0.5" minW="0" flex="1">
            {author ? (
              <Text
                asChild
                fontWeight="semibold"
                fontSize="sm"
                overflowWrap="anywhere"
                minH="6"
              >
                <Link href={profileHref(author.handle)}>
                  {author.display_name}
                </Link>
              </Text>
            ) : (
              <Text fontWeight="semibold" fontSize="sm">
                Profile unavailable
              </Text>
            )}
            <Text fontSize="xs" color="fg.muted" overflowWrap="anywhere">
              {author && `@${author.handle} · `}
              <Link
                href={`/social/posts/${post.id}?${new URLSearchParams({ returnTo })}`}
                aria-label="Open post"
              >
                <time
                  dateTime={post.created_at}
                  title={new Date(post.created_at).toLocaleString()}
                >
                  {detail
                    ? new Date(post.created_at).toLocaleString()
                    : new Date(post.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                </time>
              </Link>
            </Text>
          </Stack>
          {own && (
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton
                  ref={trigger}
                  variant="ghost"
                  minW="11"
                  minH="11"
                  rounded="full"
                  color="fg.muted"
                  aria-label="Post options"
                >
                  <Ellipsis size={21} />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="44">
                    <Menu.Item
                      value="delete"
                      color="red.fg"
                      minH="11"
                      onSelect={() => setConfirming(true)}
                    >
                      <Trash2 size={16} />
                      Delete post
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          )}
        </HStack>
        <Text
          fontSize="md"
          lineHeight="1.8"
          whiteSpace="pre-wrap"
          overflowWrap="anywhere"
        >
          {post.body}
        </Text>
        {error && (
          <Text role="alert" fontSize="sm" color="red.fg">
            {error}
          </Text>
        )}
        {error && sessionExpired(mutationError) && <SessionRecovery />}
      </Stack>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Delete this post?"
        confirmLabel="Delete post"
        busy={fetching}
        finalFocusEl={() => trigger.current}
        onConfirm={async () => {
          if (fetching) return;
          setError(null);
          try {
            const result = await deletePost({ postId: post.id }, context);
            if (
              result.error ||
              result.data?.contentDeletePost?.status !== "success"
            ) {
              setError(
                requestMessage(
                  result.error,
                  "We couldn't delete this post. Please try again.",
                ),
              );
              setConfirming(false);
              return;
            }
            setConfirming(false);
            onDeleted();
          } catch {
            setError("We couldn't delete this post. Please try again.");
            setConfirming(false);
          }
        }}
      >
        This post will be permanently removed. This cannot be undone.
      </ConfirmDialog>
    </Box>
  );
}
