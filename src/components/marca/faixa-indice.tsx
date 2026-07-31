"use client";

import { useEffect, useRef, useState } from "react";

import type { Secao } from "@/lib/representadas";

/**
 * A faixa de índice — o sumário da prancha.
 *
 * ⚠️ **Ela lista só o que renderizou.** As entradas vêm de
 * `secoesDaRepresentada()`, a mesma função que a página usa para montar as
 * seções, e é isso que impede o defeito clássico de sumário: apontar para uma
 * âncora que não existe. Abra a Trisol e a faixa tem quatro entradas; abra a
 * Marê e tem cinco. A assimetria entre as fábricas — a maior fragilidade de
 * conteúdo deste projeto — vira o próprio dispositivo de navegação, e nenhuma
 * seção precisa de estado vazio, de "em breve" ou de célula em branco.
 *
 * ⚠️ **A contagem antes do clique.** "QUEM ASSINA 8" é a mesma regra que faz o
 * arquivo declarar "SKP · 8,4 MB" antes do download: quem está em obra decide
 * se vale abrir. Custo zero, e é a diferença entre um sumário e um menu.
 *
 * ⚠️ **O realce NÃO é movimento por rolagem.** Nada entra, nada desliza, nada
 * se desenha: um rótulo troca de grafite para tinta, que é como este sistema
 * comunica estado — por tom e por posição. A regra do movimento fechado segue
 * inteira, e é por isso que não há `scroll-behavior: smooth` aqui: âncora que
 * anima é movimento que ninguém pediu.
 *
 * Sem JavaScript a faixa continua sendo o que é: uma lista de âncoras que
 * funcionam. O realce é a única coisa que se perde.
 */
export function FaixaIndice({ secoes }: { secoes: Secao[] }) {
  /* Nada marcado até o observador rodar. Começar em `secoes[0]` fazia a faixa
     afirmar "você está na identificação" mesmo com o JavaScript desligado, e
     um "você está aqui" errado é pior do que nenhum. */
  const [ativa, setAtiva] = useState<string>("");
  const faixa = useRef<HTMLElement>(null);

  useEffect(() => {
    const alvos = secoes
      .map((secao) => document.getElementById(secao.id))
      .filter((el): el is HTMLElement => el !== null);

    if (alvos.length === 0) return;

    /* A altura da pilha fixa, medida e não escrita: são 138px no telefone
       (cabeçalho + navegação + faixa) e 113px a partir de `md`, onde a
       navegação sobe para a mesma linha do cabeçalho. Um literal acertaria uma
       das duas larguras e erraria a outra. */
    const pilha = Math.round(faixa.current?.getBoundingClientRect().bottom ?? 136);
    const visiveis = new Set<string>();

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) visiveis.add(entrada.target.id);
          else visiveis.delete(entrada.target.id);
        }

        /* A primeira da ordem do documento, e não a última observada: com duas
           seções cruzando a faixa ao mesmo tempo, quem manda é a de cima.
           Conjunto vazio mantém a anterior — piscar para o topo no vão entre
           duas seções seria pior que ficar um pouco atrasado. */
        const primeira = secoes.find((secao) => visiveis.has(secao.id));
        if (primeira) setAtiva(primeira.id);
      },
      /* A faixa de decisão vai de logo abaixo dos elementos fixos até 45% da
         altura da janela. Fora dela, nada conta. */
      { rootMargin: `-${pilha}px 0px -45% 0px`, threshold: 0 },
    );

    for (const alvo of alvos) observador.observe(alvo);
    return () => observador.disconnect();
  }, [secoes]);

  return (
    <nav
      ref={faixa}
      aria-label="Seções desta marca"
      className="sticky top-24 z-10 border-b border-line bg-paper md:top-18"
    >
      {/* ⚠️ `barra-fio`, e não `sem-barra`. A navegação do cabeçalho pode
          esconder a barra porque ela transborda com um item cortado ao meio na
          borda, e o corte É o indicador. Aqui não transborda assim: na Marê os
          194px escondidos começam exatamente na borda da tela, com o quarto
          item inteiro fora e nada cortado. Sem indicador, a faixa declara três
          seções quando a marca tem cinco — e declarar o que existe antes do
          clique é a única razão de ela existir. `barra-fio` é o que o sistema
          já traz para bandeja que precisa ser descoberta: 3px na cor do fio. */}
      <ol className="barra-fio flex h-10 items-center gap-6 overflow-x-auto px-5 md:gap-8 md:px-8">
        {secoes.map((secao) => {
          const estaAtiva = secao.id === ativa;

          return (
            <li key={secao.id} className="shrink-0">
              <a
                href={`#${secao.id}`}
                aria-current={estaAtiva ? "true" : undefined}
                className={`mono uppercase whitespace-nowrap transition-colors ${
                  estaAtiva ? "text-ink" : "text-graphite hover:text-ink"
                }`}
              >
                {secao.rotulo}
                {secao.contagem ? (
                  <span className={estaAtiva ? "text-graphite" : ""}>
                    {" "}
                    {secao.contagem}
                  </span>
                ) : null}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
