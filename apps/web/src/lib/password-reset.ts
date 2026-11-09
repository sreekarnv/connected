type ResetInputs = {
  forgotPassword: { email: string };
  verifyResetToken: { token: string };
  resetPassword: {
    token: string;
    password: string;
    password_confirm: string;
  };
};

const mutations = {
  forgotPassword: `mutation ForgotPassword($input: ForgotPasswordRequestDto_Input!) {
    result: forgotPassword(input: $input) { status }
  }`,
  verifyResetToken: `mutation VerifyResetToken($input: VerifyResetTokenRequestDto_Input!) {
    result: verifyResetToken(input: $input) { status }
  }`,
  resetPassword: `mutation ResetPassword($input: ResetPasswordRequestDto_Input!) {
    result: resetPassword(input: $input) { status }
  }`,
};

export class PasswordResetError extends Error {
  constructor(readonly code?: string) {
    super("Password reset request failed");
    this.name = "PasswordResetError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export async function passwordResetRequest<Operation extends keyof ResetInputs>(
  operation: Operation,
  input: ResetInputs[Operation],
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:4000/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Protection": "1",
      },
      credentials: "include",
      cache: "no-store",
      signal,
      body: JSON.stringify({
        query: mutations[operation],
        variables: { input },
      }),
    },
  );
  const body: unknown = await response.json();
  if (!isRecord(body)) throw new PasswordResetError();

  if (Array.isArray(body.errors) && body.errors.length > 0) {
    const error: unknown = body.errors[0];
    const code =
      isRecord(error) &&
      isRecord(error.extensions) &&
      typeof error.extensions.code === "string"
        ? error.extensions.code
        : undefined;
    throw new PasswordResetError(code);
  }

  if (
    !response.ok ||
    !isRecord(body.data) ||
    !isRecord(body.data.result) ||
    body.data.result.status !== "success"
  ) {
    throw new PasswordResetError();
  }
}
