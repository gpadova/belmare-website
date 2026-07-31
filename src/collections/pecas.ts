import {
  identidadeDoRelacionamento,
  revalidarTags,
  slugDaRepresentadaPai,
} from "@/collections/apoio";
import { tagsDaMudanca } from "@/lib/revalidacao";
import type { CollectionConfig } from "payload";

/**
 * As peças em destaque, dentro do painel.
 *
 * ⚠️ **PENDE DE UMA REPRESENTADA SÓ, E NADA ATRAVESSA (decisão 10 da spec).**
 * Não existe taxonomia global de material — `materiais` é legenda de texto
 * livre, nunca filtro, nunca navegação, nunca parâmetro de URL — e a
 * `categoria` só existe nas palavras da PRÓPRIA fábrica: o campo abaixo recusa
 * qualquer valor que não esteja no vocabulário desta representada, e não olha
 * para o vocabulário de nenhuma outra. É assim que o filtro nunca sai da
 * marca e que uma peça se cadastra sem esperar a taxonomia da fábrica ao lado.
 *
 * ⚠️ **UMA PEÇA SE CADASTRA EM DOIS MINUTOS.** Cinco campos e meio — nome,
 * marca, categoria, foto, ambiente opcional, materiais opcional. Resistir a
 * acrescentar campo é a regra, não a exceção: cada campo novo é mais uma
 * coisa que o operador pode errar antes da fábrica seguinte poder publicar.
 */
export const Pecas: CollectionConfig = {
  slug: "pecas",
  labels: { singular: "Peça", plural: "Peças" },
  admin: {
    useAsTitle: "nome",
    defaultColumns: ["nome", "representada", "categoria", "updatedAt"],
    group: "Marcas",
    description:
      "As peças em destaque de cada representada. A categoria só aceita os termos que a própria fábrica já declarou no vocabulário dela — o filtro nunca atravessa para outra marca.",
  },
  access: {
    // Mesma garantia de `collections/representadas.ts`: sem sessão de painel,
    // rascunho nunca volta, nem pedindo `draft=true` direto na API.
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },

  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Ver a mesma nota em `collections/representadas.ts`: salvar rascunho
        // passa por este hook igual a publicar, e só a publicação revalida.
        if (doc._status !== "published") return;

        const slug = await slugDaRepresentadaPai(req.payload, doc.representada);
        if (slug === undefined) return;

        revalidarTags(tagsDaMudanca({ colecao: "pecas", representadaSlug: slug }));
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const slug = await slugDaRepresentadaPai(req.payload, doc.representada);
        if (slug === undefined) return;

        revalidarTags(tagsDaMudanca({ colecao: "pecas", representadaSlug: slug }));
      },
    ],
  },

  /* Rascunho e versão, como decisão 8 pede por padrão — e diferente de
     Imagens/Arquivos (PRA-118), sem o problema que os tirou de lá: uma peça
     não é populada por relacionamento DENTRO da leitura de outra coisa, ela é
     consultada como documento de topo por uma função própria (o mesmo desenho
     de `buscarRepresentadaPorSlug`), com `_status: published` explícito no
     `where`. A pergunta de visibilidade aninhada que justificou a exceção não
     se aplica aqui. */
  versions: {
    drafts: {
      autosave: false,
    },
  },

  defaultSort: "nome",

  fields: [
    {
      name: "representada",
      type: "relationship",
      relationTo: "representadas",
      required: true,
      hasMany: false,
      index: true,
      label: "Representada",
      admin: {
        position: "sidebar",
        description:
          "A fábrica a quem esta peça pertence. A categoria abaixo só aceita as palavras que ESTA fábrica já declarou no próprio vocabulário.",
      },
    },
    {
      name: "nome",
      type: "text",
      required: true,
      label: "Nome da peça",
      admin: {
        description: "Como a peça se chama — \"Jubarte\", \"Vitta\", \"Bistrô\".",
      },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== ""
          ? true
          : "Escreva o nome da peça antes de salvar.",
    },
    {
      name: "categoria",
      type: "text",
      required: true,
      label: "Categoria",
      admin: {
        description:
          "A categoria desta peça, EXATAMENTE como está escrita no vocabulário desta representada — \"Espreguiçadeiras\", \"Vitta\". Uma categoria nova só existe depois de cadastrada no vocabulário da própria fábrica, na página dela.",
      },
      validate: async (
        valor: string | null | undefined,
        opcoes: {
          siblingData?: unknown;
          req?: {
            payload?: { findByID: (args: never) => Promise<unknown> };
          };
        },
      ) => {
        const texto = valor?.trim() ?? "";
        if (texto === "")
          return "Escreva a categoria desta peça, ou escolha uma das que já existem no vocabulário da fábrica.";

        const representadaId = identidadeDoRelacionamento(
          (opcoes.siblingData as { representada?: unknown } | undefined)
            ?.representada,
        );
        // Sem representada escolhida ainda: o `required` dela recusa por
        // conta própria, e apontar o mesmo problema duas vezes só confunde.
        if (representadaId === undefined) return true;

        const payload = opcoes.req?.payload;
        if (!payload) return true;

        const representada = await payload
          .findByID({
            collection: "representadas",
            id: representadaId,
            depth: 0,
          } as never)
          .then(
            (doc) =>
              doc as {
                nome?: string;
                vocabulario?: {
                  grupos?: { itens?: { nome?: string }[] }[];
                };
              } | null,
          )
          .catch(() => null);

        const categorias = new Set(
          (representada?.vocabulario?.grupos ?? []).flatMap((grupo) =>
            (grupo.itens ?? [])
              .map((item) => item.nome?.trim())
              .filter((nome): nome is string => Boolean(nome)),
          ),
        );

        if (categorias.size === 0)
          return `${representada?.nome ?? "Esta fábrica"} ainda não tem vocabulário cadastrado. Cadastre as categorias dela na própria página da representada antes de cadastrar uma peça.`;

        return categorias.has(texto)
          ? true
          : `"${texto}" não está no vocabulário de ${representada?.nome ?? "esta fábrica"}. Use uma das categorias já cadastradas na página dela — o filtro de peças nunca sai da marca, e uma categoria nova só existe depois de entrar lá.`;
      },
    },
    {
      name: "foto",
      type: "upload",
      relationTo: "imagens",
      required: true,
      label: "Fotografia",
      admin: {
        description: "A fotografia desta peça.",
      },
      validate: (valor: unknown) =>
        identidadeDoRelacionamento(valor) !== undefined
          ? true
          : "Escolha a fotografia da peça. Sem ela o card fica vazio na grade.",
    },
    {
      name: "ambiente",
      type: "select",
      label: "Ambiente",
      options: [
        { label: "Externo", value: "externo" },
        { label: "Interno", value: "interno" },
      ],
      admin: {
        description:
          "Só quando a própria fábrica separa o catálogo por ambiente, como a GDA. Deixe em branco se a marca não faz essa distinção.",
      },
    },
    {
      name: "materiais",
      type: "text",
      label: "Materiais",
      admin: {
        description:
          "Legenda descritiva e opcional — \"Alumínio fundido e corda náutica\". Texto livre, não uma lista fechada: não filtra, não navega e nunca vira parâmetro de URL. Se a fábrica não informou, deixe em branco — nada quebra.",
      },
    },
  ],
};
