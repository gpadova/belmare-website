# Contas do painel

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

## 1. Criar a conta administradora primeiro — e escolher o papel à mão

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

## 2. Criar a conta operadora — pela conta administradora, papel também explícito

Logado como administrador, vá em **Usuários → Adicionar novo** e crie a
conta da pessoa da Belmare que vai mexer no painel no dia a dia: nome,
e-mail dela, uma senha temporária (a seção 4 cobre a entrega dela) e, de
novo, **escolha "Operador" no campo Papel em vez de deixar em branco**.
Deixar em branco também resulta em operador, pelo mesmo hook — mas um campo
escolhido é um registro de que alguém decidiu isso; um campo vazio é só um
efeito colateral que quem ler o cadastro depois não tem como distinguir de
um esquecimento.

## 3. O que cada papel alcança, na prática

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

## 4. Entregar a credencial do operador de propósito

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

## 5. Quando o operador sai

Porque a credencial é de uma pessoa nomeada, não compartilhada, desligar
alguém é apagar exatamente a conta dela — **Usuários → a conta da pessoa →
apagar** (só administrador alcança esse botão). O acesso cai na hora: não há
senha para trocar em outro lugar nem grupo para avisar.

Se alguém assume o lugar, repete o passo 2 do zero para essa pessoa: conta
nova, senha nova, mesma entrega deliberada. Nunca repasse a senha de quem
saiu para quem entra — isso reintroduz o mesmo compartilhamento ad hoc que
este procedimento existe para evitar.
