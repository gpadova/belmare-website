"use client";

import { useState } from "react";

import {
  GRADE_DO_ARQUIVO,
  LinhaDeArquivo3D,
  TETO_DA_BIBLIOTECA,
} from "@/components/arquivos-3d/linha-de-arquivo";
import { FilaDeRecortes, Recorte } from "@/components/recorte";
import {
  recorteDaBiblioteca,
  SEM_RECORTE,
  type ItemDaBiblioteca,
} from "@/lib/arquivos3d";
import { comInicialMaiuscula, porExtenso } from "@/lib/frase";

/**
 * A lista de `/arquivos-3d`, com os dois recortes — fábrica e formato.
 *
 * ⚠️ **A LISTA É PLANA, E ISSO REVERTE O AGRUPAMENTO COM QUE ESTA ROTA
 * NASCEU.** Ela desenhava um `<h2>` por fábrica e, dentro dele, um `<h3>` por
 * formato. Os dois eixos continuam existindo — viraram os dois eixos do filtro,
 * e as duas razões que sustentavam os cabeçalhos são melhor atendidas assim:
 *
 *   1. *"Cadeira Zuri não diz de quem é."* Verdade, e continua. Quem responde
 *      agora é a **coluna** `FÁBRICA` da linha, que responde em toda linha, e
 *      não só na primeira depois do cabeçalho.
 *   2. *"Quem só abre SketchUp lê a lista inteira para achar metade."* O
 *      agrupamento resolvia isso **dentro de uma fábrica** — ele dava os `.skp`
 *      da Trisol, e quem quisesse os `.skp` das quatro tinha que descer a página
 *      abrindo quatro blocos. Um clique em `SKP` dá as quatro de uma vez.
 *
 * O que se perde é o cabeçalho como marcador de posição na rolagem. O que se
 * ganha é uma lista que encurta, e a mesma gramática de `/catalogos`: título,
 * filtro, lista, contagem. Um arquiteto que aprendeu a ler uma não reaprende
 * nada na outra — que é a promessa que as duas rotas fazem desde que a segunda
 * existe.
 *
 * ⚠️ **FILTRA NO NAVEGADOR, E POR ISSO NÃO ABRE CONSULTA NENHUMA.** O princípio
 * 2 do `PRODUCT.md` continua inteiro: `buscarBiblioteca3D` é N leituras
 * escopadas por `representada.slug`, e o recorte acontece sobre o array que já
 * está na tela. Não existe consulta de "arquivos de duas fábricas", não existe
 * rota `/arquivos-3d?formato=`, e a página continua estática. O clique é
 * instantâneo porque nada vai ao servidor. É a mesma construção de
 * `catalogos/lista-de-catalogos.tsx` — ver a nota longa de
 * `lib/arquivos3d.ts#recortesDeFormato`, que é onde a reversão do filtro por
 * formato está registrada por extenso.
 *
 * ⚠️ **NENHUM EIXO APARECE COM UMA OPÇÃO SÓ.** Uma biblioteca inteira em `.skp`
 * desenharia `TODOS 12 · SKP 12` — dois controles que fazem a mesma coisa, que é
 * nada. É a regra que apagou as linhas sem PDF de `/catalogos` levada um degrau
 * acima: se um controle não leva a lugar nenhum ele não existe, e um EIXO que
 * não pode mudar a tela é um controle inteiro nessa condição. Vale para os dois
 * — com uma fábrica só publicada, o eixo da fábrica também não é desenhado.
 */
export function ListaDeArquivos3D({ lista }: { lista: ItemDaBiblioteca[] }) {
  /* Duas strings, e é todo o estado desta tela: a INTENÇÃO de quem clicou. O
     resto — opções, contagens e linhas — é derivado por
     `recorteDaBiblioteca`, que é pura e testada. */
  const [marcaEscolhida, setMarcaEscolhida] = useState(SEM_RECORTE);
  const [formatoEscolhido, setFormatoEscolhido] = useState(SEM_RECORTE);

  const { marca, formato, marcas, formatos, visiveis } = recorteDaBiblioteca(
    lista,
    marcaEscolhida,
    formatoEscolhido,
  );

  const total = visiveis.length;
  const nomeDaMarca = marcas.find((o) => o.chave === marca)?.rotulo;

  /* O número do recorte que não recorta, **somado das opções do próprio eixo** e
     não recontado da lista. As opções já vêm contadas sobre a lista recortada
     pelo OUTRO eixo (ver `recorteDaBiblioteca`), então esta soma é, por
     construção, o que sobra ao clicar em "Todas" — e não tem como divergir das
     parcelas desenhadas ao lado dela. Repetir aqui o predicado do filtro daria
     duas contas para o mesmo número, que é como "24,0 MB" vira "24MB" na tela
     ao lado. */
  const somar = (opcoes: { quantidade: number }[]) =>
    opcoes.reduce((soma, opcao) => soma + opcao.quantidade, 0);

  /* A contagem é **gerada**, como toda contagem em prosa do site: um número
     escrito à mão aqui continuaria dizendo o do primeiro lote no dia do
     segundo.

     ⚠️ **"TODOS BAIXAM SEM CADASTRO" É A TESE DA PÁGINA, e ela mora aqui porque
     era o que a coluna de argumento dizia.** A coluna saiu inteira; a frase que
     de fato interessava a quem veio buscar um bloco desceu para a linha que
     conta o que está na tela — o mesmo lugar em que `/catalogos` diz "Todos
     abrem sem cadastro". O pacote completo, três centímetros abaixo, é a única
     exceção, e ele mesmo a declara. */
  const contagem = `${comInicialMaiuscula(porExtenso(total, "m"))} ${
    total === 1 ? "arquivo" : "arquivos"
  }${formato === SEM_RECORTE ? "" : ` em ${formato}`} ${
    nomeDaMarca === undefined
      ? `de ${porExtenso(marcas.length)} ${marcas.length === 1 ? "fábrica" : "fábricas"}`
      : `da ${nomeDaMarca}`
  }. Todos baixam sem cadastro.`;

  return (
    <>
      {/* Os dois eixos só entram quando podem mudar alguma coisa — ver a nota de
          topo. `space-y` em vez de margem no filho: com um dos dois ausente, uma
          margem escrita no segundo abriria um vão sobre o primeiro. */}
      {(marcas.length > 1 || formatos.length > 1) && (
        <div className={`${TETO_DA_BIBLIOTECA} space-y-4`}>
          {marcas.length > 1 && (
            <FilaDeRecortes eixo="Fábrica" comRotulo>
              <Recorte
                rotulo="Todas"
                quantidade={somar(marcas)}
                ativo={marca === SEM_RECORTE}
                aoEscolher={() => setMarcaEscolhida(SEM_RECORTE)}
              />
              {marcas.map((opcao) => (
                <Recorte
                  key={opcao.chave}
                  rotulo={opcao.rotulo}
                  quantidade={opcao.quantidade}
                  ativo={marca === opcao.chave}
                  aoEscolher={() => setMarcaEscolhida(opcao.chave)}
                />
              ))}
            </FilaDeRecortes>
          )}

          {formatos.length > 1 && (
            <FilaDeRecortes eixo="Formato" comRotulo>
              <Recorte
                rotulo="Todos"
                quantidade={somar(formatos)}
                ativo={formato === SEM_RECORTE}
                aoEscolher={() => setFormatoEscolhido(SEM_RECORTE)}
              />
              {formatos.map((opcao) => (
                <Recorte
                  key={opcao.chave}
                  /* ⚠️ "SKP" é **sigla**, e a Regra da Caixa Alta reserva versal
                     para medida, código, sigla e rótulo de campo. Ela chega aqui
                     já em caixa alta de `formatoDoArquivo`, que é onde a caixa
                     foi decidida — o controle não a impõe, porque no eixo ao
                     lado a mesma posição carrega nome de fábrica. */
                  rotulo={opcao.rotulo}
                  quantidade={opcao.quantidade}
                  ativo={formato === opcao.chave}
                  aoEscolher={() => setFormatoEscolhido(opcao.chave)}
                />
              ))}
            </FilaDeRecortes>
          )}
        </div>
      )}

      {/* Cabeçalho de colunas de verdade, não rótulo decorativo: cada label
          assenta sobre a coluna que nomeia — por isso a grade é importada da
          linha, e não redigitada. No telefone a linha empilha e só ARQUIVO faz
          sentido, porque FÁBRICA e FORMATO E PESO nomeariam colunas que ali não
          existem. */}
      <div
        aria-hidden
        className={`mono ${GRADE_DO_ARQUIVO} ${TETO_DA_BIBLIOTECA} mt-6 border-b border-line pb-3 uppercase text-graphite`}
      >
        <span className="col-start-1 md:hidden">Arquivo</span>
        <span className="col-start-1 hidden md:block">Fábrica</span>
        <span className="col-start-2 hidden md:block">Arquivo</span>
        <span className="col-start-3 hidden md:block">Formato e peso</span>
      </div>

      {/* ⚠️ A lista é anunciada com o recorte no rótulo: quem navega por
          landmarks e clicou "SKP" tem que ouvir que a lista mudou — sem isso o
          filtro é um efeito puramente visual. */}
      <ul
        aria-label={`Arquivos 3D ${
          nomeDaMarca === undefined ? "de todas as fábricas" : `da ${nomeDaMarca}`
        }${formato === SEM_RECORTE ? "" : ` em ${formato}`}`}
        className={TETO_DA_BIBLIOTECA}
      >
        {visiveis.map(({ arquivo, marca: fabrica }) => (
          /* A chave junta marca, nome e formato porque a mesma peça existe em
             dois formatos e duas fábricas podem batizar uma peça igual. */
          <LinhaDeArquivo3D
            key={`${fabrica.slug}-${arquivo.nome}-${arquivo.formato}`}
            arquivo={arquivo}
            marca={fabrica.nome}
          />
        ))}
      </ul>

      <p
        aria-live="polite"
        className={`text-support ${TETO_DA_BIBLIOTECA} mt-6 text-pretty text-graphite`}
      >
        {contagem}
      </p>
    </>
  );
}
