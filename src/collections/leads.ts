import type { CollectionConfig } from "payload";

import { estaAutenticado } from "@/collections/papeis";
import { emailValido } from "@/lib/lead";
import { respostaDeExportacaoDeLeads } from "@/lib/lead-exportacao";

/**
 * Os leads recebidos pelo formulário do site — PRA-126.
 *
 * ⚠️ **A ÚNICA ESCRITA ANÔNIMA LEGÍTIMA DESTE PROJETO.** Toda outra coleção
 * exige sessão para criar (`collections/papeis.ts#estaAutenticado`), porque
 * toda outra escrita é trabalho de operador. Um Lead é diferente: quem o cria é
 * um visitante do site, sem login, preenchendo "quero revender" em `/contato` —
 * e negar essa escrita aqui derrubaria o próprio formulário. `access.create`
 * abaixo é a ÚNICA vez que este projeto libera criação sem `estaAutenticado`, e
 * é deliberado, não uma guarda esquecida.
 *
 * ⚠️ **LER, EDITAR E APAGAR CONTINUAM EXIGINDO SESSÃO — SEM EXCEÇÃO.** Uma
 * tabela de nome, e-mail e cidade de quem contatou a empresa, legível sem
 * login, é vazamento de dado pessoal, não conveniência. Diferente de
 * `paginas.ts`/`representadas.ts`, não existe uma segunda camada de "rascunho
 * nunca vaza" aqui — um Lead não tem `_status`, e a única condição de leitura é
 * ter sessão no painel.
 *
 * ⚠️ **A LISTA DE CAMPOS É FIXA — NÃO HÁ CONSTRUTOR DE FORMULÁRIO, E ESTE É O
 * ÚNICO LUGAR DO PROJETO ONDE ISSO É DECISÃO DE PROPÓSITO.** Todo o resto deste
 * painel existe para dar à Belmare controle sobre o que é campo; aqui é o
 * oposto — decisão 11 da spec (`PRODUCT.md`): "nome, e-mail, cidade e
 * escritório bastam — CPF não". Um formulário configurável é exatamente a
 * ferramenta que deixaria um operador bem-intencionado acrescentar um campo de
 * CPF porque uma fábrica pediu — uma violação de minimização de dado que ele
 * criaria sem perceber, num site cuja política de privacidade ainda aguarda
 * revisão jurídica (`collections/paginas.ts`, a seed de
 * `politica-de-privacidade`). Os campos vêm de `lib/lead.ts#DadosDoLead`, não
 * de um array editável — acrescentar um campo aqui é PR, não clique no painel.
 *
 * ⚠️ **SEM `versions`, DE PROPÓSITO.** Um Lead não é conteúdo editorial que se
 * rascunha e publica — é o registro de um contato que já aconteceu. Rascunho e
 * publicação não fazem sentido para uma linha que só existe porque alguém já
 * mandou.
 *
 * ⚠️ **NENHUMA ETIQUETA DE REVALIDAÇÃO SAI DAQUI.** Um lead não aparece em
 * nenhuma página pública do site — ele só é lido no painel e mandado por
 * e-mail. `lib/revalidacao.ts#tagsDaMudanca` não ganha um caso `"leads"` porque
 * não há superfície nenhuma para invalidar; acrescentar um reflexivamente
 * seria etiqueta morta, nunca invalidada por leitura nenhuma.
 *
 * ⚠️ **QUEM GRAVA É `lib/lead-acao.ts`, NÃO O PAINEL.** O Server Action valida
 * (chamando esta coleção com `overrideAccess: false`, a mesma fronteira que um
 * visitante anônimo de verdade atravessa), grava, e só então tenta o aviso por
 * e-mail via Resend — nessa ordem, e a ordem é o que garante que um Resend fora
 * do ar nunca perde o contato: o documento já está aqui antes de a tentativa de
 * e-mail sequer começar. Ver a nota grande no topo daquele arquivo.
 *
 * ⚠️ **`endpoints` ABAIXO É O "EXPORTED" DE "READ, FILTERED AND EXPORTED FROM
 * THE PANEL".** Ler e filtrar já vêm de graça da lista padrão do painel — é
 * `access.read` mais o que o Payload desenha sozinho. Exportar, não: sem um
 * plugin de import/export (que este projeto não instala), o Payload não
 * oferece CSV nenhum. `GET /api/leads/exportar`
 * (`lib/lead-exportacao.ts#respostaDeExportacaoDeLeads`) é o mínimo que fecha
 * o critério, e o botão em `components/painel/exportar-leads.tsx` é quem o
 * torna alcançável sem digitar URL — registrado em `admin.components`, logo
 * abaixo.
 */
export const Leads: CollectionConfig = {
  slug: "leads",
  labels: { singular: "Lead", plural: "Leads" },

  admin: {
    useAsTitle: "nome",
    defaultColumns: ["nome", "email", "cidade", "escritorio", "createdAt"],
    group: "Leads",
    description:
      "Os contatos recebidos pelo formulário do site — hoje só \"Quero revender\", em /contato. Todo lead chega aqui e, quando o e-mail comercial está cadastrado e o Resend está configurado, também por e-mail — mas esta lista é a cópia que sobrevive mesmo quando o e-mail falha ou nunca foi configurado.",
    components: {
      // O botão "Exportar CSV" acima da tabela — ver a nota sobre
      // `endpoints`, no topo do arquivo.
      beforeListTable: ["/components/painel/exportar-leads#ExportarLeads"],
    },
  },

  access: {
    // Ver a nota grande no topo do arquivo: a única criação sem sessão de
    // todo o projeto, e de propósito.
    create: () => true,

    read: estaAutenticado,
    update: estaAutenticado,
    delete: estaAutenticado,
  },

  defaultSort: "-createdAt",

  /**
   * O CSV de exportação — ver a nota grande no topo do arquivo. Vem ANTES
   * de qualquer coisa que o Payload acrescente sozinho (`generate:types`,
   * a leitura por id, `/count`…), porque é assim que `handleEndpoints`
   * decide qual rota vence quando duas casam com o mesmo caminho: o
   * primeiro `endpoint` da lista cujo padrão bate. Sem essa ordem,
   * `GET /api/leads/exportar` cairia no `/:id` embutido do Payload, que
   * tentaria ler um lead de id `"exportar"` em vez de rodar esta função —
   * `lead-exportacao.integracao.test.ts` prova a ordem, não só o handler.
   */
  endpoints: [
    {
      path: "/exportar",
      method: "get",
      handler: (req) =>
        respostaDeExportacaoDeLeads({ payload: req.payload, user: req.user }),
    },
  ],

  fields: [
    {
      name: "nome",
      type: "text",
      required: true,
      label: "Nome",
      admin: { description: "Como a pessoa se identificou no formulário." },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== "" ? true : "Escreva seu nome.",
    },
    {
      name: "email",
      type: "text",
      required: true,
      label: "E-mail",
      admin: { description: "Para onde a Belmare responde." },
      validate: (valor: string | null | undefined) => {
        if (!valor || valor.trim() === "")
          return "Escreva um e-mail para a Belmare poder responder.";
        return emailValido(valor) !== undefined
          ? true
          : "Confira o e-mail: falta o @, falta o ponto do domínio, ou sobrou um espaço.";
      },
    },
    {
      name: "cidade",
      type: "text",
      required: true,
      label: "Cidade",
      admin: { description: "De onde a pessoa fala." },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== "" ? true : "Escreva a cidade.",
    },
    {
      name: "escritorio",
      type: "text",
      required: true,
      label: "Empresa ou escritório",
      admin: {
        description:
          "A loja, o escritório de arquitetura ou a operação que a pessoa representa — o mínimo para a Belmare qualificar o contato (decisão 11 da spec). O mesmo campo serve os dois papéis: só o rótulo do formulário muda entre uma página de revenda e uma de arquiteto.",
      },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== "" ? true : "Escreva a empresa ou o escritório.",
    },
    {
      name: "consentimentoMarketing",
      type: "checkbox",
      label: "Aceita novidades por e-mail",
      defaultValue: false,
      admin: {
        description:
          "⚠️ Separado do envio da mensagem, de propósito: marcar ou não isto nunca muda se o contato é recebido. O formulário do site nunca vem com esta caixa pré-marcada — ver `components/formulario-de-lead.tsx`. Contatar a empresa não é, e não pode virar, inscrição automática em lista nenhuma.",
      },
    },
    {
      name: "origem",
      type: "group",
      label: "Origem",
      admin: {
        position: "sidebar",
        description:
          "De onde este contato veio. O visitante não vê nem edita estes dois campos — eles chegam ocultos no envio, preenchidos pela própria página.",
      },
      fields: [
        {
          name: "pagina",
          type: "text",
          required: true,
          label: "Página",
          admin: {
            description: "O endereço de onde o formulário foi enviado — \"contato\", por exemplo.",
          },
        },
        {
          name: "marca",
          type: "text",
          label: "Marca",
          admin: {
            description:
              "Qual representada, quando o formulário abrir a partir da página de uma marca (o seam que PRA-127 usa). Em branco nas páginas que não são de marca nenhuma, como /contato.",
          },
        },
      ],
    },
  ],
};
