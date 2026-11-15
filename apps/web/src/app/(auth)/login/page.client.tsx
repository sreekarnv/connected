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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthMessage } from "~/components/auth/auth-message";
import { PasswordInput } from "~/components/auth/password-input";
import { useLoginMutation } from "~/graphql/generated/graphql";
import { authEmailSchema } from "~/lib/auth-email";
import { authErrorMessage, hasAuthErrorCode } from "~/lib/auth-feedback";

export const loginFormSchema = z.object({
  email: authEmailSchema,
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters"),
});

type Feedback = {
  status: "error" | "verification-required";
  message: string;
} | null;

function LoginClientPage() {
  const [, login] = useLoginMutation();
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback>(null);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <chakra.form
      onSubmit={handleSubmit(
        async (data) => {
          setFeedback(null);
          try {
            const result = await login({ input: data });
            if (!result.error && result.data?.login) {
              router.replace("/dashboard");
              return;
            }
            setFeedback({
              status: hasAuthErrorCode(result.error, "EMAIL_NOT_VERIFIED")
                ? "verification-required"
                : "error",
              message: authErrorMessage(result.error),
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
        <Stack gap="5">
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
              autoComplete="current-password"
            />
            {errors.password && (
              <Field.ErrorText color="red.fg">
                {errors.password.message}
              </Field.ErrorText>
            )}
          </Field.Root>
          <Link asChild alignSelf="end" fontSize="sm" fontWeight="medium">
            <NextLink href="/forgot-password">Forgot password?</NextLink>
          </Link>
          {feedback && (
            <AuthMessage
              status="error"
              title={
                feedback.status === "verification-required"
                  ? "Verify your email"
                  : "Unable to sign in"
              }
            >
              <Stack gap="3">
                <Text>{feedback.message}</Text>
                {feedback.status === "verification-required" && (
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
            loadingText="Signing in"
            disabled={isSubmitting}
            type="submit"
            w="full"
          >
            Sign in
          </Button>
        </Stack>
      </Fieldset.Root>
    </chakra.form>
  );
}

export default LoginClientPage;
