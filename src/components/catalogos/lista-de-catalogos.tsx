"use client";

import { useState } from "react";

import {
  GRADE_DA_LINHA,
  LinhaDeCatalogo,
  TETO_DA_LISTA,
} from "@/components/linha-de-catalogo";
import { FilaDeRecortes, Recorte } from "@/components/recorte";
import { comInicialMaiuscula, porExtenso } from "@/lib/frase";
import type { CatalogoNaLista, FiltroDeMarca } from "@/lib/representadas";

/**
 * A lista de catálogos de `/catalogos`, com o recorte por fábrica.
 *
 * ⚠️ **A LISTA É PLANA E O RECORTE É UM FILTRO — não são subpáginas, não são
 * abas, não é acordeão.** Uma fábrica pode ter seis catálogos e outra um; com
 * blocos dobráveis, quem chega procurando o da Marê abre e fecha caixas até
 * achar, e quem chega sem saber de qual fábrica quer não vê nada. Plana, a
 * página mostra tudo o que existe de uma vez, e o filtro só encurta a lista para
 * quem já sabe. Nada some por padrão.
 *
 * ⚠️ **FILTRA NO NAVEGADOR, E POR ISSO NÃO ABRE CONSULTA NENHUMA.** O princípio
 * de que nada atravessa duas fábricas continua inteiro: a rota faz UMA leitura
 * de representadas — a mesma que a home e o rodapé já fazem — e o recorte
 * acontece sobre o array que já está na tela. Não existe uma consulta de
 * "catálogos de duas marcas", não existe rota `/catalogos?marca=`, e a página
 * continua estática. O clique é instantâneo porque nada vai ao servidor.
 *
 * ⚠️ **O FILTRO SÓ OFERECE FÁBRICA QUE TEM CATÁLOGO** — as opções derivam da
 * própria lista (`marcasComCatalogo`), então não há como escolher um recorte que
 * devolve tela vazia. É a mesma regra que fez as linhas sem PDF sumirem: um
 * controle que leva a lugar nenhum é a versão em miniatura do botão morto.
 *
 * ⚠️ **O CONTROLE SAIU DAQUI EM 05/08/2026 e mora em `components/recorte.tsx`.**
 * Ele nasceu privado neste arquivo e foi extraído quando `/arquivos-3d` passou a
 * ter a mesma fila — antes de existir a segunda cópia, não depois. Ele carrega
 * uma CONTAGEM, que é dado, e dado desenhado em dois lugares diverge na primeira
 * vez que alguém apertar um dos dois. As notas sobre por que ele é `<button>` e
 * por que o rótulo não vai em mono versal foram junto com ele.
 */

/** O recorte que não recorta. Não é slug de marca nenhuma — slug de painel não
 *  colide porque o formato proíbe o valor vazio e este não é um slug. */
const TODAS = "";

export function ListaDeCatalogos({
  catalogos,
  marcas,
}: {
  catalogos: CatalogoNaLista[];
  marcas: FiltroDeMarca[];
}) {
  const [escolhida, setEscolhida] = useState(TODAS);

  /* ⚠️ Uma marca que deixa de ter catálogo entre duas renderizações não pode
     prender a tela num recorte que não existe mais. O estado é a INTENÇÃO; o
     recorte de fato é derivado, e cai para "todas" quando a intenção não tem
     mais correspondente. */
  const ativa = marcas.some((m) => m.slug === escolhida) ? escolhida : TODAS;

  const visiveis =
    ativa === TODAS
      ? catalogos
      : catalogos.filter(({ marca }) => marca.slug === ativa);

  const total = visiveis.length;
  const nomeDaAtiva = marcas.find((m) => m.slug === ativa)?.nome;

  /* A contagem é **gerada**, como toda contagem em prosa do site: um número
     escrito à mão aqui continuaria dizendo o do primeiro lote no dia do
     segundo. */
  const contagem = `${comInicialMaiuscula(porExtenso(total, "m"))} ${
    total === 1 ? "catálogo" : "catálogos"
  } ${
    nomeDaAtiva === undefined
      ? `de ${porExtenso(marcas.length)} ${marcas.length === 1 ? "fábrica" : "fábricas"}`
      : `da ${nomeDaAtiva}`
  }. Todos abrem sem cadastro.`;

  return (
    <>
      {/* ⚠️ **UM EIXO SÓ, E POR ISSO SEM RÓTULO NA TELA.** A fila logo abaixo de
          um h1 chamado "catálogos" se explica; `/arquivos-3d` tem dois eixos e
          rotula os dois. O nome acessível existe nas duas rotas — ver
          `components/recorte.tsx`. */}
      <div className={TETO_DA_LISTA}>
        <FilaDeRecortes eixo="Fábrica">
          <Recorte
            rotulo="Todas"
            quantidade={catalogos.length}
            ativo={ativa === TODAS}
            aoEscolher={() => setEscolhida(TODAS)}
          />
          {marcas.map((marca) => (
            <Recorte
              key={marca.slug}
              rotulo={marca.nome}
              quantidade={marca.quantidade}
              ativo={ativa === marca.slug}
              aoEscolher={() => setEscolhida(marca.slug)}
            />
          ))}
        </FilaDeRecortes>
      </div>

      {/* Cabeçalho de colunas de verdade, não rótulo decorativo: cada label
          assenta sobre a coluna que nomeia. No telefone a linha empilha e só
          DOCUMENTO faz sentido, porque FÁBRICA e ARQUIVO nomeariam colunas que
          ali não existem. */}
      <div
        aria-hidden
        className={`mono ${GRADE_DA_LINHA} ${TETO_DA_LISTA} mt-6 border-b border-line pb-3 uppercase text-graphite`}
      >
        <span className="col-start-1 md:hidden">Documento</span>
        <span className="col-start-1 hidden md:block">Fábrica</span>
        <span className="col-start-2 hidden md:block">Documento</span>
        <span className="col-start-3 hidden md:block">Arquivo</span>
      </div>

      {/* ⚠️ A lista é anunciada com o recorte no rótulo: quem navega por
          landmarks e clicou "Marê Mobília" tem que ouvir que a lista mudou —
          sem isso o filtro é um efeito puramente visual. */}
      <ul
        aria-label={
          nomeDaAtiva === undefined
            ? "Catálogos de todas as fábricas"
            : `Catálogos da ${nomeDaAtiva}`
        }
        className={TETO_DA_LISTA}
      >
        {visiveis.map(({ catalogo, marca }, i) => (
          /* O índice entra na chave porque duas coleções da mesma fábrica podem
             chegar com o mesmo título e sem ano (P22). */
          <LinhaDeCatalogo
            key={`${marca.slug}-${i}`}
            catalogo={catalogo}
            marca={marca.nome}
          />
        ))}
      </ul>

      <p
        aria-live="polite"
        className={`text-support ${TETO_DA_LISTA} mt-6 text-pretty text-graphite`}
      >
        {contagem}
      </p>
    </>
  );
}

