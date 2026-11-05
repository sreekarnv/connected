"use client";

import { IconButton, IconButtonProps } from "@chakra-ui/react/button";
import { ClientOnly } from "@chakra-ui/react/client-only";
import { MoonIcon, SunIcon } from "lucide-react";
import { useColorMode } from "~/components/ui/color-mode";

export type ThemeTogglerProps = IconButtonProps;

function ThemeToggler({
  variant = "plain",
  borderRadius = "lg",
  onClick,
  ...props
}: ThemeTogglerProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      variant={variant}
      borderRadius={borderRadius}
      onClick={(e) => {
        onClick?.(e);
        toggleColorMode();
      }}
      {...props}
    >
      <ClientOnly>
        {colorMode === "light" ? <SunIcon /> : <MoonIcon />}
      </ClientOnly>
    </IconButton>
  );
}

export default ThemeToggler;
