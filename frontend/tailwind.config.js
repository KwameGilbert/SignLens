/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#FB5607",
        "primary-soft": "#FDBA74",
        "primary-deep": "#C2410C",
        surface: "#FFFFFF",
        "surface-muted": "#F2F2EA",
      },
      borderRadius: {
        xl2: "20px",
        xl3: "28px",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
}