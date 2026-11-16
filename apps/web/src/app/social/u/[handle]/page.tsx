import { redirect } from "next/navigation";
import { profileHref } from "~/lib/social-links";

export const metadata = { title: "Profile | Connected" };

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  redirect(profileHref(handle));
}
