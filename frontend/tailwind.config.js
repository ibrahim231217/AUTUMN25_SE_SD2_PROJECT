/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom healthcare brand colors
        primary: {
          50: "#f0f6fb",
          100: "#e1edf7",
          200: "#c3dbef",
          300: "#a5c9e7",
          600: "#003366",
          700: "#002d5c",
          800: "#001f42",
        },
        secondary: {
          50: "#f0fffe",
          100: "#d1f5f3",
          200: "#a3ebe5",
          300: "#75e1d7",
          600: "#00A896",
          700: "#008b7e",
          800: "#006b66",
        },
        accent: {
          50: "#f7fffe",
          100: "#e0f7fa",
          200: "#b3e5fc",
          300: "#81d4fa",
        },
        action: {
          500: "#FF7043",
          600: "#ff5722",
          700: "#e64a19",
        },
        neutral: {
          bg: "#FFFFFF",
          light: "#f8f9fa",
          medium: "#e9ecef",
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 51, 102, 0.1)',
        'medium': '0 4px 12px rgba(0, 51, 102, 0.15)',
        'lg-soft': '0 8px 24px rgba(0, 51, 102, 0.12)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};