import { execFileSync } from "node:child_process";

/**
 * O banco descartável dos testes de integração.
 *
 * ⚠️ **ELE É CRIADO E APAGADO PELO PRÓPRIO TESTE.** Nenhum passo manual, nenhum
 * arquivo de ambiente a preencher: `pnpm test` numa máquina recém-clonada faz o
 * banco nascer, roda, e o apaga no fim. O que o projeto já exige é o mesmo
 * Postgres local do desenvolvimento (`brew services start postgresql@14`) — o
 * teste só usa outro banco dentro dele.
 *
 * ⚠️ **NUNCA o banco de desenvolvimento e MUITO MENOS o de produção.** O nome é
 * outro, e o esquema é recriado do zero a cada execução: um teste que apagasse
 * o conteúdo em que alguém está trabalhando seria pior do que teste nenhum. Por
 * isso o nome é constante e não vem de variável de ambiente — variável de
 * ambiente é como se aponta um teste destrutivo para o Neon sem perceber.
 */
const NOME = "belmare_teste";

/**
 * O endereço do banco descartável.
 *
 * Herda servidor, porta e usuário de `DATABASE_URI` quando ela existe — é o que
 * faz o teste funcionar numa máquina cujo Postgres não está no padrão — e troca
 * só o nome do banco. Sem ela, cai no mesmo padrão do `.env.example`: Postgres
 * local, usuário do sistema.
 */
export function uriDoBancoDescartavel(): string {
  const modelo =
    process.env.DATABASE_URI ??
    `postgres://${process.env.USER ?? "postgres"}@localhost:5432/belmare_dev`;

  const endereco = new URL(modelo);
  endereco.pathname = `/${NOME}`;
  return endereco.toString();
}

/** `createdb` e `dropdb` falam com o servidor por bandeira, não por URL. */
function conexao(): string[] {
  const endereco = new URL(uriDoBancoDescartavel());
  return [
    ...(endereco.hostname ? ["-h", endereco.hostname] : []),
    ...(endereco.port ? ["-p", endereco.port] : []),
    ...(endereco.username ? ["-U", decodeURIComponent(endereco.username)] : []),
  ];
}

function comando(binario: string, argumentos: string[]) {
  execFileSync(binario, [...conexao(), ...argumentos], { stdio: "pipe" });
}

/**
 * ⚠️ `--force` derruba as conexões abertas antes de apagar. Sem ele o teardown
 * corre com o pool do Payload: o Postgres recusa com "database is being
 * accessed by other users" e a execução INTEIRA falha depois de todos os
 * testes terem passado. Uma suíte que fica vermelha por causa da faxina ensina
 * a ignorar o vermelho, que é o único jeito de um teste real passar
 * despercebido. Exige Postgres 13+; o projeto usa 14.
 */
function apagar() {
  comando("dropdb", ["--force", "--if-exists", NOME]);
}

/**
 * ⚠️ Apaga ANTES de criar, e não só no fim. Uma execução interrompida no meio
 * deixa o banco para trás, e o esquema velho de ontem passando por bom hoje é
 * um teste que mente sem falhar nenhuma vez.
 */
export default function bancoDescartavel() {
  apagar();
  comando("createdb", [NOME]);

  return apagar;
}
