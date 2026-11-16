"use client";

import {
  chakra,
  Box,
  Button,
  Field,
  Fieldset,
  Input,
  Link,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import NextLink from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthHeading } from "~/components/auth/auth-heading";
import { AuthMessage } from "~/components/auth/auth-message";
import { PasswordInput } from "~/components/auth/password-input";
import { useSignupMutation } from "~/graphql/generated/graphql";
import { authEmailSchema } from "~/lib/auth-email";
import { authErrorMessage } from "~/lib/auth-feedback";

export const signupFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Please provide your full name")
      .max(255, "Name must be at most 255 characters"),
    email: authEmailSchema,
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password must be at most 128 characters"),
    password_confirm: z
      .string()
      .min(6, "Please confirm your password with at least 6 characters")
      .max(128, "Password must be at most 128 characters"),
  })
  .refine((ch) => ch.password === ch.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  });

type Feedback = { status: "error" | "success"; message: string } | null;

function SignupClientPage() {
  const [, signup] = useSignupMutation();
  const [feedback, setFeedback] = useState<Feedback>(null);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { name: "", email: "", password: "", password_confirm: "" },
  });

  if (feedback?.status === "success") {
    return (
      <Stack gap="6">
        <Box
          bg="blue.subtle"
          color="blue.fg"
          p="4"
          rounded="2xl"
          alignSelf="start"
        >
          <MailCheck size={28} aria-hidden="true" />
        </Box>
        <AuthHeading title="Check your email" />
        <Text role="status" color="fg.muted" lineHeight="tall">
          {feedback.message}
        </Text>
        <Text fontSize="sm" color="fg.muted" lineHeight="tall">
          Once verified, sign in to choose your public name and handle.
        </Text>
        <Button asChild size="lg" rounded="full">
          <NextLink href="/login">Sign in</NextLink>
        </Button>
        <Separator />
        <Stack gap="2" align="start">
          <Text color="fg.muted" fontSize="sm">
            No email yet? Check your spam folder or request a new link.
          </Text>
          <Link asChild minH="11" fontSize="sm" fontWeight="medium">
            <NextLink href="/resend-verification">
              Resend verification email
            </NextLink>
          </Link>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap="6">
      <AuthHeading
        title="Create an account"
        description="A place for your thoughts and your people."
      />
      <chakra.form
        onSubmit={handleSubmit(
          async (data) => {
            setFeedback(null);
            try {
              const result = await signup({ input: data });
              if (result.error || !result.data?.signup) {
                setFeedback({
                  status: "error",
                  message: authErrorMessage(result.error),
                });
                return;
              }
              reset();
              setFeedback({
                status: "success",
                message:
                  "Your account was created. Check your email to verify your address before signing in.",
              });
            } catch {
              setFeedback({ status: "error", message: authErrorMessage() });
            }
          },
          () => setFeedback(null),
        )}
        aria-busy={isSubmitting}
        noValidate
      >
        <Fieldset.Root disabled={isSubmitting}>
          <Stack gap="4">
            <Field.Root invalid={!!errors.name} required>
              <Field.Label>Full name</Field.Label>
              <Input
                size="lg"
                rounded="lg"
                placeholder="Your name"
                {...register("name")}
                type="text"
                autoComplete="name"
              />
              {errors.name && (
                <Field.ErrorText color="red.fg">
                  {errors.name.message}
                </Field.ErrorText>
              )}
            </Field.Root>
            <Field.Root invalid={!!errors.email} required>
              <Field.Label>Email address</Field.Label>
              <Input
                size="lg"
                rounded="lg"
                placeholder="you@example.com"
                {...register("email")}
                type="email"
                autoComplete="email"
              />
              {errors.email && (
                <Field.ErrorText color="red.fg">
                  {errors.email.message}
                </Field.ErrorText>
              )}
            </Field.Root>
            <Field.Root invalid={!!errors.password} required>
              <Field.Label>Password</Field.Label>
              <PasswordInput
                {...register("password")}
                autoComplete="new-password"
              />
              {errors.password && (
                <Field.ErrorText color="red.fg">
                  {errors.password.message}
                </Field.ErrorText>
              )}
            </Field.Root>
            <Field.Root invalid={!!errors.password_confirm} required>
              <Field.Label>Confirm password</Field.Label>
              <PasswordInput
                {...register("password_confirm")}
                autoComplete="new-password"
                visibilityLabel="password confirmation"
              />
              {errors.password_confirm && (
                <Field.ErrorText color="red.fg">
                  {errors.password_confirm.message}
                </Field.ErrorText>
              )}
            </Field.Root>
            {feedback && (
              <AuthMessage status="error" title="Unable to create account">
                {feedback.message}
              </AuthMessage>
            )}
            <Button
              size="lg"
              rounded="lg"
              loading={isSubmitting}
              loadingText="Creating account"
              disabled={isSubmitting}
              type="submit"
              w="full"
            >
              Create account
            </Button>
          </Stack>
        </Fieldset.Root>
      </chakra.form>
      <Separator />
      <Text color="fg.muted" fontSize="sm" textAlign="center">
        Already have an account?{" "}
        <Link asChild fontWeight="medium" minH="11">
          <NextLink href="/login">Sign in</NextLink>
        </Link>
      </Text>
    </Stack>
  );
}

export default SignupClientPage;
