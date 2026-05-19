/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        background: "var(--background)",
        foreground: "var(--foreground)",

        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",

        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",

        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",

        available: "var(--available)",
        occupied: "var(--occupied)",
      },

      boxShadow: {
        card: "var(--shadow-card)",
      },
    },
  },

  plugins: [],
}