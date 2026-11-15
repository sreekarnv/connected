import { Alert } from "@chakra-ui/react";
import type { ReactNode } from "react";

type AuthMessageProps = {
  status: "error" | "success" | "info";
  title: string;
  children: ReactNode;
};

export function AuthMessage({ status, title, children }: AuthMessageProps) {
  return (
    <Alert.Root
      status={status}
      variant="subtle"
      rounded="lg"
      role={status === "error" ? "alert" : "status"}
    >
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description lineHeight="tall">{children}</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}
