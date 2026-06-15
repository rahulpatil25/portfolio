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
        border: "rgba(255, 255, 255, 0.07)",
        input: "rgba(255, 255, 255, 0.07)",
        ring: "rgba(6, 182, 212, 0.4)",
        background: "#060913",
        foreground: "#f3f4f6",
        primary: {
          DEFAULT: "#8b5cf6",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "rgba(255, 255, 255, 0.04)",
          foreground: "#f3f4f6",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#f3f4f6",
        },
        muted: {
          DEFAULT: "#1f2937",
          foreground: "#9ca3af",
        },
        accent: {
          DEFAULT: "rgba(255, 255, 255, 0.04)",
          foreground: "#f3f4f6",
        },
        popover: {
          DEFAULT: "#0b0f19",
          foreground: "#f3f4f6",
        },
        card: {
          DEFAULT: "rgba(17, 24, 39, 0.65)",
          foreground: "#f3f4f6",
        },
        cyanCustom: "#06b6d4",
        blueCustom: "#3b82f6",
        purpleCustom: "#8b5cf6",
        pinkCustom: "#ec4899",
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
      },
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["Fira Code", "monospace"],
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
        "float-blob": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(5%, 10%) scale(1.1)" },
          "100%": { transform: "translate(-5%, -5%) scale(0.9)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-blob": "float-blob 20s infinite alternate",
      },
      backgroundImage: {
        "grad-hybrid": "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)",
        "grad-engineering": "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
        "grad-product": "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        "grad-bg": "radial-gradient(circle at 50% 50%, #151c30 0%, #060913 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
