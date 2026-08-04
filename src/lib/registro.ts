/**
 * O registro público da Belmare — o que `/quem-somos` cita de documento.
 *
 * A página conta a história da empresa, mas só com o que é conferível. Para
 * isso funcionar, tudo aqui precisa ser transcrição, não redação.
 *
 * ⚠️ Regra deste arquivo: **nada é reescrito com palavras melhores.** O nome
 * público anterior sai do perfil que ainda está no ar, com a pontuação e a
 * ordem que ele tem. Adjetivo, arredondamento e "tradução para o cliente" não
 * entram — reescrever a citação quebra exatamente o que ela prova.
 *
 * ⚠️ **OS CINCO CNAEs SAÍRAM DAQUI, E COM ELES O P1.** Eles alimentavam uma
 * tabela no bloco 02 de `/quem-somos`, e a tabela saiu da página: cinco códigos
 * do cadastro nacional — "consultoria em gestão empresarial" e "tapeçaria,
 * persianas e cortinas" entre eles — não dizem nada a um arquiteto e fazem uma
 * representação de móvel de autor parecer atacado genérico. O P1 pedia publicar
 * o código e proibia interpretá-lo, o que deixava na página um bloco que
 * ninguém podia explicar. Quem quiser conferir o registro tem o CNPJ no rodapé,
 * que é a face legal do site; a página de venda não é o lugar da papelada.
 *
 * Identidade legal (razão social, CNPJ, endereço, abertura, porte) é campo do
 * global `Empresa` desde PRA-122. Aqui fica só a citação que esta página
 * estreia.
 */

/**
 * O nome com que a empresa se apresentou publicamente antes do rebranding.
 *
 * É o único documento disponível dos primeiros anos que não é um código: uma
 * frase que lista, produto a produto, o que a empresa vendia. Vale mais que
 * qualquer "tradição desde 1999" — é o que dá conteúdo ao número.
 *
 * ⚠️ **A FONTE SAIU DA TELA, E O CAMPO SAIU DAQUI.** O bloco imprimia "Fonte ·
 * Facebook · /belmarerepresentacoes" sob a citação — a empresa fazendo due
 * diligence sobre si mesma na própria página institucional. Ninguém duvida que
 * a Belmare saiba como ela se chamava, e a nota transformava duas colunas
 * legíveis em verbete. O perfil segue no ar com o nome antigo, e é por isso que
 * o bloco não põe o verbo no passado absoluto.
 *
 * ⚠️ Tapetes aparecem aqui e não aparecem no portfólio das quatro representadas
 * (P2, em aberto). A página mostra o nome como registro do passado e **não
 * afirma que a Belmare vende tapete hoje.**
 */
export const NOME_PUBLICO_ANTERIOR = {
  valor:
    "Bello Mare — Móveis para Jardim, Ombrellones, Móveis de Design e Tapetes",
} as const;
