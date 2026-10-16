import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        canvas: "rgb(var(--primitive-ink) / <alpha-value>)",
        "canvas-raised": "rgb(var(--primitive-ink-raised) / <alpha-value>)",
        "canvas-elevated": "rgb(var(--primitive-ink-elevated) / <alpha-value>)",
        "canvas-hover": "rgb(var(--primitive-ink-hover) / <alpha-value>)",
        "canvas-soft": "rgb(var(--primitive-ink-soft) / <alpha-value>)",
        "canvas-stack": "rgb(var(--primitive-ink-stack) / <alpha-value>)",
        "canvas-stack-shadow": "rgb(var(--primitive-ink-stack-shadow) / <alpha-value>)",
        "deck-layer": "rgb(var(--primitive-black-layer) / <alpha-value>)",
        deck: "rgb(var(--primitive-black) / <alpha-value>)",
        paper: "rgb(var(--primitive-paper) / <alpha-value>)",
        sheet: "rgb(var(--primitive-sheet) / <alpha-value>)",
        signal: {
          DEFAULT: "rgb(var(--primitive-signal) / <alpha-value>)",
          hover: "rgb(var(--primitive-signal-hover) / <alpha-value>)",
          deep: "rgb(var(--primitive-signal-deep) / <alpha-value>)",
        },
        success: "rgb(var(--primitive-success) / <alpha-value>)",
        warning: "rgb(var(--primitive-warning) / <alpha-value>)",
        danger: "rgb(var(--primitive-danger) / <alpha-value>)",
        "thread-study": "rgb(var(--primitive-thread-study) / <alpha-value>)",
        "thread-side": "rgb(var(--primitive-thread-side) / <alpha-value>)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
