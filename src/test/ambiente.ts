import { uriDoBancoDescartavel } from "@/test/banco-descartavel";

/**
 * O ambiente do processo que roda os testes de integração.
 *
 * ⚠️ Isto tem que acontecer ANTES de `payload.config.ts` ser importado: a
 * configuração lê `DATABASE_URI` no momento em que o módulo é avaliado, e um
 * `process.env` ajustado depois disso apontaria o teste para o banco de
 * desenvolvimento sem mudar uma linha de log. É por isso que a atribuição mora
 * num `setupFiles` — o Vitest o executa antes de importar o arquivo de teste —
 * e não dentro do próprio teste.
 *
 * O segredo é fixo e não vem do `.env`: aqui ele só assina sessão de painel que
 * ninguém abre, e depender do `.env` faria o teste falhar numa máquina limpa.
 */
process.env.DATABASE_URI = uriDoBancoDescartavel();
process.env.PAYLOAD_SECRET ??= "segredo-de-teste-sem-valor-nenhum";
