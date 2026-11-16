/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { gql } from 'urql';
import * as Urql from '@urql/next';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreatePostRequestDto_Input = {
  body: string;
};

export type CreateProfileRequestDto_Input = {
  display_name: string;
  handle: string;
};

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

export type UpdateProfileRequestDto_Input = {
  display_name: string;
};

export type VerifyEmailRequestDto_Input = {
  token: unknown;
};

export type VerifyResetTokenRequestDto_Input = {
  token: unknown;
};

export type BlockProfileMutationVariables = Exact<{
  targetId: string;
}>;


export type BlockProfileMutation = { relationship: { status: Status | null } | null };

export type CreateSocialPostMutationVariables = Exact<{
  input: CreatePostRequestDto_Input;
}>;


export type CreateSocialPostMutation = { contentCreatePost: { id: string, author_id: string, body: string, created_at: string } | null };

export type CreateSocialProfileMutationVariables = Exact<{
  input: CreateProfileRequestDto_Input;
}>;


export type CreateSocialProfileMutation = { socialCreateMyProfile: { id: string, handle: string, display_name: string, created_at: string } | null };

export type DeleteSocialPostMutationVariables = Exact<{
  postId: string;
}>;


export type DeleteSocialPostMutation = { contentDeletePost: { status: Status | null } | null };

export type FollowProfileMutationVariables = Exact<{
  targetId: string;
}>;


export type FollowProfileMutation = { relationship: { status: Status | null } | null };

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

export type UnblockProfileMutationVariables = Exact<{
  targetId: string;
}>;


export type UnblockProfileMutation = { relationship: { status: Status | null } | null };

export type UnfollowProfileMutationVariables = Exact<{
  targetId: string;
}>;


export type UnfollowProfileMutation = { relationship: { status: Status | null } | null };

export type UpdateSocialProfileMutationVariables = Exact<{
  input: UpdateProfileRequestDto_Input;
}>;


export type UpdateSocialProfileMutation = { socialUpdateMyProfile: { id: string, handle: string, display_name: string, created_at: string } | null };

export type VerifyEmailMutationVariables = Exact<{
  input: VerifyEmailRequestDto_Input;
}>;


export type VerifyEmailMutation = { verifyEmail: { id: string, email: string, name: string, email_verified_at: string | null, created_at: string, updated_at: string } | null };

export type VerifyResetTokenMutationVariables = Exact<{
  input?: VerifyResetTokenRequestDto_Input | null | undefined;
}>;


export type VerifyResetTokenMutation = { verifyResetToken: { status: Status | null } | null };

export type MyBlocksQueryVariables = Exact<{
  after?: string | null | undefined;
}>;


export type MyBlocksQuery = { profiles: { next_cursor: string | null, items: Array<{ id: string, handle: string, display_name: string } | null> } | null };

export type MyFollowersQueryVariables = Exact<{
  after?: string | null | undefined;
}>;


export type MyFollowersQuery = { profiles: { next_cursor: string | null, items: Array<{ id: string, handle: string, display_name: string } | null> } | null };

export type MyFollowingQueryVariables = Exact<{
  after?: string | null | undefined;
}>;


export type MyFollowingQuery = { profiles: { next_cursor: string | null, items: Array<{ id: string, handle: string, display_name: string } | null> } | null };

export type PostAuthorsQueryVariables = Exact<{
  ids: Array<string | null | undefined> | string;
}>;


export type PostAuthorsQuery = { socialProfilesByIds: Array<{ id: string, handle: string, display_name: string } | null> | null };

export type ProfileByHandleQueryVariables = Exact<{
  handle: string;
}>;


export type ProfileByHandleQuery = { socialProfileByHandle: { id: string, handle: string, display_name: string, created_at: string } | null };

export type ProfilePostsQueryVariables = Exact<{
  authorIds: Array<string | null | undefined> | string;
  after?: string | null | undefined;
  checkFollowing: boolean;
}>;


export type ProfilePostsQuery = { socialFeedAuthorIds?: Array<string | null> | null, posts: { next_cursor: string | null, items: Array<{ id: string, author_id: string, body: string, created_at: string } | null> } | null };

export type SocialFollowingPostsQueryVariables = Exact<{
  after?: string | null | undefined;
}>;


export type SocialFollowingPostsQuery = { posts: { next_cursor: string | null, items: Array<{ id: string, author_id: string, body: string, created_at: string } | null>, authors: Array<{ id: string, handle: string, display_name: string } | null> | null } | null };

export type SocialPostQueryVariables = Exact<{
  postId: string;
}>;


export type SocialPostQuery = { contentPost: { id: string, author_id: string, body: string, created_at: string } | null };

export type SocialPostsQueryVariables = Exact<{
  after?: string | null | undefined;
}>;


export type SocialPostsQuery = { posts: { next_cursor: string | null, items: Array<{ id: string, author_id: string, body: string, created_at: string } | null>, authors: Array<{ id: string, handle: string, display_name: string } | null> | null } | null };

export type SocialViewerQueryVariables = Exact<{ [key: string]: never; }>;


export type SocialViewerQuery = { me: { id: string, name: string, email: string, email_verified_at: string | null } | null, socialMyProfile: { id: string, handle: string, display_name: string, created_at: string } | null };


export const BlockProfileDocument = gql`
    mutation BlockProfile($targetId: UUID!) {
  relationship: socialBlockProfile(target_id: $targetId) {
    status
  }
}
    `;

export function useBlockProfileMutation() {
  return Urql.useMutation<BlockProfileMutation, BlockProfileMutationVariables>(BlockProfileDocument);
};
export const CreateSocialPostDocument = gql`
    mutation CreateSocialPost($input: CreatePostRequestDto_Input!) {
  contentCreatePost(input: $input) {
    id
    author_id
    body
    created_at
  }
}
    `;

export function useCreateSocialPostMutation() {
  return Urql.useMutation<CreateSocialPostMutation, CreateSocialPostMutationVariables>(CreateSocialPostDocument);
};
export const CreateSocialProfileDocument = gql`
    mutation CreateSocialProfile($input: CreateProfileRequestDto_Input!) {
  socialCreateMyProfile(input: $input) {
    id
    handle
    display_name
    created_at
  }
}
    `;

export function useCreateSocialProfileMutation() {
  return Urql.useMutation<CreateSocialProfileMutation, CreateSocialProfileMutationVariables>(CreateSocialProfileDocument);
};
export const DeleteSocialPostDocument = gql`
    mutation DeleteSocialPost($postId: UUID!) {
  contentDeletePost(post_id: $postId) {
    status
  }
}
    `;

export function useDeleteSocialPostMutation() {
  return Urql.useMutation<DeleteSocialPostMutation, DeleteSocialPostMutationVariables>(DeleteSocialPostDocument);
};
export const FollowProfileDocument = gql`
    mutation FollowProfile($targetId: UUID!) {
  relationship: socialFollowProfile(target_id: $targetId) {
    status
  }
}
    `;

export function useFollowProfileMutation() {
  return Urql.useMutation<FollowProfileMutation, FollowProfileMutationVariables>(FollowProfileDocument);
};
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
export const UnblockProfileDocument = gql`
    mutation UnblockProfile($targetId: UUID!) {
  relationship: socialUnblockProfile(target_id: $targetId) {
    status
  }
}
    `;

export function useUnblockProfileMutation() {
  return Urql.useMutation<UnblockProfileMutation, UnblockProfileMutationVariables>(UnblockProfileDocument);
};
export const UnfollowProfileDocument = gql`
    mutation UnfollowProfile($targetId: UUID!) {
  relationship: socialUnfollowProfile(target_id: $targetId) {
    status
  }
}
    `;

export function useUnfollowProfileMutation() {
  return Urql.useMutation<UnfollowProfileMutation, UnfollowProfileMutationVariables>(UnfollowProfileDocument);
};
export const UpdateSocialProfileDocument = gql`
    mutation UpdateSocialProfile($input: UpdateProfileRequestDto_Input!) {
  socialUpdateMyProfile(input: $input) {
    id
    handle
    display_name
    created_at
  }
}
    `;

export function useUpdateSocialProfileMutation() {
  return Urql.useMutation<UpdateSocialProfileMutation, UpdateSocialProfileMutationVariables>(UpdateSocialProfileDocument);
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
export const MyBlocksDocument = gql`
    query MyBlocks($after: UUID) {
  profiles: socialMyBlocks(after: $after, limit: 20) {
    items {
      id
      handle
      display_name
    }
    next_cursor
  }
}
    `;

export function useMyBlocksQuery(options?: Omit<Urql.UseQueryArgs<MyBlocksQueryVariables>, 'query'>) {
  return Urql.useQuery<MyBlocksQuery, MyBlocksQueryVariables>({ query: MyBlocksDocument, ...options });
};
export const MyFollowersDocument = gql`
    query MyFollowers($after: UUID) {
  profiles: socialMyFollowers(after: $after, limit: 20) {
    items {
      id
      handle
      display_name
    }
    next_cursor
  }
}
    `;

export function useMyFollowersQuery(options?: Omit<Urql.UseQueryArgs<MyFollowersQueryVariables>, 'query'>) {
  return Urql.useQuery<MyFollowersQuery, MyFollowersQueryVariables>({ query: MyFollowersDocument, ...options });
};
export const MyFollowingDocument = gql`
    query MyFollowing($after: UUID) {
  profiles: socialMyFollowing(after: $after, limit: 20) {
    items {
      id
      handle
      display_name
    }
    next_cursor
  }
}
    `;

export function useMyFollowingQuery(options?: Omit<Urql.UseQueryArgs<MyFollowingQueryVariables>, 'query'>) {
  return Urql.useQuery<MyFollowingQuery, MyFollowingQueryVariables>({ query: MyFollowingDocument, ...options });
};
export const PostAuthorsDocument = gql`
    query PostAuthors($ids: [UUID]!) {
  socialProfilesByIds(ids: $ids) {
    id
    handle
    display_name
  }
}
    `;

export function usePostAuthorsQuery(options: Omit<Urql.UseQueryArgs<PostAuthorsQueryVariables>, 'query'>) {
  return Urql.useQuery<PostAuthorsQuery, PostAuthorsQueryVariables>({ query: PostAuthorsDocument, ...options });
};
export const ProfileByHandleDocument = gql`
    query ProfileByHandle($handle: Handle!) {
  socialProfileByHandle(handle: $handle) {
    id
    handle
    display_name
    created_at
  }
}
    `;

export function useProfileByHandleQuery(options: Omit<Urql.UseQueryArgs<ProfileByHandleQueryVariables>, 'query'>) {
  return Urql.useQuery<ProfileByHandleQuery, ProfileByHandleQueryVariables>({ query: ProfileByHandleDocument, ...options });
};
export const ProfilePostsDocument = gql`
    query ProfilePosts($authorIds: [UUID]!, $after: queryInput_contentPosts_after_anyOf_0, $checkFollowing: Boolean!) {
  posts: contentPosts(author_ids: $authorIds, limit: 20, after: $after) {
    items {
      id
      author_id
      body
      created_at
    }
    next_cursor
  }
  socialFeedAuthorIds(ids: $authorIds) @include(if: $checkFollowing)
}
    `;

export function useProfilePostsQuery(options: Omit<Urql.UseQueryArgs<ProfilePostsQueryVariables>, 'query'>) {
  return Urql.useQuery<ProfilePostsQuery, ProfilePostsQueryVariables>({ query: ProfilePostsDocument, ...options });
};
export const SocialFollowingPostsDocument = gql`
    query SocialFollowingPosts($after: queryInput_contentFollowingPosts_after_anyOf_0) {
  posts: contentFollowingPosts(limit: 20, after: $after) {
    items {
      id
      author_id
      body
      created_at
    }
    next_cursor
    authors {
      id
      handle
      display_name
    }
  }
}
    `;

export function useSocialFollowingPostsQuery(options?: Omit<Urql.UseQueryArgs<SocialFollowingPostsQueryVariables>, 'query'>) {
  return Urql.useQuery<SocialFollowingPostsQuery, SocialFollowingPostsQueryVariables>({ query: SocialFollowingPostsDocument, ...options });
};
export const SocialPostDocument = gql`
    query SocialPost($postId: UUID!) {
  contentPost(post_id: $postId) {
    id
    author_id
    body
    created_at
  }
}
    `;

export function useSocialPostQuery(options: Omit<Urql.UseQueryArgs<SocialPostQueryVariables>, 'query'>) {
  return Urql.useQuery<SocialPostQuery, SocialPostQueryVariables>({ query: SocialPostDocument, ...options });
};
export const SocialPostsDocument = gql`
    query SocialPosts($after: queryInput_contentPosts_after_anyOf_0) {
  posts: contentPosts(limit: 20, after: $after) {
    items {
      id
      author_id
      body
      created_at
    }
    next_cursor
    authors {
      id
      handle
      display_name
    }
  }
}
    `;

export function useSocialPostsQuery(options?: Omit<Urql.UseQueryArgs<SocialPostsQueryVariables>, 'query'>) {
  return Urql.useQuery<SocialPostsQuery, SocialPostsQueryVariables>({ query: SocialPostsDocument, ...options });
};
export const SocialViewerDocument = gql`
    query SocialViewer {
  me {
    id
    name
    email
    email_verified_at
  }
  socialMyProfile {
    id
    handle
    display_name
    created_at
  }
}
    `;

export function useSocialViewerQuery(options?: Omit<Urql.UseQueryArgs<SocialViewerQueryVariables>, 'query'>) {
  return Urql.useQuery<SocialViewerQuery, SocialViewerQueryVariables>({ query: SocialViewerDocument, ...options });
};