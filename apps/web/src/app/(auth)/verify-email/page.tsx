import { Link, Separator, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import { AuthHeading } from "~/components/auth/auth-heading";
import VerifyEmailClientPage from "./page.client";

export const metadata = { title: "Verify your email | Connected" };

export default function VerifyEmailPage() {
  return (
    <Stack gap="6">
      <AuthHeading
        title="Verify your email"
        description="Confirm your email address to finish setting up your account."
      />
      <VerifyEmailClientPage />
      <Separator />
      <Link asChild alignSelf="center" fontSize="sm" fontWeight="medium">
        <NextLink href="/login">Go to sign in</NextLink>
      </Link>
    </Stack>
  );
}
