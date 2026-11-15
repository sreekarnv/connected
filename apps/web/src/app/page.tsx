import Link from "next/link";

import { Flex } from "@chakra-ui/react/flex";
import { Container } from "@chakra-ui/react/container";
import { Text } from "@chakra-ui/react/text";

import { ColorModeButton } from "~/components/ui/color-mode";
import { HomeAuthActions } from "~/components/auth/home-auth-actions";

function IndexPage() {
  return (
    <>
      <Container>
        <Flex
          py="2"
          base={{ py: "4", px: "2" }}
          md={{ py: "5", px: "4" }}
          alignItems="center"
          justifyContent="space-between"
          direction={{ base: "column", sm: "row" }}
          gap="4"
        >
          <Text
            asChild
            fontSize="3xl"
            fontFamily="var(--font-brand)"
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
            <Link href="/">Connected</Link>
          </Text>
          <Flex gap={{ base: "2", md: "4" }} align="center">
            <HomeAuthActions />
            <ColorModeButton />
          </Flex>
        </Flex>
      </Container>
    </>
  );
}

export default IndexPage;
