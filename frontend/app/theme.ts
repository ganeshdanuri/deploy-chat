// Central theme configuration
// Properly structured color system with clear hierarchy and semantic meaning

export const theme = {
  colors: {
    primary: {
      main: "#262ef2",
      light: "#545bff",
      lighter: "#e9eaff",
      lightest: "#f3f3f9",
    },

    accent: {
      dark: "#201f32",
      muted: "#a1a1a1",
      border: "#e3e2e5",
      bg: "#f3f3f9",
      body: "#4d5564",
      white: "#ffffff",
    },

    semantic: {
      error: "#ef4444",
      success: "#10b981",
      warning: "#f59e0b",
    },

    neutral: {
      900: "#201f32",
      800: "#333333",
      700: "#4d5564",
      600: "#666666",
      500: "#a1a1a1",
      400: "#cccccc",
      300: "#e3e2e5",
      200: "#eeeeee",
      100: "#f3f3f9",
      50: "#ffffff",
    },

    overlay: {
      dark: "rgba(32, 31, 59, 0.5)",
    },
  },

  gradients: {
    primaryButton: "#262ef2",
    page: "linear-gradient(to bottom right, #f3f3f9, #ffffff)",
  },

  shadows: {
    sm: "0 1px 2px 0 rgb(32 31 59 / 0.05)",
    md: "0 4px 6px -1px rgb(32 31 59 / 0.1)",
    lg: "0 10px 15px -3px rgb(32 31 59 / 0.1)",
    xl: "0 20px 25px -5px rgb(32 31 59 / 0.1)",
  },

  // Typography - Google Fonts
  typography: {
    fontFamily: {
      sans: "var(--font-space-grotesk), 'Space Grotesk Placeholder', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      mono: "var(--font-ibm-plex-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  }
} as const;
