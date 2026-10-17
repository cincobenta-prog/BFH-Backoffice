/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
        point: {
          red: "#e11d48",
          neon: "#ff1e42",
          dark: "#0a0a0c",
          surface: "#121216",
          subtle: "#1c1c24",
          silver: "#a1a1aa",
        },
        benta: {
          50: "#fdf5f5",
          100: "#f9e7e8",
          200: "#f2c9cc",
          300: "#e6a1a6",
          400: "#d9737b",
          500: "#c94a53",
          600: "#b32b34",
          700: "#a0080e",
          800: "#83070c",
          900: "#6a0509",
          950: "#3d0306",
        },
        brass: {
          50: "#faf7ef",
          100: "#f3edda",
          200: "#e6dac1",
          300: "#d3bd8f",
          400: "#c2a465",
          500: "#b18f47",
          600: "#9c7a30",
          700: "#7f6226",
          800: "#664e22",
          900: "#554120",
          950: "#332a14",
        },
        bentaPanel: "#e7e4dc",
        bentaInk: "#57534b",
        bentaDark: "#2f2f22",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        display: ["Jost", "Poppins", "sans-serif"],
        serif: ["Jost", "Poppins", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out forwards",
        "marquee": "marquee 35s linear infinite",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};
