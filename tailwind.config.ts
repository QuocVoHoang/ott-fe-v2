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
        'sidebar-open': '350px',
        'sidebar-close': '60px',
        'chatlist': 'calc(350px - 60px)',
        'nav-sb-open': 'calc(100vw - 350px)',
        'nav-sb-close': 'calc(100vw - 60px)',
      },
      height: {
        'navbar-height': '64px',
        'main-body-height': '100%',
        'search-component-height': '50px',
        'sidebar-body-height': '100%',
        'newchat-button': '50px',
        'chatlist-height': 'calc(100% - 100px)',
        'message-area-height': 'calc(100% - 80px)',
        'input-area-height': '80px',
        
      }
    },
  },
  plugins: [],
} satisfies Config;
