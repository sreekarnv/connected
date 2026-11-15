import {
  Card,
  Container,
  Flex,
  Icon,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChevronLeft as ChevronBack } from "lucide-react";
import NextLink from "next/link";
import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Flex
      minH="100dvh"
      bg="bg.subtle"
      align="center"
      justify="center"
      direction="column"
      gap={{ base: "5", md: "6" }}
      py={{ base: "6", md: "10" }}
      colorPalette="blue"
    >
      <Container maxW="3xl" px={{ base: "4", md: "6" }}>
        <Link asChild color="fg.muted" minH="11" gap="2">
          <NextLink href="/">
            <Icon asChild boxSize="4" aria-hidden="true">
              <ChevronBack />
            </Icon>
            Back
          </NextLink>
        </Link>
      </Container>
      <Container maxW="lg" px={{ base: "4", md: "6" }}>
        <Stack gap={{ base: "5", md: "6" }}>
          <Text
            textAlign="center"
            fontSize={{ base: "4xl", md: "5xl" }}
            fontFamily="var(--font-brand)"
            lineHeight="short"
            color="blue.fg"
            _after={{
              content: "''",
              display: "inline-block",
              boxSize: "2",
              rounded: "full",
              bg: "pink.500",
              ml: "1",
            }}
          >
            Connected
          </Text>
          <Card.Root
            as="main"
            bg="bg.panel"
            borderColor="border.subtle"
            rounded="2xl"
            shadow="sm"
          >
            <Card.Body p={{ base: "6", md: "8" }}>{children}</Card.Body>
          </Card.Root>
        </Stack>
      </Container>
    </Flex>
  );
}
