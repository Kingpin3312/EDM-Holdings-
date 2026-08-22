import type { Config } from "tailwindcss";

// EDM brand tokens — pure white ground, #083819 green as the only accent.
// Token keys are retained so existing utility classes keep compiling;
// values are repointed to the locked brand system (no bone/sage/bronze).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand green family
        emerald: { DEFAULT: "#083819", dark: "#052614", soft: "#ffffff" },
        // Dark ink for body and secondary text
        charcoal: { DEFAULT: "#0f231b", muted: "#5C6F66" },
        // "bone" retained as a key but is now pure white ground
        bone: "#FFFFFF",
        // Former sage/bronze accents collapse into the green family
        sage: "#083819",
        bronze: "#083819",
        // Neutral hairline
        line: "#E4E6E0",
      },
      fontFamily: { sans: ["Montserrat", "system-ui", "sans-serif"] },
      borderRadius: { card: "4px" },
    },
  },
  plugins: [],
};
export default config;
