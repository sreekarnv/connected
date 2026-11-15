import { Link, Separator, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { AuthHeading } from "~/components/auth/auth-heading";
import { AuthMessage } from "~/components/auth/auth-message";
import LoginClientPage from "./page.client";

export const metadata = { title: "Sign in | Connected" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const passwordReset = (await searchParams).passwordReset === "success";
  return (
    <Stack gap="6">
      <AuthHeading
        title="Sign in"
        description="Welcome back. Enter your details to continue."
      />
      {passwordReset && (
        <AuthMessage status="success" title="Password updated">
          Your password has been reset. Sign in with your new password.
        </AuthMessage>
      )}
      <LoginClientPage />
      <Separator />
      <Text color="fg.muted" fontSize="sm" textAlign="center">
        New to Connected?{" "}
        <Link asChild fontWeight="medium">
          <NextLink href="/signup">Create an account</NextLink>
        </Link>
      </Text>
    </Stack>
  );
}
