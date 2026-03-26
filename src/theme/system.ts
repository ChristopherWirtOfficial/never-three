import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineGlobalStyles,
  defineKeyframes,
  defineTokens,
} from "@chakra-ui/react";

/** Game-specific keyframes (prefixed so we do not override Chakra defaults). */
const keyframes = defineKeyframes({
  neverShake: {
    "0%, 100%": { transform: "translateX(0)" },
    "20%": { transform: "translateX(-6px)" },
    "40%": { transform: "translateX(6px)" },
    "60%": { transform: "translateX(-3px)" },
    "80%": { transform: "translateX(3px)" },
  },
  neverPulse: {
    "0%, 100%": { boxShadow: "0 0 16px rgba(68, 255, 187, 0.13)" },
    "50%": {
      boxShadow:
        "0 0 36px rgba(68, 255, 187, 0.27), 0 0 70px rgba(68, 255, 187, 0.067)",
    },
  },
  neverSpin: {
    "0%": { transform: "scale(1) rotate(0deg)" },
    "50%": { transform: "scale(0.85) rotate(180deg)" },
    "100%": { transform: "scale(1) rotate(360deg)" },
  },
  neverFadeIn: {
    from: { opacity: 0, transform: "translateY(-6px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  neverStunPulse: {
    "0%, 100%": { opacity: 0.6 },
    "50%": { opacity: 1 },
  },
});

const colors = defineTokens.colors({
  never: {
    bg: { value: "#08080f" },
    border: { value: "#141428" },
    text: { value: "#dddddd" },
    dock: { value: "#0a0a14" },
    panel: { value: "#0e0e1c" },
    panelMuted: { value: "#0e0e1a" },
    panelBorder: { value: "#1a1a2e" },
    panelBorderMuted: { value: "#1a1a28" },
    panelBorderDim: { value: "#181828" },
    rowBorder: { value: "#222238" },
    subtle: { value: "#99aabb" },
    muted: { value: "#aaaabb" },
    dim: { value: "#667788" },
    stat: { value: "#556677" },
    hint: { value: "#8899aa" },
    streak: { value: "#44ffbb" },
    streakMuted: { value: "rgba(68, 255, 187, 0.4)" },
    streakDim: { value: "#444455" },
    streakBorder: { value: "rgba(68, 255, 187, 0.2)" },
    gold: { value: "#ffdd33" },
    goldMuted: { value: "#bb9900" },
    hex: { value: "#bb88ff" },
    hexMuted: { value: "#7744aa" },
    hexStreak: { value: "#9966cc" },
    danger: { value: "#ff4466" },
    dangerFace: { value: "#ff3355" },
    dangerSoft: { value: "#ff5577" },
    stun: { value: "#ff6677" },
    stunTrack: { value: "#1a0a10" },
    logHead: { value: "#ccccdd" },
    logBorder: { value: "#111118" },
    rolling: { value: "#556677" },
    armor: { value: "#ffbb33" },
    autoTeal: { value: "#88ddcc" },
    armorBlue: { value: "#99bbff" },
    multi: { value: "#ffdd88" },
    prestige: { value: "#bb99ff" },
    prestigeMuted: { value: "rgba(187, 153, 255, 0.53)" },
    prestigeBorder: { value: "rgba(187, 153, 255, 0.33)" },
    forgeLabel: { value: "#88aacc" },
    forgeDangerBg: { value: "#1a0e14" },
    btnDisabledBg: { value: "#0a0a14" },
    btnDisabledFg: { value: "#333333" },
    upgradeLabel: { value: "#88bbaa" },
    upgradeArrow: { value: "#336655" },
    tabInactive: { value: "#667788" },
    cooldownTrack: { value: "#14142a" },
    dieBorderLocked: { value: "#1a1a30" },
    dangerBadge: { value: "#ff8899" },
    textSoft: { value: "#ccddee" },
    textFaint: { value: "#ddeeff" },
    costMuted: { value: "#8899aa" },
    rowDeep: { value: "#12121e" },
    rowDeep2: { value: "#2a2a40" },
  },
});

const theme = defineConfig({
  theme: {
    keyframes,
    tokens: { colors },
  },
  globalCss: defineGlobalStyles({
    "*, *::before, *::after": { boxSizing: "border-box" },
    body: { margin: 0 },
    "html, body, #root": {
      height: "100%",
      overflow: "hidden",
      backgroundColor: "#08080f",
    },
    "::-webkit-scrollbar": { width: "3px" },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: "#444444",
      borderRadius: "3px",
    },
  }),
});

export const system = createSystem(defaultConfig, theme);
