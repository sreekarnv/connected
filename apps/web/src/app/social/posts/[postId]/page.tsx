import { postReturnHref } from "~/lib/social-links";
import PostClientPage from "./page.client";

export const metadata = { title: "Post | Connected" };

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const [{ postId }, { returnTo }] = await Promise.all([params, searchParams]);

  return (
    <PostClientPage
      key={postId}
      postId={postId}
      returnTo={postReturnHref(returnTo)}
    />
  );
}
