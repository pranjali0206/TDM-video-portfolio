/**
 * Joyful card colourways built from the semantic palette in styles.css.
 * `fg` is the text colour that reads on `bg`; `pop` is a contrasting
 * highlight (stars, icons) that stays visible on that background.
 */
export const tones = {
  coral: { bg: "var(--glow)", fg: "var(--ink)", pop: "var(--ink)" },
  ink: { bg: "var(--ink)", fg: "var(--ivory)", pop: "var(--glow)" },
  lime: { bg: "var(--teal)", fg: "var(--ink)", pop: "var(--glow)" },
  deep: { bg: "var(--deep-teal)", fg: "white", pop: "var(--teal)" },
  teal: { bg: "var(--accent)", fg: "var(--ink)", pop: "var(--ink)" },
  blush: {
    bg: "color-mix(in oklab, var(--glow) 40%, var(--ivory))",
    fg: "var(--ink)",
    pop: "var(--glow)",
  },
  mint: { bg: "var(--secondary)", fg: "var(--ink)", pop: "var(--deep-teal)" },
  paper: { bg: "white", fg: "var(--ink)", pop: "var(--glow)" },
};

export type Tone = keyof typeof tones;
