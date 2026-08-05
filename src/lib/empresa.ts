import { differenceInYears, parseISO } from "date-fns";

import { ESTADOS } from "@/lib/territorio";

/**
 * A identidade e os canais da Belmare — o domínio, não o painel.
 *
 * ⚠️ **AQUI MORAVAM O WHATSAPP E O E-MAIL MOCKADOS.** Até PRA-122 os dois eram
 * constantes de `lib/site.ts` com um aviso de "trocar antes do lançamento", e
 * trocá-los era um commit e um deploy. Agora eles são campo do global `Empresa`
 * e este arquivo guarda só o que o painel NÃO pode guardar: como um número
 * digitado por gente vira um link de `wa.me` que funciona, e como a recusa
 * acontece quando ele não vira.
 *
 * ⚠️ **NADA AQUI FALA COM O PAYLOAD NEM COM O NEXT.** Valores já resolvidos
 * entram, string ou número sai — a mesma tática de `lib/revalidacao.ts` e
 * `lib/preview.ts`. Quem lê o painel é `lib/empresa-consulta.ts`; quem recusa
 * na tela do operador é `globals/empresa.ts`. Os dois são chamadores finos
 * destas funções, e é essa ausência de framework que permite afirmar por teste
 * comum que o número mockado de hoje seria recusado.
 *
 * ⚠️ **TUDO É OPCIONAL, E ISSO É A SEÇÃO ANULÁVEL.** O global pode estar vazio
 * (banco novo) ou pela metade (o operador ainda não preencheu o WhatsApp), e o
 * modo de falha certo é menos página, nunca página quebrada: sem número, o
 * link de WhatsApp não é desenhado — não vira um `wa.me` para lugar nenhum. Um
 * link morto é pior do que link nenhum, porque ninguém descobre que ele está
 * morto até um cliente desistir.
 */

export type Endereco = {
  logradouro?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
};

export type Empresa = {
  /** "Belmare Representações" — o nome público, usado em metadados. */
  nomeCompleto?: string;
  /** "Bello Mare Mercantil Ltda" — transcrição do registro, nunca reescrita. */
  razaoSocial?: string;
  cnpj?: string;
  /** A data de abertura em ISO (`1999-04-22`). É a ÚNICA fonte do tempo de casa
   *  e do ano de fundação — nenhum dos dois é digitado em lugar nenhum. */
  abertura?: string;
  endereco?: Endereco;
  telefones?: string[];
  /** Só dígitos, em E.164 (`5548991375030`), já normalizado e já validado. Se
   *  está aqui, `wa.me` aceita. */
  whatsapp?: string;
  email?: string;
  instagram?: string;
};

/**
 * O território atendido — **gerado da malha do IBGE, não campo do painel**.
 *
 * ⚠️ **ESTA É A ÚNICA DECISÃO DESTE TICKET QUE NÃO SEGUE A LISTA DE CAMPOS DO
 * PRÓPRIO TICKET, E O MOTIVO ESTÁ DESENHADO NA PÁGINA.** `/quem-somos` nomeia
 * os três estados em prosa e, três centímetros abaixo, DESENHA os mesmos três a
 * partir de `lib/territorio.ts` — malha oficial do IBGE, regerada da fonte e
 * fora do escopo de edição por decisão 4 da spec. Um campo de texto aqui
 * deixaria o operador escrever um quarto estado que a prancha não sabe
 * desenhar, e a página passaria a contradizer o único gráfico que ela tem. Dois
 * lugares para o mesmo fato é como um deles fica errado; a lista sai do mesmo
 * dado que o desenho, e por construção eles não podem discordar.
 *
 * Expandir território continua possível — é regerar a malha, que é a mesma
 * conversa (e o mesmo deploy) que o desenho novo já exigiria de qualquer jeito.
 */
export const TERRITORIO: string[] = ESTADOS.map((estado) => estado.nome);

/**
 * O número que o operador digitou virando E.164 — ou `undefined`, quando não
 * vira.
 *
 * ⚠️ **ACEITA O QUE UMA PESSOA ESCREVE E RECUSA O QUE NÃO É TELEFONE.** O
 * operador digita "(48) 99137-5030", que é como o número está escrito no cartão
 * dele; exigir "5548991375030" seria transformar a primeira edição da vida dele
 * num quebra-cabeça de formato. Pontuação, espaço, `+` e o `55` opcional saem;
 * o que sobra é conferido.
 *
 * ⚠️ **AS RECUSAS NÃO SÃO DECORATIVAS — CADA UMA MATA UM `wa.me` MORTO.**
 *
 *   · DDD fora de 11–99 não existe no plano de numeração brasileiro.
 *   · assinante começando em 0 ou 1 também não existe — e é exatamente esta
 *     regra que recusa o `5548000000000` que estava mockado em `lib/site.ts`
 *     até este ticket. Um número plausível à vista e inválido no WhatsApp é o
 *     pior caso possível: o link abre, o aplicativo diz que o número não
 *     existe, e quem descobre é o cliente.
 *   · 8 dígitos (fixo) continuam válidos — WhatsApp Business roda em linha
 *     fixa, e dois dos telefones da própria Belmare são fixos.
 */
export function numeroDeWhatsapp(entrada: string | null | undefined): string | undefined {
  const digitos = (entrada ?? "").replace(/\D/g, "");
  if (digitos === "") return undefined;

  // O 55 é opcional na digitação e obrigatório no resultado.
  const nacional = digitos.startsWith("55") && digitos.length > 11
    ? digitos.slice(2)
    : digitos;

  if (nacional.length !== 10 && nacional.length !== 11) return undefined;

  const ddd = Number(nacional.slice(0, 2));
  if (!Number.isInteger(ddd) || ddd < 11 || ddd > 99) return undefined;

  const assinante = nacional.slice(2);
  if (/^[01]/.test(assinante)) return undefined;

  return `55${nacional}`;
}

/**
 * O e-mail normalizado, ou `undefined`.
 *
 * ⚠️ Estreito de propósito: um endereço com espaço, sem arroba ou com domínio
 * sem ponto é erro de digitação, e um e-mail comercial errado no rodapé é uma
 * caixa que nunca recebe nada — a mesma falha silenciosa do WhatsApp morto. O
 * que este teste NÃO faz é adivinhar se a caixa existe; isso nenhum regex faz,
 * e fingir que faz é pior.
 */
export function emailComercial(entrada: string | null | undefined): string | undefined {
  const limpo = (entrada ?? "").trim().toLowerCase();
  if (limpo === "") return undefined;
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(limpo) ? limpo : undefined;
}

/**
 * O CNPJ conferido e escrito como o cadastro o escreve — `03.133.708/0001-09`.
 * `undefined` quando os catorze dígitos não fecham.
 *
 * ⚠️ **OS DÍGITOS VERIFICADORES SÃO CONFERIDOS, E NÃO SÓ O TAMANHO.** A
 * autoridade inteira de `/quem-somos` é que cada linha da página pode ser
 * conferida na fonte — a rota abre o registro em vez de afirmar que a empresa é
 * séria. Um CNPJ com um dígito trocado tem a cara certa, passa por qualquer
 * teste de formato, e é a única linha da página que o leitor de fato vai
 * digitar na consulta oficial. Ele não pode sair errado daqui.
 *
 * O cálculo é o do próprio cadastro: soma ponderada módulo 11, dos dois lados.
 */
export function cnpjFormatado(entrada: string | null | undefined): string | undefined {
  const digitos = (entrada ?? "").replace(/\D/g, "");
  if (digitos.length !== 14) return undefined;

  // Todos os dígitos iguais passam na conta e não são CNPJ de ninguém.
  if (/^(\d)\1{13}$/.test(digitos)) return undefined;

  const verificador = (ate: number): number => {
    let peso = ate - 7;
    let soma = 0;
    for (let i = 0; i < ate; i++) {
      soma += Number(digitos[i]) * peso;
      peso = peso === 2 ? 9 : peso - 1;
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  if (verificador(12) !== Number(digitos[12])) return undefined;
  if (verificador(13) !== Number(digitos[13])) return undefined;

  return digitos.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

/**
 * O WhatsApp com a mensagem pré-preenchida por contexto: quem clica na página
 * da Trisol chega dizendo de onde veio. Custo zero, ganho grande de
 * qualificação — e é a única qualificação de lead que o site tem enquanto não
 * há formulário.
 *
 * ⚠️ **`undefined` QUANDO NÃO HÁ NÚMERO, E QUEM CHAMA NÃO DESENHA O LINK.**
 * Antes deste ticket a função devolvia sempre uma string, porque o número era
 * uma constante mockada — e o site publicava um `wa.me/5548000000000` que abria
 * e não existia. Agora a ausência é visível no tipo: sem número no painel, não
 * há link para renderizar.
 */
export function linkDeWhatsapp(
  numero: string | undefined,
  contexto?: string,
): string | undefined {
  if (numero === undefined) return undefined;

  const texto = contexto
    ? `Olá! Vim pelo site da Belmare, ${contexto}.`
    : "Olá! Vim pelo site da Belmare.";

  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

/**
 * Anos completos desde a abertura, contados com dia e mês.
 *
 * ⚠️ **NÃO EXISTE CAMPO DE "TEMPO DE CASA" NO PAINEL, E NÃO PODE PASSAR A
 * EXISTIR.** Um "26" digitado congela: ele fica certo até 22 de abril e errado
 * a partir dali, em silêncio, uma vez por ano, no primeiro número da primeira
 * tela. O único campo é a DATA DE ABERTURA, que é um fato de registro e não
 * muda; o número é sempre recalculado a partir dela.
 *
 * `differenceInYears` conta anos completos: em 21/04 ela devolve um a menos que
 * em 22/04, que é exatamente o comportamento certo. A diferença simples de
 * anos-calendário erraria por um durante quase quatro meses todo ano.
 *
 * ⚠️ A página que exibe este número declara `revalidate` — e o layout também,
 * porque o rodapé o mostra em toda rota. Sem isso, um build feito antes de 22
 * de abril congela a contagem antiga até o próximo deploy, e a falha é
 * silenciosa e anual. Ver `app/(frontend)/layout.tsx`.
 */
export function anosDeMercado(
  abertura: string | undefined,
  hoje: Date = new Date(),
): number | undefined {
  const data = dataDeAbertura(abertura);
  return data === undefined ? undefined : differenceInYears(hoje, data);
}

/**
 * A data de abertura como `Date`, a partir do que o painel gravou.
 *
 * ⚠️ O campo de data do Payload grava um instante ISO completo
 * (`1999-04-22T00:00:00.000Z`) mesmo com o seletor em modo "só o dia". Cortar
 * nos dez primeiros caracteres e reconstruir com `parseISO` devolve a
 * MEIA-NOITE LOCAL daquele dia — que é o que a contagem por dia e mês precisa.
 * Usar o instante inteiro faria o aniversário virar às 21h do dia anterior em
 * Brasília, e o número da primeira tela mudaria um dia cedo.
 */
function dataDeAbertura(abertura: string | undefined): Date | undefined {
  const dia = (abertura ?? "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dia)) return undefined;

  const data = parseISO(dia);
  return Number.isNaN(data.getTime()) ? undefined : data;
}

/**
 * O ano de fundação — **gerado da data de abertura**, nunca um campo próprio.
 *
 * ⚠️ Ele era `fundacao: 1999` ao lado de `abertura: "22.04.1999"` em
 * `lib/site.ts`: dois campos para o mesmo fato, e o segundo lugar onde um erro
 * de digitação passaria despercebido para sempre. O rodapé escreve "Desde
 * 1999" a partir daqui.
 *
 * ⚠️ `/quem-somos` NÃO usa mais esta função. A página abria com o ano em
 * display, sozinho, acima da cidade e do tempo de casa em mono — e um ano solto
 * na primeira tela não traz ninguém. Depois da reescrita de 05/08/2026 o tempo
 * de casa entra lá como oração, uma vez, por `anosDeMercado`. O rodapé
 * continua sendo o lugar do ano cru.
 */
export function anoDeFundacao(abertura: string | undefined): number | undefined {
  return dataDeAbertura(abertura)?.getFullYear();
}

/**
 * A data de abertura no formato do próprio cadastro — `22.04.1999`.
 *
 * ⚠️ **GERADA, PELO MESMO MOTIVO DO ANO.** O bloco de ficha das páginas livres
 * (`components/paginas/ficha-belmare.tsx`) mostra esta string como transcrição
 * do registro; ela sai da data que o operador escolheu no calendário, e não de
 * um segundo campo de texto que poderia discordar dele.
 */
export function aberturaPorExtenso(abertura: string | undefined): string | undefined {
  const dia = dataDeAbertura(abertura);
  if (dia === undefined) return undefined;

  const doisDigitos = (valor: number) => String(valor).padStart(2, "0");
  return `${doisDigitos(dia.getDate())}.${doisDigitos(dia.getMonth() + 1)}.${dia.getFullYear()}`;
}

/** O `tel:` de um telefone escrito como a Belmare o escreve — "(48) 3234-6004". */
export function linkDeTelefone(telefone: string): string {
  return `tel:+55${telefone.replace(/\D/g, "")}`;
}
