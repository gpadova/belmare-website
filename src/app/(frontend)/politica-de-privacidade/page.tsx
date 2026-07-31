import type { Metadata } from "next";

import { RotaLivre, metadataDaRotaLivre } from "@/components/paginas/rota-livre";

/**
 * `/politica-de-privacidade` — a rota que o rodapé linka de toda página do
 * site, e que até este ticket era um 404 em todas elas.
 *
 * ⚠️ **A REDAÇÃO NÃO É NOSSA, E A PÁGINA EXISTE PARA QUE ELA POSSA SER COLADA.**
 * O texto de uma política de privacidade é peça jurídica: quem o escreve é
 * advogado, e está explicitamente fora do escopo deste ticket. O que este ticket
 * entrega é a página, a editabilidade dela e um editor que aguenta a ESTRUTURA
 * de um documento — dois níveis de título, listas, links e negrito —, para que
 * colar o texto revisado seja uma edição de dez minutos no painel e não um
 * commit.
 *
 * ⚠️ **O QUE ESTÁ PUBLICADO HOJE ESTÁ MARCADO, DENTRO DA PRÓPRIA PÁGINA, COMO
 * AGUARDANDO REVISÃO JURÍDICA.** Não é lorem, e não é texto legal inventado com
 * cara de revisado — que seria a pior das duas opções, porque texto legal
 * plausível não é conferido por ninguém depois. Ver `src/seed/semear-paginas.ts`.
 *
 * ⚠️ **NÃO HÁ BANNER DE COOKIE, e a ausência é decisão de escopo da spec**, não
 * esquecimento. O site não instala rastreador de terceiros; um banner que pede
 * consentimento para nada é teatro de conformidade.
 *
 * ⚠️ Esta é a única das três páginas livres que NÃO deve terminar em ação de
 * fecho. Um documento legal fecha em silêncio — é por isso que o fecho é um
 * bloco escolhido, e não parte fixa de toda página livre.
 */
export const revalidate = 86400;

export function generateMetadata(): Promise<Metadata> {
  return metadataDaRotaLivre("politica-de-privacidade");
}

export default function PoliticaDePrivacidade() {
  return <RotaLivre slug="politica-de-privacidade" />;
}
