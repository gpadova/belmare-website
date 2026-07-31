# Acervo — inventário e o que existe de fato

`✅` verificado · `🟡` inferência · `❓` pergunta aberta

---

## 1. Resumo honesto

**Não recebemos nenhum arquivo até agora.** Tudo abaixo foi levantado por inspeção pública dos sites das marcas. O acervo real da Belmare — fotos de projetos, catálogos, tabelas, arquivos 3D — é **desconhecido**.

Este é o documento que mais muda o projeto. Design de mobiliário é design de imagem: sem fotografia excelente, nenhum layout salva o site.

| Categoria | Existe? | Qualidade |
|---|---|---|
| Fotos de produto | 🟡 sim, nos sites das fábricas | ⚠️ **baixa resolução** — ver §2 |
| Fotos de ambiente | 🟡 algumas | ⚠️ idem |
| Fotos de fábrica/processo | ❌ nenhuma pública | — |
| Retratos dos designers | ❌ | — |
| Fotos de projetos realizados pela Belmare | ❓ **desconhecido — item mais valioso do projeto** | — |
| Logos vetoriais | ❌ | — |
| Manuais de marca | ❌ | — |
| Catálogos PDF | 🟡 Marê e GDA têm; **Trisol tem edição 2026** ✅; Bux ❓ | ⭐ **virou o ativo central** |
| Fichas técnicas com medidas | ❌ | fora de escopo — vivem no PDF |
| Arquivos 3D | 🟡 GDA na Casoca; demais ❓ | — |
| Cartas de acabamento e tecido | ❌ | — |
| Textos institucionais das marcas | 🟡 fragmentos públicos | insuficientes |

---

## 2. ⚠️ O teto fotográfico — a restrição mais séria do projeto

Medições reais nos sites das fábricas ✅:

| Fonte | Dimensão | Uso possível |
|---|---|---|
| Marê — fotos de produto | **1300 × 866 px** (1,1 MP) | card em grid, no máximo meia-tela |
| Marê — banners de home | **1920 × 980 px** | hero a 1× em 1440px; **borra a 2×** |
| Marê — verticais | 577 × 866 px | thumbnail |
| GDA — home | 4 imagens no total, a maior é o logo (636 × 89) | nada aproveitável |

### A conta

Um hero full-bleed numa tela de 1440 px com DPR 2 pede **2880 px** de largura. Um MacBook Pro 16" pede mais.

- Foto de produto da Marê: **1300 px = 45% do necessário.** Não preenche nem 1× em desktop.
- Banner da Marê: **1920 px = 67% do necessário** a 2×.

**Conclusão direta: com o material publicado hoje, não existe site nível Awwwards.** Não é limitação de layout, código ou talento — é limitação física de pixel. Ampliar borra, e júri de premiação vê borrão em dois segundos.

### Três saídas

| Caminho | Custo | Resultado |
|---|---|---|
| **A. Pedir os originais às fábricas** | baixo (só articulação) | ⭐ **Comece por aqui.** As fotos foram feitas por fotógrafo profissional; os RAW/TIFF originais quase sempre existem em 4000–6000 px. O que está no site é a versão comprimida pelo WordPress. Um e-mail pode resolver 80% do problema. |
| **B. Ensaio fotográfico próprio** | R$ 8–25k 🟡 | Controle total, identidade visual coerente entre as quatro marcas, e **acervo que passa a ser da Belmare** — ativo permanente, não emprestado. É o que separa um bom site de um site premiado. |
| **C. Design que contorna a limitação** | zero | Layout editorial, tipografia protagonista, imagem em módulos menores e bem emoldurados, muito branco. Honesto e elegante — mas abre mão do impacto full-bleed. |

> ❓ **P41 — As fábricas conseguem enviar as fotos originais em alta?** É a primeira pergunta a fazer, e a de melhor retorno em todo o projeto.
> ❓ **P42 — Há orçamento para um ensaio fotográfico próprio?** Ver `restricoes.md`.
> ❓ **P43 — A Belmare tem fotos de projetos entregues no Sul?** Casas, coberturas, pousadas, restaurantes. **Este é o conteúdo mais valioso que pode existir** — é a única prova de que a Belmare fez algo, e é o que "Quem somos → Projetos realizados" exige. Sem isso, a página vira texto institucional vazio.

---

## 3. O volume de conteúdo — o risco que foi eliminado

Registro do que **quase** aconteceu, porque explica o valor da decisão tomada.

Um catálogo nativo com filtro por categoria e material exigiria, por produto:

```
🟡 ~80–150 produtos (4 marcas)  ×  campos obrigatórios:

nome · marca · coleção · designer · categoria · ambiente (int/ext)
· materiais (1..n) · medidas (L×P×A) · acabamentos disponíveis
· foto principal · fotos adicionais · arquivo 3D (1..n formatos)
· prazo · descrição
```

**~1.000 a 2.000 campos.** E nenhuma das fábricas publica material por produto hoje ✅ — o dado não existia em lugar nenhum. Seria o maior risco de prazo do projeto, maior que qualquer decisão técnica.

### ✅ DECIDIDO (30/07/2026) — **somente PDFs. Conteúdo gerenciado por CMS.**

**Não haverá página de produto individual.** O detalhamento (medidas, acabamentos, especificação) vive no **PDF de catálogo de cada marca**. O site não replica o catálogo — ele o distribui.

**Isso resolve o maior risco do projeto.** A estimativa de ~1.000–2.000 campos acima **deixa de valer**: não é preciso levantar material, medida e acabamento produto a produto. O caminho crítico deixa de ser conteúdo e volta a ser design e construção.

O que o CMS passa a controlar:
- Marcas, textos institucionais e o PDF de catálogo de cada uma
- Peças em destaque (foto, nome, marca, categoria) — para o grid navegável
- Projetos realizados
- Arquivos 3D e cartas de acabamento

O que **sai** do escopo: página por produto, ficha técnica no site, matriz completa produto × material × medida.

> ✅ **A tensão do filtro, resolvida em 30/07/2026.** O briefing pedia filtro por categoria **e** por material atravessando as quatro marcas. Ao medir o acervo, a matriz marca × material apareceu com **4 células de 32** — a Marê, que tem mais peças, não declara material em lugar nenhum. **O filtro de material foi cancelado**; ficou o filtro de categoria dentro da marca. Ver `estrutura.md` §4.
>
> Isso reforça a decisão desta seção em vez de contrariá-la: era o mesmo dado inexistente que inflava a estimativa de ~1.000–2.000 campos. Cortá-lo duas vezes é coerente.

> ❓ **P46b — Quantas peças em destaque por marca?** Sugestão: 12–20, escolhidas pela Belmare como as mais vendidas ou mais especificadas. A Trisol resolve com 5 — é a linha inteira dela.

---

## 4. Direitos de uso

> ❓ **P47 — Quem é o fotógrafo das imagens de cada marca, e a licença cobre uso pela Belmare no site dela?**
> ❓ **P48 — As fotos de projetos realizados têm autorização do cliente final e do arquiteto para publicação?** Projeto residencial de alto padrão costuma ter cláusula de confidencialidade. Publicar a casa de um cliente sem autorização é problema real — jurídico e de relacionamento.
> ❓ **P49 — Podemos creditar os arquitetos nos projetos?** Creditar é ótimo negócio: o arquiteto compartilha, e vira prova social junto ao público-alvo nº 1.

---

## 5. Estrutura de pastas para o material recebido

Conforme os arquivos chegarem:

```
briefing/acervo/
├── inventario.md          ← este documento (atualizar a cada entrega)
├── fotos/
│   ├── mare-mobilia/
│   ├── gda-moveis/
│   ├── bux-garden/
│   ├── trisol/
│   └── projetos-belmare/  ← prioridade máxima
├── catalogos/             ← PDFs por marca, com data da edição
├── 3d/
│   ├── skp/  dwg/  rvt/  3ds/
├── acabamentos/           ← cartas de tecido e acabamento
└── textos/                ← institucionais enviados pelas fábricas
```

⚠️ **Não versionar binário pesado em git.** Fotos em alta e PDFs de catálogo estouram o repositório rapidamente. Ver `../restricoes.md` §5.

---

## 6. Ordem de coleta recomendada

| # | Item | Por quê |
|---|---|---|
| 1 | **Fotos originais em alta** | Define o teto de qualidade do site inteiro — **o único gargalo que sobrou** |
| 2 | **Fotos de projetos da Belmare** | Único conteúdo exclusivo dela; nenhuma fábrica tem |
| 3 | **Logos vetoriais + autorização** | Bloqueia home e página de marcas |
| 4 | **Os 4 catálogos PDF atualizados** | Viraram o produto entregue em cada página de marca |
| 5 | ~~Lista de lojas~~ | ✅ fase 2 |
| 6 | **Arquivos 3D e formatos** | Bloqueia a seção que prende o arquiteto |
| 7 | **Peças em destaque por marca** (12–20) | Alimenta o grid e os filtros |
| 8 | **Textos institucionais** | Preenchível por entrevista, se necessário |

~~Identificar a Trisol~~ ✅ resolvido em 30/07/2026.
