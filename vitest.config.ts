import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * O único alias do projeto é `@` → `src` (ver `tsconfig.json`). Duplicar isso
 * aqui em vez de puxar um plugin de resolução de tsconfig evita depender de
 * mais uma peça só para resolver uma linha de mapeamento. `@payload-config` é o
 * segundo, e existe pelo mesmo motivo: é assim que o Payload se importa.
 */
const alias = {
  "@": fileURLToPath(new URL("./src", import.meta.url)),
  "@payload-config": fileURLToPath(
    new URL("./src/payload.config.ts", import.meta.url),
  ),
};

/**
 * Dois projetos, e a divisão é o custo de rodar, não o assunto do teste.
 *
 * **puro** — mapper e ajudantes. Sem banco, sem framework, milissegundos. É onde
 * cabem os estados que um banco esconderia: um upload que voltou só como
 * identificador, um arquivo sem tamanho gravado.
 *
 * **integração** — as consultas contra um Payload de verdade sobre um Postgres
 * descartável, semeado pela API local. É também onde a recusa de validação é
 * provada: gravar entrada inválida pela API local tem que ser recusado, que é a
 * mesma garantia que o operador vê como "não salvou".
 *
 * ⚠️ A separação existe porque o segundo precisa de um `globalSetup` que cria e
 * apaga banco, e de um tempo limite dez vezes maior — pendurar isso no projeto
 * inteiro faria a suíte rápida pagar o preço da lenta em toda execução.
 */
export default defineConfig({
  resolve: { alias },
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: "puro",
          include: ["src/**/*.test.ts"],
          exclude: ["src/**/*.integracao.test.ts"],
        },
      },
      {
        resolve: { alias },
        test: {
          name: "integracao",
          include: ["src/**/*.integracao.test.ts"],
          globalSetup: ["src/test/banco-descartavel.ts"],
          setupFiles: ["src/test/ambiente.ts"],

          /* Criar o esquema do zero e subir o Payload leva dezenas de segundos
             na primeira vez; o padrão de 5 s derrubaria a suíte por relógio e
             não por defeito. */
          testTimeout: 60_000,
          hookTimeout: 120_000,

          /* Um banco só, um esquema só: os arquivos não podem correr juntos. */
          fileParallelism: false,
        },
      },
    ],
  },
});
