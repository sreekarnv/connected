"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { House, PenLine, Settings, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CombinedError, OperationContext } from "urql";
import { ColorModeButton } from "~/components/ui/color-mode";
import {
  type SocialViewerQuery,
  useSocialViewerQuery,
} from "~/graphql/generated/graphql";
import { fieldError } from "~/lib/graphql-errors";
import { useSession } from "~/lib/use-session";
import { profileHref } from "~/lib/social-links";
import { PostComposer } from "./post-composer";
import {
  LoadingState,
  PersonAvatar,
  RequestError,
  SessionRecovery,
  sessionExpired,
} from "./social-ui";

type SocialSession = {
  user: NonNullable<SocialViewerQuery["me"]>;
  context: Partial<OperationContext>;
  profile: SocialViewerQuery["socialMyProfile"] | undefined;
  profileLoading: boolean;
  profileError: CombinedError | undefined;
  refreshProfile: () => void;
  openComposer: () => void;
  postVersion: number;
};

const SocialContext = createContext<SocialSession | null>(null);

export function useSocialSession() {
  const session = useContext(SocialContext);
  if (!session) throw new Error("Social screens require SocialShell");
  return session;
}

function Brand() {
  return (
    <Text
      asChild
      fontFamily="var(--font-brand)"
      fontSize={{ base: "2xl", lg: "3xl" }}
      color="blue.fg"
      lineHeight="1"
      _after={{
        content: "''",
        display: "inline-block",
        boxSize: "1.5",
        rounded: "full",
        bg: "pink.500",
        ml: "1",
      }}
    >
      <Link href="/social">Connected</Link>
    </Text>
  );
}

function ReadyShell({
  sessionFetch,
  children,
}: {
  sessionFetch: typeof fetch;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [composerOpen, setComposerOpen] = useState(false);
  const [postVersion, setPostVersion] = useState(0);
  const [notice, setNotice] = useState("");
  const composerTrigger = useRef<HTMLElement | null>(null);
  const context = useMemo<Partial<OperationContext>>(
    () => ({
      suspense: false,
      fetch: sessionFetch,
      fetchOptions: {
        credentials: "include",
        headers: {
          "X-CSRF-Protection": "1",
        },
      },
    }),
    [sessionFetch],
  );
  const [result, reexecute] = useSocialViewerQuery({
    context,
    requestPolicy: "network-only",
  });
  const accountError = fieldError(result.error, "me");
  const profileError = fieldError(result.error, "socialMyProfile");
  const [loadedUser, setLoadedUser] = useState(result.data?.me);
  if (result.data?.me && result.data.me !== loadedUser)
    setLoadedUser(result.data.me);
  const user = result.data?.me ?? loadedUser;
  const profile = profileError ? undefined : result.data?.socialMyProfile;
  const signedOut =
    sessionExpired(accountError) ||
    (!result.fetching && !accountError && result.data?.me === null);
  useEffect(() => {
    if (signedOut && !loadedUser) router.replace("/login");
  }, [signedOut, loadedUser, router]);
  if (!user) {
    return (
      <AccountState
        failed={!result.fetching && !signedOut}
        onRetry={() => reexecute({ requestPolicy: "network-only" })}
      />
    );
  }
  const profileUrl = profile
    ? profileHref(profile.handle)
    : "/social#profile-setup";
  const links = [
    {
      href: "/social",
      label: "Feed",
      icon: House,
      active: pathname === "/social",
    },
    {
      href: "/social/connections",
      label: "Connections",
      icon: Users,
      active: pathname === "/social/connections",
    },
    {
      href: profileUrl,
      label: "Profile",
      icon: UserRound,
      active: pathname === "/social/u" || pathname.startsWith("/social/u/"),
    },
    {
      href: "/social/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/social/settings",
    },
  ];
  const openComposer = () => {
    if (!profile) {
      router.push("/social#profile-setup");
      return;
    }
    composerTrigger.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setNotice("");
    setComposerOpen(true);
  };
  return (
    <SocialContext
      value={{
        user,
        context,
        profile,
        profileLoading: result.fetching,
        profileError,
        refreshProfile: () => reexecute({ requestPolicy: "network-only" }),
        openComposer,
        postVersion,
      }}
    >
      <Box minH="100dvh" bg="bg">
        <Box
          asChild
          position="fixed"
          top="-20"
          left="4"
          _focus={{ top: "2" }}
          bg="bg.panel"
          px="4"
          py="3"
          zIndex="100"
        >
          <a href="#social-content">Skip to content</a>
        </Box>
        <HStack
          as="header"
          display={{ base: "flex", lg: "none" }}
          position="sticky"
          top="0"
          zIndex="20"
          bg="bg.panel"
          borderBottomWidth="1px"
          borderColor="border"
          px="4"
          pt="env(safe-area-inset-top)"
          minH="16"
          justify="space-between"
        >
          <Brand />
          <ColorModeButton minH="11" minW="11" color="fg.muted" />
        </HStack>
        <Container maxW="1120px" px={{ base: "0", md: "6", lg: "8" }}>
          <Flex gap={{ lg: "12" }} align="start">
            <Stack
              as="aside"
              display={{ base: "none", lg: "flex" }}
              position="sticky"
              top="0"
              h="100dvh"
              w="224px"
              flexShrink="0"
              py="9"
              gap="9"
            >
              <HStack justify="space-between">
                <Brand />
                <ColorModeButton minH="11" minW="11" />
              </HStack>
              <Stack as="nav" aria-label="Social navigation" gap="2">
                {links.map(({ href, label, icon: Icon, active }) => (
                  <Button
                    key={label}
                    asChild
                    variant="ghost"
                    justifyContent="start"
                    gap="4"
                    h="13"
                    px="4"
                    rounded="2xl"
                    color={active ? "blue.fg" : "fg.muted"}
                    bg={active ? "blue.subtle" : undefined}
                    fontWeight={active ? "bold" : "medium"}
                  >
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon size={21} strokeWidth={active ? 2.4 : 1.8} />
                      {label}
                    </Link>
                  </Button>
                ))}
                <Button
                  mt="4"
                  colorPalette="blue"
                  h="13"
                  rounded="full"
                  gap="3"
                  onClick={openComposer}
                >
                  <PenLine size={19} />
                  New post
                </Button>
              </Stack>
              <Stack mt="auto" gap="4">
                <Box
                  bg="bg.panel"
                  borderRadius="2xl"
                  p="4"
                  borderWidth="1px"
                  borderColor="border"
                >
                  <Text fontSize="sm" fontWeight="semibold" color="pink.fg">
                    A little closer.
                  </Text>
                  <Text fontSize="sm" color="fg.muted" mt="1" lineHeight="1.6">
                    Share a thought. Find your people.
                  </Text>
                </Box>
                <HStack
                  asChild
                  gap="3"
                  minH="14"
                  p="2"
                  rounded="xl"
                  _hover={{ bg: "bg.muted" }}
                >
                  <Link href={profileUrl}>
                    <PersonAvatar name={profile?.display_name ?? user.name} />
                    <Stack gap="0" minW="0">
                      <Text fontSize="sm" fontWeight="semibold" truncate>
                        {profile?.display_name ?? user.name}
                      </Text>
                      <Text fontSize="xs" color="fg.muted" truncate>
                        {profile ? `@${profile.handle}` : "Set up your profile"}
                      </Text>
                    </Stack>
                  </Link>
                </HStack>
              </Stack>
            </Stack>
            <Box
              as="main"
              id="social-content"
              tabIndex={-1}
              flex="1"
              minW="0"
              maxW="760px"
              mx="auto"
              w="full"
              px={{ base: "4", md: "0" }}
              pt={{ base: "5", lg: "9" }}
              pb={{
                base: "calc(10rem + env(safe-area-inset-bottom))",
                lg: "12",
              }}
            >
              {signedOut ? (
                <Stack mb="5" gap="3">
                  <Text role="alert" fontSize="sm" color="red.fg">
                    Your session has expired. Sign in to continue.
                  </Text>
                  <SessionRecovery />
                </Stack>
              ) : accountError ? (
                <Box mb="5">
                  <RequestError
                    error={accountError}
                    message="We couldn't refresh your account. Your current page is still here."
                    onRetry={() => reexecute({ requestPolicy: "network-only" })}
                    retryLabel="Retry account"
                  />
                </Box>
              ) : null}
              {notice && (
                <Text
                  role="status"
                  mb="4"
                  px="4"
                  py="3"
                  rounded="xl"
                  bg="bg.muted"
                  color="fg"
                  fontSize="sm"
                >
                  {notice}
                </Text>
              )}
              {children}
            </Box>
          </Flex>
        </Container>
        <Button
          display={{
            base: pathname === "/social" ? "flex" : "none",
            lg: "none",
          }}
          position="fixed"
          right="4"
          bottom="calc(5.5rem + env(safe-area-inset-bottom))"
          zIndex="15"
          rounded="full"
          h="13"
          px="5"
          gap="2"
          colorPalette="blue"
          shadow="lg"
          onClick={openComposer}
          aria-label="New post"
        >
          <PenLine size={20} />
          Post
        </Button>
        <HStack
          as="nav"
          aria-label="Social navigation"
          display={{ base: "flex", lg: "none" }}
          position="fixed"
          bottom="0"
          insetInline="0"
          zIndex="20"
          bg="bg.panel"
          borderTopWidth="1px"
          borderColor="border"
          px="2"
          pt="2"
          pb="max(0.5rem, env(safe-area-inset-bottom))"
          gap="0"
          justify="space-around"
        >
          {links.map(({ href, label, icon: Icon, active }) => (
            <Flex
              asChild
              key={label}
              direction="column"
              align="center"
              gap="1"
              flex="1"
              minW="0"
              minH="12"
              py="1"
              rounded="xl"
              color={active ? "blue.fg" : "fg.muted"}
              fontSize="xs"
              fontWeight={active ? "bold" : "medium"}
            >
              <Link href={href} aria-current={active ? "page" : undefined}>
                <Box
                  px="5"
                  py="1"
                  rounded="full"
                  bg={active ? "blue.subtle" : undefined}
                >
                  <Icon size={21} strokeWidth={active ? 2.4 : 1.8} />
                </Box>
                {label}
              </Link>
            </Flex>
          ))}
        </HStack>
        <PostComposer
          profile={profile}
          context={context}
          open={composerOpen}
          onOpenChange={setComposerOpen}
          finalFocusEl={() => composerTrigger.current}
          onPublished={() => {
            setPostVersion((version) => version + 1);
            setNotice("Your post is published.");
          }}
        />
      </Box>
    </SocialContext>
  );
}

function AccountState({
  failed,
  onRetry,
}: {
  failed: boolean;
  onRetry: () => void;
}) {
  return (
    <Container maxW="md" py={{ base: "12", md: "24" }}>
      <Stack gap="6">
        <Brand />
        {failed ? (
          <Stack gap="4">
            <Text role="alert">
              We couldn&apos;t load your account. Please try again.
            </Text>
            <Button alignSelf="start" onClick={onRetry}>
              Try again
            </Button>
          </Stack>
        ) : (
          <LoadingState>Getting your account ready...</LoadingState>
        )}
      </Stack>
    </Container>
  );
}

export function SocialShell({ children }: { children: ReactNode }) {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.status === "signed-out") router.replace("/login");
  }, [session.status, router]);
  return session.status === "ready" ? (
    <ReadyShell sessionFetch={session.fetch}>{children}</ReadyShell>
  ) : (
    <AccountState failed={session.status === "error"} onRetry={session.retry} />
  );
}
