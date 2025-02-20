import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#656554",
        sidebarColor: '#FCFCFC',
        bodyBackground: '#F2F2F2',
      },
      width: {
        'sidebar-open': '200px',
        'sidebar-close': '80px',
        'nav-sb-open': 'calc(100vw - 200px)',
        'nav-sb-close': 'calc(100vw - 80px)',
      },
      height: {
        'navbar-height': '64px',
        'sidebar-body-height': 'calc(100% - 114px)'
      }
    },
  },
  plugins: [],
} satisfies Config;
