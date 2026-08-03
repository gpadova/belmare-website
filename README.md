# Belmare — site institucional

Next 16 + Payload 3. O site público e o painel de edição moram na mesma
aplicação: `src/app/(frontend)` é o site, `src/app/(payload)` é o painel.

Vocabulário do projeto em `CONTEXT.md` — os termos são vinculantes.

## Rodar localmente

```bash
pnpm install
cp .env.example .env   # e preencha (ver abaixo)
pnpm db:local          # cria o banco de desenvolvimento do zero
pnpm dev
```

- Site: <http://localhost:3000>
- Painel: <http://localhost:3000/admin>

Na primeira visita ao painel ele pede para criar a conta inicial. O esquema do
banco é criado sozinho na primeira requisição.

### O banco de desenvolvimento

Postgres local, descartável, **nunca o do Neon de produção**. Um comando o
recria do zero:

```bash
pnpm db:local     # dropdb --if-exists belmare_dev && createdb belmare_dev
```

Precisa do Postgres rodando: `brew services start postgresql@14`.

Recriar o banco apaga tudo, inclusive a conta do painel — é para isso que ele
serve. O `DATABASE_URI` do `.env` aponta para ele.

### Variáveis de ambiente

Estão listadas e explicadas em `.env.example`, que é versionado justamente
para não virar memória de uma pessoa só. Sem as variáveis do R2 o painel
continua funcionando: os uploads caem em `.uploads/`, no disco.

## Comandos

| Comando                  | O que faz                                          |
| ------------------------ | -------------------------------------------------- |
| `pnpm dev`               | Site e painel em desenvolvimento                   |
| `pnpm build`             | Build de produção                                  |
| `pnpm test`              | Testes (Vitest) sobre a superfície de `src/lib`    |
| `pnpm test:prova`        | O upload de 24 MB contra a pilha do Docker         |
| `pnpm db:local`          | Recria o banco de desenvolvimento do zero          |
| `pnpm generate:types`    | Regera `src/payload-types.ts` a partir do esquema  |
| `pnpm generate:importmap`| Regera o import map do painel                      |

Rode `generate:types` sempre que mexer numa coleção. `generate:importmap` só
quando entrar ou sair um componente de painel — o handler de upload do
navegador está lá, e sem ele o upload direto para o bucket não acontece.

### Os testes

Um seam só: a superfície pública de `src/lib`. Componente e rota ficam de fora
porque são finos, e o que eles fazem é consequência do que o seam devolve.

`pnpm test` roda dois projetos:

- **puro** — mappers e ajudantes, sem banco e sem framework. É onde cabem os
  estados que um banco esconderia: um upload que voltou só como identificador,
  um arquivo sem tamanho gravado.
- **integração** — as consultas contra um Payload de verdade, semeado pela API
  local. É também onde a recusa de validação é provada: gravar entrada inválida
  pela API local é a mesma porta por onde o operador salva.

⚠️ O projeto de integração **cria e apaga o próprio banco** (`belmare_teste`) a
cada execução — nunca o de desenvolvimento e nunca o de produção. Não há passo
manual, mas o Postgres local precisa estar de pé, o mesmo do desenvolvimento.
Rodar só a parte rápida: `pnpm vitest run --project puro`.

## Cloudflare R2

Os binários pesados — catálogos de 24 MB, arquivos 3D de 8 MB — vão para o R2,
e o navegador os envia **direto para o bucket**, sem passar pela função
serverless da Vercel, que recusa corpo de requisição acima de 4,5 MB.

Duas configurações precisam ser feitas no painel da Cloudflare, e o upload
falha sem qualquer uma delas.

### 1. CORS: liberar o PUT assinado

O navegador faz um preflight `OPTIONS` antes do `PUT`. Sem a política abaixo em
**R2 → o bucket → Settings → CORS Policy**, o upload morre no preflight e o
painel só mostra um erro de rede.

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://belmare.com.br",
      "https://www.belmare.com.br"
    ],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["content-type", "content-length"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Três detalhes que custam uma tarde cada:

- **`AllowedOrigins` não aceita curinga de subdomínio.** `https://*.vercel.app`
  não vale; cada domínio de preview que precisar subir arquivo entra na lista
  pela URL inteira, sem barra no fim e sem caminho.
- **`AllowedHeaders` não aceita `"*"`.** Funciona na AWS, não funciona no R2.
  `content-type` é o único que o navegador realmente pede no preflight — o
  `content-length` é posto pelo próprio navegador e vai na lista por garantia.
- **A origem é a do site, não a do bucket.** É de `localhost:3000` e do domínio
  de produção que o `PUT` parte.

### 2. Leitura pública: para o catálogo descer

O `PUT` é assinado, mas o `GET` de quem baixa não é — e o endpoint da API S3
recusa requisição sem assinatura. O bucket precisa de leitura pública, em
**Settings → Public access**, e o domínio que sair de lá é o `R2_PUBLIC_URL`:

- **Domínio próprio** (`arquivos.belmare.com.br`) — o certo para produção.
- **Subdomínio `r2.dev`** — resolve para testar, mas é limitado por taxa e a
  própria Cloudflare desaconselha em produção.

## A prova local do upload de 24 MB

O `clientUploads` acima é a suposição de que o projeto inteiro depende, e
`payload.config.test.ts` prova só metade dela: que a configuração montada TEM as
duas peças do envio direto. A outra metade é uma medida, não uma leitura — 24 MB
de verdade atravessando —, e ela precisa de um bucket. O `docker-compose.yml`
põe um **MinIO** no lugar do R2 e um Postgres no lugar do Neon, para que a
medida caiba numa máquina sem conta de nuvem nenhuma.

MinIO e R2 falam a mesma API S3, então o caminho de código exercitado é o mesmo:
o painel chama `POST /api/storage-s3-generate-signed-url`, recebe uma URL
assinada e o navegador faz o `PUT` direto no bucket. **Leia antes de comemorar o
verde**: o que isto não prova está no fim desta seção.

### Subir a pilha

```bash
docker compose up -d --wait
```

Sobem três coisas: Postgres em **55432** (deslocado do 5432 do desenvolvimento,
com banco próprio `belmare_prova`), MinIO em **9000** (painel em 9001), e um
contêiner de um passo só que cria o bucket e o abre para leitura anônima — o
equivalente local do "Public access" do R2. Nada disto toca `belmare_dev` nem
`belmare_teste`.

### Apontar o painel para ela

`prova-local.env` é lido **por cima** do `.env`, só na sessão que roda a prova.
Variável já posta no processo ganha da que está no `.env`, então o seu ambiente
de desenvolvimento continua intacto e fechar o terminal desfaz tudo:

```bash
set -a && . ./prova-local.env && set +a
pnpm dev
```

O painel fica em <http://localhost:3000/admin> e pede para criar a conta inicial,
porque o banco é novo.

### Rodar a prova

```bash
pnpm test:prova
```

⚠️ Este comando **não** entra em `pnpm test`, e é de propósito: ele exige Docker
de pé, e um teste que falha por falta de ambiente ensina a suíte inteira a ser
ignorada. Ele mora em `vitest.prova.config.ts`, num arquivo de configuração
próprio que `vitest run` nunca lê.

O que ele afirma, em ordem: o catálogo de prova tem os 24 MB; o bucket libera o
`PUT` no preflight; **a URL assinada aponta para fora da origem da aplicação** —
é esta a linha que decide o ticket; e os 24 MB sobem e descem com o mesmo
resumo SHA-256.

O catálogo é **gerado**, não versionado — 24 MB no repositório para sempre seria
caro e inútil. `src/test/catalogo-de-24-mb.ts` o monta de forma determinística
(mesmo arquivo, mesmo resumo, toda vez); para tê-lo em disco e arrastá-lo para o
painel à mão:

```bash
node src/test/catalogo-de-24-mb.ts .uploads/prova/catalogo-de-24-mb.pdf
```

### Medir que o arquivo não passou pela aplicação

`pnpm test:prova` prova que o `PUT` sai para outra origem. Para medir o outro
lado da frase — quantos bytes a aplicação REALMENTE recebeu —, há
`src/test/medidor-de-bytes.ts`: um repasse de TCP que se põe entre o navegador e
o Next e conta o que atravessa.

```bash
set -a && . ./prova-local.env && set +a
pnpm exec next dev -p 3210 &                 # o Next sai da frente
node src/test/medidor-de-bytes.ts &          # e o medidor atende em 3000
# use o painel normalmente em http://localhost:3000/admin
kill -USR2 $(pgrep -f medidor-de-bytes)      # imprime o placar sem derrubar nada
```

O veredito é uma comparação: o total que subiu para a aplicação durante a sessão
inteira, contra os 25.165.824 bytes que o bucket recebeu num `PUT` só. Se o
primeiro for menor, o arquivo não passou pela função — não há onde ele caberia.

### Derrubar

```bash
docker compose down -v      # o -v leva junto o banco e o bucket
```

### ⚠️ O que o MinIO NÃO prova sobre o R2

O verde daqui mede o **caminho**, não o **fornecedor**. Continua sem prova, e
só a produção resolve:

- **A política de CORS do bucket de verdade.** Aqui a liberação é uma variável
  de ambiente do servidor inteiro (`MINIO_API_CORS_ALLOW_ORIGIN`); no R2 é um
  JSON por bucket, com as três armadilhas listadas acima — sem curinga de
  subdomínio, sem `"*"` em `AllowedHeaders`, e a origem é a do site. Nenhuma
  delas pode falhar aqui, porque nenhuma delas existe aqui.
- **A leitura pública do R2.** `mc anonymous set download` não é o mesmo botão
  que "Public access", e o domínio que sai de lá (`r2.dev` ou próprio) tem
  limite de taxa e comportamento de cache que o `localhost:9000` não tem.
- **A rede.** Aqui os 24 MB andam por loopback em 338 ms. Numa conexão de
  escritório o `PUT` leva minutos, e é aí que aparecem tempo limite de
  navegador, expiração da URL assinada (600 s) e reconexão — nada disso é
  exercitado por um cabo que não existe.
- **Os limites da Vercel e da Cloudflare.** O cap de 4,5 MB de corpo de
  requisição é da função serverless da Vercel, e não há função serverless
  nenhuma nesta prova: o `pnpm dev` é um servidor Node comum. O que se mediu foi
  que o arquivo **não passa pela aplicação** — o que torna o cap irrelevante —,
  não que a Vercel se comporte como se espera.
- **O checksum do SDK.** O `requestChecksumCalculation: "WHEN_REQUIRED"` de
  `payload.config.ts` existe por causa de uma recusa do R2. O MinIO aceita os
  dois modos, então esta prova passaria mesmo com a linha errada.

### ⚠️ O servidor busca o arquivo de volta depois do envio

Uma coisa que a prova mediu e que não estava no desenho: terminado o `PUT` do
navegador, ao salvar o documento **o servidor faz `HeadObject` e `GetObject` e lê
os 24 MB de volta do bucket** (`getFile` do adaptador S3). Reproduzido duas
vezes, pelo painel.

Isso **não** invalida o envio direto — o cap de 4,5 MB é de CORPO DE REQUISIÇÃO
que entra na função, e uma busca que a função faz para fora não é isso. Mas quer
dizer que a função ainda move 24 MB por upload, em memória e em tempo, e que o
custo do envio direto não é zero do lado do servidor. Vale medir na Vercel antes
de tratar o assunto como encerrado.

## Contas do painel

O papel de cada conta — quem é operador, quem é administrador — é decidido em
código (`src/collections/usuarios.ts`, `src/collections/papeis.ts`, PRA-125).
As duas contas reais, não. Diferente de `representadas`, `paginas` e dos
globais, a coleção `usuarios` **não tem seed** — `pnpm db:seed` roda quatro
scripts e nenhum deles toca esta coleção, de propósito: e-mail e senha são
exatamente o tipo de dado que não se versiona. As duas contas nascem de
alguém preenchendo o formulário no painel de verdade, e é isso que este
procedimento descreve.

⚠️ Isto não é um script para rodar — é o passo a passo de quem tem acesso ao
painel em produção. Hoje, isso é você.

### 1. Criar a conta administradora primeiro — e escolher o papel à mão

Na primeira visita ao `/admin` em produção, com a tabela de usuários vazia, o
Payload mostra a tela **"Create your first user"** em vez do login. Essa tela
é um caso especial: ela ignora a regra "só administrador cria conta" que vale
para toda conta seguinte, porque com zero contas ainda não existe ninguém que
possa ter essa permissão (`registerFirstUser`, confirmado na fonte do pacote
— é o mesmo mecanismo que a nota de topo de `src/collections/usuarios.ts` já
registra para o `access.create` da coleção).

O que aquela nota não cobria, e que decide a ordem deste procedimento: a
mesma tela também mostra o campo **Papel**, com as opções "Operador" e
"Administrador" — e o formulário deixa escolher. Só que, se ninguém tocar
nesse campo, `usuarios.ts` tem um hook que grava "operador" no lugar do
vazio, e o mecanismo que ignora a regra de permissão para a primeira conta
**não desliga esse hook**. Resultado: a própria tela de bootstrap, preenchida
sem escolher Papel, cria uma conta operadora — a única conta que existe no
painel nesse instante — e não sobra ninguém administrador para consertar
isso depois (a partir da segunda conta, só administrador edita o papel de
alguém, inclusive o próprio). Sem acesso direto ao banco, essa conta fica
presa fora das próprias ações que o primeiro acesso existe para ter: criar a
segunda conta, criar ou apagar representada, editar slug.

Então, nesta ordem:

1. Abra `/admin` em produção.
2. Preencha nome, e-mail e senha.
3. No campo **Papel**, escolha **"Administrador" deliberadamente** — não
   deixe em branco.
4. Confirme.

Esta é a conta do desenvolvedor. É ela que faz o passo 2.

### 2. Criar a conta operadora — pela conta administradora, papel também explícito

Logado como administrador, vá em **Usuários → Adicionar novo** e crie a
conta da pessoa da Belmare que vai mexer no painel no dia a dia: nome,
e-mail dela, uma senha temporária (a seção 4 cobre a entrega dela) e, de
novo, **escolha "Operador" no campo Papel em vez de deixar em branco**.
Deixar em branco também resulta em operador, pelo mesmo hook — mas um campo
escolhido é um registro de que alguém decidiu isso; um campo vazio é só um
efeito colateral que quem ler o cadastro depois não tem como distinguir de
um esquecimento.

### 3. O que cada papel alcança, na prática

**Operador** — o painel inteiro foi desenhado pensando nesta conta. Editar
prosa, trocar fotografia, atualizar contato, subir catálogo, cadastrar
peça/arquivo 3D/acabamento, criar e ajustar projeto, montar a composição das
páginas livres (`/arquitetos`, `/contato`, `/politica-de-privacidade`) — tudo
isso está liberado. Se alguma dessas ações for recusada, é defeito, não
comportamento esperado, e vale reportar.

O que o operador **não** alcança, de propósito: criar ou apagar uma
representada; mudar o slug (o endereço) de qualquer coisa; criar, editar ou
apagar a conta de outra pessoa, inclusive escolher o próprio papel. Se o
painel recusar alguma dessas com uma mensagem em português dizendo que a
ação é só do administrador, isso não é um degrau que falta — é o desenho
funcionando. Essas ações mexem na estrutura do site ou em para onde uma URL
aponta: o tipo de engano que quem edita prosa não tem como ver vindo, e que
sai caro — link quebrado, posição perdida na busca. Quando esbarrar nisso, a
resposta é falar com o administrador, não tentar contornar.

**Administrador** — tudo o que o operador alcança, mais criar e apagar
representada, editar slug, e criar/editar/apagar conta de usuário (inclusive
o papel de alguém). É o papel do desenvolvedor — não é para uso diário da
Belmare.

### 4. Entregar a credencial do operador de propósito

"Deliberadamente" quer dizer três coisas concretas, nenhuma delas exigindo
ferramenta que a Belmare não tem hoje:

- **A senha vai para a pessoa, não para um grupo.** Ligue ou mande por
  mensagem direta — WhatsApp individual, não o grupo da empresa — nunca um
  canal onde mais alguém lê. O objetivo é que só ela tenha visto a senha.
- **A senha entregue é temporária.** Gere algo forte e aleatório — não o
  nome da empresa, não uma senha já usada em outro lugar — e trate-a como
  descartável: a única função dela é permitir o primeiro login.
- **No primeiro acesso, a pessoa troca a senha na hora**, antes de mexer em
  qualquer outra coisa, em **Painel → canto superior direito → Account**
  (`/admin/account`, tela padrão do Payload). Dali em diante, só ela sabe a
  senha final — nem quem entregou.

Telefonema ou mensagem direta, mais troca no primeiro acesso, já tiram a
senha de circulação por escrito — que é o problema que "ad hoc" descreve.

### 5. Quando o operador sai

Porque a credencial é de uma pessoa nomeada, não compartilhada, desligar
alguém é apagar exatamente a conta dela — **Usuários → a conta da pessoa →
apagar** (só administrador alcança esse botão). O acesso cai na hora: não há
senha para trocar em outro lugar nem grupo para avisar.

Se alguém assume o lugar, repete o passo 2 do zero para essa pessoa: conta
nova, senha nova, mesma entrega deliberada. Nunca repasse a senha de quem
saiu para quem entra — isso reintroduz o mesmo compartilhamento ad hoc que
este procedimento existe para evitar.

## Custo mensal

| Item                     | Custo         | Por quê                                     |
| ------------------------ | ------------- | ------------------------------------------- |
| Vercel Pro               | US$ 20/mês    | O plano Hobby proíbe uso comercial          |
| Neon (free)              | US$ 0         | O conteúdo são algumas centenas de linhas   |
| Cloudflare R2 (free)     | US$ 0         | 10 GB e egresso zero cobrem o acervo        |
| **Total**                | **US$ 20/mês**|                                             |

⚠️ Isto corrige `briefing/estrutura.md` §5, que diz "Custo real: R$ 0". Não
sobrevive à cláusula de uso comercial do plano Hobby da Vercel.
