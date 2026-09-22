import type { Config } from "tailwindcss";

// "Royal grey" design system for Namoza India:
// a graphite/charcoal core with soft silver-greys, and a muted antique-gold
// accent used sparingly for a premium, "royal" touch.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#0C0D10",
          900: "#15171B",
          800: "#1E2127",
          700: "#2A2E36",
          600: "#3A3F49",
        },
        royal: {
          600: "#4A4E58",
          500: "#6B707C",
          400: "#8C919C",
        },
        silver: {
          300: "#B7BAC2",
          200: "#D4D6DB",
          100: "#E9EAED",
        },
        mist: {
          100: "#F4F4F5",
          50: "#FAFAFA",
        },
        gold: {
          600: "#8E703F",
          500: "#B08D57",
          400: "#C7A876",
          300: "#DDC79B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px -10px rgba(12, 13, 16, 0.25)",
        glow: "0 0 40px -8px rgba(176, 141, 87, 0.35)",
      },
      backgroundImage: {
        "royal-radial": "radial-gradient(circle at 50% 0%, rgba(176,141,87,0.10), transparent 60%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 18s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
