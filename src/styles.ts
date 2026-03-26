export const GLOBAL_CSS = `
  @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
  @keyframes pulse{0%,100%{box-shadow:0 0 16px #44ffbb22}50%{box-shadow:0 0 36px #44ffbb44,0 0 70px #44ffbb11}}
  @keyframes spin{0%{transform:scale(1) rotate(0)}50%{transform:scale(.85) rotate(180deg)}100%{transform:scale(1) rotate(360deg)}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes stunPulse{0%,100%{opacity:.6}50%{opacity:1}}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body,#root{height:100%;overflow:hidden;background:#08080f}
  ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#444;border-radius:3px}
`;
