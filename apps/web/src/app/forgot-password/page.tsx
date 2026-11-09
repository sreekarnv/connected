"use client";

import { Button } from "@chakra-ui/react/button";
import { Container } from "@chakra-ui/react/container";
import { Field } from "@chakra-ui/react/field";
import { Heading } from "@chakra-ui/react/heading";
import { Input } from "@chakra-ui/react/input";
import { Link } from "@chakra-ui/react/link";
import { Stack } from "@chakra-ui/react/stack";
import { Text } from "@chakra-ui/react/text";
import NextLink from "next/link";
import { type FormEvent, useState } from "react";

import { passwordResetRequest } from "~/lib/password-reset";

type FormState =
  | { status: "idle" | "submitting" | "sent" }
  | { status: "error"; message: string };

export default function ForgotPasswordPage() {
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "submitting") return;

    const email = new FormData(event.currentTarget).get("email");
    if (typeof email !== "string") return;

    setState({ status: "submitting" });
    try {
      await passwordResetRequest("forgotPassword", { email });
      setState({ status: "sent" });
    } catch {
      setState({
        status: "error",
        message: "We couldn't process your request. Please try again.",
      });
    }
  }

  return (
    <Container as="main" maxW="md" py={{ base: "12", md: "24" }}>
      <Stack gap="6">
        <Heading as="h1" size="2xl">
          Forgot your password?
        </Heading>
        {state.status === "sent" ? (
          <Stack gap="4" role="status">
            <Text>
              If an account exists for that email, we will send a password reset
              link. Check your inbox and spam folder.
            </Text>
            <Text color="fg.muted">
              Links expire after 30 minutes. Wait at least a minute before
              requesting another.
            </Text>
            <Button
              variant="outline"
              onClick={() => setState({ status: "idle" })}
            >
              Request another link
            </Button>
          </Stack>
        ) : (
          <form onSubmit={submit} aria-busy={state.status === "submitting"}>
            <Stack gap="5">
              <Text color="fg.muted">
                Enter your email and we will send you a link to reset your
                password.
              </Text>
              <Field.Root required disabled={state.status === "submitting"}>
                <Field.Label>Email address</Field.Label>
                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={255}
                  required
                />
              </Field.Root>
              {state.status === "error" ? (
                <Text color="fg.error" role="alert">
                  {state.message}
                </Text>
              ) : null}
              <Button
                type="submit"
                colorPalette="purple"
                loading={state.status === "submitting"}
                loadingText="Sending link"
              >
                Send reset link
              </Button>
            </Stack>
          </form>
        )}
        <Link asChild alignSelf="start">
          <NextLink href="/login">Back to login</NextLink>
        </Link>
      </Stack>
    </Container>
  );
}
