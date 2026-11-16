import { PostScreen } from "~/components/social/post-screen";
import { postReturnHref } from "~/lib/social-links";

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
    <PostScreen
      key={postId}
      postId={postId}
      returnTo={postReturnHref(returnTo)}
    />
  );
}
