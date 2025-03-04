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
        'sidebar-open-with-padding': '540px',
        'sidebar-open-no-padding': 'calc(540px - 40px)',
        'sidebar-close-with-padding': '120px',
        'sidebar-close-no-padding': '80px',
        'sidebar-second-component': '400px',

        'chat-container': 'calc(100vw - 540px)',


        'chatlist': 'calc(540px - 80px)',
        'nav-sb-open': 'calc(100vw - 540px)',
        'nav-sb-close': 'calc(100vw - 80px)',

        'chat-item': 'calc(100% - 70px)'
      },
      height: {
        'navbar-height': '64px',
        'main-body-height': '100%',

        'search-component-height': '50px',
        'group-people-height': 'calc(100% - 120px)',
        'new-chat-button': '45px',
        'group-height': '48%',
        'people-height': '48%',
        

        'sidebar-body-height': '100%',
        'chatlist-height': 'calc(100% - 100px)',
        'chatbar': '60px',
        'message-area-height': 'calc(100vh - 180px)',
        'input-area-height': '80px',
        
      }
    },
  },
  plugins: [],
} satisfies Config;
