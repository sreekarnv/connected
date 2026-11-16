"use client";

import {
  Box,
  Button,
  Dialog,
  Field,
  HStack,
  Portal,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import { hasAuthErrorCode } from "~/lib/auth-feedback";
import type { OperationContext } from "urql";
import {
  type SocialViewerQuery,
  useCreateSocialPostMutation,
} from "~/graphql/generated/graphql";
import { PersonAvatar, sessionExpired, SessionRecovery } from "./social-ui";

export function PostComposer({
  profile,
  context,
  open,
  onOpenChange,
  finalFocusEl,
  onPublished,
}: {
  profile: SocialViewerQuery["socialMyProfile"] | undefined;
  context: Partial<OperationContext>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finalFocusEl: () => HTMLElement | null;
  onPublished: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const pending = useRef(false);
  const [{ fetching, error: mutationError }, createPost] =
    useCreateSocialPostMutation();
  const valid = !!draft.trim() && draft.length <= 5000 && !draft.includes("\0");
  return (
    <Dialog.Root
      open={open}
      onOpenChange={({ open }) => {
        if (!fetching) onOpenChange(open);
      }}
      size={{ mdDown: "full", md: "lg" }}
      placement="center"
      scrollBehavior="inside"
      initialFocusEl={() => input.current}
      finalFocusEl={finalFocusEl}
      closeOnEscape={!fetching}
      closeOnInteractOutside={!fetching}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            asChild
            bg="bg.panel"
            rounded={{ base: "0", md: "3xl" }}
            h={{ base: "100dvh", md: "auto" }}
            maxH="100dvh"
            pt="env(safe-area-inset-top)"
            pb="env(safe-area-inset-bottom)"
          >
            <Box
              as="form"
              onSubmit={async (event) => {
                event.preventDefault();
                if (fetching || pending.current || !valid || !profile) return;
                pending.current = true;
                setError(null);
                try {
                  const result = await createPost(
                    { input: { body: draft.trim() } },
                    context,
                  );
                  if (result.error || !result.data?.contentCreatePost) {
                    setError(
                      sessionExpired(result.error)
                        ? "Your session has expired. Your draft is still here. Sign in to continue."
                        : [
                              "VALIDATION_ERROR",
                              "BAD_USER_INPUT",
                              "PROFILE_NOT_FOUND",
                              "FORBIDDEN",
                            ].some((code) =>
                              hasAuthErrorCode(result.error, code),
                            )
                          ? "We couldn't publish your post. Your draft is still here. Check it and try again."
                          : "We couldn't confirm whether this posted. Your draft is still here. Check your profile before trying again.",
                    );
                    return;
                  }
                  setDraft("");
                  onPublished();
                  onOpenChange(false);
                } catch {
                  setError(
                    "We couldn't confirm whether this posted. Your draft is still here. Check your profile before trying again.",
                  );
                } finally {
                  pending.current = false;
                }
              }}
            >
              <Dialog.Header
                p={{ base: "4", md: "6" }}
                borderBottomWidth="1px"
                borderColor="border"
              >
                <HStack w="full" justify="space-between" gap="2">
                  <Button
                    variant="ghost"
                    minH="11"
                    onClick={() => onOpenChange(false)}
                    disabled={fetching}
                  >
                    Cancel
                  </Button>
                  <Dialog.Title fontSize="md">New post</Dialog.Title>
                  <Button
                    type="submit"
                    colorPalette="blue"
                    rounded="full"
                    minH="11"
                    px="5"
                    disabled={fetching || !valid || !profile}
                    loading={fetching}
                    loadingText="Posting"
                  >
                    Post
                    <ArrowUpRight size={17} />
                  </Button>
                </HStack>
              </Dialog.Header>
              <Dialog.Body p={{ base: "5", md: "6" }} flex="1" minH="0">
                <Stack gap="5">
                  {profile && (
                    <HStack gap="3">
                      <PersonAvatar name={profile.display_name} accent="pink" />
                      <Stack gap="0">
                        <Text fontWeight="semibold">
                          {profile.display_name}
                        </Text>
                        <Text fontSize="sm" color="fg.muted">
                          @{profile.handle}
                        </Text>
                      </Stack>
                    </HStack>
                  )}
                  <Field.Root invalid={draft.includes("\0")}>
                    <Field.Label srOnly>Write a post</Field.Label>
                    <Textarea
                      ref={input}
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      maxLength={5000}
                      disabled={fetching}
                      placeholder="What's on your mind?"
                      rows={8}
                      resize="none"
                      border="0"
                      px="0"
                      fontSize="md"
                      lineHeight="1.8"
                      minH={{ base: "40dvh", md: "220px" }}
                      _focusVisible={{ outline: "none", boxShadow: "none" }}
                    />
                    <Field.ErrorText>
                      Remove the unsupported character before posting.
                    </Field.ErrorText>
                  </Field.Root>
                  {!profile && (
                    <Text role="alert" color="red.fg" fontSize="sm">
                      Your profile is unavailable. Your draft is still here.
                      Close this window and retry your profile.
                    </Text>
                  )}
                  {error && (
                    <Text role="alert" color="red.fg" fontSize="sm">
                      {error}
                    </Text>
                  )}
                  {error && sessionExpired(mutationError) && (
                    <SessionRecovery />
                  )}
                </Stack>
              </Dialog.Body>
              <Dialog.Footer
                px={{ base: "5", md: "6" }}
                py="4"
                borderTopWidth="1px"
                borderColor="border"
                gap="4"
                justifyContent="space-between"
                alignItems="start"
              >
                <Dialog.Description fontSize="xs" color="fg.muted" maxW="72">
                  Your draft stays here while you browse. Leaving Connected
                  clears it.
                </Dialog.Description>
                <Text
                  fontSize="xs"
                  color={draft.length > 4500 ? "pink.fg" : "fg.muted"}
                  whiteSpace="nowrap"
                  pt="0.5"
                >
                  {draft.length.toLocaleString()} / 5,000
                </Text>
              </Dialog.Footer>
            </Box>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
