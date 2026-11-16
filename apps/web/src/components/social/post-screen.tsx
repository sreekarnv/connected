"use client";

import { Button, Stack } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  usePostAuthorsQuery,
  useSocialPostQuery,
} from "~/graphql/generated/graphql";
import { hasAuthErrorCode } from "~/lib/auth-feedback";
import { PostCard } from "./post-card";
import { useSocialSession } from "./social-shell";
import {
  EmptyState,
  LoadingSkeleton,
  PageHeading,
  RequestError,
} from "./social-ui";

export function PostScreen({
  postId,
  returnTo,
}: {
  postId: string;
  returnTo: string;
}) {
  const { context } = useSocialSession();
  const router = useRouter();
  const [result, refreshPost] = useSocialPostQuery({
    context,
    variables: { postId },
    requestPolicy: "network-only",
  });
  const post = result.data?.contentPost;
  const [authors, refreshAuthors] = usePostAuthorsQuery({
    context,
    variables: { ids: post ? [post.author_id] : [] },
    pause: !post,
    requestPolicy: "network-only",
  });
  const author = authors.data?.socialProfilesByIds?.find(
    (profile) => profile?.id === post?.author_id,
  );
  const unavailable =
    hasAuthErrorCode(result.error, "POST_NOT_FOUND") ||
    hasAuthErrorCode(result.error, "BAD_USER_INPUT") ||
    hasAuthErrorCode(result.error, "VALIDATION_ERROR") ||
    (!authors.fetching &&
      !authors.error &&
      !!authors.data?.socialProfilesByIds &&
      !author);

  return (
    <Stack gap="5">
      <Button asChild variant="ghost" alignSelf="start" minH="11" px="0">
        <Link href={returnTo}>
          <ArrowLeft size={17} />
          {returnTo === "/social" ? "Your feed" : "Back to profile"}
        </Link>
      </Button>
      <PageHeading title="Post">A moment from your community.</PageHeading>
      {result.fetching || (post && authors.fetching) ? (
        <LoadingSkeleton>Loading post...</LoadingSkeleton>
      ) : unavailable ? (
        <EmptyState title="Post unavailable.">
          This post may have been removed or may not be visible to you.
        </EmptyState>
      ) : result.error || !post ? (
        <RequestError
          error={result.error}
          message="We couldn't load this post."
          onRetry={() => refreshPost({ requestPolicy: "network-only" })}
          retryLabel="Retry post"
        />
      ) : authors.error || !author ? (
        <RequestError
          error={authors.error}
          message="We couldn't load this post's author."
          onRetry={() => refreshAuthors({ requestPolicy: "network-only" })}
          retryLabel="Retry author"
        />
      ) : (
        <PostCard
          post={post}
          author={author}
          detail
          returnTo={returnTo}
          onDeleted={() => router.replace(returnTo)}
        />
      )}
    </Stack>
  );
}
