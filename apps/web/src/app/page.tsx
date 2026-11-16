import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { HomeAuthActions } from "~/components/auth/home-auth-actions";
import { ColorModeButton } from "~/components/ui/color-mode";

const artwork = {
  src: "/illustrations/connected-community.svg",
  darkSrc: "/illustrations/connected-community-dark.svg",
  alt: "",
  width: 799,
  height: 592,
} as const;

export default function IndexPage() {
  return (
    <Container maxW="1120px" px={{ base: "5", md: "8" }}>
      <HStack as="header" justify="space-between" py={{ base: "5", md: "7" }}>
        <Text
          asChild
          fontSize={{ base: "2xl", md: "3xl" }}
          fontFamily="var(--font-brand)"
          color="blue.fg"
          lineHeight="1"
          minH="11"
          display="inline-flex"
          alignItems="center"
          _after={{
            content: "''",
            display: "inline-block",
            boxSize: "1.5",
            rounded: "full",
            bg: "pink.500",
            ml: "1",
          }}
        >
          <Link href="/">Connected</Link>
        </Text>
        <ColorModeButton minH="11" minW="11" />
      </HStack>
      <Stack
        as="main"
        align="center"
        gap={{ base: "8", md: "10" }}
        pt={{ base: "7", md: "9" }}
        pb={{ base: "10", md: "14" }}
      >
        <Stack align="center" textAlign="center" gap={{ base: "5", md: "6" }}>
          <Heading
            as="h1"
            fontSize={{ base: "42px", md: "6xl", lg: "68px" }}
            lineHeight="1.08"
            letterSpacing="-0.045em"
            maxW="760px"
          >
            Keep up with
            <Text as="span" display="block" color="blue.fg">
              your people.
            </Text>
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="fg.muted"
            lineHeight="1.75"
            maxW="490px"
          >
            Share updates and follow the people you care about.
          </Text>
          <Box pt="1" maxW="full" w="fit-content" textAlign="start">
            <HomeAuthActions />
          </Box>
        </Stack>
        <Box
          w="full"
          maxW="620px"
          bg="blue.50"
          _dark={{ bg: "bg.panel" }}
          borderRadius="50% 50% 16% 16% / 12% 12% 16% 16%"
          p={{ base: "5", md: "8" }}
        >
          <Box asChild display="block" _dark={{ display: "none" }}>
            <Image
              src={artwork.src}
              alt={artwork.alt}
              width={artwork.width}
              height={artwork.height}
              loading="eager"
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
          <Box asChild display="none" _dark={{ display: "block" }}>
            <Image
              src={artwork.darkSrc}
              alt={artwork.alt}
              width={artwork.width}
              height={artwork.height}
              loading="eager"
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
        </Box>
      </Stack>
      <Flex
        as="footer"
        py="6"
        borderTopWidth="1px"
        borderColor="border"
        justify="space-between"
        align="center"
        gap="3"
        wrap="wrap"
        color="fg.muted"
        fontSize="xs"
      >
        <Text>Connected</Text>
        <Text
          asChild
          py="3"
          minH="11"
          display="inline-flex"
          alignItems="center"
          textDecoration="underline"
          textUnderlineOffset="3px"
        >
          <a href="https://undraw.co/illustration/online-community_3o0l">
            Illustration by unDraw
          </a>
        </Text>
      </Flex>
    </Container>
  );
}
