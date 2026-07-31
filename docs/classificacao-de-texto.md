# Classificação gerado / fixo / campo — Representada, Imagem, Peça, Arquivo3D, Acabamento

Registro exaustivo, pedido pela decisão 3 da spec e por PRA-119: toda string tocada pela
migração do conteúdo de `lib/representadas.ts` e `lib/acervo.ts` para o Payload, classificada
numa das três camadas definidas em `CONTEXT.md` (`Gerado` / `Fixo` / `Campo`). Feita uma vez,
para que PRA-120 (Peça, Arquivo3D, Acabamento, Projeto) não precise relitigar caso a caso — só
estender esta tabela para os campos que aquele ticket introduzir.

Cada linha aponta para onde a regra está de fato aplicada (a coleção, o mapper ou o helper de
`lib`), não só para a definição conceitual.

**PRA-120 estendeu esta tabela** com as três coleções filhas — Peça, Arquivo3D, Acabamento —,
sem relitigar a classificação de Representada ou Imagem acima. Projeto continua fora: é
PRA-121.

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

## Coleção `pecas` (`src/collections/pecas.ts`) — PRA-120

| Campo | Camada | Por quê |
|---|---|---|
| `representada` | Campo (relacionamento) | O operador escolhe a fábrica dona da peça; a coleção recusa salvar sem ela. |
| `nome` | Campo | Como a peça se chama — nome comercial, digitado pela Belmare a partir do que a fábrica publica. |
| `categoria` | Campo | Texto digitado, **não** um enum do código — o vocabulário é dado do painel (`Representada.vocabulario`), então travar a lista no tipo impediria a quinta representada de declarar a própria categoria amanhã. A garantia "só categoria do vocabulário desta marca, nunca de outra" é aplicada na validação assíncrona da coleção (UX de editor), não no tipo de domínio — mesma divisão de trabalho da decisão 5 (validação de editor × segurança de tipo). |
| `foto` | Campo (upload) | O operador escolhe a fotografia; sem ela a coleção recusa. |
| `ambiente` | Campo | Só a GDA usa hoje; as outras marcas deixam ausente. Dois valores fixos (`externo`/`interno`) porque é assim que a própria árvore de `briefing/estrutura.md` §4 declara o campo — não é vocabulário aberto. |
| `materiais` | Campo | Legenda de texto livre, opcional. **Nunca filtra, nunca navega, nunca vira parâmetro de URL** — decisão 10 da spec matou o eixo de material deliberadamente (a matriz marca × material é 4 de 32 células preenchidas). Vazio não quebra nada. |

## Coleção `arquivos3d` (`src/collections/arquivos3d.ts`) — PRA-120

| Campo | Camada | Por quê |
|---|---|---|
| `representada` | Campo (relacionamento) | Idem Peça. |
| `nome` | Campo | Como o arquivo é chamado na página — o operador digita, a fábrica não publica um "nome de arquivo 3D" próprio. |
| `arquivo` | Campo (upload) | O binário em si, na coleção `arquivos` (a mesma do PDF do catálogo — ver a nota "hoje PDF, depois arquivo 3D" já registrada em `collections/arquivos.ts` antes deste ticket). A validação (tamanho gravado, extensão legível) é editor UX; formato e peso em si são **gerados**, abaixo. |

## Coleção `acabamentos` (`src/collections/acabamentos.ts`) — PRA-120

| Campo | Camada | Por quê |
|---|---|---|
| `representada` | Campo (relacionamento) | Idem Peça. |
| `nome` | Campo | Como a fábrica chama o acabamento. |
| `tipo` | Campo | Tecido ou pintura — dois valores fixos, porque é assim que `briefing/estrutura.md` §5 declara o campo ("tipo (tecido/pintura)"); não é vocabulário da fábrica. |
| `amostra` | Campo (upload) | A fotografia de perto do acabamento. |

## Gerado — derivado em tempo de leitura, nunca um campo

| Valor | Onde nasce | Por que não pode virar campo |
|---|---|---|
| A marcação "— imagem de referência." | `lib/acervo.ts#descricaoDeImagem` | Gravá-la dentro de `descricao` faz a frase dobrar a cada leitura, e desmarcar `mock` não limparia nada — o próprio critério de aceite deste ticket. |
| `object-position` (`"30% 50%"` etc.) | `lib/acervo.ts#posicaoDoFoco` | Deriva de `focalX`/`focalY`; um campo de texto paralelo poderia divergir do clique. |
| Peso do arquivo em MB | `lib/representadas-traducao.ts#pesoDoArquivo`, a partir de `Arquivo.filesize` | O Payload já mede o arquivo que armazenou; digitar o peso é como o site passa a prometer um número que pode estar errado. Nenhum dos catálogos seedados tem arquivo anexado, então nenhum peso é computado ainda — mas a regra vale a partir do dia em que um PDF for anexado. |
| **[PRA-120]** O formato de um arquivo 3D ("SKP", "DWG"...) | `lib/arquivos3d.ts#formatoDoArquivo`, a partir de `Arquivo.filename` | `.skp`/`.3ds`/`.dwg` chegam do navegador como `application/octet-stream` na maioria dos sistemas — `mimeType` não identifica o formato, só a extensão do nome gravado. Digitado à mão, "SKP" vira exatamente o erro de digitação que o critério de aceite deste ticket proíbe. |
| **[PRA-120]** Peso de um arquivo 3D em MB | `lib/representadas-traducao.ts#pesoDoArquivo`, reaproveitada — não uma segunda função | A mesma regra do catálogo: o Payload já mediu o arquivo que armazenou. Diferente do catálogo, não há estado "a pedir" — um Arquivo3D sem tamanho medido nem extensão legível não vira item nenhum (`lib/arquivos3d.ts#arquivo3DDoPainel` devolve `undefined` inteiro, nunca um objeto pela metade). |
| **[PRA-120]** A decisão de recusar uma `categoria` de Peça | `collections/pecas.ts`, validação assíncrona do campo `categoria` | Não é o valor em si que é gerado (`categoria` é Campo, texto digitado) — é a **decisão de aceitar ou recusar** que é sempre recalculada contra o vocabulário atual da representada escolhida, nunca uma lista de opções congelada no schema. |
| O eixo que autoriza um filtro (`eixoDeFiltro`) | `lib/representadas.ts` | O CAMPO é `vocabulario.eixo` (texto); o que é gerado é a *decisão* de oferecer filtro, que depende de `eixo` estar presente **e** haver mais de um grupo. Essa decisão não tem campo próprio — é sempre recalculada. |
| A contagem de categorias distintas na faixa de índice | `lib/representadas.ts#secoesDaRepresentada` | Itens repetidos entre grupos (a GDA repete as mesmas seis categorias em Externo/Interno) não podem contar em dobro; a contagem é sempre recalculada a partir dos grupos, nunca digitada. |
| A numeração das seções (`01`, `02`, ...) | `lib/representadas.ts#secoesDaRepresentada` | Recalculada a cada leitura, a partir de quais seções sobreviveram — nunca um número fixo por seção. |
| A lista "Marê Mobília, GDA Móveis, Bux Garden e Trisol" | `components/abertura.tsx` (`nomeadas`), `app/representadas/page.tsx` (metadata) | Junção de `REPRESENTADAS.map(r => r.nome)` (ou, depois de PRA-119 completo em todas as superfícies, de `buscarRepresentadas()`) — nunca digitada como frase própria. |
| A contagem "N representadas" | `components/representadas/prancha-area-externa.tsx`, `app/representadas/page.tsx` | `REPRESENTADAS.length` — muda sozinha se uma quinta marca entrar. |
| O tempo de casa ("27 anos") | `lib/site.ts#anosDeMercado` | Fora do escopo direto deste ticket (não é campo de Representada), mas citado aqui porque é o exemplo canônico da spec para "gerado": contagem por dia e mês, nunca um número escrito. |

## Fixo — no código, por ser o argumento do desenho

Nada em `Representada`, `Imagem`, `Peça`, `Arquivo3D` ou `Acabamento` é fixo — cada uma dessas
coleções existe para tornar o próprio dado editável. Os dois exemplos fixos que este ticket
*toca* de raspão, sem alterar, são:

| Texto | Onde mora | Por quê |
|---|---|---|
| "Imagem de referência — ilustra o que a fábrica resolve, não uma peça do catálogo dela." | `components/marca/abertura.tsx` (figcaption) | Legenda visível obrigatória por decisão de desenho — não muda por marca, não é campo de nenhuma representada. |
| Os rótulos das seções ("O que declara", "Quem assina", "Vocabulário", "Para levar", "Falar") | `lib/representadas.ts#secoesDaRepresentada` | São o argumento da página, não conteúdo de uma marca — mudam por reposicionamento de desenho, não por edição de operador. |

## Referência

Definições de camada: `CONTEXT.md`, seção "Camadas de texto". Decisão de origem: spec
"Payload CMS — o site editável sem deploy", decisão 3.
