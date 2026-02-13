/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary colors
        ocean: {
          DEFAULT: "#1F4E79",
          light: "#2D6BA8",
          dark: "#163A5A",
        },
        sunset: {
          DEFAULT: "#F76C1E",
          light: "#FF8A47",
          dark: "#D45A12",
        },
        sunny: {
          DEFAULT: "#F7B733",
          light: "#FFCC5C",
          dark: "#E5A51F",
        },
        sand: {
          DEFAULT: "#F4EDE3",
          light: "#FAF8F5",
          dark: "#E8DED0",
        },
        // Soft pastels for events page
        lavender: {
          50: "#FAF8FF",
          100: "#F3EEFF",
          200: "#E8DFFF",
          700: "#7C3AED",
          DEFAULT: "#E8DFFF",
        },
        coral: {
          50: "#FFF7F5",
          100: "#FFEBE5",
          200: "#FFD7CC",
          400: "#FF8A6B",
          500: "#F76C1E",
          600: "#EA580C",
          DEFAULT: "#FF8A6B",
        },
        pink: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          DEFAULT: "#FECDD3",
        },
        // Accent
        charcoal: "#333333",
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Open Sans", "sans-serif"],
        accent: ["Pacifico", "cursive"],
        nav: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "gradient-tropical":
          "linear-gradient(135deg, #1F4E79 0%, #2D6BA8 100%)",
        "gradient-sunset": "linear-gradient(135deg, #F76C1E 0%, #F7B733 100%)",
        "gradient-sand": "linear-gradient(180deg, #F4EDE3 0%, #FFFFFF 100%)",
      },
      boxShadow: {
        card: "0 4px 20px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.12)",
        button: "0 4px 14px rgba(247, 108, 30, 0.4)",
      },
      animation: {
        wave: "wave 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "overlay-show": "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "content-show": "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        contentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
