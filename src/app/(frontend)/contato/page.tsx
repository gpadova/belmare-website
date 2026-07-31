import type { Metadata } from "next";

import { RotaLivre, metadataDaRotaLivre } from "@/components/paginas/rota-livre";

/**
 * `/contato` — a porta B da home, onde ela bifurca.
 *
 * A segunda porta junta consumidor e lojista, que têm economias opostas, e a
 * home mantém as duas portas com peso igual justamente porque a bifurcação
 * acontece UMA camada abaixo, aqui (`components/portas.tsx`). Os dois caminhos:
 *
 *   quero comprar    → WhatsApp · a Belmare indica a loja mais próxima
 *   quero revender   → a proposta comercial
 *
 * A Belmare nunca vende direto, e não há lista de lojas na v1 — conteúdo
 * volátil demais, fase 2 (`briefing/estrutura.md` §2). Ela é o roteador: todo
 * consumidor vira conversa em vez de clique perdido num mapa.
 *
 * ⚠️ **O CAMINHO "QUERO REVENDER" AINDA NÃO É FORMULÁRIO, E O SEAM É PRA-126.**
 * Hoje ele é um caminho de WhatsApp com contexto próprio: funciona, chega
 * marcado de onde veio, e não promete a ninguém um formulário que não existe.
 * Quando PRA-126 construir o formulário de proposta, ele entra como um TERCEIRO
 * valor no rádio `destino` do bloco de caminhos — ver o comentário marcado em
 * `collections/blocos.ts` e a união `Caminho` em `lib/paginas.ts`. São três
 * linhas, nenhuma delas neste arquivo, e o `switch` exaustivo do renderizador
 * vira erro de build se alguém esquecer uma. **Este ticket não o constrói.**
 *
 * ⚠️ O endereço, os telefones, o e-mail, o território e o CNPJ NÃO são digitados
 * nesta página: são o bloco "Ficha da Belmare", que os lê do cadastro. Duas
 * cópias de um telefone é como a segunda passa a estar errada.
 */
export const revalidate = 86400;

export function generateMetadata(): Promise<Metadata> {
  return metadataDaRotaLivre("contato");
}

export default function Contato() {
  return <RotaLivre slug="contato" />;
}
