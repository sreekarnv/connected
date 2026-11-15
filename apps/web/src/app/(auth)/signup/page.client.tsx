"use client";

import {
  chakra,
  Button,
  Field,
  Fieldset,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import NextLink from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { name: "", email: "", password: "", password_confirm: "" },
  });

  return (
    <chakra.form
      onSubmit={handleSubmit(
        async (data) => {
          setFeedback(null);
          try {
            const result = await signup({ input: data });
            setFeedback(
              result.error || !result.data?.signup
                ? { status: "error", message: authErrorMessage(result.error) }
                : {
                    status: "success",
                    message:
                      "Your account was created. Check your email to verify your address before signing in.",
                  },
            );
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
            <AuthMessage
              status={feedback.status}
              title={
                feedback.status === "success"
                  ? "Check your inbox"
                  : "Unable to create account"
              }
            >
              <Stack gap="3">
                <Text>{feedback.message}</Text>
                {feedback.status === "success" && (
                  <Link
                    asChild
                    alignSelf="start"
                    fontWeight="medium"
                    colorPalette="blue"
                  >
                    <NextLink href="/resend-verification">
                      Resend verification email
                    </NextLink>
                  </Link>
                )}
              </Stack>
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
  );
}

export default SignupClientPage;
