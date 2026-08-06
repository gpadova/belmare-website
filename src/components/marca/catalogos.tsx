import {
  LinhaDeCatalogo,
  TETO_DA_LISTA,
} from "@/components/linha-de-catalogo";
import { SecaoDaMarca } from "@/components/marca/secao";
import type { Catalogo } from "@/lib/representadas";

/**
 * Os catálogos desta fábrica.
 *
 * ⚠️ **CHAMAVA-SE "PARA LEVAR" E AGORA SE CHAMA PELO QUE É.** "Para levar" é uma
 * metáfora; "Catálogo" é o nome do objeto que o arquiteto veio buscar e a
 * palavra que ele digita no Google. A prosa de abertura saiu junto — ela dizia
 * "São documentos da própria fábrica, com o detalhamento que não cabe nesta
 * página", que é a página explicando o próprio escopo a quem nunca perguntou.
 * O que o leitor precisa saber já está na linha: título, formato, peso e edição.
 *
 * ⚠️ **A SEÇÃO É ANULÁVEL: ELA EXISTE QUANDO HÁ PDF PARA BAIXAR.** Sobe o
 * arquivo, aparece a linha; não sobe, não aparece. A regra nasceu do defeito que
 * o cliente encontrou em 05/08/2026 — três linhas com título sublinhado
 * anunciando documentos que ninguém tinha subido, uma delas parecendo clicável e
 * apontando para lugar nenhum. Hoje as quatro fábricas estão sem catálogo, e as
 * quatro páginas simplesmente não têm esta seção.
 *
 * ⚠️ **UMA FÁBRICA TEM N CATÁLOGOS.** O título vai ao plural quando são vários —
 * a Marê pode ter um PDF por coleção (P22), e um h2 no singular sobre seis
 * linhas é a página não olhando para o próprio conteúdo.
 *
 * ⚠️ **PESO E FORMATO ANTES DO CLIQUE**, sempre — quem está em obra com internet
 * ruim precisa saber o que custa o toque. A linha vem de `LinhaDeCatalogo`,
 * compartilhada com `/catalogos` justamente para que a medida não seja formatada
 * duas vezes e comece a divergir: sem a casa decimal fixa, a mesma coluna mostra
 * `24 MB` embaixo de `8,4 MB`.
 *
 * ⚠️ **A COLUNA DA FÁBRICA NÃO VEM AQUI.** A página inteira é da Trisol; repetir
 * "Trisol" em cada linha de uma tela que se chama Trisol é ruído, e ainda abriria
 * um vão de onze rem antes de cada título.
 *
 * ⚠️ **NÃO LINKA O SITE DA FÁBRICA.** A Trisol publica a edição 2026 para
 * download no site dela, e mandar o arquiteto para lá entrega o lead, o e-mail
 * comercial deles e a comissão de graça. O arquivo é servido daqui ou não é
 * servido.
 */
export function CatalogosDaMarca({
  catalogos,
  contagem,
}: {
  catalogos: Catalogo[];
  contagem?: string;
}) {
  if (catalogos.length === 0) return null;

  const varios = catalogos.length > 1;

  return (
    <SecaoDaMarca
      id="catalogos"
      titulo={varios ? "Catálogos" : "Catálogo"}
      contagem={contagem}
    >
      <ul className={`mt-6 border-t border-line md:mt-8 ${TETO_DA_LISTA}`}>
        {catalogos.map((catalogo, i) => (
          <LinhaDeCatalogo
            /* Índice na chave pelo mesmo motivo de `/catalogos`: se a Marê vier
               com um PDF por coleção (P22), chegam N documentos com o mesmo
               título e sem ano. */
            key={`${catalogo.titulo}-${i}`}
            catalogo={catalogo}
          />
        ))}
      </ul>
    </SecaoDaMarca>
  );
}
