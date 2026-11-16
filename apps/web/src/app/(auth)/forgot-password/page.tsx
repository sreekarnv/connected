import { Link, Separator, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import { AuthHeading } from "~/components/auth/auth-heading";
import ForgotPasswordClientPage from "./page.client";

export const metadata = { title: "Forgot your password? | Connected" };

export default function ForgotPasswordPage() {
  return (
    <Stack gap="6">
      <AuthHeading
        title="Forgot your password?"
        description="Enter your email to request a password reset link."
      />
      <ForgotPasswordClientPage />
      <Separator />
      <Link asChild alignSelf="center" fontSize="sm" fontWeight="medium">
        <NextLink href="/login">Back to sign in</NextLink>
      </Link>
    </Stack>
  );
}
