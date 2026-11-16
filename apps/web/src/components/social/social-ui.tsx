"use client";

import {
  Avatar,
  Box,
  Button,
  Dialog,
  Portal,
  Heading,
  HStack,
  Stack,
  Spinner,
  Skeleton,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { CombinedError } from "urql";
import { hasAuthErrorCode } from "~/lib/auth-feedback";
import { profileHref } from "~/lib/social-links";

export function sessionExpired(error: CombinedError | undefined) {
  return (
    hasAuthErrorCode(error, "UNAUTHENTICATED") ||
    hasAuthErrorCode(error, "EMAIL_NOT_VERIFIED")
  );
}

export function requestMessage(
  error: CombinedError | undefined,
  fallback: string,
) {
  return sessionExpired(error)
    ? "Your session has expired. Sign in to continue."
    : fallback;
}

export function RequestError({
  error,
  message,
  onRetry,
  retryLabel = "Try again",
}: {
  error?: CombinedError;
  message: string;
  onRetry: () => void;
  retryLabel?: string;
}) {
  return (
    <Stack gap="3" align="start">
      <Text role="alert" fontSize="sm" color="red.fg">
        {requestMessage(error, message)}
      </Text>
      <Button size="sm" minH="11" variant="outline" onClick={onRetry}>
        {retryLabel}
      </Button>
      {sessionExpired(error) && <SessionRecovery />}
    </Stack>
  );
}

export function SessionRecovery() {
  return (
    <Stack gap="2" align="start">
      <Text fontSize="sm" color="fg.muted">
        Signing in leaves this page. Copy any unsaved changes first.
      </Text>
      <Button asChild variant="outline" minH="11">
        <Link href="/login">Sign in</Link>
      </Button>
    </Stack>
  );
}

export function LoadingState({ children }: { children: ReactNode }) {
  return (
    <HStack role="status" color="fg.muted" py="6" justify="center">
      <Spinner size="md" aria-hidden="true" />
      <Text srOnly>{children}</Text>
    </HStack>
  );
}

export function LoadingSkeleton({
  children,
  rows = 1,
  variant = "post",
}: {
  children: ReactNode;
  rows?: number;
  variant?: "post" | "person";
}) {
  return (
    <Stack role="status" aria-busy="true" gap="4">
      <Text srOnly>{children}</Text>
      {Array.from({ length: rows }, (_, index) => (
        <Stack
          key={index}
          aria-hidden="true"
          bg={variant === "post" ? "bg.panel" : undefined}
          rounded="2xl"
          borderWidth={variant === "post" ? "1px" : "0"}
          borderColor="border"
          p={variant === "post" ? { base: "4", md: "6" } : "0"}
          py={variant === "person" ? "4" : undefined}
          gap="5"
        >
          <HStack gap="3">
            <Skeleton boxSize="11" rounded="2xl" flexShrink="0" />
            <Stack gap="2" flex="1">
              <Skeleton h="4" maxW="40" />
              <Skeleton h="3" maxW="24" />
            </Stack>
          </HStack>
          {variant === "post" && <SkeletonText noOfLines={3} gap="3" />}
        </Stack>
      ))}
    </Stack>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Stack
      bg="bg.panel"
      rounded="2xl"
      borderWidth="1px"
      borderColor="border.subtle"
      p={{ base: "6", md: "9" }}
      textAlign="center"
      gap="2"
    >
      <Box
        alignSelf="center"
        rounded="2xl"
        bg="bg.muted"
        color="pink.fg"
        p="3"
        mb="2"
      >
        <MessageCircle size={24} aria-hidden="true" />
      </Box>
      <Heading as="h2" fontSize="lg">
        {title}
      </Heading>
      <Text color="fg.muted" fontSize="sm">
        {children}
      </Text>
      {action && <Box mt="3">{action}</Box>}
    </Stack>
  );
}

export function Pagination({
  after,
  next,
  onFirst,
  onNext,
  nextLabel = "Next page",
}: {
  after?: string;
  next?: string | null;
  onFirst: () => void;
  onNext: (cursor: string) => void;
  nextLabel?: string;
}) {
  return (
    <HStack justify="space-between" gap="3" wrap="wrap">
      {after && (
        <Button
          size="sm"
          minH="11"
          variant="outline"
          rounded="lg"
          onClick={onFirst}
        >
          Back to first page
        </Button>
      )}
      {next && (
        <Button
          ml="auto"
          size="sm"
          minH="11"
          variant="outline"
          rounded="lg"
          onClick={() => onNext(next)}
        >
          {nextLabel}
        </Button>
      )}
    </HStack>
  );
}

export function ProfileRequired() {
  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border.subtle"
      rounded="2xl"
      p="5"
    >
      <Text mb="3" color="fg.muted" fontSize="sm">
        Create your profile before using this part of Connected.
      </Text>
      <Button asChild size="sm" minH="11">
        <Link href="/social">Set up your profile</Link>
      </Button>
    </Box>
  );
}

export function PersonRow({
  profile,
  children,
  linked = true,
}: {
  profile: { handle: string; display_name: string };
  children?: ReactNode;
  linked?: boolean;
}) {
  const identity = (
    <>
      <PersonAvatar name={profile.display_name} />
      <Stack gap="1" flex="1" minW="0">
        <Text fontWeight="semibold" fontSize="sm" overflowWrap="anywhere">
          {profile.display_name}
        </Text>
        <Text fontSize="xs" color="fg.muted" overflowWrap="anywhere">
          @{profile.handle}
        </Text>
      </Stack>
      {linked && <ArrowRight size={18} aria-hidden="true" />}
    </>
  );
  return (
    <HStack gap="3" minW="0">
      <HStack
        asChild={linked}
        gap="3"
        py="4"
        px="2"
        mx="-2"
        flex="1"
        minW="0"
        minH="20"
        rounded="xl"
        _hover={linked ? { bg: "bg.subtle" } : undefined}
      >
        {linked ? (
          <Link href={profileHref(profile.handle)}>{identity}</Link>
        ) : (
          identity
        )}
      </HStack>
      {children}
    </HStack>
  );
}

export function PersonAvatar({
  name,
  accent = "blue",
  size = "md",
}: {
  name?: string;
  accent?: "blue" | "pink";
  size?: "md" | "xl" | "2xl";
}) {
  return (
    <Avatar.Root
      aria-hidden="true"
      size={size}
      bg="bg.muted"
      color={`${accent}.fg`}
      flexShrink="0"
      rounded="2xl"
    >
      <Avatar.Fallback name={name} />
    </Avatar.Root>
  );
}

export function PageHeading({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Stack gap="1.5">
      <Heading
        as="h1"
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="bold"
        letterSpacing="-0.04em"
      >
        {title}
      </Heading>
      <Text fontSize="sm" color="fg.muted" lineHeight="1.7">
        {children}
      </Text>
    </Stack>
  );
}

export function ProfileCover() {
  return (
    <Box
      h={{ base: "24", md: "32" }}
      bg="bg.muted"
      position="relative"
      overflow="hidden"
      aria-hidden="true"
    >
      <Box
        position="absolute"
        rounded="full"
        w="80"
        h="80"
        bg="bg.emphasized"
        right="-12"
        top="-48"
        transform="rotate(-20deg)"
      />
      <Box
        position="absolute"
        rounded="full"
        w="44"
        h="44"
        borderWidth="18px"
        borderColor="bg.panel"
        right="28"
        top="-28"
      />
      <Box
        position="absolute"
        rounded="full"
        w="28"
        h="28"
        bg="bg.panel"
        right="16"
        bottom="-20"
      />
    </Box>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  children,
  confirmLabel,
  busy,
  onConfirm,
  finalFocusEl,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  busy: boolean;
  onConfirm: () => void;
  finalFocusEl?: () => HTMLElement | null;
}) {
  const cancel = useRef<HTMLButtonElement>(null);
  return (
    <Dialog.Root
      role="alertdialog"
      open={open}
      onOpenChange={({ open }) => {
        if (!busy) onOpenChange(open);
      }}
      placement="center"
      size="sm"
      initialFocusEl={() => cancel.current}
      finalFocusEl={finalFocusEl}
      closeOnEscape={!busy}
      closeOnInteractOutside={!busy}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner px="4">
          <Dialog.Content rounded="2xl" bg="bg.panel">
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Dialog.Description color="fg.muted" lineHeight="1.7">
                {children}
              </Dialog.Description>
            </Dialog.Body>
            <Dialog.Footer gap="3">
              <Button
                ref={cancel}
                variant="outline"
                minH="11"
                disabled={busy}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                colorPalette="red"
                minH="11"
                disabled={busy}
                loading={busy}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
