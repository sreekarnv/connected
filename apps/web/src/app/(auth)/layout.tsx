import {
  Card,
  Container,
  Flex,
  HStack,
  Icon,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChevronLeft as ChevronBack } from "lucide-react";
import NextLink from "next/link";
import type { PropsWithChildren } from "react";
import { ColorModeButton } from "~/components/ui/color-mode";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Flex
      minH="100dvh"
      bg="bg.subtle"
      align="center"
      justify="center"
      direction="column"
      gap={{ base: "4", md: "6" }}
      py={{ base: "4", md: "8" }}
      colorPalette="blue"
    >
      <Container maxW="lg" px={{ base: "4", md: "6" }}>
        <HStack
          as="nav"
          aria-label="Account navigation"
          justify="space-between"
        >
          <Link asChild color="fg.muted" minH="11" gap="2" fontSize="sm">
            <NextLink href="/">
              <Icon asChild boxSize="4" aria-hidden="true">
                <ChevronBack />
              </Icon>
              Back
            </NextLink>
          </Link>
          <ColorModeButton minH="11" minW="11" color="fg.muted" />
        </HStack>
      </Container>
      <Container maxW="lg" px={{ base: "4", md: "6" }}>
        <Stack gap={{ base: "5", md: "6" }}>
          <Text
            asChild
            alignSelf="center"
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
            <NextLink href="/" aria-label="Connected home">
              Connected
            </NextLink>
          </Text>
          <Card.Root
            as="main"
            bg="bg.panel"
            borderColor="border.subtle"
            rounded={{ base: "2xl", md: "3xl" }}
            shadow="sm"
          >
            <Card.Body p={{ base: "6", md: "8" }}>{children}</Card.Body>
          </Card.Root>
          <Text as="footer" textAlign="center" color="fg.muted" fontSize="xs">
            Small updates. Real connections.
          </Text>
        </Stack>
      </Container>
    </Flex>
  );
}
