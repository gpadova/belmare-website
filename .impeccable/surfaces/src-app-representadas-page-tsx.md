---
version: 1
slug: "src-app-representadas-page-tsx"
primary_target: "src/app/representadas/page.tsx"
related_targets: ["src/components/representadas/prancha-area-externa.tsx","src/components/representadas/registros.tsx","src/lib/prancha-area-externa.ts"]
---

## Escopo e modo

Página `/representadas`, o índice das marcas. Modo **Persuade** — o visitante decide qual fábrica abrir, e a página é o argumento da cobertura.

Superfície nova dentro do mundo estabelecido (Direção A, editorial/arquivo). O sistema visual não se toca; só a composição estava aberta.

## Público, trabalho, ação

Arquiteto do Sul que já sabe que a Belmare existe e quer descobrir **qual das fábricas resolve o vão que ele tem agora**. Chega pelo menu, pela home ou pelo bloco 05 de `/quem-somos`. Leitor silencioso: o diretor comercial de uma quinta fábrica medindo o profissionalismo de quem quer o Sul dele.

Ação primária: **descer para uma marca**. Secundária: falar com a Belmare no fecho.

## O problema que a direção resolve

O site já mostrou as quatro marcas **duas vezes** — galeria fotográfica na home, ledger de quatro linhas em `/quem-somos` 05. Uma terceira lista das mesmas quatro não tem razão de existir. A rota só se justifica fazendo o que nenhuma das duas fez: mostrar que as quatro, juntas, cobrem uma área externa inteira, e onde cada uma entra.

## Direção — **"PRANCHA 02 · a área externa desmontada"** (sorteio `77738b15`, índice 5 de 7; comp aprovado `indice-b-duas-colunas`)

`PRANCHA 01` desenha **onde** a Belmare opera; esta desenha **o que** ela resolve. Duas pranchas, a mesma gramática de moldura, registro de canto, rótulo em mono e carimbo. É série, não gesto avulso.

Primeira dobra em duas colunas separadas por fio de altura total: à esquerda a prancha com quatro chamadas numeradas sobre a fotografia; à direita rótulo em mono, h1 e a legenda de quatro linhas com seta, que é a rota primária. Abaixo, os registros em duas colunas com miniatura, mesma ordem e mesmas chaves. Fecho em WhatsApp.

**Três regras que não se desfazem:**

1. **A chamada nomeia a FUNÇÃO, nunca o produto.** A cena é gerada; uma seta escrita "Trisol" afirmaria que aquele ombrelone é produto da Trisol. A legenda, fora do desenho, é que atribui.
2. **A prancha não recorta.** `aspect-16/9` em toda largura, igual ao aspecto do arquivo. As chamadas estão em porcentagem da caixa, e `object-cover` num aspecto diferente empurra a chamada 01 para fora do sofá. Trocar a foto obriga a recalcular `lib/prancha-area-externa.ts`, e só ele.
3. **Cada linha de chamada é traçada duas vezes** — encamisamento de 3px em papel sob traço de 1px em tinta. Não é efeito: linha única em papel media 1,09–1,9:1 sobre esta fotografia clara, abaixo do 3:1 que a WCAG 1.4.11 pede para objeto gráfico necessário à compreensão.

**O título não afirma partição.** "Cada parte da área externa tem uma fábrica" prometia uma regra que o desenho não ensina — móvel e estofado são dois recortes do mesmo objeto. "O móvel, a estrutura, o estofado e a sombra." nomeia quatro objetos sem afirmar o que não se sustenta. Pelo mesmo motivo, o `parte` da Bux é **Estofado** na prancha, enquanto o `resolve` dela segue "o conforto" na prosa e no ledger.

## Prova publicável, e nada além

Nome, origem e um fato verificado por marca, de `lib/representadas.ts`. Território "Sul do Brasil", igual para todas.

**Fora, e vinculante:** território por marca (a própria Marê lista a Belmare só para SC e RS — publicar quebra a promessa única) · exclusividade ou termo de contrato · e-mail de fábrica · "~20 anos" da GDA, que é aproximação · obra, cliente, prêmio, depoimento.

**Duas legendas visíveis de mock**, e as duas existem por posição: a da prancha, porque a cena mostra uma área externa inteira resolvida logo abaixo de um título que fala em fábricas; a dos registros, porque uma poltrona de corda encostada em "Marê Mobília · Cambé · PR" é lida como peça da Marê. `alt` não resolve — quem enxerga não lê `alt`.

**Anti-metas:** grade de quatro colunas · tabela comparativa marca × atributo, que é o eixo de material voltando pela porta dos fundos · repetir a galeria da home · **grade de logos** — em 05/08/2026 o item era "logo das fábricas" e passou a ser só a grade: o logotipo encabeça a ficha de cada registro, uma marca por linha, e a miniatura fotográfica continua sendo a coluna da esquerda em todas elas · chamada de recrutamento de novas marcas, que é oferta comercial que ninguém confirmou · véu escuro sobre a prancha · movimento por rolagem.

## Estados e faixas

3–8 marcas (array, nunca quatro fixas) · marca sem base renderiza "Origem não declarada" por extenso · sem estado vazio, sem loading, sem erro — rota estática · a prancha aceita N porque a chave é a função: duas marcas podem dividir uma chamada, e uma quinta que resolva algo novo pede um objeto novo na cena, não uma quinta coluna.

## Decisões em aberto

P18 o portfólio cresce · P65 base da Trisol · P41 fotos originais em alta (a prancha é o maior consumidor delas) · `/catalogos` e `/arquivos-3d` seguem em 404, e são dois dos quatro itens do menu.
