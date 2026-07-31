import { differenceInYears, parseISO } from "date-fns";

/**
 * Identidade e canais da Belmare — um lugar só.
 *
 * ⚠️ WhatsApp e e-mail estão MOCKADOS por decisão do cliente (30/07/2026).
 * Trocar os dois valores marcados abaixo antes do lançamento. Nada no site
 * referencia número ou e-mail fora deste arquivo.
 *
 * Os telefones fixos e o CNPJ são dados reais e verificados.
 */

export const EMPRESA = {
  nome: "Belmare",
  nomeCompleto: "Belmare Representações",
  razaoSocial: "Bello Mare Mercantil Ltda",
  cnpj: "03.133.708/0001-09",
  fundacao: 1999,
  /** Data de abertura como consta no registro. Formato do próprio cadastro. */
  abertura: "22.04.1999",
  porte: { sigla: "EPP", extenso: "Empresa de pequeno porte" },
  endereco: {
    logradouro: "Rua Zanzibar do Nascimento Lins, 81",
    bairro: "Trindade",
    cidade: "Florianópolis",
    uf: "SC",
    cep: "88.036-225",
  },
  telefones: ["(48) 3234-6004", "(48) 99137-5030"],
  territorio: ["Paraná", "Santa Catarina", "Rio Grande do Sul"],
  instagram: "https://www.instagram.com/belmarerepresentacoes",
} as const;

/** MOCK — substituir pelo número real antes do lançamento. */
const WHATSAPP_E164 = "5548000000000";

/** MOCK — substituir pelo e-mail real antes do lançamento. */
export const EMAIL_COMERCIAL = "comercial@exemplo.belmare.com.br";

/**
 * WhatsApp com mensagem pré-preenchida por contexto: quem clica na página da
 * Trisol chega dizendo de onde veio. Custo zero, ganho grande de qualificação.
 */
export function whatsapp(contexto?: string): string {
  const texto = contexto
    ? `Olá! Vim pelo site da Belmare — ${contexto}.`
    : "Olá! Vim pelo site da Belmare.";
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(texto)}`;
}

export const NAVEGACAO = [
  { rotulo: "Quem somos", href: "/quem-somos" },
  { rotulo: "Representadas", href: "/representadas" },
  { rotulo: "Catálogos", href: "/catalogos" },
  { rotulo: "Arquivos 3D", href: "/arquivos-3d" },
] as const;

/**
 * A data de abertura, em ISO. É a única fonte da contagem de anos — o número
 * nunca é escrito à mão em lugar nenhum do site.
 */
const ABERTURA_ISO = "1999-04-22";

/**
 * Anos completos desde a abertura, contados com dia e mês.
 *
 * `differenceInYears` conta anos completos: em 21/04 de um ano ela devolve um a
 * menos que em 22/04, que é exatamente o comportamento certo. A diferença
 * simples de anos-calendário erraria por um durante quase quatro meses todo
 * ano — e este número aparece na primeira tela de `/quem-somos`.
 *
 * ⚠️ A página que exibe esse número declara `revalidate`. Sem isso, um build
 * feito antes de 22 de abril congela a contagem antiga até o próximo deploy, e
 * a falha é silenciosa e anual.
 */
export function anosDeMercado(hoje: Date = new Date()): number {
  return differenceInYears(hoje, parseISO(ABERTURA_ISO));
}
