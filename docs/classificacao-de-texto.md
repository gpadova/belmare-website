# Classificação gerado / fixo / campo — Representada e Imagem

Registro exaustivo, pedido pela decisão 3 da spec e por PRA-119: toda string tocada pela
migração do conteúdo de `lib/representadas.ts` e `lib/acervo.ts` para o Payload, classificada
numa das três camadas definidas em `CONTEXT.md` (`Gerado` / `Fixo` / `Campo`). Feita uma vez,
para que PRA-120 (Peça, Arquivo3D, Acabamento, Projeto) não precise relitigar caso a caso — só
estender esta tabela para os campos que aquele ticket introduzir.

Cada linha aponta para onde a regra está de fato aplicada (a coleção, o mapper ou o helper de
`lib`), não só para a definição conceitual.

## Coleção `representadas` (`src/collections/representadas.ts`)

| Campo | Camada | Por quê |
|---|---|---|
| `nome` | Campo | Editado pela Belmare quando a fábrica muda de nome comercial. |
| `slug` | Campo | Decisão de endereço, não de conteúdo — mas é o operador quem a toma (a Belmare decide a URL). |
| `ordem` | Campo | Decisão de apresentação da Belmare, explícita no rótulo do campo ("Posição nas listas"). Não é derivada de nenhum outro dado. |
| `resolve` | Campo | Prosa institucional por marca — o que a spec chama de "editar a prosa institucional de uma representada" (história 5). |
| `parte` | Campo | O rótulo da chamada na prancha; a fábrica não o publica, é uma escolha editorial da Belmare, mas ainda assim digitada, não calculada. |
| `base` | Campo | Fato verificável, mas só existe se alguém o registrar — sem ele, ausente, nunca inventado. |
| `fato` | Campo | Idem. |
| `imagem`, `imagemLarga` | Campo (upload) | O operador escolhe o upload; a validação (recusa de repetição, formato) é editor UX, não geração. |
| `declaracoes[].rotulo`, `declaracoes[].valor` | Campo | Ficha técnica nas palavras da própria fábrica — não existe fonte automática. |
| `designers[].nome`, `.colecoes`, `.nota` | Campo | Atribuição pública da fábrica, digitada uma vez. |
| `colecoes` (sem atribuição) | Campo | Mesmo caso, sem designer ligado. |
| `vocabulario.eixo`, `.grupos[].nome`, `.grupos[].slug`, `.grupos[].itens[].nome`, `.itens[].nota` | Campo | Vocabulário da própria fábrica; o eixo em si é dado, não fixo — mas **decide** se um filtro existe (ver "gerado" abaixo). |
| `catalogos[].titulo`, `.ano` | Campo | Título e edição só existem quando a fábrica os declara. |
| `catalogos[].arquivo` | Campo (upload) | O PDF em si, quando em mãos. Nenhuma das quatro marcas tem um anexado hoje — a seed não cria este relacionamento. |

## Coleção `imagens` (`src/collections/imagens.ts`)

| Campo | Camada | Por quê |
|---|---|---|
| `descricao` | Campo | O que o operador escreve — **sem** a marcação de mock, que é gerada por cima dela. |
| `mock` | Campo | Um checkbox que o operador liga/desliga; decide se o gerado abaixo aparece. |
| `focalX` / `focalY` | Campo | O clique do operador no assunto da foto — substitui os valores de `object-position` medidos à mão em código. |
| `alt` (virtual) | **Gerado** | Composto em `afterRead` por `descricaoDeImagem(descricao, mock)`; nunca gravado, nunca editável (`admin.readOnly`). |

## Gerado — derivado em tempo de leitura, nunca um campo

| Valor | Onde nasce | Por que não pode virar campo |
|---|---|---|
| A marcação "— imagem de referência." | `lib/acervo.ts#descricaoDeImagem` | Gravá-la dentro de `descricao` faz a frase dobrar a cada leitura, e desmarcar `mock` não limparia nada — o próprio critério de aceite deste ticket. |
| `object-position` (`"30% 50%"` etc.) | `lib/acervo.ts#posicaoDoFoco` | Deriva de `focalX`/`focalY`; um campo de texto paralelo poderia divergir do clique. |
| Peso do arquivo em MB | `lib/representadas-traducao.ts#pesoDoArquivo`, a partir de `Arquivo.filesize` | O Payload já mede o arquivo que armazenou; digitar o peso é como o site passa a prometer um número que pode estar errado. Nenhum dos catálogos seedados tem arquivo anexado, então nenhum peso é computado ainda — mas a regra vale a partir do dia em que um PDF for anexado. |
| O eixo que autoriza um filtro (`eixoDeFiltro`) | `lib/representadas.ts` | O CAMPO é `vocabulario.eixo` (texto); o que é gerado é a *decisão* de oferecer filtro, que depende de `eixo` estar presente **e** haver mais de um grupo. Essa decisão não tem campo próprio — é sempre recalculada. |
| A contagem de categorias distintas na faixa de índice | `lib/representadas.ts#secoesDaRepresentada` | Itens repetidos entre grupos (a GDA repete as mesmas seis categorias em Externo/Interno) não podem contar em dobro; a contagem é sempre recalculada a partir dos grupos, nunca digitada. |
| A numeração das seções (`01`, `02`, ...) | `lib/representadas.ts#secoesDaRepresentada` | Recalculada a cada leitura, a partir de quais seções sobreviveram — nunca um número fixo por seção. |
| A lista "Marê Mobília, GDA Móveis, Bux Garden e Trisol" | `components/abertura.tsx` (`nomeadas`), `app/representadas/page.tsx` (metadata) | Junção de `REPRESENTADAS.map(r => r.nome)` (ou, depois de PRA-119 completo em todas as superfícies, de `buscarRepresentadas()`) — nunca digitada como frase própria. |
| A contagem "N representadas" | `components/representadas/prancha-area-externa.tsx`, `app/representadas/page.tsx` | `REPRESENTADAS.length` — muda sozinha se uma quinta marca entrar. |
| O tempo de casa ("27 anos") | `lib/site.ts#anosDeMercado` | Fora do escopo direto deste ticket (não é campo de Representada), mas citado aqui porque é o exemplo canônico da spec para "gerado": contagem por dia e mês, nunca um número escrito. |

## Fixo — no código, por ser o argumento do desenho

Nada em `Representada` ou `Imagem` é fixo — a coleção inteira existe para tornar esses dados
editáveis. Os dois exemplos fixos que este ticket *toca* de raspão, sem alterar, são:

| Texto | Onde mora | Por quê |
|---|---|---|
| "Imagem de referência — ilustra o que a fábrica resolve, não uma peça do catálogo dela." | `components/marca/abertura.tsx` (figcaption) | Legenda visível obrigatória por decisão de desenho — não muda por marca, não é campo de nenhuma representada. |
| Os rótulos das seções ("O que declara", "Quem assina", "Vocabulário", "Para levar", "Falar") | `lib/representadas.ts#secoesDaRepresentada` | São o argumento da página, não conteúdo de uma marca — mudam por reposicionamento de desenho, não por edição de operador. |

## Referência

Definições de camada: `CONTEXT.md`, seção "Camadas de texto". Decisão de origem: spec
"Payload CMS — o site editável sem deploy", decisão 3.
