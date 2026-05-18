/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  safelist: [
    "grid",
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-5",
    "gap-2",
    "gap-3",
    "rounded-xl",
    "rounded-2xl",
    "shadow-lg",
    "text-2xl",
    "text-3xl",
    "font-semibold",
    "bg-card",
    "text-foreground",
    "text-muted-foreground",
    "text-available",
    "text-occupied",
    "border",
    "bg-primary",
    "text-primary-foreground",
    "max-w-7xl",
    "mx-auto",
    "p-4",
    "px-4",
    "py-8",
    "mt-6",
    "mt-8",
    "mt-10",
    "mt-12",
  ],

  theme: {
    extend: {},
  },

  plugins: [],
}