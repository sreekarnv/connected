import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    html: { colorPalette: "blue", scrollPaddingTop: "24" },
    "button, a, input, textarea": { WebkitTapHighlightColor: "transparent" },
    "*, *::before, *::after": {
      _motionReduce: {
        animationDuration: "0.01ms !important",
        transitionDuration: "0.01ms !important",
        scrollBehavior: "auto !important",
      },
    },
    "*::placeholder, *[data-placeholder]": { color: "fg.muted" },
  },
  theme: {
    tokens: {
      colors: {
        blue: {
          50: { value: "#F1F4FF" },
          100: { value: "#E4EBFF" },
          200: { value: "#CAD8FF" },
          300: { value: "#A8BEFF" },
          400: { value: "#8BA8FF" },
          500: { value: "#597EF0" },
          600: { value: "#4267DC" },
          700: { value: "#3455BF" },
          800: { value: "#293D78" },
          900: { value: "#202F59" },
          950: { value: "#171F3E" },
        },
        pink: {
          50: { value: "#FBF5F7" },
          100: { value: "#F5E8ED" },
          200: { value: "#ECD1DC" },
          300: { value: "#E2B8C9" },
          400: { value: "#DDA1B5" },
          500: { value: "#C97C98" },
          600: { value: "#B15B7D" },
          700: { value: "#A04468" },
          800: { value: "#653246" },
          900: { value: "#3B2432" },
          950: { value: "#271C26" },
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
              _light: "#F6F7F8",
              _dark: "#111318",
            },
          },
          subtle: {
            value: {
              _light: "#F6F7F8",
              _dark: "#111318",
            },
          },
          panel: {
            value: {
              _light: "{colors.white}",
              _dark: "#1A1D24",
            },
          },
          muted: {
            value: {
              _light: "#ECEEF1",
              _dark: "#242832",
            },
          },
          emphasized: {
            value: {
              _light: "#DEE2E7",
              _dark: "#323844",
            },
          },
          inverted: {
            value: {
              _light: "#202329",
              _dark: "#F1F2F4",
            },
          },
          info: {
            value: "{colors.blue.subtle}",
          },
        },
        fg: {
          DEFAULT: {
            value: {
              _light: "#202329",
              _dark: "#F1F2F4",
            },
          },
          muted: {
            value: {
              _light: "#59616E",
              _dark: "#ADB3BF",
            },
          },
          subtle: {
            value: "{colors.fg.muted}",
          },
          inverted: {
            value: {
              _light: "#F6F7F8",
              _dark: "#1A1D24",
            },
          },
          info: {
            value: "{colors.blue.fg}",
          },
        },
        border: {
          DEFAULT: {
            value: {
              _light: "#DEE2E7",
              _dark: "#323844",
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
              _light: "#7D8795",
              _dark: "#737C8C",
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
      button: {
        base: { borderRadius: "xl", fontWeight: "semibold", minH: "11" },
      },
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
