// Central theme configuration
// Properly structured color system with clear hierarchy and semantic meaning

export const theme = {
  colors: {
    // Primary: Main brand color - used for primary CTAs, links, and key actions
    primary: {
      main: "#4667ff",
      light: "#8fa3ff",
      lighter: "#b8c7ff",
      lightest: "#e0e7ff",
    },

    // Accent colors for variety and visual interest
    accent: {
      green: "#10b981",
      greenLight: "#d1fae5",
      yellow: "#fbbf24",
      yellowLight: "#fef3c7",
      purple: "#8b5cf6",
      purpleLight: "#ede9fe",
      blue: "#3b82f6",
      teal: "#14b8a6",
    },

    // Semantic colors
    semantic: {
      error: "#ef4444",
      errorLight: "#fee2e2",
      errorBorder: "#fca5a5",
      errorDark: "#991b1b",
    },

    // Neutral: Used for text, borders, backgrounds
    neutral: {
      900: "#0f172a",
      800: "#1e293b",
      700: "#334155",
      600: "#64748b",
      500: "#94a3b8",
      400: "#cbd5e1",
      300: "#e2e8f0",
      200: "#f1f5f9",
      100: "#f8fafc",
      50: "#ffffff",
    },

    // Overlay colors
    overlay: {
      dark: "rgba(0, 0, 0, 0.5)",
    },
  },

  // Gradient backgrounds - professional and subtle
  gradients: {
    primaryButton: "#4667ff",
    page: "linear-gradient(to bottom right, #f8fafc, #f1f5f9)",
  },

  // Shadows for depth hierarchy
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },

  // Typography - Google Fonts
  typography: {
    fontFamily: {
      sans: "var(--font-sora), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      mono: "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  }
} as const;
