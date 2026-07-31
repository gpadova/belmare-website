import type { CollectionConfig } from "payload";

import { apenasAdministrador, ehAdministrador, estaAutenticado } from "@/collections/papeis";

/**
 * Quem entra no painel.
 *
 * A coleção continua deliberadamente rasa: e-mail e senha vêm da autenticação
 * do Payload, o nome existe para o histórico de versões dizer "Fulano
 * publicou" em vez de mostrar um e-mail — e agora o `papel`, que PRA-125
 * acrescenta, decide o que essa conta alcança no resto do painel (ver
 * `collections/papeis.ts` para a fronteira inteira).
 *
 * ⚠️ **A PRÓPRIA COLEÇÃO PRECISA DE GUARDA, OU O PAPEL É DECORAÇÃO.** Sem o
 * `access` abaixo, o padrão do Payload para toda escrita ausente é liberar
 * geral — qualquer chamada não autenticada à API conseguiria criar uma conta
 * `administrador` direto, e o papel que este ticket introduz não protegeria
 * nada. A criação do PRIMEIRO usuário do painel continua funcionando sem
 * sessão: o Payload tem uma operação própria para isso (`registerFirstUser`,
 * a tela "Create your first user"), que ignora `access.create` por completo
 * enquanto a coleção estiver vazia — confirmado na fonte do pacote, não
 * suposto. `access.create` abaixo só passa a valer a partir da segunda conta.
 */
export const Usuarios: CollectionConfig = {
  slug: "usuarios",
  labels: { singular: "Usuário", plural: "Usuários" },
  auth: true,
  admin: {
    useAsTitle: "nome",
    defaultColumns: ["nome", "email", "papel"],
    group: "Configuração",
  },

  access: {
    // Sem sessão, nem a lista de colegas se lê — antes deste ticket este
    // `access` nem existia, e o padrão do Payload para leitura ausente
    // também é liberar geral: qualquer um conseguia enumerar e-mail e nome
    // de toda conta do painel sem estar logado.
    read: estaAutenticado,

    // Só administrador cria conta nova — ver a nota do "create your first
    // user" no topo do arquivo para a única exceção, que este `access` nem
    // chega a ver.
    create: apenasAdministrador,

    // Uma conta pode editar a si mesma (o nome, tipicamente); administrador
    // edita qualquer uma. O que NENHUMA das duas alcança por aqui é o
    // próprio `papel` — esse campo tem a guarda dele, mais abaixo, e vale
    // mesmo dentro da própria conta: um operador não se promove editando o
    // próprio cadastro.
    update: ({ req }) => {
      if (!req.user) return false;
      if (ehAdministrador(req.user)) return true;
      return { id: { equals: req.user.id } };
    },

    // Só administrador apaga conta — inclusive a própria: um painel sem
    // ninguém dentro é um estado pior do que uma conta indesejada.
    delete: apenasAdministrador,
  },

  fields: [
    {
      name: "nome",
      type: "text",
      required: true,
      label: "Nome",
      admin: {
        description:
          "Como você aparece no histórico de alterações. Nome e sobrenome bastam.",
      },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== ""
          ? true
          : "Escreva um nome. O histórico de versões mostra quem publicou cada mudança, e um e-mail no lugar do nome não diz nada a quem for consultar depois.",
    },
    {
      name: "papel",
      type: "select",
      label: "Papel",
      options: [
        { label: "Operador", value: "operador" },
        { label: "Administrador", value: "administrador" },
      ],
      admin: {
        position: "sidebar",
        description:
          "Operador é a Belmare: edita prosa, fotografia, catálogo, peça, projeto e a composição das páginas livres — o painel inteiro foi desenhado para este papel. Administrador é o desenvolvedor: além de tudo isso, é o único que cria e apaga representada e edita o endereço (slug) dela — mudar ou apagar URL é o tipo de engano que o operador não tem como ver vindo. Deixe em branco ao criar uma conta nova e ela nasce operador; escolha \"Administrador\" de propósito quando for o caso. Contas de antes deste campo existir ficam em branco para sempre (nunca são alteradas por trás) e por isso contam como administrador — ver `collections/papeis.ts`.",
      },

      // ⚠️ Só administrador escreve o papel de alguém — ao criar E ao editar,
      // inclusive a própria conta. Sem `create` aqui, a guarda de coleção
      // (`access.create` acima) ainda impediria um operador de criar QUALQUER
      // conta — mas um segundo administrador criando outra conta poderia,
      // sem esta linha, tentar `papel` fora do que pretendia sem uma segunda
      // guarda conferindo; e sem `update`, `access.update` da coleção (que
      // deixa cada conta editar a SI MESMA) seria a porta por onde um
      // operador se promoveria sozinho. Acesso de campo é independente do
      // acesso de documento, e as duas guardas precisam concordar.
      access: {
        create: apenasAdministrador,
        update: apenasAdministrador,
      },

      /* ⚠️ **`defaultValue` FOI TESTADO E DESCARTADO DE PROPÓSITO — NÃO
         REINTRODUZIR SEM REABRIR ESTA NOTA.** A intuição óbvia seria
         `defaultValue: "operador"`, mas o adaptador Postgres do Payload
         traduz `defaultValue` de um campo `select` num `DEFAULT` de verdade
         na coluna do banco (confirmado empiricamente durante PRA-125, não
         suposto: `ALTER TABLE usuarios ADD COLUMN papel ... DEFAULT
         'operador'` some com as linhas SEM o campo, e um `push` sobre uma
         tabela que já tem gente dentro BACKFILA toda linha existente para
         `'operador'` no mesmo instante). Isso apaga exatamente o estado que
         a decisão deste ticket depende de existir — "conta de antes deste
         campo não tem papel gravado" — e trancaria a única conta que hoje
         consegue entrar no painel fora das próprias capacidades, no exato
         commit deste ticket. Sem `defaultValue`, uma coluna nova nasce sem
         `DEFAULT` nenhum, e uma linha anterior à migração fica genuinamente
         `null` (confirmado do mesmo jeito). O hook abaixo dá o mesmo
         resultado de UX para conta NOVA — nasce operador quando ninguém
         escolhe — mas só na hora de CRIAR, na camada de aplicação, nunca no
         esquema do banco. */
      hooks: {
        beforeValidate: [
          ({ value, operation }) =>
            operation === "create" && (value === undefined || value === null)
              ? "operador"
              : value,
        ],
      },
    },
  ],
};
