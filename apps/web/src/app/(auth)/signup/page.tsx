import { Link, Separator, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { AuthHeading } from "~/components/auth/auth-heading";
import SignupClientPage from "./page.client";

export const metadata = { title: "Create an account | Connected" };

export default function SignupPage() {
  return (
    <Stack gap="4">
      <AuthHeading title="Create an account" />
      <SignupClientPage />
      <Separator />
      <Text color="fg.muted" fontSize="sm" textAlign="center">
        Already have an account?{" "}
        <Link asChild fontWeight="medium">
          <NextLink href="/login">Sign in</NextLink>
        </Link>
      </Text>
    </Stack>
  );
}
