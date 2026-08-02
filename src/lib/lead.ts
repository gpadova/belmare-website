/**
 * O domínio do lead — o contato recebido pelo formulário do site (PRA-126).
 *
 * ⚠️ **A LISTA DE CAMPOS É FIXA, EM CÓDIGO, E É ESSE O PONTO INTEIRO DO
 * TICKET.** Todo outro conteúdo deste projeto vira campo do painel porque a
 * Belmare é quem decide o que existe; aqui é o oposto — decisão 11 da spec
 * (`PRODUCT.md`): "nome, e-mail, cidade e escritório bastam — CPF não". Um
 * construtor de formulário é exatamente a ferramenta que deixaria um operador
 * bem-intencionado acrescentar um campo de CPF porque uma fábrica pediu, e essa
 * é uma violação de minimização de dado que o operador cria sem perceber, num
 * site cuja política de privacidade não tem advogado por trás (ver
 * `docs/classificacao-de-texto.md`, seção "Coleção `leads`"). Por isso os
 * campos abaixo não vêm de `collections/leads.ts` sozinho — eles nascem aqui,
 * no domínio, e a coleção só os declara.
 *
 * ⚠️ **`escritorio` NOMEIA DOIS PAPÉIS DIFERENTES DE PROPÓSITO.** O mesmo
 * formulário atende "quero revender" (`/contato`, uma loja ou operação) e,
 * quando um caminho abrir daqui a diante numa página de marca ou em
 * `/arquivos-3d` (PRA-127, que este ticket deixa pronto para usar o mesmo
 * seam), um arquiteto qualificando o próprio escritório — o mesmo caso que a
 * decisão 11 descreve ao pé da letra. Duplicar o formulário por audiência
 * seria dois formulários fazendo a mesma pergunta com rótulos diferentes; o
 * rótulo em `components/formulario-de-lead.tsx` é a única coisa que muda.
 *
 * ⚠️ **TELEFONE FICOU DE FORA, DE PROPÓSITO.** `briefing/restricoes.md`
 * permite telefone como campo opcional, mas o brief que abriu este ticket
 * enumera a lista fechada sem ele — e "pedir só o necessário" corta na
 * direção de menos campo, não de mais. Reabrir esta lista é decisão de
 * produto, não um esquecimento deste ticket.
 *
 * NADA AQUI FALA COM O PAYLOAD NEM COM O NEXT — mesma tática de
 * `lib/empresa.ts` e `lib/paginas.ts`: valores já resolvidos entram, valor de
 * domínio sai. Quem grava é `lib/lead-acao.ts`; quem declara os campos no
 * painel é `collections/leads.ts`.
 */

/** De onde um lead veio — os dois campos ocultos que o visitante nunca digita
 *  e nunca vê. Preenchidos pela própria página no momento do envio. */
export type OrigemDoLead = {
  /** O endereço de onde o formulário foi enviado — "contato", por exemplo. */
  pagina: string;
  /** A representada, quando o formulário nasce numa página de marca. Ausente
   *  em `/contato` e `/arquitetos`, que não pertencem a fábrica nenhuma. */
  marca?: string;
};

/** Os dados de um envio — a MESMA forma que `collections/leads.ts` declara
 *  como campo, e nada além dela. */
export type DadosDoLead = {
  nome: string;
  email: string;
  cidade: string;
  escritorio: string;
  /** Nunca pré-marcado — ver `components/formulario-de-lead.tsx`. */
  consentimentoMarketing: boolean;
  origem: OrigemDoLead;
};

/**
 * O que o formulário mostra depois de tentar enviar.
 *
 * ⚠️ `"sucesso"` não distingue se o aviso por e-mail foi entregue: o lead já
 * está salvo no painel quando este estado é devolvido, e é exatamente essa
 * garantia que faz "sucesso" ser a resposta certa mesmo quando o Resend falha
 * por baixo — ver a nota grande em `lib/lead-acao.ts`. Contar ao visitante que
 * o envio falhou, depois de o documento já estar gravado, seria a mentira
 * inversa: fazê-lo mandar a mesma mensagem de novo, ou desistir, por uma falha
 * que não é dele.
 */
export type EstadoDoFormularioDeLead =
  | { status: "inicial" }
  | { status: "sucesso" }
  | {
      status: "erro";
      mensagem: string;
      /** Uma mensagem por campo recusado, chaveada pelo `name` do input —
       *  populada só quando a recusa veio da validação de um campo (nunca
       *  numa falha de infraestrutura, que não aponta para campo nenhum). */
      campos?: Record<string, string>;
    };

/** O estado antes de qualquer envio — o valor inicial de `useActionState` em
 *  `components/formulario-de-lead.tsx`. */
export const ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD: EstadoDoFormularioDeLead = {
  status: "inicial",
};

/**
 * O e-mail normalizado, ou `undefined`.
 *
 * ⚠️ **A MESMA REGRA DE `lib/empresa.ts#emailComercial`, COPIADA EM VEZ DE
 * IMPORTADA.** São dois domínios que só coincidem em formato por acaso — o
 * e-mail comercial da Belmare de um lado, o e-mail de quem preenche o
 * formulário do outro — e acoplar um ao outro por causa de um regex idêntico
 * seria o tipo de dependência que quebra no dia em que só um dos dois precisar
 * mudar (aceitar um domínio interno sem TLD, por exemplo).
 */
export function emailValido(entrada: string | null | undefined): string | undefined {
  const limpo = (entrada ?? "").trim().toLowerCase();
  if (limpo === "") return undefined;
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(limpo) ? limpo : undefined;
}

/**
 * O corpo do e-mail de aviso que a Belmare recebe.
 *
 * ⚠️ **TEXTO SIMPLES, SEM HTML.** É um aviso interno de sistema para quem já
 * confia no remetente, não uma peça de comunicação com o próprio lead — a
 * mesma economia que `AJUDA_DE_SUMICO` e o resto do painel já aplicam contra
 * decoração que não muda o que a mensagem entrega.
 */
export function corpoDoAvisoPorEmail(dados: DadosDoLead): string {
  const linhas = [
    `Nome: ${dados.nome}`,
    `E-mail: ${dados.email}`,
    `Cidade: ${dados.cidade}`,
    `Empresa ou escritório: ${dados.escritorio}`,
    `Aceita novidades por e-mail: ${dados.consentimentoMarketing ? "sim" : "não"}`,
    `Página de origem: ${dados.origem.pagina}`,
    ...(dados.origem.marca !== undefined ? [`Marca: ${dados.origem.marca}`] : []),
    "",
    "Este contato já está salvo no painel, em \"Leads\".",
  ];
  return linhas.join("\n");
}

/** Uma linha do CSV de exportação — os mesmos campos do formulário, mais os
 *  dois que só existem depois de gravado: identificador e data. */
export type LinhaDeExportacaoDoLead = DadosDoLead & {
  id: number | string;
  /** Já formatada em pt-BR por quem monta a linha (`lib/lead-exportacao.ts`)
   *  — esta função não sabe de fuso nem de locale, só de texto de célula. */
  criadoEm: string;
};

/**
 * O CSV que "Leads" exporta do painel — PRA-126, o critério "read, filtered
 * and exported". `lib/lead-exportacao.ts` chama esta função depois de ler o
 * Payload; nada aqui fala com ele, mesma tática do resto do arquivo.
 *
 * ⚠️ **BOM NA FRENTE, DE PROPÓSITO.** Sem o `\uFEFF` inicial, o Excel — que é
 * quem a Belmare abre — lê o arquivo como Latin-1 e troca todo acento por
 * caractere quebrado. Um CSV de nome e cidade sem acento certo não serve para
 * nada.
 *
 * ⚠️ **QUEBRA DE LINHA É `\r\n`, A DA RFC 4180.** E uma célula só vai entre
 * aspas quando o conteúdo dela exige — vírgula, aspas ou quebra de linha
 * própria —, nunca por padrão: é o que mantém o arquivo legível a olho nu na
 * imensa maioria das linhas.
 */
export function csvDeLeads(linhas: LinhaDeExportacaoDoLead[]): string {
  const cabecalho = [
    "ID",
    "Nome",
    "E-mail",
    "Cidade",
    "Empresa ou escritório",
    "Aceita novidades por e-mail",
    "Página de origem",
    "Marca de origem",
    "Criado em",
  ];

  const corpo = linhas.map((linha) =>
    [
      String(linha.id),
      linha.nome,
      linha.email,
      linha.cidade,
      linha.escritorio,
      linha.consentimentoMarketing ? "sim" : "não",
      linha.origem.pagina,
      linha.origem.marca ?? "",
      linha.criadoEm,
    ]
      .map(celulaCSV)
      .join(","),
  );

  return `\uFEFF${[cabecalho.map(celulaCSV).join(","), ...corpo].join("\r\n")}`;
}

function celulaCSV(valor: string): string {
  return /[",\r\n]/.test(valor) ? `"${valor.replace(/"/g, '""')}"` : valor;
}
