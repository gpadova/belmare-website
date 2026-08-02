import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * A prova de PRA-115, e só ela.
 *
 * ⚠️ **ISTO É UM ARQUIVO DE CONFIGURAÇÃO SEPARADO PORQUE O ISOLAMENTO É O
 * PONTO.** A prova exige o `docker-compose.yml` de pé e o painel servindo. Numa
 * máquina sem Docker ela não tem como passar — e um teste que fica vermelho por
 * falta de ambiente ensina a suíte inteira a ser ignorada.
 *
 * Pendurar isso no `vitest.config.ts`, mesmo como um terceiro projeto, não
 * resolveria: `vitest run` roda todos os projetos, e `pnpm test` deixaria de
 * ser verde numa máquina limpa. Aqui, `vitest run` NUNCA vê este arquivo — a
 * prova só roda quando alguém a chama pelo nome, com `pnpm test:prova`.
 *
 * O nome dos arquivos também não colide de propósito: a prova é `*.prova.ts`, e
 * o `puro` do `vitest.config.ts` procura `*.test.ts`. Não há glob que a apanhe
 * por engano.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    name: "prova",
    include: ["src/**/*.prova.ts"],

    /* Mover 24 MB duas vezes e conferir o resumo leva mais do que os 5 s
       padrão, e o alvo é um contêiner que pode estar acordando. */
    testTimeout: 120_000,
    hookTimeout: 120_000,
    fileParallelism: false,
  },
});
