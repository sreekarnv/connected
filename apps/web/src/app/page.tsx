import Link from "next/link";

import { Flex } from "@chakra-ui/react/flex";
import { Container } from "@chakra-ui/react/container";
import { Button } from "@chakra-ui/react/button";
import { LogInIcon } from "lucide-react";

import ThemeToggler from "~/components/ui/theme-toggler";

function IndexPage() {
  return (
    <>
      <Container>
        <Flex py="5" px="4" alignItems="center" justifyContent="space-between">
          <Link href="/">Connected</Link>
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
