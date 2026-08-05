/**
 * O logotipo de uma fábrica representada.
 *
 * ⚠️ **O SITE NÃO MEXE NA MARCA DOS OUTROS.** Sem recolorir, sem filtro, sem
 * `currentColor`, sem recorte — o arquivo que o operador subiu é o que a página
 * publica. Não é preguiça: "autorização de uso" quase sempre chega junto com um
 * manual de marca, e manual de marca costuma proibir exatamente a versão
 * monocromática que este sistema acromático pediria. A regra do matiz de
 * `DESIGN.md` foi reescrita para dizer o que sempre quis dizer — a cor vive
 * dentro de uma MARCA e nunca na interface: não vira acento, nem estado, nem
 * fio, nem fundo.
 *
 * ⚠️ **`<img>`, E NUNCA SVG EM LINHA — AQUI ISSO É SEGURANÇA, NÃO SÓ PESO.** Um
 * SVG é conteúdo executável: ele pode carregar `<script>`, e o arquivo chega ao
 * bucket sem passar por nenhuma função nossa (`clientUploads: true`, em
 * `payload.config.ts`), então não existe hook de servidor que higienize o vetor
 * antes de ele existir. O que contém o risco é a publicação: dentro de `<img>`
 * o navegador desenha o SVG e **não executa script nenhum**. Trocar isto por
 * `dangerouslySetInnerHTML`, `<object>` ou `<embed>` — a tentação natural de
 * quem quiser herdar `currentColor` — transforma o upload de um terceiro em
 * execução de código na origem do site. As duas decisões se sustentam: não
 * recolorir é o que remove a única razão de embutir o vetor.
 *
 * ⚠️ **`alt=""` É A LEITURA CORRETA, NÃO UM CAMPO ESQUECIDO.** Nas duas
 * superfícies onde esta marca aparece, o nome da fábrica está escrito ao lado
 * dela em `h3`. Um `alt` com o nome faria o leitor de tela anunciar "Marê
 * Mobília" duas vezes seguidas; imagem cujo conteúdo o texto vizinho já carrega
 * é decorativa, e a WCAG a quer marcada assim. É a mesma decisão de
 * `MarcaCompacta` em `marca-belmare.tsx`, pela mesma razão.
 *
 * ⚠️ **A MARCA É LIMITADA POR CAIXA, NUNCA POR ALTURA — e isto foi corrigido
 * olhando a tela, não pensando nela.** A primeira versão fixava a altura
 * (`h-full`) e deixava a largura livre. Numa prova com quatro proporções
 * diferentes o resultado foi indefensável: uma palavra deitada de 5:1 assentava
 * bem, e um lockup empilhado de ~1,2:1 — símbolo em cima, nome embaixo —
 * encolhia para uns 33px de largura, com o nome da fábrica virando um borrão de
 * três pixels. Altura igual **não** é peso igual: para a marca quadrada, altura
 * igual é área quatro vezes menor.
 *
 * O teto duplo (`max-h` mais `max-w`) faz cada marca esbarrar no limite que lhe
 * cabe. A deitada bate na largura e fica baixa; a empilhada bate na altura e usa
 * a caixa inteira. Não é área idêntica — isso exigiria a proporção de cada
 * arquivo, que o upload direto para o bucket não nos entrega —, mas aproxima o
 * bastante para as duas serem legíveis, e sem um número por fábrica.
 *
 * ⚠️ **QUEM RESERVA A CAIXA É A FAIXA, NÃO A IMAGEM.** Com a marca dimensionada
 * por teto, a altura dela antes de carregar é zero. É a `<div>` da faixa, com
 * altura fixa em classe, que impede a fotografia de saltar na primeira pintura —
 * e é ela também que mantém os quatro cartões alinhados quando só uma fábrica
 * mandou o vetor. Ver `representadas-galeria.tsx`.
 *
 * ⚠️ **AINDA NÃO HÁ COMPENSAÇÃO ÓPTICA POR FÁBRICA, E É DE PROPÓSITO.** O teto
 * duplo resolve o caso grosseiro — ilegível contra legível. O ajuste fino, que é
 * um lockup pesar mais que o outro na mesma caixa, depende dos quatro arquivos
 * reais, e nenhum chegou. No dia em que estiverem no painel e um estiver
 * visivelmente errado, um campo `alturaOptica` na Representada se paga.
 */

/* eslint-disable @next/next/no-img-element --
   `next/image` recusa SVG por padrão, e ligá-lo com `dangerouslyAllowSVG` é
   abrir justamente o caminho que a nota acima fecha. Sobre um arquivo de alguns
   kilobytes o otimizador também não teria o que otimizar: não há formato melhor
   para converter nem variante responsiva para gerar. */

export function Logotipo({
  src,
  className,
}: {
  src: string;
  className: string;
}) {
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      className={`object-contain object-left ${className}`}
    />
  );
}
