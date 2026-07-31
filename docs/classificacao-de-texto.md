# Classificação gerado / fixo / campo — Representada, Imagem, Peça, Arquivo3D, Acabamento, Empresa, Home, QuemSomos, Prancha

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

**PRA-122 estendeu esta tabela** com os três globais — `Empresa`, `Home`, `QuemSomos` — e é o
ticket onde a classificação teve mais consequência, porque um global é exatamente onde uma
pessoa bem-intencionada põe tudo. **A lista do que NÃO virou campo vale mais do que a do que
virou**, e está registrada abaixo justamente para o próximo ticket não precisar reabrir cada
string.

**PRA-123 estendeu esta tabela** com o global `Prancha` — e é o único caso em que um CAMPO não
é texto nem arquivo, e sim GEOMETRIA: quatro porcentagens por chamada. A pergunta que a
classificação faz continua a mesma ("quem decide este valor, e a partir de quê?"), e a resposta
aqui é o operador olhando para a própria fotografia. O rótulo da chamada, que é a única string
do desenho, **não virou campo de propósito** — ver a linha de `Representada.parte` na tabela de
gerado.

## Coleção `representadas` (`src/collections/representadas.ts`)

| Campo | Camada | Por quê |
|---|---|---|
| `nome` | Campo | Editado pela Belmare quando a fábrica muda de nome comercial. |
| `slug` | Campo | Decisão de endereço, não de conteúdo — mas é o operador quem a toma (a Belmare decide a URL). |
| `ordem` | Campo | Decisão de apresentação da Belmare, explícita no rótulo do campo ("Posição nas listas"). Não é derivada de nenhum outro dado. |
| `resolve` | Campo | Prosa institucional por marca — o que a spec chama de "editar a prosa institucional de uma representada" (história 5). |
| `parte` | Campo | O rótulo da chamada na prancha; a fábrica não o publica, é uma escolha editorial da Belmare, mas ainda assim digitada, não calculada. **[PRA-123]** É o ÚNICO lugar onde essa palavra existe: a chamada da prancha não tem campo de texto próprio, e o rótulo do desenho é lido daqui. |
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

## Global `empresa` (`src/globals/empresa.ts`) — PRA-122

O global que destrava o lançamento: o WhatsApp e o e-mail comercial estavam MOCKADOS em
`lib/site.ts` com um aviso de "trocar antes do lançamento", o que significava um commit e um
deploy para corrigir um telefone.

| Campo | Camada | Por quê |
|---|---|---|
| `whatsapp` | Campo | **O motivo do ticket.** Normalizado para E.164 num `beforeValidate` e recusado em pt-BR quando não é telefone brasileiro (`lib/empresa.ts#numeroDeWhatsapp`). Não é `required`: exigi-lo obrigaria o seed a inventar um número, que é o mock voltando. Vazio, o site não desenha botão de WhatsApp em página nenhuma. |
| `email` | Campo | Idem — era `EMAIL_COMERCIAL` em código. Normalizado e validado; vazio, a linha some do rodapé. |
| `telefones[].numero` | Campo | Vira `tel:` no rodapé e na ficha. Validado pela MESMA regra do WhatsApp: um telefone que não disca é a mesma falha silenciosa. |
| `instagram` | Campo | Endereço do perfil. Vazio, o link some. |
| `nomeCompleto`, `razaoSocial`, `cnpj`, `porte` | Campo | Transcrição do registro, corrigível sem deploy. `cnpj` confere os dígitos verificadores (`lib/empresa.ts#cnpjFormatado`): é o único número que o leitor de `/quem-somos` vai de fato digitar na consulta oficial. |
| `abertura` | Campo (data) | **O único campo de data da empresa, e a fonte de três valores gerados** — ver abaixo. Recusa data no futuro. |
| `endereco.*` | Campo | Sede. Uma linha em branco desaparece do endereço em vez de deixar um vão. |

## Global `home` (`src/globals/home.ts`) — PRA-122

| Campo | Camada | Por quê |
|---|---|---|
| `galeria` | Campo | O parágrafo sob o título da seção das marcas — a única prosa institucional da home inteira. Em branco, o parágrafo desaparece (seção anulável). |

## Global `quem-somos` (`src/globals/quem-somos.ts`) — PRA-122

| Campo | Camada | Por quê |
|---|---|---|
| `registro` (bloco 01) | Campo | Parágrafo sob "A empresa, por extenso." |
| `atividades` (bloco 02) | Campo | Parágrafo que explica a tabela de CNAEs. |
| `nome` (bloco 03) | Campo **a partir da segunda frase** | A primeira frase é montada com `Empresa.razaoSocial`. Se ela fosse texto livre, trocar a razão social no painel deixaria a prosa nomeando a antiga — numa página cujo argumento é que cada linha pode ser conferida na fonte. |
| `acervo` (bloco 05) | Campo **a partir da segunda frase** | A primeira frase conta as fábricas ("Quatro fábricas, quatro papéis.") e abre um ledger que lista as marcas logo abaixo. Texto livre ali congelaria em "quatro" no dia da quinta marca. |
| `interlocutor` (bloco 06) | Campo | Parágrafo do fecho. |

O bloco 04 (a prancha do território) **não tem campo nenhum** — ver a tabela de gerado abaixo.

## Global `prancha` (`src/globals/prancha.ts`) — PRA-123

A PRANCHA 02 de `/representadas`: a fotografia da área externa e as chamadas numeradas que
apontam para os objetos dela. Existe por um modo de falha, não por simetria com os outros
globais — as coordenadas eram porcentagens **medidas à mão** contra uma fotografia específica, e
trocar a fotografia sem recalcular as quatro deixava quatro linhas apontando para deck vazio,
sem quebrar nada visivelmente.

| Campo | Camada | Por quê |
|---|---|---|
| `foto` | Campo (upload) | A fotografia da cena. Recusa salvar sem ela, em pt-BR. As dimensões do arquivo (`width`/`height`) **não** são campo — são lidas pelo Payload e definem o aspecto da moldura na página, que é o que mantém a porcentagem valendo (`lib/prancha-traducao.ts`). |
| `chamadas[].representada` | Campo (relacionamento) | Qual fábrica responde por aquele objeto da cena. É o único campo da chamada que o operador **escolhe** em vez de arrastar. |
| `chamadas[].rotuloX`, `.rotuloY` | Campo | Onde a etiqueta numerada pousa, em porcentagem da caixa da imagem. Digitável nos campos numéricos **e** arrastável no campo de pinos — o mesmo valor, dois caminhos, porque um campo só de mouse tranca do lado de fora quem não usa mouse. |
| `chamadas[].alvoX`, `.alvoY` | Campo | Onde a linha de chamada encosta no objeto. Independente da etiqueta de propósito: a etiqueta pousa em área vazia, o alvo pousa no objeto, e são justamente os dois lugares que uma fotografia nova desloca de forma diferente. |

## Prancha — o que PRA-123 recusou a transformar em campo

| Texto | Onde mora | Por que não é campo |
|---|---|---|
| O rótulo da chamada ("MÓVEL", "ESTRUTURA", "ESTOFADO", "SOMBRA") | **Gerado** de `Representada.parte` | Um campo de texto na chamada seria a SEGUNDA cópia da mesma palavra — a primeira mora na representada —, e é assim que uma seta acaba escrita com o nome de uma fábrica. A cena é gerada: uma seta dizendo "Trisol" afirma que aquele ombrelone é produto da Trisol. Nomear a função é verdade; nomear a peça é inventar acervo com cara de ficha técnica. |
| A numeração `01`, `02`, `03`… | **Gerado** de `lib/prancha-area-externa.ts#numeroDaChamada` | É a posição na lista, recalculada a cada leitura. Três chamadas numeram 01–03. Um campo de número deixaria o painel publicar duas chamadas "02". |
| O aspecto da moldura da prancha | **Gerado** de `width`/`height` da fotografia | Era `aspect-16/9` cravado no componente. Com a fotografia vindo do operador, cravar o aspecto da foto ANTERIOR é a mesma armadilha das coordenadas medidas à mão, uma camada acima: `object-cover` num aspecto diferente recorta a imagem por dentro da moldura e desloca TODAS as chamadas de uma vez. |
| "Três fábricas para uma área externa." | **Gerado** de `lib/frase.ts#porExtenso` sobre as chamadas desenhadas | A sexta contagem em prosa do site, e a única que PRA-122 não pegou. Com o painel abrindo a prancha para três ou cinco chamadas, um "Quatro" cravado passaria a discordar do desenho ao lado. |
| O h1 "O móvel, a estrutura, o estofado e a sombra." | **Fixo** (`components/representadas/prancha-area-externa.tsx`) | Mesma regra do h1 da home, e a mesma decisão de PRA-122 que este ticket não relitiga: h1 é o argumento do desenho. **Consequência aceita e registrada:** ele nomeia quatro objetos, e uma prancha de três ou cinco chamadas não o atualiza. É deliberado — uma quinta função na cena é reposicionamento, e reposicionamento é conversa, não edição. É a mesma nota que a ajuda do campo `Home.galeria` já dá ao operador. |
| O carimbo "N representadas · Sul do Brasil" | **Gerado** das representadas cadastradas, e **não** das chamadas | Os dois números podem divergir a partir deste ticket. A linha está emparelhada com o território, que é fato da empresa e não do desenho, e o índice de registros logo abaixo lista todas as marcas. Quem conta o desenho é a legenda. |
| A prancha do TERRITÓRIO de `/quem-somos` | **Fixo** (`lib/territorio.ts`) | Fora de escopo por decisão 4 da spec e pelo próprio ticket: malha oficial do IBGE, reprojetada e simplificada. Regerada da fonte quando muda, nunca editada à mão, nunca no CMS. As duas pranchas compartilham a gramática de desenho e nada mais. |

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
| A contagem "N representadas" | `components/representadas/prancha-area-externa.tsx`, `app/representadas/page.tsx` | Sai do painel (`representadasDaPagina()`) desde PRA-123 — muda sozinha se uma quinta marca entrar. |
| O tempo de casa ("27 anos") | `lib/empresa.ts#anosDeMercado` (era `lib/site.ts`) | O exemplo canônico da spec para "gerado": contagem por dia e mês a partir de `Empresa.abertura`, nunca um número escrito. **[PRA-122]** Não existe campo de "anos de mercado" em lugar nenhum do painel, e o aviso está escrito na ajuda do campo de data. Um "26" digitado congela e passa a errar em silêncio a partir do aniversário seguinte, uma vez por ano, no primeiro número da primeira tela. |
| **[PRA-122]** O ano de fundação ("Desde 1999") | `lib/empresa.ts#anoDeFundacao` | Era `fundacao: 1999` ao lado de `abertura: "22.04.1999"` em `lib/site.ts` — dois campos para um fato só. Agora sai da data. |
| **[PRA-122]** A data de abertura por extenso ("22.04.1999") | `lib/empresa.ts#aberturaPorExtenso` | Mesma razão: a ficha do bloco 01 imprime a transcrição do registro, e ela sai da data que o operador escolheu no calendário — não de um segundo campo de texto que poderia discordar. |
| **[PRA-122]** O território ("Paraná, Santa Catarina e Rio Grande do Sul") | `lib/empresa.ts#TERRITORIO`, a partir de `lib/territorio.ts#ESTADOS` | **A única decisão do ticket que não segue a lista de campos do próprio ticket.** A prosa de `/quem-somos` nomeia os estados três centímetros acima do desenho que os traça — malha oficial do IBGE, fora do escopo de edição por decisão 4 da spec. Um campo de texto deixaria o operador escrever um quarto estado que a prancha não sabe desenhar, e a página passaria a contradizer o único gráfico que ela tem. Expandir território é regerar a malha, que é o mesmo deploy que o desenho novo já exigiria. |
| **[PRA-122]** Toda contagem em prosa: "As **quatro** fábricas que a Belmare representa", "de **quatro** fábricas brasileiras", "**Quatro** fábricas, **quatro** papéis", "**Três** estados", "Ver as **quatro** representadas", "**Cinco** atividades registradas" | `lib/frase.ts#porExtenso`, sobre `representadasDaPagina()`, `TERRITORIO` e `CNAES` | Eram a palavra `quatro` digitada dentro de uma frase, em cinco arquivos. No dia da quinta marca as cinco continuariam dizendo quatro, sem calendário nenhum para denunciar — a mesma falha do tempo de casa, e mais silenciosa. |
| **[PRA-122]** A junção "A, B, C **e** D" | `lib/frase.ts#emLista` | Existia inline em `abertura.tsx` e numa segunda escrita (`join(", ").replace(...)`) em mais três lugares. Quatro cópias da mesma pontuação é como a lista de marcas da home e a de estados do rodapé passam a ser escritas de dois jeitos na mesma tela. |

## Fixo — no código, por ser o argumento do desenho

Nada em `Representada`, `Imagem`, `Peça`, `Arquivo3D` ou `Acabamento` é fixo — cada uma dessas
coleções existe para tornar o próprio dado editável. Os dois exemplos fixos que este ticket
*toca* de raspão, sem alterar, são:

| Texto | Onde mora | Por quê |
|---|---|---|
| "Imagem de referência — ilustra o que a fábrica resolve, não uma peça do catálogo dela." | `components/marca/abertura.tsx` (figcaption) | Legenda visível obrigatória por decisão de desenho — não muda por marca, não é campo de nenhuma representada. |
| Os rótulos das seções ("O que declara", "Quem assina", "Vocabulário", "Para levar", "Falar") | `lib/representadas.ts#secoesDaRepresentada` | São o argumento da página, não conteúdo de uma marca — mudam por reposicionamento de desenho, não por edição de operador. |

### Fixo — o que PRA-122 recusou a transformar em campo

Esta é a lista que o próximo ticket **não precisa relitigar**. Cada linha é uma string que estava
ao alcance de um global e ficou no código de propósito.

| Texto | Onde mora | Por que não é campo |
|---|---|---|
| O h1 da home — "Sofá, mesa, espreguiçadeira e ombrelone." | `components/abertura.tsx` | O argumento do desenho, não conteúdo dentro dele. Já foi "Quatro fábricas. Um interlocutor." (jargão de organograma) e "Móveis para área externa" (descreve uma fábrica, e a Belmare é representação); as duas caíram em 30/07/2026. Um campo de texto é o caminho de volta para uma delas numa tarde em que ninguém lembra por que caíram. Trocá-lo é reposicionar a empresa, e reposicionamento é conversa, não edição. |
| Os rótulos numerados de `/quem-somos` (`01`…`06`) e os títulos de cada bloco | `components/quem-somos/bloco.tsx` e cada bloco | A sequência É o argumento da página: ler fora de ordem é ler outra coisa. Não há array de blocos, não há campo de título, não há campo de número. |
| O nome e o texto de apoio das duas portas | `components/portas.tsx` | Decisão 3 da spec. As duas têm que ter peso igual, e a simetria "eu especifico / eu compro" é o argumento — um campo por porta é como uma delas fica maior que a outra. |
| A linha de apoio da abertura da home, fora das partes contadas | `components/abertura.tsx` | Ela existe para carregar dado (marcas, território, tempo de casa) sem virar slogan; o que não é dado nela é a moldura desse dado. |
| O aviso "Imagens de referência, para representar o que cada fábrica resolve…" | `components/representadas-galeria.tsx` | Marcação de mock exigida por desenho, não prosa de marketing sobre as fábricas. Mesma razão do figcaption de `components/marca/abertura.tsx`, já listado acima. |
| O parágrafo do bloco 04 de `/quem-somos` (a prancha do território) | `components/quem-somos/prancha-territorio.tsx` | O único dos seis blocos sem campo. Ele nomeia os três estados, conta as representadas e nomeia a cidade da sede — e as três coisas saem do dado que desenha a prancha ao lado ou do cadastro. Texto livre ali é como a prosa passa a dizer "quatro estados" ao lado de um desenho com três. |
| Os cinco CNAEs (código e descrição) | `lib/registro.ts#CNAES` | Transcrição do cadastro nacional. Um campo de texto é precisamente a ferramenta que convida alguém a reescrever uma descrição oficial "com palavras melhores" — a única coisa que essa página não pode fazer sem perder a autoridade inteira. E o P1 continua aberto: os códigos de atacado ao lado do de representação sugerem uma conclusão que o cliente não confirmou, e um campo editável é por onde essa conclusão entraria em texto visível. |
| O nome público anterior e a fonte dele | `lib/registro.ts#NOME_PUBLICO_ANTERIOR` | Citação com fonte declarada. Reescrevê-la em melhores palavras quebraria exatamente o que ela prova. |
| A navegação do site (os quatro itens do menu) | `lib/site.ts#NAVEGACAO` | Não é conteúdo dentro do desenho: é quais rotas existem. Uma rota nova exige uma página nova, que é código — um item de menu editável só serviria para apontar para um 404 que o operador não tem como criar. |
| A descrição de SEO do layout e o `title` padrão | `app/(frontend)/layout.tsx` | Só `openGraph.siteName` passou a ler o painel, porque é o nome público da empresa. O resto é a mesma prosa fixa da home. |
| A prancha do território (a malha do IBGE) | `lib/territorio.ts` | Fora de escopo por decisão 4 da spec: é dado regerado da fonte, não desenho a editar. |

## Referência

Definições de camada: `CONTEXT.md`, seção "Camadas de texto". Decisão de origem: spec
"Payload CMS — o site editável sem deploy", decisão 3.
