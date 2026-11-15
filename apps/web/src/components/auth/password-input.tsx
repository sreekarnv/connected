"use client";

import {
  IconButton,
  Input,
  InputGroup,
  type InputProps,
} from "@chakra-ui/react";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

type PasswordInputProps = Omit<InputProps, "type"> & {
  visibilityLabel?: string;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ visibilityLabel = "password", ...props }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <InputGroup
        endElementProps={{ px: "1" }}
        endElement={
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            h="11"
            minW="11"
            color="fg.muted"
            disabled={props.disabled}
            aria-label={`${visible ? "Hide" : "Show"} ${visibilityLabel}`}
            aria-pressed={visible}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? (
              <EyeOff aria-hidden="true" />
            ) : (
              <Eye aria-hidden="true" />
            )}
          </IconButton>
        }
      >
        <Input
          size="lg"
          rounded="lg"
          pe="14"
          {...props}
          type={visible ? "text" : "password"}
          ref={ref}
        />
      </InputGroup>
    );
  },
);
