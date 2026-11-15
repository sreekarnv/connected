import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    html: { colorPalette: "blue" },
    "*::placeholder, *[data-placeholder]": { color: "fg.muted" },
  },
  theme: {
    tokens: {
      colors: {
        blue: {
          50: { value: "#F0F9FF" },
          100: { value: "#E0F2FE" },
          200: { value: "#BDE8FD" },
          300: { value: "#7DD3FC" },
          400: { value: "#38BDF8" },
          500: { value: "#0EA5E9" },
          600: { value: "#0284C7" },
          700: { value: "#0369A1" },
          800: { value: "#16435E" },
          900: { value: "#102E46" },
          950: { value: "#082336" },
        },
        pink: {
          50: { value: "#FDF2F8" },
          100: { value: "#FCE7F3" },
          200: { value: "#FBD9EC" },
          300: { value: "#FFA3CD" },
          400: { value: "#FF71B1" },
          500: { value: "#FF2D8D" },
          600: { value: "#DB176D" },
          700: { value: "#C11567" },
          800: { value: "#641C45" },
          900: { value: "#3B1730" },
          950: { value: "#271023" },
        },
      },
      fonts: {
        body: {
          value: "var(--font-inter), sans-serif",
        },
        heading: {
          value: "var(--font-inter), sans-serif",
        },
        mono: {
          value: "var(--font-mono), monospace",
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: {
              _light: "#F5F9FC",
              _dark: "#0B1220",
            },
          },
          subtle: {
            value: {
              _light: "#F5F9FC",
              _dark: "#0B1220",
            },
          },
          panel: {
            value: {
              _light: "{colors.white}",
              _dark: "#121E30",
            },
          },
          muted: {
            value: {
              _light: "#EEF5FA",
              _dark: "#1B2B41",
            },
          },
          emphasized: {
            value: {
              _light: "#DCE6EF",
              _dark: "#28394F",
            },
          },
          inverted: {
            value: {
              _light: "#15263B",
              _dark: "#F2F7FC",
            },
          },
          info: {
            value: "{colors.blue.subtle}",
          },
        },
        fg: {
          DEFAULT: {
            value: {
              _light: "#15263B",
              _dark: "#F2F7FC",
            },
          },
          muted: {
            value: {
              _light: "#53677F",
              _dark: "#9CAEC4",
            },
          },
          subtle: {
            value: "{colors.fg.muted}",
          },
          inverted: {
            value: {
              _light: "#F2F7FC",
              _dark: "#15263B",
            },
          },
          info: {
            value: "{colors.blue.fg}",
          },
        },
        border: {
          DEFAULT: {
            value: {
              _light: "#DCE6EF",
              _dark: "#28394F",
            },
          },
          subtle: {
            value: "{colors.border}",
          },
          muted: {
            value: "{colors.border}",
          },
          info: {
            value: "{colors.blue.border}",
          },
          // Controls need stronger boundaries than decorative card dividers.
          emphasized: {
            value: {
              _light: "#7A8A9E",
              _dark: "#60758F",
            },
          },
        },
        blue: {
          solid: {
            value: {
              _light: "{colors.blue.700}",
              _dark: "{colors.blue.400}",
            },
          },
          contrast: {
            value: {
              _light: "{colors.white}",
              _dark: "{colors.bg}",
            },
          },
          fg: {
            value: {
              _light: "{colors.blue.700}",
              _dark: "{colors.blue.400}",
            },
          },
          subtle: {
            value: {
              _light: "{colors.blue.100}",
              _dark: "{colors.blue.950}",
            },
          },
          muted: {
            value: {
              _light: "{colors.blue.100}",
              _dark: "{colors.blue.900}",
            },
          },
          emphasized: {
            value: {
              _light: "{colors.blue.200}",
              _dark: "{colors.blue.800}",
            },
          },
          focusRing: {
            value: "{colors.blue.fg}",
          },
          border: {
            value: "{colors.blue.fg}",
          },
        },
        pink: {
          solid: {
            value: {
              _light: "{colors.pink.700}",
              _dark: "{colors.pink.400}",
            },
          },
          contrast: {
            value: "{colors.blue.contrast}",
          },
          fg: {
            value: {
              _light: "{colors.pink.700}",
              _dark: "{colors.pink.400}",
            },
          },
          subtle: {
            value: {
              _light: "{colors.pink.50}",
              _dark: "{colors.pink.950}",
            },
          },
          muted: {
            value: {
              _light: "{colors.pink.100}",
              _dark: "{colors.pink.900}",
            },
          },
          emphasized: {
            value: {
              _light: "{colors.pink.200}",
              _dark: "{colors.pink.800}",
            },
          },
          focusRing: {
            value: "{colors.pink.fg}",
          },
          border: {
            value: "{colors.pink.fg}",
          },
        },
      },
    },
    recipes: {
      input: {
        variants: {
          variant: {
            outline: {
              borderColor: "border.emphasized",
            },
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
