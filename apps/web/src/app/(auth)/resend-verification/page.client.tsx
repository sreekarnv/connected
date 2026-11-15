"use client";

import {
  chakra,
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthMessage } from "~/components/auth/auth-message";
import { PasswordInput } from "~/components/auth/password-input";
import { useResendEmailVerificationMutation } from "~/graphql/generated/graphql";
import { authEmailSchema } from "~/lib/auth-email";
import { authErrorMessage } from "~/lib/auth-feedback";

const formSchema = z.object({
  email: authEmailSchema,
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters"),
});
type DeliveryState =
  { status: "idle" | "sent" } | { status: "error"; message: string };

export default function ResendVerificationClientPage() {
  const [, resendVerification] = useResendEmailVerificationMutation();
  const [state, setState] = useState<DeliveryState>({ status: "idle" });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  if (state.status === "sent") {
    return (
      <Stack gap="5">
        <AuthMessage status="success" title="Check your inbox">
          If your details match an unverified account, we will send a
          verification link. Check your inbox and spam folder.
        </AuthMessage>
        <Text color="fg.muted" fontSize="sm" lineHeight="tall">
          Wait at least a minute before requesting another verification email.
        </Text>
        <Button
          size="lg"
          rounded="lg"
          variant="outline"
          w="full"
          onClick={() => setState({ status: "idle" })}
        >
          Request another email
        </Button>
      </Stack>
    );
  }

  return (
    <chakra.form
      noValidate
      aria-busy={isSubmitting}
      onSubmit={handleSubmit(
        async (input) => {
          setState({ status: "idle" });
          try {
            const result = await resendVerification({ input });
            setState(
              result.error ||
                result.data?.resendVerification?.status !== "success"
                ? { status: "error", message: authErrorMessage(result.error) }
                : { status: "sent" },
            );
          } catch {
            setState({ status: "error", message: authErrorMessage() });
          }
        },
        () => setState({ status: "idle" }),
      )}
    >
      <Fieldset.Root disabled={isSubmitting}>
        <Stack gap="5">
          <Field.Root required invalid={!!errors.email}>
            <Field.Label>Email address</Field.Label>
            <Input
              size="lg"
              rounded="lg"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <Field.ErrorText color="red.fg">
                {errors.email.message}
              </Field.ErrorText>
            )}
          </Field.Root>
          <Field.Root required invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <PasswordInput
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <Field.ErrorText color="red.fg">
                {errors.password.message}
              </Field.ErrorText>
            )}
          </Field.Root>
          {state.status === "error" && (
            <AuthMessage status="error" title="Unable to send link">
              {state.message}
            </AuthMessage>
          )}
          <Button
            size="lg"
            rounded="lg"
            type="submit"
            w="full"
            loading={isSubmitting}
            disabled={isSubmitting}
            loadingText="Sending email"
          >
            Send verification email
          </Button>
        </Stack>
      </Fieldset.Root>
    </chakra.form>
  );
}
