import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * O único alias do projeto é `@` → `src` (ver `tsconfig.json`). Duplicar isso
 * aqui em vez de puxar um plugin de resolução de tsconfig evita depender de
 * mais uma peça só para resolver uma linha de mapeamento.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
