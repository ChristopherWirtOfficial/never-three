import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** CI sets `VITE_BASE_PATH=/repo-name/` for https://user.github.io/repo-name/ */
function viteBase(raw: string | undefined): string {
  if (!raw || raw === "/") return "/";
  const trimmed = raw.replace(/\/+$/, "");
  return `${trimmed}/`;
}
const base = viteBase(process.env.VITE_BASE_PATH);

export default defineConfig({
  plugins: [react()],
  base,
});
