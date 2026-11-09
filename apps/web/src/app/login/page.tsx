import { Container } from "@chakra-ui/react/container";
import { Heading } from "@chakra-ui/react/heading";
import { Link } from "@chakra-ui/react/link";
import { Stack } from "@chakra-ui/react/stack";
import { Text } from "@chakra-ui/react/text";
import NextLink from "next/link";

async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ passwordReset?: string }>;
}) {
  const { passwordReset } = await searchParams;

  return (
    <Container as="main" maxW="md" py={{ base: "12", md: "24" }}>
      <Stack gap="6">
        <Heading as="h1" size="2xl">
          Login
        </Heading>
        {passwordReset === "success" ? (
          <Text role="status">
            Your password has been reset. Sign in with your new password.
          </Text>
        ) : null}
        <Link asChild alignSelf="start">
          <NextLink href="/forgot-password">Forgot password?</NextLink>
        </Link>
      </Stack>
    </Container>
  );
}

export default LoginPage;
