import type { Metadata } from "next";

import { RotaLivre, metadataDaRotaLivre } from "@/components/paginas/rota-livre";

/**
 * `/arquitetos` — a porta A da home, e a primeira **página livre** do site.
 *
 * ⚠️ **ESTE ARQUIVO É CURTO DE PROPÓSITO, E ISSO É O TICKET.** As outras rotas
 * do site declaram a sequência delas em código porque a sequência É o argumento
 * — `/quem-somos` vai do documento ao interlocutor, e ler fora de ordem é ler
 * outra coisa. Esta nunca foi escrita: não há argumento de desenho a proteger
 * nela, então ela nasce CMS-nativa e o que ela mostra é a composição do painel.
 * Ver `CONTEXT.md`, "Composição de página".
 *
 * ⚠️ **HUB DE TRABALHO, NÃO PÁGINA DE VENDA** (`briefing/estrutura.md` §3.6). O
 * arquiteto reconhece bajulação à distância: o que ele vem buscar são catálogos,
 * arquivos 3D, acabamentos e uma pessoa do outro lado. O painel monta isso com
 * um bloco de texto e um bloco de caminhos — e é o bloco de caminhos que
 * impede a página de virar folheto, porque ele leva para onde o trabalho está.
 *
 * ⚠️ Ela fica FORA do menu, e continua fora: é destino da porta da home, e
 * mantê-la fora preserva o peso das duas portas (`lib/site.ts`).
 */
export const revalidate = 86400;

export function generateMetadata(): Promise<Metadata> {
  return metadataDaRotaLivre("arquitetos");
}

export default function Arquitetos() {
  return <RotaLivre slug="arquitetos" />;
}
