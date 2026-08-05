# Belmare — site institucional

O site da Belmare Representações: quatro fábricas de móveis para área externa,
um interlocutor, três estados. Este documento é o glossário do projeto — a
língua que o código, o briefing e o painel do CMS usam em comum. Não é
especificação nem registro de decisão técnica.

## Language

### Camadas de texto

Toda string visível do site pertence a exatamente uma das três. A classificação
é vinculante: define o que existe como campo no painel e o que não existe.

**Gerado**:
Texto derivado de dado em tempo de render — nunca digitado por ninguém. O tempo
de casa, a lista de representadas, o peso de um arquivo, a contagem de
categorias. Digitar um valor gerado é como o site passa a mentir sozinho.
_Avoid_: calculado, dinâmico

**Fixo**:
Texto que mora no código porque é o argumento do desenho, não conteúdo dentro
dele. O h1 da home, os rótulos numerados de `/quem-somos`, o nome das duas
portas. Muda por reposicionamento — e reposicionamento é conversa, não edição.
_Avoid_: hardcoded, estático

**Campo**:
Texto que o cliente edita no painel, com rótulo e ajuda em pt-BR. Prosa
institucional de uma marca, legenda de materiais de uma peça, dados de contato.
_Avoid_: editável, conteúdo

A classificação campo a campo — feita uma vez em PRA-119 e estendida por PRA-120 (Peça,
Arquivo3D, Acabamento), PRA-122 (os globais Empresa, Home e QuemSomos), PRA-123 (a Prancha,
onde o campo é geometria em vez de texto) e PRA-124 (a Página, onde o campo é a COMPOSIÇÃO) —
está registrada em
`docs/classificacao-de-texto.md`. Consulte-a antes de reabrir a discussão para um campo já
classificado; estenda-a, em vez de recomeçar, quando uma coleção nova entrar. A seção "o que
PRA-122 recusou a transformar em campo" existe para que a lista do que fica **fixo** não precise
ser redefendida a cada ticket.

### Composição de página

**Espinha fixa**:
A sequência de seções de uma página desenhada — home, `/quem-somos`,
`/representadas/[marca]`. Definida em código. O cliente edita o que há dentro de
cada seção e pode apagar seções opcionais, mas não reordena nem acrescenta.
_Avoid_: template, layout fixo

**Página livre**:
Uma página cuja composição é um array de blocos escolhidos e ordenados no
painel — `/arquitetos`, `/contato` e `/politica-de-privacidade`. Existe onde não
há argumento de desenho a proteger: as três nunca foram escritas em código, e
nascem CMS-nativas. O ENDEREÇO continua sendo decisão de código — uma rota nova
é um arquivo novo em `app/(frontend)/` mais uma linha em `lib/site.ts#ROTAS_LIVRES`,
e o painel só oferece os endereços que já existem.
_Avoid_: page builder, landing page

**Seção anulável**:
Seção que desaparece quando o dado que a sustenta está ausente, em vez de
renderizar vazia ou quebrar. É o modo de falha correto para um editor inseguro:
o pior resultado de um campo em branco é menos página, nunca página quebrada.
_Avoid_: seção condicional, seção opcional

### O acervo

**Representada**:
Uma fábrica que a Belmare representa. Raiz da árvore de conteúdo: peça,
arquivo 3D e acabamento pendem dela, cada um com um pai só. O catálogo é campo
dela, não coleção.
_Avoid_: marca parceira, fornecedor, cliente

**Vocabulário**:
As categorias de produto nas palavras da própria fábrica. Não se normaliza entre
representadas: cada uma usa as suas, e o filtro nunca sai da marca.
_Avoid_: taxonomia, categorias globais

**Mock**:
Imagem gerada, em uso enquanto a fotografia real não chega. Nunca é apresentada
como foto de produto, fábrica ou projeto entregue — o `alt` termina sempre em
"imagem de referência". Um mock em produção sem marcação explícita é defeito.
_Avoid_: placeholder, provisório
