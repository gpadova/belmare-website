/**
 * Os dois papéis do painel, e a fronteira entre eles — decisão 14 da spec
 * (PRA-125).
 *
 * ⚠️ **O CRITÉRIO NÃO É "AVANÇADO", É "IRREVERSÍVEL DO JEITO QUE O OPERADOR NÃO
 * ENXERGA".** Um `slug` é uma URL, e uma URL que muda quebra um link que
 * alguém já mandou por e-mail. Apagar uma representada tira do ar seis
 * superfícies de conteúdo de uma vez — a própria página, mais peça, arquivo 3D
 * e acabamento, que pendem dela. O painel inteiro foi desenhado para o
 * OPERADOR: a pessoa da Belmare que o abre uma vez por mês para trocar prosa e
 * fotografia — ver a nota de topo de `collections/representadas.ts` e as
 * outras coleções do acervo. `administrador` é o desenvolvedor, e só ele
 * alcança o que muda a ESTRUTURA do site ou as URLs dele: criar e apagar
 * representada, e editar o `slug` dela.
 *
 * ⚠️ **NA DÚVIDA, O OPERADOR CONSEGUE.** Um papel que tranca o operador fora
 * do próprio trabalho é pior do que nenhum papel — ele volta a mandar
 * mensagem para o desenvolvedor, que é exatamente o problema que este painel
 * existe para tirar do caminho. Por isso a lista do que É de administrador é
 * curta e literal (procure `apenasAdministrador` no projeto para vê-la
 * inteira), e tudo que não está nela continua aberto aos dois papéis — só
 * fechado para quem não tem sessão nenhuma (`estaAutenticado`).
 *
 * ⚠️ **ISTO É FRONTEIRA DE API, NÃO COSMÉTICA DE PAINEL.** As funções daqui
 * entram em `access` de coleção e de campo — a camada que o Payload de fato
 * confere em toda escrita, pela API local, REST ou GraphQL. Esconder um botão
 * no admin sem isto por trás deixaria a mesma escrita passar por quem soubesse
 * chamar a API direto; `admin.condition`/`admin.hidden`, quando aparecem, são
 * só a apresentação — nunca a única guarda.
 */

/** As duas contas que o painel conhece. */
export type Papel = "operador" | "administrador";

/** O bastante de um usuário para decidir o papel — nunca o tipo gerado
 *  inteiro (`payload-types.ts`): `collections/` não importa dele, como o
 *  resto do projeto já não importa (ver `identidadeDoRelacionamento` em
 *  `collections/apoio.ts`, a mesma tática). */
type UsuarioComPapel = { papel?: string | null } | null | undefined;

/**
 * Esta conta é administradora?
 *
 * ⚠️ **CONTA SEM PAPEL GRAVADO CONTA COMO ADMINISTRADORA — decisão deliberada,
 * não lacuna.** O campo `papel` não existia antes deste ticket, então toda
 * conta de hoje foi criada por quem construiu o painel (PRA-115 a PRA-124),
 * nunca pela Belmare — o cadastro da operadora ainda não existe. Tratar o
 * papel ausente como `operador` DESTRANCARIA a si mesma a única conta que hoje
 * consegue entrar no painel: ela perderia, no exato commit deste ticket, a
 * capacidade de criar e apagar representada e de editar slug — sem que
 * ninguém tivesse decidido isso, e sem aviso nenhum. Uma conta NOVA, a partir
 * de agora, grava `operador` de propósito (o `defaultValue` do campo em
 * `collections/usuarios.ts`); só uma conta ANTERIOR a este ticket chega aqui
 * sem o campo gravado, e ela mantém o acesso total que sempre teve.
 *
 * Um valor gravado que não seja nenhum dos dois papéis conhecidos (corrupção,
 * migração malfeita) cai no outro lado — nega, não concede. É a assimetria
 * certa: ausência de campo é um estado esperado e coberto; um valor estranho
 * não é.
 */
export function ehAdministrador(usuario: UsuarioComPapel): boolean {
  if (!usuario) return false; // sem sessão nenhuma — nunca administrador
  if (usuario.papel === undefined || usuario.papel === null) return true; // conta anterior a este ticket
  return usuario.papel === "administrador";
}

/** Alguém logado no painel — os dois papéis, nunca o visitante do site. Toda
 *  escrita deste projeto passava sem isto até este ticket: nenhuma coleção
 *  além de `representadas`/`paginas`/os globais tinha SEQUER um `access.read`
 *  próprio, e nenhuma tinha `access.update`/`create`/`delete` — o padrão do
 *  Payload quando o campo fica ausente é liberar geral, não recusar. */
export function estaAutenticado({ req }: { req: { user?: unknown } }): boolean {
  return Boolean(req.user);
}

/**
 * A recusa que só uma conta administradora atravessa.
 *
 * Serve tanto em `access` de coleção (criar/apagar representada, criar/apagar
 * usuário) quanto em `access` de campo (o `slug` da representada, o `papel`
 * do próprio usuário) — as duas formas aceitam a mesma assinatura `{ req }`.
 */
export function apenasAdministrador({ req }: { req: { user?: unknown } }): boolean {
  return ehAdministrador(req.user as UsuarioComPapel);
}
