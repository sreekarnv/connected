import { notFound } from "next/navigation";
import ProfileClientPage from "./page.client";

export const metadata = { title: "Profile | Connected" };

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ handle?: string | string[] }>;
}) {
  const { handle } = await searchParams;
  if (typeof handle !== "string" || !handle || [...handle].length > 30)
    notFound();
  return <ProfileClientPage key={handle} handle={handle} />;
}
