# Classificação gerado / fixo / campo — Representada, Imagem, Peça, Arquivo3D, Acabamento, Empresa, Home, QuemSomos, Prancha, Página, Lead, Pacote3D

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

**PRA-124 estendeu esta tabela** com a coleção `Página` — e ela desloca a pergunta um nível
acima de tudo o que veio antes. Nas nove entradas anteriores a pergunta era "este TEXTO é
gerado, fixo ou campo?"; aqui a pergunta é "a SEQUÊNCIA das seções é gerada, fixa ou campo?".
A resposta divide o site em dois, e a divisão é a mesma de `CONTEXT.md`: em `/quem-somos`, na
home e na página de marca a sequência é **fixa**, porque ela É o argumento; nas três rotas que
nunca foram escritas em código — `/arquitetos`, `/contato`, `/politica-de-privacidade` — ela é
**campo**, porque não há argumento a proteger. O ENDEREÇO de uma página livre continua sendo
decisão de código, e por isso não é texto digitado: é uma escolha dentro de `ROTAS_LIVRES`.

**PRA-123 estendeu esta tabela** com o global `Prancha` — e é o único caso em que um CAMPO não
é texto nem arquivo, e sim GEOMETRIA: quatro porcentagens por chamada. A pergunta que a
classificação faz continua a mesma ("quem decide este valor, e a partir de quê?"), e a resposta
aqui é o operador olhando para a própria fotografia. O rótulo da chamada, que é a única string
do desenho, **não virou campo de propósito** — ver a linha de `Representada.parte` na tabela de
gerado.

**PRA-125 não acrescenta campo a esta tabela.** O papel do usuário (`operador`/`administrador`,
`collections/usuarios.ts`) é campo interno do painel — nunca uma string visível no site — e por
isso fica fora do escopo desta ficha, que é sobre texto que o visitante lê. O que aquele ticket
muda é QUEM, dentro do painel, pode gravar um campo já classificado abaixo: a linha de `slug`,
logo a seguir, foi corrigida para refletir a nova restrição — a camada do campo (Campo) não
mudou, só quem tem permissão de gravá-lo.

**PRA-126 estendeu esta tabela** com a coleção `Lead` — e é o primeiro caso em que a pergunta
"quem decide este valor?" não responde "o operador, no painel". Ver a seção dedicada abaixo, que
por isso foge um pouco da forma das anteriores.

**PRA-127 estendeu esta tabela** com o global `Pacote3D` — o último campo do projeto, e o único
cuja classificação decide **o que o site COBRA** em vez do que ele mostra. Ele reverte uma
suposição do `PRODUCT.md` (cadastro para baixar qualquer 3D): o arquivo avulso passa a baixar
aberto, e só o pacote com as quatro fábricas juntas pede os dados do visitante. A razão está na
seção dedicada, e ela é econômica, não editorial — gatear o que a Casoca já entrega de graça não
captura o lead, doa o lead. **Nenhuma linha das seções anteriores mudou de camada por causa
deste ticket**, `arquivos3d` (PRA-120) inclusive: formato e peso continuam gerados, e o que
mudou foi quem pode baixar o arquivo, não o que ele é.

## Coleção `representadas` (`src/collections/representadas.ts`)

| Campo | Camada | Por quê |
|---|---|---|
| `nome` | Campo | Editado pela Belmare quando a fábrica muda de nome comercial. |
| `slug` | Campo | Decisão de endereço, não de conteúdo. **[PRA-125]** Editável só por conta com papel administrador — decisão 14 da spec: uma URL que muda quebra link já enviado, e esse risco não é do operador correr sozinho. A camada continua Campo (dado do painel, não gerado nem fixo); o que mudou foi QUEM pode gravá-lo, não o que ele é. |
| `ordem` | Campo | Decisão de apresentação da Belmare, explícita no rótulo do campo ("Posição nas listas"). Não é derivada de nenhum outro dado. |
| `resolve` | Campo | A linha que a fábrica produz, em uma frase — o que a spec chama de "editar a prosa institucional de uma representada" (história 5). ⚠️ O campo guardou benefício até esta rodada ("a sombra", "o conforto") e o site prefixava "Resolve …" nas três telas que leem daqui; a ajuda do painel agora pede produto e matéria, e o verbo saiu do código. O NOME da coluna continua `resolve`, atrasado em relação ao que ela guarda — renomeá-lo é migração própria. |
| `parte` | Campo | O rótulo da chamada na prancha; a fábrica não o publica, é uma escolha editorial da Belmare, mas ainda assim digitada, não calculada. **[PRA-123]** É o ÚNICO lugar onde essa palavra existe: a chamada da prancha não tem campo de texto próprio, e o rótulo do desenho é lido daqui. |
| `base` | Campo | Fato verificável, mas só existe se alguém o registrar — sem ele, ausente, nunca inventado. |
| `fato` | Campo | Idem. |
| `imagem`, `imagemLarga` | Campo (upload) | O operador escolhe o upload; a validação (recusa de repetição, formato) é editor UX, não geração. |
| `logotipo` | Campo (upload) | A marca da fábrica, quando o vetor chega. Opcional: nenhuma das quatro respondeu, e obrigatório trancaria o painel inteiro. ⚠️ **O `alt` dele NÃO é campo, e não é gerado — é vazio.** Nas duas superfícies onde a marca aparece o nome da fábrica está escrito em `h3` ao lado dela, então a imagem é decorativa pela WCAG e um `alt` faria o leitor de tela repetir o nome. É a única razão pela qual a coleção `logotipos` não tem campo de texto nenhum: o único dado que um logotipo carrega é o próprio arquivo. |
| `declaracoes[].rotulo`, `declaracoes[].valor` | Campo | Ficha técnica nas palavras da própria fábrica — não existe fonte automática. |
| `designers[].nome`, `.colecoes`, `.nota` | Campo | Atribuição pública da fábrica, digitada uma vez. |
| `colecoes` (sem atribuição) | Campo | Mesmo caso, sem designer ligado. |
| `vocabulario.eixo`, `.grupos[].nome`, `.grupos[].slug`, `.grupos[].itens[].nome`, `.itens[].nota` | Campo | Vocabulário da própria fábrica; o eixo em si é dado, não fixo — mas **decide** se um filtro existe (ver "gerado" abaixo). |
| `catalogos[].titulo`, `.ano` | Campo | Título e edição só existem quando a fábrica os declara. |
| `catalogos[].arquivo` | Campo (upload) | O PDF em si, quando em mãos. Nenhuma das quatro marcas tem um anexado hoje — a seed não cria este relacionamento. |

## Coleção `logotipos` (`src/collections/logotipos.ts`)

| Campo | Camada | Por quê |
|---|---|---|
| — nenhum | — | **A ausência é a classificação.** A coleção guarda arquivo e nada mais. O nome da fábrica já é `Representada.nome`, e `CONTEXT.md` o classifica como **Gerado** onde ele aparece derivado — digitá-lo outra vez aqui criaria uma segunda fonte para o mesmo dado, que é como o site passa a mentir sozinho. Descrição de imagem, marcação de mock e ponto focal, os três campos de `imagens`, não existem aqui de propósito: um logotipo publicado com o sufixo "imagem de referência" apresentaria a marca registrada de outra empresa como geração de IA. |

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
| `nomeCompleto`, `razaoSocial`, `cnpj` | Campo | Transcrição do registro, corrigível sem deploy. `cnpj` confere os dígitos verificadores (`lib/empresa.ts#cnpjFormatado`): é o único número que o leitor de `/quem-somos` vai de fato digitar na consulta oficial. |
| ~~`porte`~~ | — | **Saiu em 05/08/2026.** "Empresa de pequeno porte" abria `/quem-somos` numa faixa de identificação; a faixa saiu na reescrita e o campo ficou sem leitor nenhum — atravessava o mapper até o tipo de domínio e morria ali. Campo que o operador preenche e o site nunca publica custa uma decisão por edição e não paga nenhuma. |
| `abertura` | Campo (data) | **O único campo de data da empresa, e a fonte de três valores gerados** — ver abaixo. Recusa data no futuro. |
| `endereco.*` | Campo | Sede. Uma linha em branco desaparece do endereço em vez de deixar um vão. |

## Global `home` (`src/globals/home.ts`) — PRA-122

| Campo | Camada | Por quê |
|---|---|---|
| `galeria` | Campo | O parágrafo sob o título da seção das marcas — a única prosa institucional da home inteira. Em branco, o parágrafo desaparece (seção anulável). |

## Global `quem-somos` (`src/globals/quem-somos.ts`) — PRA-122

> **Reescrita de 05/08/2026.** A página deixou de ser um documento de arquivo com seis blocos
> numerados e virou uma página institucional comum, com seções não numeradas. Dois campos saíram
> com os blocos que eles escreviam e dois entraram; `interlocutor` só mudou de nome. A migração é
> `src/migrations/20260805_130547_refaz_quem_somos.ts`. **A camada de nenhum campo mudou** — os
> quatro continuam Campo, e o parágrafo do território continua sem campo nenhum.

| Campo | Camada | Por quê |
|---|---|---|
| `apresentacao` | Campo **a partir do segundo parágrafo** | O primeiro é montado com o cadastro — a contagem de fábricas, a cidade da sede e o tempo de casa. O campo é o que vem depois dele. |
| `atuacao` | Campo | Parágrafo de abertura de "O que a Belmare faz.", antes da lista de representação, especificação, pedido e pós-venda — que é **fixa**, e está na tabela do que não virou campo. |
| `acervo` | Campo **a partir da segunda frase** | A primeira frase conta as fábricas ("São quatro fábricas brasileiras.") e abre a lista que mostra as marcas logo abaixo. Texto livre ali congelaria em "quatro" no dia da quinta marca. |
| `contato` | Campo | Parágrafo do fecho, sob "Fale com a Belmare." Era `interlocutor`, e mudou de nome junto com o título da seção. |

Os campos `registro` e `nome` **deixaram de existir**, junto com os blocos que eles escreviam.
`registro` legendava o ano de fundação em display, sozinho na primeira tela; `nome` era o
parágrafo do bloco que mostrava o nome público anterior ao lado do logotipo de hoje. Em que ano a
empresa abriu e como ela se chamava antes não decidem conversa comercial nenhuma — e o segundo
ainda contava ao arquiteto que a Belmare vendia móvel de jardim e tapete. Com o bloco saiu também
`lib/registro.ts`, que guardava a citação do nome antigo.

A seção do território **não tem campo nenhum** — ver a tabela de gerado abaixo.

O campo `atividades` **deixou de existir** antes dos dois acima, junto com o bloco que ele legendava: a tabela dos
cinco CNAEs saiu de `/quem-somos`. Os códigos não dizem nada ao arquiteto que a página precisa
convencer — e dois deles ("consultoria em gestão empresarial", "tapeçaria, persianas e cortinas")
fazem uma representação de móvel de autor parecer atacado genérico. A ajuda do campo chegava a
proibir interpretá-los (P1), o que deixava na página um bloco que ninguém podia explicar. Quem
quiser conferir o registro tem o CNPJ no rodapé.

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

## Coleção `paginas` (`src/collections/paginas.ts`) — PRA-124

A única coleção do projeto que não guarda uma COISA do acervo: ela guarda a **composição** de
três rotas. As três nunca existiram em código, então não há um "antes" cujo argumento precise
ser defendido — ao contrário da prancha e das representadas, que eram código migrado.

| Campo | Camada | Por quê |
|---|---|---|
| `slug` | Campo **escolhido**, nunca digitado | O endereço é decisão de código: uma rota nova é um arquivo em `app/(frontend)/` mais uma linha em `lib/site.ts#ROTAS_LIVRES`. O `select` da coleção monta as opções a partir desse MESMO registro, então o painel só oferece endereços que já resolvem. Um campo de texto livre aqui seria o espelho exato da falha que `lib/site.ts` descreve para o menu: uma página composta, publicada, e existindo em URL nenhuma. `unique`: uma rota, uma composição. |
| `titulo` | Campo | O h1 da página. **É o contraste que fecha a decisão de PRA-122**: o h1 da home é FIXO porque é o argumento do desenho e já derrubou duas versões; este é campo porque a rota inteira nasceu no CMS e não tem argumento a proteger. É a diferença entre espinha fixa e página livre, escrita num campo só. |
| `resumo` | Campo | A descrição do resultado de busca — a única superfície do site que se lê antes do site. Obrigatório: sem ela o Google inventa um trecho, e o trecho que ele escolhe raramente é o que interessa. |
| `composicao` | Campo — **e é o único campo do projeto cujo valor é uma ORDEM** | Quais blocos, em que sequência. Recusa lista vazia ao publicar (rascunho atravessa, história 17). Aqui a assimetria com `/quem-somos` é o assunto inteiro do ticket: lá a ordem é fixa e não existe array nenhum; aqui a ordem é o único desenho que a página tem. |
| `composicao[].prosa.titulo` | Campo | O h2 de uma seção. Opcional: nem toda seção de um documento tem título, e obrigá-lo forçaria o operador a inventar um para o primeiro parágrafo. |
| `composicao[].prosa.corpo` | Campo (texto formatado) | **O único campo de texto formatado do projeto**, e ele existe por causa de um documento: uma política de privacidade chega estruturada de quem a escreveu, e colar essa estrutura tem que funcionar. O editor é deliberadamente MENOR que o padrão — ver a lista de recusas abaixo. |
| `composicao[].caminhos.itens[].rotulo`, `.apoio` | Campo | O que o visitante quer, na voz dele, e o que há atrás do clique. |
| `composicao[].caminhos.itens[].destino` | Campo (rádio) | Página do site ou conversa de WhatsApp. **É o seam de PRA-126**: o formulário de proposta comercial entra como um terceiro valor aqui, não como um bloco novo. |
| `composicao[].caminhos.itens[].rota` | Campo **escolhido** | As opções saem de `lib/site.ts#DESTINOS_DE_CAMINHO`. Mesma razão do `slug`: um campo de URL livre é como um 404 entra no site pelas mãos do operador — e é também por onde o e-mail comercial de uma fábrica entraria, que é o único erro que este projeto trata como de negócio e não de código. |
| `composicao[].caminhos.itens[].contexto`, `composicao[].fecho.contexto` | Campo | A continuação de "Oi! Vim pelo site: …". É a única qualificação de lead que o site tem, e custa zero. |
| `composicao[].fecho.rotulo` | Campo | O que a faixa diz. Em branco, o componente escreve "Falar pelo WhatsApp" — o mesmo padrão que `/catalogos` e a página de marca já usam. |
| `composicao[].ficha.titulo` | Campo | O h2 sobre a ficha. **É o único campo do bloco inteiro** — ver a linha da ficha na tabela de gerado abaixo. |

## Página — o que PRA-124 recusou a transformar em campo

| Texto / decisão | Onde mora | Por que não é campo |
|---|---|---|
| **A sequência de `/quem-somos`, da home e da página de marca** | Fixo, em código (`app/(frontend)/quem-somos/page.tsx`, `lib/representadas.ts#secoesDaRepresentada`) | A recusa que define o ticket. As três têm **espinha fixa** e NÃO ganharam construtor de blocos, porque `/quem-somos` carrega uma lista vinculante do que nunca pode aparecer nela — foto de equipe, missão/visão/valores, contador animado, prosa em superlativo. Um array de blocos ali é exatamente a ferramenta que contorna essa lista, e ele não existe. **[05/08/2026]** O outro motivo declarado desta linha — "a sequência é o argumento" — caiu com a reescrita de `/quem-somos`, que perdeu a numeração; a recusa fica de pé sozinha na lista vinculante, que nunca dependeu de ordem. |
| O conjunto de URLs do site | **Fixo** — três arquivos em `app/(frontend)/` mais `lib/site.ts#ROTAS_LIVRES` | Um segmento dinâmico `[pagina]` teria dado as três rotas de graça e, junto, o poder de inventar endereço no painel. Ver a linha de `slug` acima. |
| O sobretítulo em mono que abre cada página livre | **Gerado** de `lib/paginas.ts#rotuloDaRotaLivre` | Ele nomeia a ROTA, e a rota é decisão de código. Um campo aqui seria a segunda cópia do nome da página — a que continua dizendo "Contato" depois de a rota virar outra coisa. |
| Endereço, telefones, e-mail, Instagram, território e CNPJ dentro de `/contato` | **Gerado** do cadastro da empresa (`components/paginas/ficha-belmare.tsx`, sobre `lib/empresa-consulta.ts`) | **É a razão de o bloco "Ficha da Belmare" existir sem campo de conteúdo.** Sem ele, a única saída do operador para montar `/contato` seria digitar os cinco dentro de um bloco de texto: duas cópias do mesmo telefone, e a segunda é a que ninguém lembra de corrigir. O que ele escolhe é SE a ficha aparece e ONDE. O território, especificamente, continua saindo da malha do IBGE pela mesma razão de PRA-122. |
| Alinhamento, recuo, tabela, citação, sublinhado, tachado, código, cor e upload dentro do texto formatado | **Fixo** — o editor de `collections/blocos.ts#EDITOR_DE_PAGINA` não os oferece | O padrão do Payload traz todos. Cada um é uma decisão de tipografia sendo tomada por quem escreve, não por quem desenhou o sistema — e este site tem uma escala única, sem cor de marca, sem raio e sem sombra. Texto centralizado ou uma palavra sublinhada é como uma página livre deixa de pertencer ao site. |
| O `h1` dentro do texto formatado | **Fixo** — o editor começa em `h2` | A página já tem um `h1`, e ele é campo próprio no topo. Dois `h1` numa rota é defeito de leitura assistiva e de busca, e é o que um construtor de blocos produz quando cada bloco escolhe o próprio nível. |
| A numeração das seções de uma página livre | **Não existe** (`components/paginas/secao.tsx`) | Os blocos de `/quem-somos` são numerados porque a sequência é o argumento daquela página. Numa página livre a ordem é conveniência de quem montou: numerá-la emprestaria ao arranjo do operador uma autoridade de documento que ele não tem. |
| Bloco de imagem, galeria, colunas, espaçador, divisor, destaque numérico, contador, depoimento, logos de clientes, acordeão/FAQ, vídeo e HTML incorporado | **Não existem na biblioteca** (`collections/blocos.ts`) | A lista completa, com o motivo de cada um, está no cabeçalho daquele arquivo. Em resumo: fotografia solta é como um mock entra sem a marcação gerada; layout não é conteúdo; e contador, depoimento e prova social são a mesma lista que `/quem-somos` já recusa — um bloco que os produz em `/arquitetos` é aquela página com outro endereço. |
| O formulário de proposta comercial de `/contato` | **Não construído** — é PRA-126 | O caminho "quero revender" é hoje um WhatsApp com contexto próprio: funciona, chega marcado de onde veio, e não promete um formulário que não existe. O seam é um terceiro valor no rádio `destino`. |
| **A redação da política de privacidade** | **Não é nossa** — fora de escopo por decisão da spec | O que a seed publica é (a) um aviso inequívoco, em negrito e na primeira linha da página, de que o documento aguarda revisão jurídica e (b) o levantamento factual do que o site faz com dados, conferido contra o código. Texto legal inventado com cara de revisado é pior do que página vazia: ninguém o confere depois. Não há banner de cookie, e a ausência é decisão — o site não instala rastreador de terceiros, e um banner que pede consentimento para nada é teatro de conformidade. |

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

## Coleção `leads` (`src/collections/leads.ts`) — PRA-126

Toda tabela acima responde "quem decide este valor, e a partir de quê?" com "o operador, no
painel" — é o operador que escreve a prosa de uma representada, escolhe a data de abertura da
Belmare, arrasta um bloco de página livre. Aqui a resposta é outra: quem decide `nome`, `email`,
`cidade` e `escritorio` é o **visitante do site**, uma vez, ao enviar `/contato` — o operador só
LÊ o que chegou, no painel. Por isso a tabela abaixo marca essas quatro linhas como **Campo
(visitante)**, para não confundir com a prosa institucional que o resto deste documento chama de
Campo sem qualificação.

⚠️ **O QUE DE FATO SE FIXA AQUI NÃO É O VALOR DE UM CAMPO — É A LISTA DE CAMPOS.** Diferente de
toda outra coleção do painel, `leads` não tem construtor de formulário: os cinco campos vêm de
`lib/lead.ts#DadosDoLead`, em código, por decisão 11 da spec (`PRODUCT.md`): "nome, e-mail,
cidade e escritório bastam — CPF não". Um formulário configurável é exatamente a ferramenta que
deixaria um operador bem-intencionado acrescentar um campo de CPF porque uma fábrica pediu — a
violação de minimização de dado que este ticket existe para impedir, num site cuja política de
privacidade ainda aguarda revisão jurídica. Acrescentar um campo aqui é PR, nunca clique no
painel — a mesma proteção que `/quem-somos` aplica à própria sequência de seções, aplicada ao
formulário.

| Campo | Camada | Por quê |
|---|---|---|
| `nome` | Campo (visitante) | Como a pessoa se identificou no formulário — nunca reescrito pelo operador. |
| `email` | Campo (visitante) | Para onde a Belmare responde. Validado por `lib/lead.ts#emailValido` — a mesma regra de `lib/empresa.ts#emailComercial`, copiada e não importada: são dois domínios que só coincidem em formato por acaso. |
| `cidade` | Campo (visitante) | De onde a pessoa fala. |
| `escritorio` | Campo (visitante) | A loja, o escritório ou a operação que a pessoa representa. O mesmo campo nomeia dois papéis — revendedor hoje, e arquiteto qualificando o próprio escritório a partir de PRA-127 — e só o RÓTULO do formulário muda entre os dois, nunca o campo em si. |
| `consentimentoMarketing` | Campo (visitante) | Separado do envio da mensagem, de propósito — decisão de LGPD do brief: contatar a empresa nunca pode inscrever ninguém em lista nenhuma sem essa caixa marcada à parte. Nunca vem pré-marcada. |
| `origem.pagina` | **Gerado** | De qual página o envio partiu — preenchido pela própria página no momento do envio (`components/formulario-de-lead.tsx`, campo oculto), nunca digitado por ninguém. |
| `origem.marca` | **Gerado** | Qual representada, quando o formulário abre a partir de uma página de marca — o seam que PRA-127 usa para o pacote completo de `/arquivos-3d`. Ausente em `/contato`, que não pertence a fábrica nenhuma. |

## Lead — o que PRA-126 recusou a transformar em campo

| Texto / decisão | Onde mora | Por que não é campo |
|---|---|---|
| A lista de campos do formulário (nome, e-mail, cidade, escritório, consentimento) | **Fixo**, em `lib/lead.ts#DadosDoLead` | Decisão 11 da spec: minimização de dado. Ver a nota grande no topo da seção acima. |
| Telefone | **Não existe** — decisão de produto em aberto, não esquecimento deste ticket | `briefing/restricoes.md` permite telefone como campo opcional, mas a lista fechada deste ticket não o inclui. Reabri-la é decisão de produto, não bug. |
| A etiqueta de revalidação de um lead | **Não existe** | Um lead não aparece em nenhuma página pública do site — só no painel e no e-mail de aviso. `lib/revalidacao.ts#tagsDaMudanca` não ganha um caso `"leads"` porque não há superfície nenhuma para invalidar; acrescentar uma reflexivamente seria etiqueta morta, nunca invalidada por leitura nenhuma. |
| O corpo do e-mail de aviso (`corpoDoAvisoPorEmail`) | **Gerado**, em `lib/lead.ts` | Composto a partir do próprio Lead já gravado — nunca um segundo texto que poderia divergir do que está no painel. |
| Captcha ou honeypot | **Não existe** | Os dois custam acessibilidade real (campo que um leitor de tela anuncia mesmo escondido, ou quebra-cabeça que barra baixa visão) contra spam que ninguém mediu ainda. Se aparecer, aparece na lista do painel, onde dá para contar antes de decidir. |

## Global `pacote-3d` (`src/globals/pacote-3d.ts`) — PRA-127

O último campo do projeto, e o único cuja classificação decide **o que o site COBRA**, não o
que ele mostra. Um campo só — um upload —, e a lista do que ficou de fora dele é, mais uma vez,
maior do que a do que entrou.

⚠️ **A DECISÃO QUE ESTE TICKET REVERTE NÃO É SOBRE TEXTO, É SOBRE PORTÃO.** `PRODUCT.md` e
`briefing/audiencias.md` (P11) recomendam cadastro leve para baixar 3D — qualquer 3D. A
recomendação não sobrevive ao alerta competitivo escrito no mesmo documento: a **Casoca** é
gratuita, dominante no Brasil e **já distribui a GDA**. Um formulário na frente de um arquivo
que a Casoca entrega sem pedir nada não captura o lead — **doa** o lead, porque a aba seguinte
já tem o arquivo de graça. O portão migra inteiro para a única coisa que a Casoca
estruturalmente não tem: as quatro fábricas juntas, com acabamentos e tecidos, num download só.
O arquivo avulso da coleção `arquivos3d` (classificada acima, em PRA-120) **não muda de camada
nenhuma** — o que mudou foi quem pode baixá-lo, e a resposta passou a ser "qualquer um".

| Campo | Camada | Por quê |
|---|---|---|
| `pacote` | Campo (upload) | O arquivo pronto, **montado à mão pelo operador e subido inteiro** — não zipado sob demanda. Três razões, na ordem em que pesam: (1) **peso antes do clique** — um zip montado na hora não tem tamanho até terminar de ser montado, e a página teria que omitir o peso (quebrando a promessa que ela existe para fazer) ou estimá-lo (inventando dado); um arquivo em disco tem `filesize` medido pelo Payload, a MESMA derivação de toda outra linha do site. (2) **A plataforma** — `collections/arquivos.ts` existe porque a função serverless recusa corpo acima de 4,5 MB e o upload precisou ir direto ao bucket; montar dezenas de MB dentro dessa mesma função, a cada pedido, reabre por dentro o limite que aquele ticket rodeou por fora. (3) **Curadoria é o produto** — o que a Casoca não entrega não é "os arquivos concatenados", é o conjunto organizado. Opcional de propósito: em branco, a seção e o formulário somem juntos. |

### Arquivos 3D — o que PRA-127 recusou a transformar em campo

| Texto / decisão | Onde mora | Por que não é campo |
|---|---|---|
| **O cadastro na frente de um arquivo 3D avulso** | **Não existe** — `components/arquivos-3d/linha-de-arquivo.tsx` baixa direto | A recusa que define o ticket, e a única deste documento que é sobre economia e não sobre edição. Ver a nota acima. É também o princípio 5 do `PRODUCT.md` aplicado sem desconto: "ficha aberta sem cadastro, arquivo com formato e peso declarados antes do clique, e nada que encante na primeira visita e irrite na décima" — o arquiteto volta muitas vezes, e um formulário por download é o que irrita na décima. |
| Um campo novo no formulário do pacote (projeto, telefone, CPF) | **Não existe** — a lista continua a de `lib/lead.ts#DadosDoLead` | A proibição de PRA-126 vale inteira, e este ticket era o primeiro teste dela: uma audiência nova ("o arquiteto") é exatamente a justificativa que faria um campo entrar. Entrou um SLOT DE SUCESSO em `components/formulario-de-lead.tsx` — o que a pessoa recebe depois de enviar —, nunca um campo a mais do que ela precisa preencher. |
| A data de remontagem do pacote | **Não existe**, e não é esquecimento | A data óbvia (`Arquivo.updatedAt`) mexe quando alguém corrige o TÍTULO do upload, não só quando o binário é trocado — ela diria "remontado em julho" sobre um pacote de março. Um carimbo que se atualiza sozinho sem o conteúdo ter mudado é a definição de "o site passa a mentir sozinho" (`CONTEXT.md`), e um campo de data digitado à mão é a mesma mentira com uma tecla a mais. **O custo aceito no lugar dela**: o pacote envelhece, e remontá-lo é obrigação do operador — dita com todas as letras na ajuda do campo, e dita ao visitante na própria página ("quando um arquivo novo entra, ele aparece na lista acima antes de entrar aqui"). |
| O filtro por formato ("SKETCHUP · DWG · REVIT · 3DS") | **Não existe** (`briefing/prompt-paper.md` o desenha) | É o eixo transversal que a decisão 10 já matou uma vez para material, com o mesmo argumento e o mesmo dado: **nenhuma estrutura do site deve depender de dado que as fábricas não têm**, e não há um único formato confirmado em nenhuma das quatro. E ele exigiria uma consulta de arquivos 3D SEM pai — a porta por onde "o filtro nunca sai da marca" (princípio 2) deixaria de valer. **Agrupar não é filtrar**: `buscarBiblioteca3D` é N leituras escopadas por `representada.slug`, e o que atravessa as marcas é só a ordem na tela. |
| O rótulo de cada grupo da biblioteca | **Gerado** de `Representada.nome` | Segunda cópia do nome da fábrica seria a que continua dizendo o nome antigo depois de a marca ser renomeada no painel. |
| O h1 "O bloco entra no projeto hoje." e a prosa das duas colunas | **Fixo** (`app/(frontend)/arquivos-3d/page.tsx`) | Mesma regra do h1 da home e de `/catalogos`, que este ticket não relitiga: a página é **espinha fixa**, e a sequência dela é o argumento — um construtor de blocos aqui desfaria a inversão econômica acima numa tarde de edição. |
| Um pacote por representada | **Não existe** — o global é um só | Seria quatro pacotes com um dono cada, que é literalmente o oposto do que faz o pacote valer um cadastro. É também por isso que ele é global e não campo de `Representada`: ele não pende de fábrica nenhuma porque pertence às quatro (ver `lib/revalidacao.ts`, onde é o único documento que não deriva `tagDaRepresentada`). |

## Gerado — derivado em tempo de leitura, nunca um campo

| Valor | Onde nasce | Por que não pode virar campo |
|---|---|---|
| A marcação "— imagem de referência." | `lib/acervo.ts#descricaoDeImagem` | Gravá-la dentro de `descricao` faz a frase dobrar a cada leitura, e desmarcar `mock` não limparia nada — o próprio critério de aceite deste ticket. |
| `object-position` (`"30% 50%"` etc.) | `lib/acervo.ts#posicaoDoFoco` | Deriva de `focalX`/`focalY`; um campo de texto paralelo poderia divergir do clique. |
| Peso do arquivo em MB | `lib/representadas-traducao.ts#pesoDoArquivo`, a partir de `Arquivo.filesize` | O Payload já mede o arquivo que armazenou; digitar o peso é como o site passa a prometer um número que pode estar errado. Nenhum dos catálogos seedados tem arquivo anexado, então nenhum peso é computado ainda — mas a regra vale a partir do dia em que um PDF for anexado. |
| **[PRA-120]** O formato de um arquivo 3D ("SKP", "DWG"...) | `lib/arquivos3d.ts#formatoDoArquivo`, a partir de `Arquivo.filename` | `.skp`/`.3ds`/`.dwg` chegam do navegador como `application/octet-stream` na maioria dos sistemas — `mimeType` não identifica o formato, só a extensão do nome gravado. Digitado à mão, "SKP" vira exatamente o erro de digitação que o critério de aceite deste ticket proíbe. |
| **[PRA-127]** Formato e peso do PACOTE COMPLETO | `lib/arquivos3d.ts#pacoteDoPainel`, sobre a MESMA `baixavelDoUpload` que o arquivo avulso usa | **O cadastro não compra o direito de esconder o tamanho.** É o único download do site atrás de formulário, e por isso o que menos pode chegar sem medida: `ZIP · 62,4 MB` aparece ACIMA dos campos, não depois do envio. Descobrir o peso depois de entregar nome, e-mail, cidade e escritório é a mesma quebra de promessa na versão pior — aí já se pagou. Sem peso medido ou sem extensão legível o pacote não existe, e a seção inteira (formulário incluído) não é desenhada. |
| **[PRA-127]** "Três arquivos de duas fábricas" na biblioteca | `lib/arquivos3d.ts#totalDeArquivos3D` + `lib/frase.ts#porExtenso` | A sétima contagem em prosa do site, pela mesma regra das seis de PRA-122: um número escrito à mão continuaria dizendo o do primeiro lote no dia do segundo. |
| **[PRA-120]** Peso de um arquivo 3D em MB | `lib/representadas-traducao.ts#pesoDoArquivo`, reaproveitada — não uma segunda função | A mesma regra do catálogo: o Payload já mediu o arquivo que armazenou. Diferente do catálogo, não há estado "a pedir" — um Arquivo3D sem tamanho medido nem extensão legível não vira item nenhum (`lib/arquivos3d.ts#arquivo3DDoPainel` devolve `undefined` inteiro, nunca um objeto pela metade). |
| **[PRA-120]** A decisão de recusar uma `categoria` de Peça | `collections/pecas.ts`, validação assíncrona do campo `categoria` | Não é o valor em si que é gerado (`categoria` é Campo, texto digitado) — é a **decisão de aceitar ou recusar** que é sempre recalculada contra o vocabulário atual da representada escolhida, nunca uma lista de opções congelada no schema. |
| O eixo que autoriza um filtro (`eixoDeFiltro`) | `lib/representadas.ts` | O CAMPO é `vocabulario.eixo` (texto); o que é gerado é a *decisão* de oferecer filtro, que depende de `eixo` estar presente **e** haver mais de um grupo. Essa decisão não tem campo próprio — é sempre recalculada. |
| A contagem de categorias distintas na faixa de índice | `lib/representadas.ts#secoesDaRepresentada` | Itens repetidos entre grupos (a GDA repete as mesmas seis categorias em Externo/Interno) não podem contar em dobro; a contagem é sempre recalculada a partir dos grupos, nunca digitada. |
| A numeração das seções (`01`, `02`, ...) | `lib/representadas.ts#secoesDaRepresentada` | Recalculada a cada leitura, a partir de quais seções sobreviveram — nunca um número fixo por seção. |
| A lista "Marê Mobília, GDA Móveis, Bux Garden e Trisol" | `components/abertura.tsx` (`nomeadas`), `app/representadas/page.tsx` (metadata) | Junção de `REPRESENTADAS.map(r => r.nome)` (ou, depois de PRA-119 completo em todas as superfícies, de `buscarRepresentadas()`) — nunca digitada como frase própria. |
| A contagem "N representadas" | `components/representadas/prancha-area-externa.tsx`, `app/representadas/page.tsx` | Sai do painel (`representadasDaPagina()`) desde PRA-123 — muda sozinha se uma quinta marca entrar. |
| O tempo de casa ("27 anos") | `lib/empresa.ts#anosDeMercado` (era `lib/site.ts`) | O exemplo canônico da spec para "gerado": contagem por dia e mês a partir de `Empresa.abertura`, nunca um número escrito. **[PRA-122]** Não existe campo de "anos de mercado" em lugar nenhum do painel, e o aviso está escrito na ajuda do campo de data. Um "26" digitado congela e passa a errar em silêncio a partir do aniversário seguinte, uma vez por ano, no primeiro número da primeira tela. |
| **[PRA-122]** O ano de fundação ("Desde 1999") | `lib/empresa.ts#anoDeFundacao` | Era `fundacao: 1999` ao lado de `abertura: "22.04.1999"` em `lib/site.ts` — dois campos para um fato só. Agora sai da data. |
| **[PRA-122]** A data de abertura por extenso ("22.04.1999") | `lib/empresa.ts#aberturaPorExtenso` | Mesma razão: o bloco de ficha das páginas livres (`components/paginas/ficha-belmare.tsx`) imprime a transcrição do registro, e ela sai da data que o operador escolheu no calendário — não de um segundo campo de texto que poderia discordar. |
| **[PRA-122]** O território ("Paraná, Santa Catarina e Rio Grande do Sul") | `lib/empresa.ts#TERRITORIO`, a partir de `lib/territorio.ts#ESTADOS` | **A única decisão do ticket que não segue a lista de campos do próprio ticket.** A prosa de `/quem-somos` nomeia os estados três centímetros acima do desenho que os traça — malha oficial do IBGE, fora do escopo de edição por decisão 4 da spec. Um campo de texto deixaria o operador escrever um quarto estado que o mapa não sabe desenhar, e a página passaria a contradizer o único gráfico que ela tem. Expandir território é regerar a malha, que é o mesmo deploy que o desenho novo já exigiria. |
| **[PRA-122]** Toda contagem em prosa: "As **quatro** fábricas que a Belmare representa", "de **quatro** fábricas brasileiras", "**Quatro** fábricas, **quatro** linhas", "**Três** estados, uma conversa só", "Ver as **quatro** representadas" | `lib/frase.ts#porExtenso`, sobre `representadasDaPagina()` e `TERRITORIO` | Eram a palavra `quatro` digitada dentro de uma frase, em cinco arquivos. No dia da quinta marca as cinco continuariam dizendo quatro, sem calendário nenhum para denunciar — a mesma falha do tempo de casa, e mais silenciosa. ("**Cinco** atividades registradas" saiu da lista junto com o bloco de CNAEs.) |
| **[PRA-122]** A junção "A, B, C **e** D" | `lib/frase.ts#emLista` | Existia inline em `abertura.tsx` e numa segunda escrita (`join(", ").replace(...)`) em mais três lugares. Quatro cópias da mesma pontuação é como a lista de marcas da home e a de estados do rodapé passam a ser escritas de dois jeitos na mesma tela. |

## Fixo — no código, por ser o argumento do desenho

Nada em `Representada`, `Imagem`, `Peça`, `Arquivo3D` ou `Acabamento` é fixo — cada uma dessas
coleções existe para tornar o próprio dado editável. Os dois exemplos fixos que este ticket
*toca* de raspão, sem alterar, são:

| Texto | Onde mora | Por quê |
|---|---|---|
| "Imagem de referência — ilustra a linha da fábrica, não uma peça do catálogo dela." | `components/marca/abertura.tsx` (figcaption) | Legenda visível obrigatória por decisão de desenho — não muda por marca, não é campo de nenhuma representada. |
| Os rótulos das seções ("O que declara", "Quem assina", "Vocabulário", "Para levar", "Falar") | `lib/representadas.ts#secoesDaRepresentada` | São o argumento da página, não conteúdo de uma marca — mudam por reposicionamento de desenho, não por edição de operador. |

### Fixo — o que PRA-122 recusou a transformar em campo

Esta é a lista que o próximo ticket **não precisa relitigar**. Cada linha é uma string que estava
ao alcance de um global e ficou no código de propósito.

| Texto | Onde mora | Por que não é campo |
|---|---|---|
| O h1 da home — "Representação comercial de móveis para área externa." | `components/abertura.tsx` | O argumento do desenho, não conteúdo dentro dele. **Quatro versões já caíram:** "Quatro fábricas. Um interlocutor." (jargão de organograma) e "Móveis para área externa" (categoria pura, que descreve uma fábrica — é essa a objeção que "representação comercial de…" resolve), as duas em 30/07/2026; "Sofá, mesa, espreguiçadeira e ombrelone." em 04/08/2026, porque descrevia uma **loja** — quem caía de busca entendia que comprava um sofá ali e descobria depois que a Belmare não vende direto; e "A área externa inteira, para quem especifica e para quem revende." em 05/08/2026, promessa de posicionamento sem verbo que não dizia em que ramo a empresa está. O h1 de agora diz o ramo com o nome que o ramo usa, porque quem lê a primeira tela é lojista ou escritório de arquitetura e a pergunta dele é se está diante de uma fábrica, de uma loja ou de uma representação. Um campo de texto é o caminho de volta para uma das quatro numa tarde em que ninguém lembra por que caíram. Trocá-lo é reposicionar a empresa, e reposicionamento é conversa, não edição. |
| Os títulos das seções de `/quem-somos` | `components/quem-somos/secao.tsx` e cada seção | Não há array de blocos e não há campo de título: o que a página recusa publicar é decisão de posicionamento, não de edição. **[05/08/2026]** Os rótulos numerados (`01`…`06`) saíram desta linha porque saíram do site — a rota foi refeita e a numeração foi junto com a história que ela ordenava. |
| A lista de quatro linhas de "O que a Belmare faz" (representação, especificação, pedido, pós-venda) | `components/quem-somos/atuacao.tsx` | **[05/08/2026]** Descrição de trabalho, não promessa de serviço: nenhuma das quatro afirma prazo, exclusividade ou condição comercial, e cada uma já está publicada em outro lugar do site. Um campo por linha convida a transformar as quatro em promessa, que é exatamente o que a lista vinculante da página recusa. O parágrafo ACIMA da lista é campo (`atuacao`). |
| O nome e o texto de apoio das duas portas | `components/portas.tsx` | Decisão 3 da spec. As duas têm que ter peso igual, e a simetria "eu especifico / eu compro" é o argumento — um campo por porta é como uma delas fica maior que a outra. |
| A linha de apoio da abertura da home, fora das partes contadas | `components/abertura.tsx` | Ela existe para carregar dado (marcas, território, tempo de casa) sem virar slogan; o que não é dado nela é a moldura desse dado. |
| O aviso "Imagens de referência, para representar a linha de cada fábrica…" | `components/representadas-galeria.tsx` | Marcação de mock exigida por desenho, não prosa de marketing sobre as fábricas. Mesma razão do figcaption de `components/marca/abertura.tsx`, já listado acima. |
| O parágrafo do território em `/quem-somos` | `components/quem-somos/territorio.tsx` | A única seção sem campo. Ele nomeia os três estados, conta as representadas e nomeia a cidade da sede — e as três coisas saem do dado que desenha o mapa ao lado ou do cadastro. Texto livre ali é como a prosa passa a dizer "quatro estados" ao lado de um desenho com três. |
| A navegação do site (os quatro itens do menu) | `lib/site.ts#NAVEGACAO` | Não é conteúdo dentro do desenho: é quais rotas existem. Uma rota nova exige uma página nova, que é código — um item de menu editável só serviria para apontar para um 404 que o operador não tem como criar. **[PRA-124]** A mesma regra passou a valer do outro lado: o endereço de uma página livre é escolhido dentro de `ROTAS_LIVRES`, nunca digitado. |
| A descrição de SEO do layout e o `title` padrão | `app/(frontend)/layout.tsx` | Só `openGraph.siteName` passou a ler o painel, porque é o nome público da empresa. O resto é a mesma prosa fixa da home. |
| O mapa do território (a malha do IBGE) | `lib/territorio.ts` | Fora de escopo por decisão 4 da spec: é dado regerado da fonte, não desenho a editar. **[05/08/2026]** A moldura, o carimbo, a graticula e a escala gráfica que envolviam o desenho saíram da página; a malha não mudou. |

## O texto do formulário de lead — PRA-126

A seção anterior sobre `leads` classifica o que o **documento gravado** guarda. Esta classifica
o que o **formulário mostra**: rótulo, texto de consentimento, mensagem de sucesso, recusa.

⚠️ **É o único lugar do projeto onde "não é campo do painel" significa o oposto do resto deste
documento.** Em todo o resto, `fixo` protege o argumento do desenho contra edição. Aqui, `fixo`
protege **quem preenche o formulário**: a lista de campos mora em `lib/lead.ts` e acrescentar um
é PR, não clique, porque um construtor de formulário é exatamente a ferramenta que deixaria um
operador bem-intencionado acrescentar CPF porque uma fábrica pediu. Decisão 11 da spec, sobre a
minimização que `PRODUCT.md` promete: *"nome, e-mail, cidade e escritório bastam — CPF não"*.

| Texto | Camada | Por quê |
|---|---|---|
| A lista de campos do formulário | **Fixo** | Ver acima. É violação de minimização de dado criada por acidente, num site cuja política de privacidade ainda espera advogado. |
| Os rótulos dos campos ("Nome", "Cidade", "Empresa ou escritório") | **Fixo** | Nomeiam os campos fixos; um rótulo editável sobre um campo fixo só serve para a etiqueta discordar do que é gravado. |
| O texto da caixa de consentimento | **Fixo** | É a promessa de que contatar a empresa não inscreve ninguém em lista — e a redação de um consentimento não é assunto de edição casual. |
| A mensagem de sucesso e as recusas por campo | **Fixo** | Mesma família das recusas de coleção: explicam um estado do sistema, não conteúdo da Belmare. |
| O rótulo do caminho que abre o formulário ("Quero revender") e o apoio dele | **Campo** | Isto sim é da Belmare: como ela convida, e em qual página o formulário aparece. O bloco de caminhos escolhe **onde** o formulário está e **como se chama** — nunca o que ele pergunta. |
| A origem do lead (página e marca) | **Gerado** | Preenchida pela própria página no envio. O visitante nunca vê nem digita; um campo aqui seria pedir que alguém declarasse de onde veio. |
| O corpo do aviso por e-mail | **Gerado** | Montado do próprio lead em `lib/lead.ts#corpoDoAvisoPorEmail`. |

### O que PRA-126 recusou construir

| Recusado | Por quê |
|---|---|
| Construtor de formulário / campos configuráveis | O ponto inteiro do ticket. Ver acima. |
| Campo de telefone | `briefing/restricoes.md` o permite como opcional, mas "pedir só o necessário" corta na direção de menos campo. Reabrir é decisão de produto, não esquecimento. |
| Captcha e honeypot | Os dois custam acessibilidade real — um campo escondido que o leitor de tela anuncia mesmo assim, ou um quebra-cabeça que barra quem tem baixa visão — contra spam que ninguém mediu. Se aparecer, aparece na lista do painel, onde dá para contar antes de decidir. |
| Consentimento obrigatório | Exigir a marcação trocaria o atendimento por um endereço de mala direta. Recusar a lista não pode impedir o contato. |
| Etiqueta de revalidação para `leads` | Um lead não aparece em página pública nenhuma. Uma etiqueta acrescentada por reflexo seria etiqueta morta, nunca invalidada por leitura nenhuma. |

## Referência

Definições de camada: `CONTEXT.md`, seção "Camadas de texto". Decisão de origem: spec
"Payload CMS — o site editável sem deploy", decisão 3.
