import type { GlobalConfig } from "payload";

import { estaAutenticado } from "@/collections/papeis";
import { aoPublicarGlobal, exigeTexto, VERSOES_DO_GLOBAL } from "@/globals/apoio";
import { cnpjFormatado, emailComercial, numeroDeWhatsapp } from "@/lib/empresa";

/**
 * A Belmare, dentro do painel — identidade, canais e endereço.
 *
 * ⚠️ **ESTE GLOBAL É O QUE DESTRAVA O LANÇAMENTO.** O número de WhatsApp e o
 * e-mail comercial estavam MOCKADOS em `lib/site.ts` com um aviso de "trocar
 * antes do lançamento"; trocá-los era um commit e um deploy, e é quase certo
 * que seja a primeira edição da vida do operador. Essa edição exercita o
 * sistema inteiro de uma vez: campo de global, validação em pt-BR, rascunho e
 * publicação, invalidação de etiqueta do SITE INTEIRO pelo rodapé, e
 * confirmação em segundos. É o teste de aceite do CMS, não uma tarefa.
 *
 * ⚠️ **O NÚMERO E O E-MAIL NÃO SÃO OBRIGATÓRIOS AQUI, E ISSO É DECIDIDO, NÃO
 * ESQUECIDO.** Se fossem, o seed de PRA-119 não conseguiria publicar a
 * identidade sem inventar um número — e inventar um número é exatamente o
 * mock que este ticket existe para tirar do código. Vazio, o site não desenha
 * botão de WhatsApp NENHUM, em página nenhuma: é a seção anulável aplicada a um
 * canal. Um link morto é pior do que link nenhum, porque ninguém descobre que
 * ele está morto até um cliente desistir de falar com a empresa.
 *
 * ⚠️ **O TEMPO DE CASA NÃO TEM CAMPO AQUI E NÃO PODE PASSAR A TER.** O único
 * campo é a DATA DE ABERTURA; "27 anos" e "Desde 1999" são recalculados a cada
 * leitura por `lib/empresa.ts`. Um número digitado congela e passa a errar em
 * silêncio a partir de 22 de abril, uma vez por ano, no primeiro número da
 * primeira tela do site.
 *
 * ⚠️ **O TERRITÓRIO TAMBÉM NÃO É CAMPO.** Ele é gerado da malha do IBGE que
 * DESENHA a prancha de `/quem-somos` — ver a nota longa em `lib/empresa.ts`.
 * Um campo de texto deixaria o operador escrever um quarto estado que o único
 * gráfico da página não sabe desenhar.
 *
 * ⚠️ **O NOME PÚBLICO ANTERIOR FICA EM `lib/registro.ts`, NO CÓDIGO.** É uma
 * citação, e um campo de texto é precisamente a ferramenta que convida alguém a
 * reescrevê-la "com palavras melhores" — que é a única coisa que aquela página
 * não pode fazer sem quebrar o que a citação prova. Os cinco CNAEs moravam lá
 * ao lado dele e saíram do projeto junto com o bloco que os exibia; ver o `⚠️`
 * no topo de `lib/registro.ts`.
 *
 * ⚠️ **`porte` CONTINUA SENDO CAMPO, MAS NÃO APARECE MAIS EM PÁGINA NENHUMA.**
 * "Empresa de pequeno porte" abria `/quem-somos` numa faixa de identificação, e
 * era o registro dizendo ao arquiteto que a empresa é pequena, no primeiro
 * viewport de uma página que precisa vender. O dado segue no cadastro porque é
 * verdadeiro e barato de manter; o que mudou é que ele não é mais argumento de
 * venda.
 */
export const Empresa: GlobalConfig = {
  slug: "empresa",
  label: "A Belmare",
  typescript: { interface: "Empresa" },
  admin: {
    group: "O site",
    description:
      "Os dados da própria Belmare: como falar com ela, quem ela é no registro e onde fica. Tudo aqui aparece no rodapé, e o rodapé está em todas as páginas do site — inclusive na de erro.",
  },

  access: {
    /* ⚠️ Sem sessão de painel, só a versão publicada. É a segunda camada da
       garantia de PRA-118: a primeira é a condição explícita de
       `lib/empresa-consulta.ts`, por onde o SITE lê; esta cobre quem pedir o
       global pela API REST/GraphQL — um telefone novo salvo como rascunho não
       vaza por lá antes de o operador clicar em "Publicar". */
    read: ({ req }) => Boolean(req.user),

    /* ⚠️ Faltava desde sempre: um global só tem `update` (não há como criar
       nem apagar um), e sem este `access` o padrão do Payload liberava a
       escrita geral — qualquer chamada sem sessão trocava o WhatsApp ou o
       e-mail comercial do site inteiro. "Os dados da própria Belmare" é
       conteúdo do operador (PRA-125); a guarda é só autenticação. */
    update: estaAutenticado,
  },

  versions: VERSOES_DO_GLOBAL,
  hooks: { afterChange: aoPublicarGlobal({ colecao: "empresa" }) },

  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Canais",
          description:
            "Por onde o visitante fala com a Belmare. Mudar qualquer um destes campos muda o site inteiro de uma vez — não há uma página para atualizar depois.",
          fields: [
            {
              name: "whatsapp",
              type: "text",
              label: "WhatsApp",
              admin: {
                description:
                  "O número com DDD, como você o escreveria para alguém — (48) 99137-5030. Pode digitar com parênteses, espaço e traço. ⚠️ Enquanto este campo estiver vazio, o site não mostra botão de WhatsApp em página nenhuma: é melhor não oferecer o canal do que oferecer um link que abre e diz que o número não existe.",
              },

              /* Normaliza ANTES de validar: o campo guarda E.164 (`55` + DDD +
                 número, só dígitos), que é o que o `wa.me` aceita, e o operador
                 nunca precisa saber o que é E.164. Quando o número não é válido
                 o valor cru atravessa de propósito — é ele que a recusa abaixo
                 precisa devolver para a tela, ou o operador veria o campo
                 esvaziar sozinho sem entender o motivo. */
              hooks: {
                beforeValidate: [
                  ({ value }) =>
                    typeof value === "string"
                      ? (numeroDeWhatsapp(value) ?? value)
                      : value,
                ],
              },

              validate: (valor: string | null | undefined) => {
                if (!valor || valor.trim() === "") return true;
                return numeroDeWhatsapp(valor) !== undefined
                  ? true
                  : "Este não é um número de telefone brasileiro completo. Escreva o DDD e o número — (48) 99137-5030. Um número pela metade vira um link de WhatsApp que abre e diz que o contato não existe, e quem descobre isso é o cliente, não a gente.";
              },
            },
            {
              name: "email",
              type: "text",
              label: "E-mail comercial",
              admin: {
                description:
                  "O endereço que recebe contato comercial, escrito por extenso. Ele aparece no rodapé de todas as páginas. Vazio, a linha do e-mail simplesmente não aparece.",
              },
              hooks: {
                beforeValidate: [
                  ({ value }) =>
                    typeof value === "string"
                      ? (emailComercial(value) ?? value)
                      : value,
                ],
              },
              validate: (valor: string | null | undefined) => {
                if (!valor || valor.trim() === "") return true;
                return emailComercial(valor) !== undefined
                  ? true
                  : "Confira o endereço: falta o @, falta o ponto do domínio, ou sobrou um espaço. Um e-mail errado no rodapé é uma caixa que nunca recebe nada, e ninguém avisa.";
              },
            },
            {
              name: "telefones",
              type: "array",
              label: "Telefones",
              labels: { singular: "Telefone", plural: "Telefones" },
              admin: {
                description:
                  "Os telefones que aparecem no rodapé e na ficha de atendimento de /quem-somos, na ordem em que você quer que sejam vistos. Cada um vira um link que disca no celular do visitante.",
              },
              fields: [
                {
                  name: "numero",
                  type: "text",
                  required: true,
                  label: "Número",
                  admin: {
                    description:
                      "Com DDD, escrito como você escreveria — (48) 3234-6004. O site mostra exatamente o que estiver aqui.",
                  },
                  validate: (valor: string | null | undefined) => {
                    if (!valor || valor.trim() === "")
                      return "Escreva o número, ou apague a linha inteira. Uma linha vazia vira um link que não disca para lugar nenhum.";
                    return numeroDeWhatsapp(valor) !== undefined
                      ? true
                      : "Confira o número: faltou o DDD, ou sobrou/faltou um dígito. Ele vira um link de discagem, e um número incompleto disca errado.";
                  },
                },
              ],
            },
            {
              name: "instagram",
              type: "text",
              label: "Endereço do Instagram",
              admin: {
                description:
                  "O endereço completo do perfil — https://www.instagram.com/belmarerepresentacoes. Vazio, o link some do rodapé.",
              },
              validate: (valor: string | null | undefined) => {
                if (!valor || valor.trim() === "") return true;
                return /^https:\/\/\S+$/.test(valor.trim())
                  ? true
                  : "Cole o endereço completo, começando em https:// — só o nome do perfil vira um link quebrado.";
              },
            },
          ],
        },

        {
          label: "Registro",
          description:
            "A identidade legal, transcrita do cadastro. ⚠️ Nada aqui é reescrito com palavras melhores: /quem-somos abre o registro em vez de afirmar que a empresa é séria, e essa autoridade depende de cada linha poder ser conferida na fonte.",
          fields: [
            {
              name: "nomeCompleto",
              type: "text",
              required: true,
              label: "Nome público",
              admin: {
                description:
                  "Como a empresa se apresenta hoje — \"Belmare Representações\". É o nome que acompanha o site quando alguém o compartilha.",
              },
              validate: exigeTexto(
                "Escreva o nome público. Ele identifica o site inteiro quando um link é compartilhado.",
              ),
            },
            {
              name: "razaoSocial",
              type: "text",
              required: true,
              label: "Razão social",
              admin: {
                description:
                  "Como consta no registro — \"Bello Mare Mercantil Ltda\". Transcreva; não traduza para o cliente.",
              },
              validate: exigeTexto(
                "Escreva a razão social como está no registro. Ela abre a ficha de /quem-somos e fecha o rodapé.",
              ),
            },
            {
              name: "cnpj",
              type: "text",
              required: true,
              label: "CNPJ",
              admin: {
                description:
                  "Os catorze dígitos. Pode digitar com ou sem pontuação — o site escreve no formato do cadastro.",
              },
              hooks: {
                beforeValidate: [
                  ({ value }) =>
                    typeof value === "string"
                      ? (cnpjFormatado(value) ?? value)
                      : value,
                ],
              },
              validate: (valor: string | null | undefined) => {
                if (!valor || valor.trim() === "")
                  return "Escreva o CNPJ. Ele é a primeira linha conferível de /quem-somos, e a página inteira se apoia em ele estar certo.";
                return cnpjFormatado(valor) !== undefined
                  ? true
                  : "Este CNPJ não fecha — confira dígito a dígito. Um número com a cara certa e um dígito trocado passa despercebido aqui e falha na consulta oficial, que é exatamente o que o leitor desta página vai fazer.";
              },
            },
            {
              name: "abertura",
              type: "date",
              required: true,
              label: "Data de abertura",
              admin: {
                date: { pickerAppearance: "dayOnly", displayFormat: "dd/MM/yyyy" },
                description:
                  "O dia em que a empresa foi aberta, como consta no registro. ⚠️ Não existe campo de \"anos de mercado\" em lugar nenhum deste painel, e não deve passar a existir: o site conta os anos a partir desta data, sozinho, e vira a contagem no aniversário. Um número digitado ficaria errado a partir do aniversário seguinte sem ninguém perceber.",
              },
              validate: (valor: unknown) => {
                if (typeof valor !== "string" || valor === "")
                  return "Escolha a data de abertura. É dela que saem o ano de fundação e a contagem de anos que o site mostra — sem ela os dois desaparecem.";
                const data = new Date(valor);
                if (Number.isNaN(data.getTime()))
                  return "Escolha uma data válida no calendário.";
                if (data.getTime() > Date.now())
                  return "A data de abertura está no futuro. Confira o ano: uma data adiante de hoje faz o site contar anos negativos.";
                return true;
              },
            },
            {
              name: "porte",
              type: "text",
              label: "Porte",
              admin: {
                description:
                  "Como o cadastro classifica a empresa, por extenso — \"Empresa de pequeno porte\". Deixe em branco e a linha some da ficha.",
              },
            },
          ],
        },

        {
          label: "Endereço",
          description:
            "A sede, como ela aparece no rodapé. Uma linha em branco desaparece do endereço em vez de deixar um vão.",
          fields: [
            {
              name: "endereco",
              type: "group",
              label: "Sede",
              fields: [
                {
                  name: "logradouro",
                  type: "text",
                  label: "Rua e número",
                  admin: { description: "\"Rua Zanzibar do Nascimento Lins, 81\"." },
                },
                { name: "bairro", type: "text", label: "Bairro" },
                { name: "cidade", type: "text", label: "Cidade" },
                {
                  name: "uf",
                  type: "text",
                  label: "Estado (sigla)",
                  admin: { description: "Duas letras — SC." },
                  validate: (valor: string | null | undefined) => {
                    if (!valor || valor.trim() === "") return true;
                    return /^[A-Za-z]{2}$/.test(valor.trim())
                      ? true
                      : "Use a sigla de duas letras — SC, não \"Santa Catarina\".";
                  },
                },
                {
                  name: "cep",
                  type: "text",
                  label: "CEP",
                  admin: { description: "\"88.036-225\" ou 88036225." },
                  validate: (valor: string | null | undefined) => {
                    if (!valor || valor.trim() === "") return true;
                    return valor.replace(/\D/g, "").length === 8
                      ? true
                      : "Um CEP tem oito dígitos. Confira o que está escrito.";
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
