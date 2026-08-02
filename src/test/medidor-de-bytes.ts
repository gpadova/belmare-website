import { createServer, connect } from "node:net";

/**
 * Quantos bytes o navegador manda para a APLICAÇÃO — a balança da prova de
 * PRA-115.
 *
 * ⚠️ Sem isto, "o arquivo não passou pela função" é uma afirmação. O log do Next
 * lista as requisições que chegaram, não o peso delas; o painel do navegador
 * mostra para onde o `PUT` foi, não o que a aplicação deixou de receber. Falta
 * o número do outro lado da frase — e é ele que decide o ticket, porque a
 * função serverless da Vercel recusa corpo acima de 4,5 MB e o catálogo tem
 * 24 MB.
 *
 * O medidor é um repasse de TCP posto entre o navegador e o Next: o navegador
 * fala com ele em 3000, ele fala com o Next em 3100, e conta os bytes que
 * atravessam em cada direção. Contar em TCP, e não dentro do Next, é de
 * propósito — um contador dentro da aplicação contaria o que a aplicação
 * escolheu ler, e o que se quer medir é o que ela recebeu.
 *
 * O veredito é uma comparação de dois números: o total que subiu para a
 * aplicação durante a sessão inteira do painel, contra os 25.165.824 bytes que
 * o bucket recebeu num `PUT` só. Se o primeiro for menor que o segundo, o
 * arquivo não pode ter passado pela função — não há onde ele caberia.
 *
 * ⚠️ Isto é instrumento de prova, não peça do site. Não entra em produção e não
 * é atravessado por `pnpm dev` normal; sobe à mão, pelo comando do README.
 */

const ESCUTA = Number(process.env.MEDIDOR_PORTA ?? 3000);
const DESTINO = Number(process.env.MEDIDOR_DESTINO ?? 3100);

let doNavegadorParaAplicacao = 0;
let daAplicacaoParaNavegador = 0;
let conexoes = 0;

/** O maior corpo que uma conexão só carregou para cima. */
let maiorSubidaNumaConexao = 0;

const servidor = createServer((doNavegador) => {
  conexoes += 1;
  let subidaDestaConexao = 0;

  const paraONext = connect(DESTINO, "127.0.0.1");

  doNavegador.on("data", (pedaco: Buffer) => {
    doNavegadorParaAplicacao += pedaco.length;
    subidaDestaConexao += pedaco.length;
    if (subidaDestaConexao > maiorSubidaNumaConexao) {
      maiorSubidaNumaConexao = subidaDestaConexao;
    }
  });
  paraONext.on("data", (pedaco: Buffer) => {
    daAplicacaoParaNavegador += pedaco.length;
  });

  doNavegador.pipe(paraONext);
  paraONext.pipe(doNavegador);

  const encerrar = () => {
    doNavegador.destroy();
    paraONext.destroy();
  };
  doNavegador.on("error", encerrar);
  paraONext.on("error", encerrar);
  doNavegador.on("close", encerrar);
  paraONext.on("close", encerrar);
});

function relatorio() {
  return {
    conexoes,
    doNavegadorParaAplicacao,
    daAplicacaoParaNavegador,
    maiorSubidaNumaConexao,
  };
}

/* Um `SIGUSR2` faz o medidor imprimir o placar sem morrer — é assim que a prova
   lê o número antes e depois do upload, e a diferença entre as duas leituras é
   o que a aplicação recebeu durante ele. */
process.on("SIGUSR2", () => {
  process.stdout.write(`MEDIDOR ${JSON.stringify(relatorio())}\n`);
});

for (const sinal of ["SIGINT", "SIGTERM"] as const) {
  process.on(sinal, () => {
    process.stdout.write(`MEDIDOR-FINAL ${JSON.stringify(relatorio())}\n`);
    process.exit(0);
  });
}

servidor.listen(ESCUTA, "127.0.0.1", () => {
  process.stdout.write(
    `MEDIDOR de pé: navegador -> 127.0.0.1:${ESCUTA} -> Next 127.0.0.1:${DESTINO}\n`,
  );
});
