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
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",

        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",

        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",

        available: "hsl(var(--available))",
        occupied: "hsl(var(--occupied))",
      },

      borderRadius: {
        xl: "var(--radius)",
        "2xl": "calc(var(--radius) + 4px)",
      },

      boxShadow: {
        card: "0 4px 16px rgba(0,0,0,0.08)",
      },
    },
  },

  plugins: [],
}