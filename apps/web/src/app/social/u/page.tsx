import { notFound } from "next/navigation";
import { ProfileScreen } from "~/components/social/profile-screen";

export const metadata = { title: "Profile | Connected" };

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ handle?: string | string[] }>;
}) {
  const { handle } = await searchParams;
  if (typeof handle !== "string" || !handle || [...handle].length > 30)
    notFound();
  return <ProfileScreen key={handle} handle={handle} />;
}
