import { identidadeDoRelacionamento, revalidarTags } from "@/collections/apoio";
import { tagsDaMudanca } from "@/lib/revalidacao";
import type { CollectionConfig } from "payload";

/**
 * Os projetos entregues, dentro do painel — a seção anulável de `/quem-somos`.
 *
 * ⚠️ **ESTA COLEÇÃO CITA REPRESENTADAS, NÃO PENDE DE UMA SÓ (decisão 10 da
 * spec).** Diferente de Peça, Arquivo3D e Acabamento, não existe aqui um campo
 * `representada` obrigatório e único: `marcas` é relacionamento múltiplo, e o
 * projeto registra quais fábricas foram de fato especificadas na obra — uma,
 * duas, as quatro. A árvore do site não ganha um quarto nível; ela ganha uma
 * coleção que aponta de volta para a raiz sem pertencer a nenhum galho dela.
 *
 * ⚠️ **O ENDEREÇO DA OBRA NÃO É CAMPO.** A obra é nomeada como é publicamente
 * conhecida — "Residência Costa", não a rua e o número. Cidade e estado bastam
 * para localizar; um endereço de cliente final de alto padrão é exatamente o
 * tipo de dado que este site não existe para publicar.
 *
 * ⚠️ **O CRÉDITO DO ARQUITETO É OBRIGATÓRIO, E NÃO É CORTESIA.** É o que faz o
 * multiplicador que enviou este projeto mandar o próximo — ver `creditoArquiteto`
 * abaixo. Nenhum outro campo desta coleção tem esse peso.
 *
 * ⚠️ **UMA FOTOGRAFIA MARCADA COMO MOCK NUNCA PODE SE APRESENTAR COMO OBRA
 * ENTREGUE — A MENTIRA MAIS GRAVE QUE ESTE SITE PODERIA CONTAR, E A QUE UM
 * ARQUITETO DETECTA PRIMEIRO.** Duas camadas, as duas deliberadas:
 *
 *   1. **Validação do campo `foto`, abaixo.** Recusa a PUBLICAÇÃO de um
 *      projeto cuja foto esteja marcada como referência no acervo. Só corre na
 *      publicação (decisão 8: `validate` de campo não roda em rascunho por
 *      padrão), então o operador ainda pode rascunhar com um placeholder
 *      antes da fotografia de verdade chegar.
 *   2. **`lib/projetos.ts#projetoDoPainel`, recalculada em toda leitura.** A
 *      validação acima só dispara quando ALGUÉM EDITA o projeto — mas o
 *      operador pode marcar `mock` numa Imagem depois, por engano ou reuso,
 *      sem tocar no projeto que a cita. Sem uma segunda camada que recalcula a
 *      cada leitura, essa foto passaria a mentir sozinha, sem ninguém ter
 *      salvado nada de errado. A mesma divisão de trabalho da decisão 5:
 *      validação de editor e segurança de tipo são dois trabalhos, os dois
 *      existem.
 *
 * ⚠️ **O PORTÃO DE TRÊS MORA EM `lib/projetos.ts#projetosPublicaveis`, NÃO
 * AQUI.** Esta coleção só declara e publica documentos; é a consulta em
 * `lib/projetos-consulta.ts` que embrulha a lista publicada com esse portão
 * antes de entregá-la à página. Menos de três projetos publicáveis e a
 * função devolve lista vazia — a seção não renderiza título, nem "em breve",
 * nem markup vazio.
 */
export const Projetos: CollectionConfig = {
  slug: "projetos",
  labels: { singular: "Projeto", plural: "Projetos" },
  admin: {
    useAsTitle: "obra",
    defaultColumns: ["obra", "cidade", "uf", "ano", "updatedAt"],
    group: "Quem somos",
    description:
      "Obras entregues em que peças das representadas foram especificadas e instaladas. A seção só entra no ar em /quem-somos no dia em que houver três projetos publicados — dois leem como exceção, e a página fica de pé sem esta seção até lá. Antes de publicar qualquer projeto, confirme três consentimentos: o direito de uso da fotografia, a autorização do cliente final e o crédito do arquiteto (campo obrigatório, abaixo). Projeto residencial de alto padrão costuma ter cláusula de confidencialidade — confirme antes de publicar, não depois.",
  },
  access: {
    // Mesma garantia de `collections/representadas.ts`: sem sessão de painel,
    // rascunho nunca volta, nem pedindo `draft=true` direto na API.
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },

  /**
   * ⚠️ **OS HOOKS SÃO CHAMADORES FINOS DE `tagsDaMudanca`, NUNCA A ROTA.** Um
   * projeto aparece num lugar só — a seção de `/quem-somos` — e é essa
   * etiqueta única que a função pura devolve para `colecao: "projetos"`. Se
   * um dia um projeto passar a aparecer em outro lugar, o fan-out muda em
   * `lib/revalidacao.ts`, e nenhuma linha muda aqui.
   */
  hooks: {
    afterChange: [
      ({ doc }) => {
        // Salvar rascunho passa por este hook igual a publicar; só a
        // publicação revalida (ver a mesma nota em `collections/pecas.ts`).
        if (doc._status !== "published") return;

        revalidarTags(tagsDaMudanca({ colecao: "projetos" }));
      },
    ],
    afterDelete: [
      () => {
        revalidarTags(tagsDaMudanca({ colecao: "projetos" }));
      },
    ],
  },

  /* Rascunho e versão, como decisão 8 pede por padrão — mesma nota de
     `collections/pecas.ts`: um projeto é consultado como documento de topo,
     nunca populado por relacionamento dentro da leitura de outra coisa, então
     a exceção que tirou rascunho de Imagens/Arquivos (PRA-118) não se aplica
     aqui. */
  versions: {
    drafts: {
      autosave: false,
    },
  },

  defaultSort: "-ano",

  fields: [
    {
      name: "obra",
      type: "text",
      required: true,
      label: "Nome da obra",
      admin: {
        description:
          "Como a obra é nomeada publicamente — \"Residência Costa\", \"Cobertura Beira-Mar\". Nunca o endereço: cidade e estado, logo abaixo, bastam para localizar.",
      },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== ""
          ? true
          : "Escreva o nome da obra antes de salvar. É o título do card na seção de projetos entregues.",
    },
    {
      name: "cidade",
      type: "text",
      required: true,
      label: "Cidade",
      admin: {
        description: "A cidade onde a obra foi entregue. Sem rua, sem número.",
      },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== ""
          ? true
          : "Escreva a cidade da obra antes de salvar.",
    },
    {
      name: "uf",
      type: "text",
      required: true,
      label: "Estado (UF)",
      admin: {
        position: "sidebar",
        description: "A sigla do estado — \"SC\", \"PR\", \"RS\".",
      },
      validate: (valor: string | null | undefined) => {
        const texto = valor?.trim() ?? "";
        if (texto === "") return "Escreva a sigla do estado antes de salvar.";
        if (!/^[A-Z]{2}$/.test(texto))
          return "Use as duas letras MAIÚSCULAS da sigla do estado — \"SC\", não \"Santa Catarina\" nem \"sc\".";
        return true;
      },
    },
    {
      name: "ano",
      type: "number",
      required: true,
      label: "Ano de entrega",
      admin: {
        position: "sidebar",
        description: "O ano em que a obra foi entregue.",
      },
      validate: (valor: number | null | undefined) => {
        if (typeof valor !== "number" || !Number.isInteger(valor))
          return "Escreva o ano de entrega, com quatro dígitos — 2025.";
        if (valor < 1900 || valor > 2200)
          return "Escreva um ano plausível de entrega — quatro dígitos, entre 1900 e 2200.";
        return true;
      },
    },
    {
      name: "marcas",
      type: "relationship",
      relationTo: "representadas",
      hasMany: true,
      required: true,
      label: "Representadas especificadas",
      admin: {
        description:
          "Quais fábricas representadas pela Belmare foram DE FATO especificadas nesta obra — uma, duas ou as quatro. Não é lista de patrocínio: só quem entrou no projeto de verdade.",
      },

      /* ⚠️ Um relacionamento múltiplo `required` não garante sozinho que a
         lista tenha ao menos um item — só que o campo não veio ausente. Um
         projeto que não cita representada nenhuma não tem o que fazer nesta
         coleção (ver a nota de topo do arquivo: "cita representadas, não
         pende de uma só" pressupõe pelo menos uma). */
      validate: (valor: unknown) => {
        const bruto = Array.isArray(valor) ? valor : [];
        const identidades = bruto
          .map((item) => identidadeDoRelacionamento(item))
          .filter((id) => id !== undefined);

        return identidades.length > 0
          ? true
          : "Escolha ao menos uma representada especificada nesta obra. Um projeto sem marca nenhuma não tem o que citar.";
      },
    },
    {
      name: "foto",
      type: "upload",
      relationTo: "imagens",
      required: true,
      label: "Fotografia",
      admin: {
        description:
          "A fotografia da obra entregue. Nunca uma imagem de referência: se a foto escolhida estiver marcada como referência (mock) no acervo, a publicação deste projeto é recusada. Confirme o direito de uso da imagem e a autorização do cliente final antes de escolher.",
      },

      /* ⚠️ Só corre na PUBLICAÇÃO — rascunho não roda `validate` de campo por
         padrão (decisão 8), e é assim que o operador consegue rascunhar com um
         placeholder antes da foto de verdade chegar. Ver a nota completa no
         topo do arquivo: esta é a primeira das duas camadas contra apresentar
         mock como obra entregue. */
      validate: async (
        valor: unknown,
        opcoes: {
          req?: { payload?: { findByID: (args: never) => Promise<unknown> } };
        },
      ) => {
        const id = identidadeDoRelacionamento(valor);
        if (id === undefined)
          return "Escolha a fotografia da obra. Sem ela o card fica vazio na seção.";

        const payload = opcoes.req?.payload;
        if (!payload) return true;

        const imagem = await payload
          .findByID({ collection: "imagens", id, depth: 0 } as never)
          .then((doc) => doc as { mock?: boolean | null } | null)
          .catch(() => null);

        return imagem?.mock !== true
          ? true
          : "Esta fotografia está marcada como imagem de referência (mock) no acervo. Um projeto entregue não pode ser publicado com uma foto de referência — troque a marcação da imagem no acervo ou escolha outra fotografia antes de publicar.";
      },
    },
    {
      name: "creditoArquiteto",
      type: "text",
      required: true,
      label: "Crédito do arquiteto",
      admin: {
        description:
          "O escritório ou profissional responsável pelo projeto — \"Estúdio Galho Arquitetura\". Campo obrigatório: não é cortesia, é o que faz o multiplicador que enviou este projeto mandar o próximo.",
      },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== ""
          ? true
          : "Escreva o crédito do arquiteto ou escritório responsável. Este projeto não pode ser publicado sem ele — é o crédito que faz o multiplicador voltar a especificar.",
    },
  ],
};
