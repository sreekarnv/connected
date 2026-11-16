import { Link, Separator, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import { AuthHeading } from "~/components/auth/auth-heading";
import ResendVerificationClientPage from "./page.client";

export const metadata = { title: "Verify your account | Connected" };

export default function ResendVerificationPage() {
  return (
    <Stack gap="6">
      <AuthHeading
        title="Verify your account"
        description="Enter your email and password to request a new link."
      />
      <ResendVerificationClientPage />
      <Separator />
      <Link asChild alignSelf="center" fontSize="sm" fontWeight="medium">
        <NextLink href="/login">Back to sign in</NextLink>
      </Link>
    </Stack>
  );
}
