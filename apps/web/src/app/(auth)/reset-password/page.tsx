import { Link, Separator, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import { AuthHeading } from "~/components/auth/auth-heading";
import ResetPasswordClientPage from "./page.client";

export const metadata = { title: "Reset your password | Connected" };

export default function ResetPasswordPage() {
  return (
    <Stack gap="6">
      <AuthHeading
        title="Reset your password"
        description="Choose a new password for your account."
      />
      <ResetPasswordClientPage />
      <Separator />
      <Link asChild alignSelf="center" fontSize="sm" fontWeight="medium">
        <NextLink href="/login">Back to sign in</NextLink>
      </Link>
    </Stack>
  );
}
