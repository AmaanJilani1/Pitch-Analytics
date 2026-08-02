import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-container-lowest": "#ffffff",
        "tertiary": "#5a5c5e",
        "error-container": "#ffdad6",
        "primary-container": "#018646",
        "surface-bright": "#f9f9f7",
        "secondary-container": "#ffa454",
        "on-error-container": "#93000a",
        "primary-fixed-dim": "#71dc92",
        "on-secondary-fixed-variant": "#6e3900",
        "inverse-primary": "#71dc92",
        "tertiary-fixed": "#e2e2e5",
        "on-secondary-container": "#713b00",
        "tertiary-fixed-dim": "#c6c6c9",
        "inverse-surface": "#2f3130",
        "on-background": "#1a1c1b",
        "surface-container-high": "#e8e8e6",
        "secondary-fixed": "#ffdcc3",
        "background": "#f9f9f7",
        "on-primary-fixed": "#00210d",
        "surface-tint": "#006d38",
        "outline": "#6e7a6f",
        "surface-container-low": "#f4f4f2",
        "on-tertiary": "#ffffff",
        "on-surface-variant": "#3e4a3f",
        "surface-container-highest": "#e2e3e1",
        "on-tertiary-fixed-variant": "#454749",
        "outline-variant": "#bdcabc",
        "on-surface": "#1a1c1b",
        "error": "#ba1a1a",
        "on-tertiary-fixed": "#1a1c1e",
        "on-secondary-fixed": "#2f1500",
        "on-primary": "#ffffff",
        "tertiary-container": "#737577",
        "surface-container": "#eeeeec",
        "on-primary-container": "#f6fff4",
        "inverse-on-surface": "#f1f1ef",
        "secondary-fixed-dim": "#ffb77d",
        "surface-dim": "#dadad8",
        "on-tertiary-container": "#fcfcff",
        "surface": "#f9f9f7",
        "on-primary-fixed-variant": "#005229",
        "primary-fixed": "#8df9ac",
        "secondary": "#904d00",
        "on-secondary": "#ffffff",
        "on-error": "#ffffff",
        "primary": "#006a36",
        "surface-variant": "#e2e3e1"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "margin-desktop": "40px",
        "margin-mobile": "16px",
        "gutter": "24px",
        "container-max": "1440px",
        "unit": "4px"
      },
      fontFamily: {
        "stat-sm": ["JetBrains Mono", "monospace"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "stat-lg": ["JetBrains Mono", "monospace"],
        "headline-md": ["Inter", "sans-serif"],
        "label-caps": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "display": ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      fontSize: {
        "stat-sm": ["14px", { lineHeight: "16px", fontWeight: "500" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "stat-lg": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "700" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "display": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }]
      }
    },
  },
  plugins: [],
}

export default config
