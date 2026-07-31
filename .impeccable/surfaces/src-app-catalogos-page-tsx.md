---
version: 1
slug: "src-app-catalogos-page-tsx"
primary_target: "src/app/catalogos/page.tsx"
related_targets: ["src/components/linha-de-catalogo.tsx","src/components/marca/para-levar.tsx","src/lib/representadas.ts"]
---

## Escopo e modo

Rota `/catalogos`, até aqui **404** e terceiro item do menu. Modo **Operate** — a primeira superfície do site que não persuade. As quatro anteriores argumentam; esta serve um arquivo.

Superfície nova dentro do mundo estabelecido (Direção A, editorial/arquivo). O sistema visual não se toca.

## Público, trabalho, ação

Arquiteto que já decidiu olhar e quer o documento com medida, acabamento e ficha cotada. Chega pelo menu, e também pela busca: "catálogo" é a palavra que ele digita. Cena real: em obra, sinal ruim, quer saber o peso **antes** do clique. Volta muitas vezes — é ferramenta, não campanha.

Ação primária: **obter um documento** — baixar quando o arquivo existe, pedir à Belmare quando não. Secundária: sair para os arquivos 3D ou para a página da marca.

## Os dois problemas que a direção resolve

1. **Zero PDFs existem.** Nada foi recebido até 30/07/2026. A implementação literal de `estrutura.md` §3.4 ("os PDFs, lista plana") renderiza página em branco, e página em branco atrás de item de menu é pior que o 404.
2. **Seria a quarta enumeração das mesmas quatro marcas** — galeria da home, ledger de `/quem-somos` 05, registros de `/representadas`, e agora esta.

## Direção — **"O índice de documentos"** (comp aprovado `catalogos-c-duas-colunas`)

**A linha é o documento, não a marca.** A entrada é o documento; a marca vai em mono pequena **sob** o título, como atribuição. Isso tira a página da repetição e libera a lista de ser de quatro: uma fábrica com dois documentos ocupa duas linhas sem tocar em layout.

**A linha tem dois estados, e o de hoje é o segundo.** Publicado (`arquivo` + `mb` medidos) baixa o PDF; a pedir aciona o WhatsApp com o documento nomeado no contexto. Preencher dois campos vira a linha de *pedir* para *baixar* — mesma grade, mesma altura. Nenhum layout novo no dia em que o primeiro PDF chegar.

Composição: fio vertical de altura total separando o argumento (rótulo, h1, parágrafo, saídas) da lista (cabeçalho de colunas, linhas, nota de ausência). Fecho atravessando as duas colunas como o pedido coletivo — a única página em que "um interlocutor para as quatro" vira ação e não frase.

**Sem fotografia, e é decisão.** Primeira superfície do site sem imagem: é o teste que o DESIGN.md declara sobre si mesmo. Em Operate, foto de ambiente é ruído entre o visitante e o arquivo.

## Prova publicável, e nada além

O estado do catálogo de cada fábrica, como levantado em fonte pública: Trisol edição 2026 ✅ · Marê tem catálogo, edição desconhecida (P22) · GDA tem PDF, edição desconhecida · Bux não declara nada. A assimetria é o conteúdo, não a lacuna.

Marca sem documento declarado **não vira linha**: sai numa nota por extenso abaixo da lista. Peso sempre medido do arquivo, nunca estimado.

**Fora, e vinculante:** ❌ link para o site da fábrica — o catálogo 2026 da Trisol está público lá, e linkar entrega o lead, o e-mail comercial da fábrica e a comissão de graça (Princípio 3) · "em breve", "aguarde", travessão em campo vazio · peso ou edição inventados · capa de catálogo, miniatura de PDF, visualizador embutido · grade, filtro, subpágina por marca · PRANCHA 03 — as duas existentes desenham dado com geometria, e uma lista de arquivos não tem geometria · movimento por rolagem.

## Estados e faixas

0 a N documentos, nunca quatro fixos · hoje 3 documentos, 0 publicados, 1 marca sem declaração · rota estática, sem loading e sem erro · sem estado vazio construído · documento sem edição conhecida escreve "Edição não declarada".

## Consequências que o construtor não inventa

`catalogo` continua **campo da `Representada`**, não coleção nova, e não nasce `/catalogos/[marca]` — esta rota é uma vista sobre o mesmo dado. O campo virou `catalogos?: Catalogo[]`, com o par `arquivo`+`mb` discriminando publicado de a pedir. A linha de documento é **componente compartilhado** com `para-levar.tsx` da página de marca, e `/arquivos-3d` herda a mesma gramática. PDF não vai para o git: `arquivo` é URL de storage.

## Fidelidade ao comp — `.impeccable/mocks/catalogos-c-duas-colunas.png` (aprovado 30/07/2026)

| Ingrediente do comp | Meio | Onde |
|---|---|---|
| Fio vertical de altura total entre as colunas | CSS — borda da coluna da lista, não elemento próprio | `md:border-l` em `page.tsx` |
| Rótulo, h1, parágrafo, saída secundária | HTML semântico | coluna esquerda |
| Cabeçalho de colunas em mono | HTML, `aria-hidden`, grade compartilhada | `GRADE_DA_LINHA` |
| Linha de documento com título, medida, seta | Componente compartilhado | `linha-de-catalogo.tsx` |
| Seta | SVG autoral já existente, 32×12, traço 1px | `icones.tsx` |
| Fecho de largura total em fio de tinta | Componente existente | `acao-de-fecho.tsx` |
| Fotografia | **omissão aceita, e é a direção** — Operate, e o DESIGN.md declara o teste de ficar de pé sem foto | — |

Compromissos que o comp fixou e o build honra: marca subordinada ao documento (resolvida **dentro do título** — "Catálogo Trisol" — depois que a versão com linha em mono versal quebrou a Regra da Caixa Alta e esvaziou o corpo maior) · medida alinhada à direita com seta na ponta · teto de 52rem na lista, sem o qual a linha abre buraco em 1440px.

## Decisões em aberto

❓ **P11 aplicado a catálogo — download com cadastro?** Construído sem gate: o gate, se existir, fica em `/arquivos-3d`, que é o ativo raro. Ligar o gate troca a linha de link por formulário.
❓ **P22 — a Marê tem PDF único ou um por coleção?** Se for por coleção, a lista pode ter 30 linhas e passa a exigir agrupamento por marca. O modelo aceita; o layout pede revisão nesse dia.
❓ P62 frequência de atualização · `/arquivos-3d` segue em 404, e é o último item do menu ainda sem rota.
