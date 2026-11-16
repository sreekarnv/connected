import { PostScreen } from "~/components/social/post-screen";

export const metadata = { title: "Post | Connected" };

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  return <PostScreen key={postId} postId={postId} />;
}
