import type { Config } from "tailwindcss";

// EDM brand tokens — pure white ground, #083819 green as the only accent.
// Token keys are retained so existing utility classes keep compiling;
// values are repointed to the locked brand system (no bone/sage/bronze).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand green family.
        // `on` is the label colour for text sitting ON an emerald surface —
        // white at 70%, the same device the website footer uses. It exists
        // because `sage` was repointed to #083819, which made every
        // `text-sage` label on a `bg-emerald` tile invisible at 1:1.
        emerald: { DEFAULT: "#083819", dark: "#052614", soft: "#ffffff", on: "#B5C3BA" },
        // Dark ink for body and secondary text
        charcoal: { DEFAULT: "#0f231b", muted: "#5C6F66" },
        // "bone" retained as a key but is now pure white ground
        bone: "#FFFFFF",
        // Former sage/bronze accents collapse into the green family
        sage: "#083819",
        bronze: "#083819",
        // Neutral hairline, plus a stronger edge for boundaries that carry meaning
        line: { DEFAULT: "#E4E6E0", strong: "#C1C8C3" },
        // Ordinal ramp for ordered categories (pipeline stages, tiers, bands).
        // One hue — #083819 stepped toward white — so the reader sees the order
        // in the colour. No second hue is introduced.
        stage: { 1: "#97AB9E", 2: "#6B8875", 3: "#3E644C", 4: "#083819" },
      },
      fontFamily: { sans: ["Montserrat", "system-ui", "sans-serif"] },
      borderRadius: { card: "4px" },
    },
  },
  plugins: [],
};
export default config;
