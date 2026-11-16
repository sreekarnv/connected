import type { CombinedError } from "urql";

const messages = new Map([
  ["INVALID_CREDENTIALS", "Incorrect email or password."],
  [
    "EMAIL_NOT_VERIFIED",
    "Verify your email before signing in. Check your inbox and spam folder.",
  ],
  [
    "EMAIL_ALREADY_REGISTERED",
    "This email is already registered. Sign in or reset your password.",
  ],
  ["VALIDATION_ERROR", "Check your details and try again."],
  ["BAD_USER_INPUT", "Check your details and try again."],
]);

export function authErrorMessage(error?: CombinedError): string {
  if (!error?.networkError) {
    for (const issue of error?.graphQLErrors ?? []) {
      const code = issue.extensions.code;
      const message = typeof code === "string" ? messages.get(code) : undefined;
      if (message) return message;
    }
  }
  return "We couldn't complete your request. Please try again.";
}

export function hasAuthErrorCode(
  error: CombinedError | undefined,
  code: string,
): boolean {
  return (
    !error?.networkError &&
    !!error?.graphQLErrors.some((issue) => issue.extensions.code === code)
  );
}
