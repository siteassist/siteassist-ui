import tailwindcssTypography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      colors: {
        border: "var(--sa-border, #e4e4e7)",
        ring: "var(--sa-ring, #18181b)",
        background: "var(--sa-background, #ffffff)",
        foreground: "var(--sa-foreground, #09090b)",
        "modal-overlay": "var(--sa-modal-overlay, #09090b)",
        primary: {
          DEFAULT: "var(--sa-primary, #4e4eff)",
          foreground: "var(--sa-primary-foreground, #ffffff)",
        },
        secondary: {
          DEFAULT: "var(--sa-secondary, #f4f4f5)",
          foreground: "var(--sa-secondary-foreground, #18181b)",
        },
        destructive: {
          DEFAULT: "var(--sa-destructive, #ef4444)",
          foreground: "var(--sa-destructive-foreground, #fafafa)",
        },
        muted: {
          DEFAULT: "var(--sa-muted, #f4f4f5)",
          foreground: "var(--sa-muted-foreground, #71717a)",
        },
      },
      borderRadius: {
        lg: "var(--sa-radius, 0.5rem)",
        md: "calc(var(--sa-radius, 0.5rem) - 2px)",
        sm: "calc(var(--sa-radius, 0.5rem) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssTypography],
} satisfies Config;

export default config;
