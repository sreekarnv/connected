/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { gql } from 'urql';
import * as Urql from '@urql/next';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ForgotPasswordRequestDto_Input = {
  email: string;
};

export type LoginRequestDto_Input = {
  email: string;
  password: unknown;
};

export type ResetPasswordRequestDto_Input = {
  password: unknown;
  password_confirm: unknown;
  token: unknown;
};

export type SignupRequestDto_Input = {
  email: string;
  name: string;
  password: string;
  password_confirm: string;
};

export type Status =
  | 'success';

export type VerifyEmailRequestDto_Input = {
  token: unknown;
};

export type VerifyResetTokenRequestDto_Input = {
  token: unknown;
};

export type ForgotPasswordMutationVariables = Exact<{
  input: ForgotPasswordRequestDto_Input;
}>;


export type ForgotPasswordMutation = { forgotPassword: { status: Status | null } | null };

export type LoginMutationVariables = Exact<{
  input: LoginRequestDto_Input;
}>;


export type LoginMutation = { login: { access_token: string, user: { id: string, name: string, email: string, email_verified_at: string | null, created_at: string, updated_at: string } } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: { status: Status | null } | null };

export type RefreshMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshMutation = { refresh: { access_token: string } | null };

export type ResendEmailVerificationMutationVariables = Exact<{
  input: LoginRequestDto_Input;
}>;


export type ResendEmailVerificationMutation = { resendVerification: { status: Status | null } | null };

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordRequestDto_Input;
}>;


export type ResetPasswordMutation = { resetPassword: { status: Status | null } | null };

export type SignupMutationVariables = Exact<{
  input: SignupRequestDto_Input;
}>;


export type SignupMutation = { signup: { id: string, name: string, email: string, email_verified_at: string | null, created_at: string, updated_at: string } | null };

export type VerifyEmailMutationVariables = Exact<{
  input: VerifyEmailRequestDto_Input;
}>;


export type VerifyEmailMutation = { verifyEmail: { id: string, email: string, name: string, email_verified_at: string | null, created_at: string, updated_at: string } | null };

export type VerifyResetTokenMutationVariables = Exact<{
  input?: VerifyResetTokenRequestDto_Input | null | undefined;
}>;


export type VerifyResetTokenMutation = { verifyResetToken: { status: Status | null } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, name: string, email: string, email_verified_at: string | null, created_at: string, updated_at: string } | null };


export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($input: ForgotPasswordRequestDto_Input!) {
  forgotPassword(input: $input) {
    status
  }
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($input: LoginRequestDto_Input!) {
  login(input: $input) {
    access_token
    user {
      id
      name
      email
      email_verified_at
      created_at
      updated_at
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    status
  }
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RefreshDocument = gql`
    mutation Refresh {
  refresh {
    access_token
  }
}
    `;

export function useRefreshMutation() {
  return Urql.useMutation<RefreshMutation, RefreshMutationVariables>(RefreshDocument);
};
export const ResendEmailVerificationDocument = gql`
    mutation ResendEmailVerification($input: LoginRequestDto_Input!) {
  resendVerification(input: $input) {
    status
  }
}
    `;

export function useResendEmailVerificationMutation() {
  return Urql.useMutation<ResendEmailVerificationMutation, ResendEmailVerificationMutationVariables>(ResendEmailVerificationDocument);
};
export const ResetPasswordDocument = gql`
    mutation ResetPassword($input: ResetPasswordRequestDto_Input!) {
  resetPassword(input: $input) {
    status
  }
}
    `;

export function useResetPasswordMutation() {
  return Urql.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument);
};
export const SignupDocument = gql`
    mutation Signup($input: SignupRequestDto_Input!) {
  signup(input: $input) {
    id
    name
    email
    email_verified_at
    created_at
    updated_at
  }
}
    `;

export function useSignupMutation() {
  return Urql.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument);
};
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($input: VerifyEmailRequestDto_Input!) {
  verifyEmail(input: $input) {
    id
    email
    name
    email_verified_at
    created_at
    updated_at
  }
}
    `;

export function useVerifyEmailMutation() {
  return Urql.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument);
};
export const VerifyResetTokenDocument = gql`
    mutation VerifyResetToken($input: VerifyResetTokenRequestDto_Input) {
  verifyResetToken(input: $input) {
    status
  }
}
    `;

export function useVerifyResetTokenMutation() {
  return Urql.useMutation<VerifyResetTokenMutation, VerifyResetTokenMutationVariables>(VerifyResetTokenDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    id
    name
    email
    email_verified_at
    created_at
    updated_at
  }
}
    `;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};