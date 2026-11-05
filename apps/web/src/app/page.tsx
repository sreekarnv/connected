import Link from "next/link";

import { Flex } from "@chakra-ui/react/flex";
import { Container } from "@chakra-ui/react/container";
import { Button } from "@chakra-ui/react/button";
import { LogInIcon } from "lucide-react";
import { Text } from "@chakra-ui/react/text";

import ThemeToggler from "~/components/ui/theme-toggler";

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
        >
          <Text asChild fontSize="3xl" fontFamily="var(--font-brand)">
            <Link href="/">Connected</Link>
          </Text>
          <Flex gap="4">
            <Button
              asChild
              size="sm"
              variant="solid"
              borderRadius="lg"
              colorPalette="purple"
            >
              <Link href="/login">
                Log In
                <LogInIcon />
              </Link>
            </Button>
            <ThemeToggler size="sm" />
          </Flex>
        </Flex>
      </Container>
    </>
  );
}

export default IndexPage;
