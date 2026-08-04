/**
 * O logotipo — o desenho de verdade.
 *
 * Até aqui a marca era uma imitação tipográfica: a palavra BELMARE composta em
 * Söhne, uma faixa de hachura no lugar do símbolo e o descritor distribuído à
 * mão letra por letra. Era o que dava para fazer sem o vetor. O vetor chegou, e
 * estes dois arquivos em `public/marca/` são o traço original da Belmare —
 * símbolo, palavra e descritor como foram desenhados, não como o site os
 * remontava.
 *
 * ⚠️ **O "B" DO SÍMBOLO É VAZADO, NÃO PINTADO.** No traço original ele é um
 * buraco no disco azul; quem der a cor da letra é o que estiver ATRÁS do SVG.
 * Sobre o papel do site isso é exatamente o desejado. Sobre qualquer superfície
 * escura a letra desaparece dentro do azul — então a marca não vai em fundo
 * escuro sem uma versão própria. É a mesma razão de `icon.svg` levar um disco de
 * papel embutido: na aba do navegador não há como saber qual é o fundo.
 *
 * ⚠️ **OS DOIS LOCKUPS SÃO ARQUIVO, NÃO SVG EM LINHA.** Juntos são ~10 KB
 * comprimidos, e cabeçalho e rodapé moram no layout — ou seja, saem em TODA
 * rota. Em linha, esse peso entraria no HTML e outra vez na carga do RSC, a cada
 * navegação. Como arquivo, o navegador busca uma vez e reusa no site inteiro.
 * O preço é que a palavra não herda `currentColor`; ela está gravada na tinta do
 * sistema (#17171A) dentro do próprio SVG.
 *
 * ⚠️ **`width` E `height` SÃO A PROPORÇÃO INTRÍNSECA, NÃO O TAMANHO NA TELA.**
 * São as unidades do viewBox. Quem manda no tamanho é a classe de altura; os
 * atributos existem para o navegador reservar a caixa antes do SVG chegar, e sem
 * eles o cabeçalho salta na primeira pintura de toda visita.
 *
 * Os arquivos são gerados a partir do vetor original: recorte rente ao desenho,
 * coordenadas em uma casa decimal e as três cores da marca normalizadas (o traço
 * veio com #00339A e #00349A, #009A34 e #019B35, #FE0100 e #FE0000 — ruído de
 * vetorização, não decisão). O mesmo símbolo alimenta `icon.svg`,
 * `apple-icon.png` e `favicon.ico`, em `app/(frontend)/`.
 */

/* eslint-disable @next/next/no-img-element --
   `next/image` não tem o que otimizar num SVG estático da própria origem: não há
   formato melhor para converter nem variante responsiva para gerar, e o
   otimizador recusa SVG por padrão. O que ele acrescentaria aqui é uma volta por
   `/_next/image` e um `unoptimized` para desligá-la. */

/** Horizontal — o cabeçalho. Símbolo à esquerda, palavra e descritor à direita. */
export function MarcaCompacta() {
  return (
    <img
      src="/marca/horizontal.svg"
      width={1625}
      height={302}
      /* Vazio de propósito: o único uso é dentro do link do cabeçalho, que já
         carrega `aria-label`. Nome aqui seria o mesmo nome duas vezes. */
      alt=""
      className="h-6 w-auto md:h-8"
    />
  );
}

/** Vertical — rodapé e `/quem-somos`. Símbolo em cima, palavra e descritor embaixo. */
export function MarcaVertical({ className }: { className?: string }) {
  return (
    <img
      src="/marca/vertical.svg"
      width={1256}
      height={1295}
      alt="Belmare Representações"
      /* A altura é do componente, não de quem chama: a marca tem um tamanho no
         site, e `className` aqui é para espaçamento. */
      className={`h-28 w-auto ${className ?? ""}`}
    />
  );
}
