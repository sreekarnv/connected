import { SocialShell } from "~/components/social/social-shell";

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SocialShell>{children}</SocialShell>;
}
