import { Heading, Stack, Text } from "@chakra-ui/react";

type AuthHeadingProps = { title: string; description?: string };

export function AuthHeading({ title, description }: AuthHeadingProps) {
  return (
    <Stack gap="2">
      <Heading as="h1" fontSize={{ base: "2xl", md: "3xl" }} lineHeight="short">
        {title}
      </Heading>
      {description && (
        <Text color="fg.muted" lineHeight="tall">
          {description}
        </Text>
      )}
    </Stack>
  );
}
