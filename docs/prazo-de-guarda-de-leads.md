# Prazo de guarda dos leads — material de decisão para PRA-129

PRA-129 puxou de PRA-126 (que já entregou o formulário, a coleção e o envio) o único critério
que não é trabalho de engenharia: escolher por quanto tempo um contato recebido em `/contato`
fica guardado, e se essa exclusão é **aplicada** ou apenas **declarada**. Este documento existe
para que essas duas perguntas cheguem ao cliente com o material pronto para decidir numa sentada
só, em vez de um ticket parado esperando alguém abrir o código.

Nada aqui foi escrito na política de privacidade, no `PRODUCT.md` ou em código — ver a nota no
topo de PRA-129 sobre por que inventar um prazo na cópia do produto seria pior do que a lacuna
atual.

## Parte 1 — para o cliente decidir: por quanto tempo guardamos um contato do site

### O que o site guarda hoje

Quando alguém preenche "Quero revender" em `/contato`, o site grava, para sempre e sem prazo
nenhum, exatamente isto (`src/collections/leads.ts`) — nada além disso:

- nome
- e-mail
- cidade
- a empresa ou escritório que a pessoa representa
- se a pessoa aceitou receber novidades por e-mail — uma caixa separada do envio, que nunca vem
  marcada sozinha
- de qual página do site (e de qual marca, quando for o caso) a pessoa veio

Não se pede CPF, não se pede telefone. Só quem tem login no painel da Belmare consegue ler essa
lista — nenhum visitante do site enxerga o contato de outra pessoa.

Hoje, depois de gravado, um contato nunca sai dali sozinho: não existe prazo, não existe
apagamento automático nem manual programado. A própria página de política de privacidade admite
isso por escrito, na seção "Por quanto tempo os dados ficam guardados", reescrita em 06/08/2026:
ela diz que a Belmare revisa a lista e elimina o que não virou nada, e diz com todas as letras que
apagamento automático por prazo fixo não existe. **A recomendação de 24 meses abaixo continua sendo
decisão do cliente, e não está escrita na página** — ver a Parte 2 sobre por que declarar um prazo
que o sistema não cumpre é exposição nova, não conformidade.

### Por que isso precisa de um prazo

Duas razões — nenhuma delas "porque a lei manda decorar um número":

1. **Obrigação.** A lei brasileira de proteção de dados (LGPD) diz, em resumo, que quem guarda
   dado de outra pessoa só pode guardá-lo enquanto ele serve à razão pela qual foi coletado. Aqui,
   a razão é responder e qualificar uma proposta comercial. Guardar para sempre um contato que
   nunca virou nada é o oposto disso — e é a Belmare quem responde por essa guarda, como dona do
   site.
2. **Risco.** Um dado parado, sem prazo e sem uso, não ajuda em nada o negócio — mas continua
   sendo dado pessoal de alguém, que pode a qualquer momento pedir para saber o que a Belmare tem
   sobre ele, ou pedir para apagar. Quanto mais tempo (e mais gente) parada nessa lista sem
   necessidade, maior o estrago possível se um dia houver uma reclamação, uma fiscalização ou um
   vazamento — e menor o ganho, porque um contato que nunca respondeu em anos, na prática, não vai
   responder.

Prazo nenhum não é uma posição neutra: é guardar por guardar.

### A recomendação: 24 meses

Contados a partir da data do contato. Depois disso, se aquele contato nunca virou uma relação
comercial de verdade (uma loja revendendo, uma parceria formalizada), o dado seria apagado.

Por quê 24 meses e não outro número: o ciclo de venda deste setor é longo. Um arquiteto que baixa
o material da Belmare pode especificar um projeto com ela um ano ou mais depois do primeiro
contato. Um prazo curto arrisca apagar, no meio da conversa, exatamente o contato que está
prestes a virar negócio. 24 meses dá folga real para esse ciclo sem virar "guardar para sempre".

### As alternativas, e o que cada uma custa de verdade

| Opção | O que ganha | O que custa |
|---|---|---|
| **Mais curto** (ex.: 6–12 meses) | Menos dado parado, menos exposição | Risco real de apagar um contato que ainda está vivo — o ciclo de venda deste setor costuma passar de um ano, e um prazo curto pode apagar justo quem está prestes a fechar |
| **24 meses** — recomendação | Cobre o ciclo de venda típico do setor sem virar guarda indefinida | — |
| **Mais longo** (ex.: 36+ meses, ou sem prazo) | Nunca perde um contato por engano | É exatamente o que a lei mira: dado guardado além de qualquer uso real. Um contato que não respondeu em três, quatro anos não vai responder — mantê-lo na lista só soma risco, não soma negócio |

### Isto não é parecer jurídico

A recomendação acima foi montada por quem construiu o site, lendo dois artigos da lei (Arts. 15 e
16 da LGPD) e olhando o ciclo de venda do setor — **não por um advogado**. A política de
privacidade do site já avisa que a redação jurídica ainda não foi feita, e o prazo de guarda faz
parte do mesmo pacote pendente: **precisa ser confirmado por um advogado antes de ir para o ar**,
do mesmo jeito que o resto do texto legal da página.

### A pergunta que fecha isto

**Quantos meses a Belmare quer guardar um contato que nunca virou relação comercial, contados a
partir do dia em que ele chega: 24 (a recomendação) ou outro número?**

Uma resposta em número fecha o assunto. Depois de confirmado (idealmente com um advogado), o
número entra na política de privacidade e é registrado no ticket.

---

## Parte 2 — nota técnica: exclusão aplicada ou apenas declarada

A pergunta que PRA-129 deixou em aberto para engenharia: se o prazo escolhido acima vai ser
**cumprido pelo sistema** ou apenas **escrito na página**. Esta parte é para quem for decidir isso
— cliente e quem for construir, se for o caso — não para o visitante do site.

### Não existe job agendado nesta pilha hoje — verificado, não suposto

- `package.json:7-17` — os únicos scripts do projeto são `dev`, `build`, `start`, `lint`, `test`,
  `test:prova`, `payload`, `generate:types`, `generate:importmap`, `db:local` e `db:seed`. Nenhum
  roda em intervalo; todos são disparados à mão ou pelo próprio `next build`/`next start`.
- Não há `vercel.json` neste repositório. A única entrada que bate com "vercel" no projeto inteiro
  é `public/vercel.svg` — um ícone, não configuração. `vercel.json` é onde a Vercel declara Cron
  Jobs; sem o arquivo, não existe nenhum agendado.
- `src/payload.config.ts:143-239` — o `buildConfig` inteiro do Payload não declara a chave `jobs`,
  que é onde o Payload liga sua própria fila de tarefas agendadas (Jobs Queue). Sem ela, o Payload
  não agenda nada sozinho.

Conclusão: hoje, um `Lead` gravado nunca é tocado de novo por código nenhum. A única forma de ele
sumir é alguém apagá-lo à mão no painel (`access.delete: estaAutenticado`,
`src/collections/leads.ts:89`).

### As opções reais, e o que cada uma custa

| Opção | Como funcionaria | Custo |
|---|---|---|
| **Vercel Cron** | Um `vercel.json` com uma entrada de cron (ex.: diária) chamando uma rota de API autenticada por segredo, que roda a exclusão contra o Postgres | Menor esforço de construção — uma rota nova + `vercel.json` + deploy, meio dia de trabalho incluindo teste. O projeto já está no plano Vercel Pro (ver `README.md`, seção "Custo mensal"), então não esbarra no limite de 2 crons diários do plano Hobby. Precisa de monitoramento: um cron que para de rodar silenciosamente é pior do que nenhum, porque a política passaria a prometer algo que já não acontece |
| **Payload Jobs Queue** | Usar a fila de tarefas nativa do Payload 3 (`jobs` em `payload.config.ts`) para definir a tarefa de exclusão | Mais idiomático dentro do próprio Payload, mas não elimina a necessidade da opção acima: em função serverless nada fica "rodando" entre requisições, então a fila do Payload ainda precisa de algo externo disparando-a numa hora certa — normalmente outro cron batendo numa rota. Custo extra sem ganho real aqui, a menos que o projeto já planeje outras tarefas agendadas no futuro |
| **Ação manual no painel** | Um botão na lista de Leads (mesmo padrão do botão "Exportar CSV" já existente, `admin.components.beforeListTable` em `src/collections/leads.ts:75-79`) que roda a exclusão quando um operador clica | Mais barato de construir — reaproveita um padrão já pronto. Mas só é "aplicado" enquanto alguém lembrar de clicar; se ninguém clicar, nada é apagado apesar do que a política disser. Isto é "declarado, com reforço manual", não "aplicado" de verdade, e a redação da política precisa admitir exatamente isso |

### A assimetria de risco

Declarar um prazo que o sistema não cumpre é, por si só, uma exposição nova — o site passaria a
prometer ao visitante algo que nada garante, numa política cuja única virtude hoje é ser honesta
sobre a própria lacuna. Duas saídas, e as duas são melhores do que declarar sem cumprir:

1. **Construir o mecanismo** (a opção de Vercel Cron acima, com ou sem o botão manual como
   reforço), ou
2. **Escrever a política de um jeito que não prometa automação que não existe** — algo como "os
   contatos são revisados periodicamente" em vez de "são apagados automaticamente após X meses" —
   até que o mecanismo exista de fato.

Qual das duas é também decisão do cliente: a primeira tem custo de engenharia; a segunda tem o
custo de a política ficar mais vaga do que o prazo escolhido na Parte 1 sugere.

### O que "apagar" deveria significar para um lead no meio da conversa

O relógio de 24 meses contado a partir de `createdAt` (gravado sozinho pelo Payload em cada
`Lead`) não sabe se aquele contato está frio ou em negociação ativa: não existe hoje nenhum campo
de status no `Lead`, e nada no fluxo atual (`src/lib/lead-acao.ts`) atualiza o registro depois da
gravação inicial. Se alguém da Belmare está trocando mensagem por WhatsApp com aquele contato há
20 meses fora do sistema, o relógio do painel não sabe disso — um mecanismo automático apagaria um
negócio quase fechado só porque ninguém tocou o registro no painel.

Duas saídas possíveis, nenhuma delas implementada aqui: ancorar o prazo em "última atualização" em
vez de em criação (o que exige alguém de fato editar o registro quando a conversa avança — um
hábito, não só um campo), ou dar ao operador um jeito de marcar um lead como "não apagar" antes do
prazo vencer. As duas são decisão de produto tanto quanto de engenharia, e nenhuma está no escopo
deste ticket construir — só registrar que o relógio ingênuo tem esse ponto cego.

### O consentimento de marketing muda a resposta

`consentimentoMarketing` (`src/collections/leads.ts:158-167`) é uma caixa separada do envio do
formulário, e quem a marca está aceitando algo diferente de "ser respondido sobre este contato":
está aceitando receber novidade por e-mail depois. Na prática, isso é uma segunda finalidade de
tratamento, com sua própria lógica de prazo — mais parecida com "até a pessoa pedir para sair da
lista" do que com "24 meses depois do primeiro contato".

Aplicar o mesmo relógio de 24 meses aos dois casos sem distinção erra de um jeito ou de outro:
apaga, ainda dentro do ciclo de venda, alguém que pediu para continuar recebendo novidade da
Belmare; ou, se o consentimento virar desculpa para nunca apagar ninguém, esvazia o prazo inteiro
— a maioria das pessoas marca ou não essa caixa sem pensar muito nela, não por um interesse
deliberado em entrar numa lista de e-mail permanente.

Este ponto não está resolvido pela recomendação de 24 meses e precisa da mesma decisão do cliente
antes de qualquer mecanismo ser construído — provavelmente como uma segunda pergunta, depois da
Parte 1 estar fechada: **um lead que aceitou novidades por e-mail segue uma regra de prazo
diferente do lead que não aceitou, ou os dois seguem o mesmo relógio?**

---

## Referência

Ticket: PRA-129. Ticket pai: PRA-126. Página afetada, ainda não alterada por este documento:
`/politica-de-privacidade`, seção "Seus direitos e como exercê-los" (composição em
`src/seed/semear-paginas.ts`).
