import { nextui } from "@nextui-org/theme";
import type { Config } from "tailwindcss";
import { createThemes } from "tw-colors";
import colors from "tailwindcss/colors";

const baseColors = [
  "gray",
  "red",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
];

const shadeMapping = {
  "50": "900",
  "100": "800",
  "200": "700",
  "300": "600",
  "400": "500",
  "500": "400",
  "600": "300",
  "700": "200",
  "800": "100",
  "900": "50",
};

const generateThemeObject = (colors: any, mapping: any, invert = false) => {
  const theme: any = {};
  baseColors.forEach((color) => {
    theme[color] = {};
    Object.entries(mapping).forEach(([key, value]: any) => {
      const shadeKey = invert ? value : key;
      theme[color][key] = colors[color][shadeKey];
    });
  });
  return theme;
};

const lightTheme = generateThemeObject(colors, shadeMapping);
const darkTheme = generateThemeObject(colors, shadeMapping, true);

const themes = {
  light: {
    ...lightTheme,
    white: "#ffffff",
  },
  dark: {
    ...darkTheme,
    white: colors.gray["950"],
    black: colors.gray["50"],
  },
};

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    createThemes(themes), // Custom color themes with inverted shades
    nextui({
      themes: {
        light: {
          colors: {
            primary: "#0072F5", // Customize the primary color
            secondary: "#9750DD", // Customize the secondary color
            success: "#17C964", // Customize the success color
            warning: "#F5A524", // Customize the warning color
            danger: "#F31260", // Customize the error color
            background: "#FFFFFF", // Light theme background
            foreground: "#000000", // Light theme foreground
          },
        },
        dark: {
          colors: {
            primary: "#4B78E5", // Adjust for dark mode
            secondary: "#BB86FC",
            success: "#03DAC6",
            warning: "#FBC02D",
            danger: "#CF6679",
            background: "#121212", // Dark theme background
            foreground: "#E0E0E0", // Dark theme foreground
          },
        },
      },
    }),
  ],
};

export default config;
