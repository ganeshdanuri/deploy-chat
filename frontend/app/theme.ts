// Central theme configuration
// Properly structured color system with clear hierarchy and semantic meaning

export const theme = {
  colors: {
    // Primary: Main brand color - used for primary CTAs, links, and key actions
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },
    
    // Accent colors for variety and visual interest
    accent: {
      green: "#10b981",
      yellow: "#fbbf24",
      purple: "#8b5cf6",
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
    },
  },
  
  // Gradient backgrounds - professional and subtle
  gradients: {
    page: "linear-gradient(to bottom, #f8fafc, #e0e7ff)",
    primaryButton: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  },
  
  // Shadows for depth hierarchy
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  }
} as const;

// Utility function to get theme colors
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = theme.colors;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value;
};
