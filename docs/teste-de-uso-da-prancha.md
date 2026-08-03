# Teste de uso — trocar a fotografia da prancha

O último critério de PRA-123, palavra por palavra:

> O operador consegue trocar a fotografia sem ajuda — verificar com alguém que não viu o código.

Nenhum teste automatizado fecha essa frase. Ela pede uma pessoa, uma tarefa e alguém
calado ao lado anotando. Este documento é o roteiro dessa sessão.

⚠️ **É um teste, não uma demonstração.** A diferença é inteira: numa demonstração alguém
mostra o painel funcionando e a plateia concorda; num teste alguém recebe um objetivo e
ninguém ajuda. Se durante a sessão você explicar onde fica alguma coisa, o teste acabou
naquele instante e o resultado é FALHA — não "passou com uma ajudinha". A ajudinha é o
resultado.

O motivo de a exigência existir está no próprio ticket: as coordenadas das chamadas eram
porcentagens medidas à mão contra uma fotografia específica. Trocar a fotografia sem
recalculá-las deixa quatro linhas numeradas apontando para deck vazio — **e não quebra
nada visivelmente**, então ninguém é avisado. O dia em que a fotografia real chegar é o
único dia em que este campo precisa funcionar, e é tarde demais para descobrir que não
funciona.

---

## 1. Quem senta na cadeira

Uma pessoa que **nunca viu o código e nunca viu este painel**. Não precisa ser
desenvolvedor — precisa ser o contrário disso. O testador ideal é a própria pessoa que vai
operar o site depois; o segundo melhor é alguém do mesmo tipo de trabalho, à vontade com
computador e nada mais.

Desclassificam o testador:

- ter ajudado a desenhar ou revisar o campo;
- ter lido este documento antes;
- ter visto alguém usar o painel, mesmo por cima do ombro.

## 2. Quem conduz, e a única regra

Uma pessoa conduz e anota. **Não ajuda.** Quando o testador perguntar alguma coisa, você
tem três frases e nenhuma a mais:

1. "O que você acha que aconteceria?"
2. "Faça como você faria se eu não estivesse aqui."
3. "Não posso responder isso agora — anotei a pergunta."

Qualquer coisa dita além dessas três — inclusive apontar a tela, inclusive "isso aí",
inclusive um "hmm" no tom certo — é ajuda, e vira FALHA. Anote **todas** as perguntas,
palavra por palavra, respondidas ou não: essa lista costuma valer mais do que o veredito.

Peça ao testador que **pense em voz alta**. Diga isso uma vez, no começo, e não repita.

## 3. Preparar a máquina (antes de o testador chegar)

Um banco de desenvolvimento do zero, com o conteúdo semeado — a prancha publicada com a
fotografia atual e as quatro chamadas nas posições medidas à mão.

```bash
pnpm db:local          # recria belmare_dev do zero (apaga tudo, é para isso que serve)
pnpm dev               # noutro terminal
```

Abra <http://localhost:3000/admin>, crie a conta inicial e então:

```bash
pnpm db:seed           # representadas, globais, prancha e páginas
```

Depois, ainda como quem preparou:

1. **Confira o papel da conta.** Em Usuários, o campo "Papel" tem que estar em
   **Operador** — uma conta criada agora nasce assim. O painel foi desenhado para esse
   papel, e uma sessão feita como administrador testa outra tela. Se estiver diferente,
   anote na folha: o resultado ainda vale, mas com essa ressalva escrita.
2. **Deixe a fotografia nova na área de trabalho, com nome neutro:**
   ```bash
   cp public/acervo/abertura.jpg ~/Desktop/area-externa-nova.jpg
   ```
   É outra área externa, com os mesmos quatro assuntos na cena — a lona do ombrelone, a
   haste de alumínio, o sofá de corda e as almofadas — em lugares diferentes dos da
   fotografia atual. Ela tem a mesma proporção da fotografia de hoje, então a moldura não
   muda de forma: o que sai do lugar são as chamadas, só elas.

   Com os pinos onde estão hoje, o resultado sobre a cena nova é: **uma** linha cai quase
   certa por acaso, **duas** caem em parede e céu vazios, e **uma** encosta num objeto que
   não é o daquela fábrica — esta última é a traiçoeira, porque parece resolvida. Isso é
   de propósito: se as quatro caíssem no vazio, a sessão mediria se o testador enxerga, e
   não se ele conserta.
3. **Deixe exatamente duas abas abertas:** o painel em `/admin` (na tela inicial dele, não
   na prancha) e o site em `/representadas`. Mais nada. Não abra a tela da prancha —
   achá-la é parte do teste.
4. Zoom do navegador em 100%. Mouse ou trackpad à mão, teclado à mão.
5. Anote **navegador e sistema**. O comportamento de foco ao clicar num pino depende
   deles, e um resultado sem essa linha não se compara com o próximo.
6. Grave a tela, se o testador concordar. Se não, faça a sessão com duas pessoas: uma
   observa, a outra escreve.

## 4. A tarefa

Entregue **impressa**. Deixe o testador ler sozinho. Não parafraseie, não resuma, não
acrescente.

> **A fotografia da área externa mudou.**
>
> A página `/representadas` mostra uma área externa inteira numa fotografia, com linhas
> numeradas apontando para os objetos da cena. Cada linha é de uma fábrica, e a legenda ao
> lado diz qual.
>
> A fotografia nova está na área de trabalho: `area-externa-nova.jpg`. É ainda uma imagem
> de referência, não obra entregue. Ponha-a no lugar da antiga e deixe a página no ar,
> certa: cada linha encostando no objeto da fábrica daquela linha.
>
> As fábricas e a ordem delas não mudam. O que mudou foi só a fotografia.
>
> Você tem o painel numa aba e a página na outra. Trabalhe como trabalharia sozinho — se
> travar, tente outro caminho do seu jeito. Quando achar que terminou, diga "terminei".

## 5. O que anotar

### Marcos, com hora no relógio

| | Momento |
|---|---|
| **T0** | Terminou de ler a tarefa e tocou na primeira coisa |
| **T1** | Abriu a tela da prancha no painel |
| **T2** | A fotografia nova está no campo |
| **T3** | Mexeu no primeiro pino |
| **T4** | Disse "terminei" |

### O relato

1. **Onde procurou primeiro.** Anote os três primeiros cliques, literalmente, na ordem.
2. **Como achou a prancha.** Por qual palavra entrou? Quantas telas erradas abriu antes?
3. **Se percebeu que as linhas saíram do lugar.** Anote a frase exata dita no instante em
   que a fotografia nova apareceu. Se não disse nada, anote o silêncio — ele é um achado.
4. **O que tentou primeiro para consertar.** Arrastar? Digitar nos números? Rolar a tela
   procurando outra coisa? Trocar a fotografia de novo?
5. **Se descobriu que os pinos se arrastam, e por quê.** Pelo texto de ajuda? Pelo cursor
   de mão? Por tentativa? Ou nunca descobriu e digitou porcentagens?
6. **Se soube qual pino é qual.** O quadrado numerado é a etiqueta; o ponto redondo é onde
   a linha encosta no objeto. Anote se arrastou o quadrado achando que estava movendo a
   ponta da linha — é o engano mais provável da tela.
7. **Ajuste fino.** Usou as setas do teclado? Reparou na frase que aparece abaixo do
   desenho quando solta o pino? Leu-a?
8. **Salvar ou publicar.** Anote a palavra que ele usou e o botão que apertou. Rascunho
   salvo e sessão encerrada conta como não publicado.
9. **Conferiu?** Voltou à aba do site para olhar o resultado, ou declarou pronto sem
   conferir?
10. **Todas as perguntas**, palavra por palavra.
11. **O que nunca descobriu.** Escreva no fim, comparando o que ele fez com o que o campo
    oferece.

## 6. O veredito

O critério é binário, e o único jeito de ele ser um veredito em vez de uma impressão é
decidir os limites **antes** da sessão. Estes:

**Teto de tempo: 20 minutos** de T0 a T4. Declarado antes, não depois. O testador não
precisa saber.

**PASSA** — e só passa — quando as três valem:

- **(a) A página está certa.** Julgada por uma **terceira pessoa**, que não assistiu à
  sessão: ela abre `/representadas` numa janela limpa e responde SIM ou NÃO a uma pergunta
  só — *cada linha numerada encosta no objeto que a legenda daquela linha nomeia?* Hesitou
  em qualquer uma das linhas, é NÃO. Não se mede pixel: mede-se se a prancha continua
  conferível por quem olha.
- **(b) Ninguém ajudou.** O condutor não disse nada além das três frases da seção 2.
- **(c) Coube no teto.**

**FALHA** em qualquer um destes quatro, e vale registrar em qual:

1. **Pediu ajuda e precisou dela** para seguir.
2. **Desistiu.**
3. **Estourou os 20 minutos.**
4. **Disse "terminei" com a página errada.** É a pior das quatro, e não é empate técnico
   com as outras: é exatamente o modo de falha que fez este ticket existir — a prancha
   errada não quebra nada visivelmente, então ninguém é avisado. Uma sessão que termina
   assim reabre o ticket mesmo que tudo o mais tenha ido bem.

**Quantas sessões.** O critério pede uma pessoa e uma pessoa fecha a frase. Duas custam o
dobro de quase nada e são a diferença entre um veredito e uma anedota — se houver duas,
rode com as duas, e o critério só fecha com **dois PASSA**.

**Fora do veredito, mas anote:** se o testador marcou "Imagem de referência (ainda não é
fotografia real)" ao subir a fotografia. A imagem é gerada, e um mock publicado sem
marcação é defeito — mas de outro ticket. Não mexe neste veredito.

## 7. Pontos fracos conhecidos — observar, nunca apontar

Cada um destes é uma hipótese de onde a tela falha. Estão aqui para você **reconhecer** o
que está vendo e anotar com precisão, não para levantar o assunto. Se o testador não
esbarrar em nenhum, ótimo: a hipótese estava errada.

1. **Pinos empilhados.** Quando dois objetos da cena ficam perto, os pinos das duas
   chamadas se sobrepõem e viram marcas iguais uma sobre a outra. A tela tenta resolver
   isso: o par que está na mão sobe para cima da pilha e a linha dele engrossa. **Observe
   se isso basta** — se o testador arrastou o pino errado, se percebeu, e quanto tempo
   levou para perceber. Não diga que existe realce.

2. **Chamada nova nasce embaixo, não sobre a fotografia.** Acrescentar uma chamada é um
   botão no array logo abaixo do desenho, e só depois o pino aparece sobre a foto. A
   tarefa desta sessão não pede chamada nova — mas se o testador tentar (por exemplo,
   apagando uma chamada e refazendo em vez de arrastar), **observe se ele encontra o
   botão** e se entende de onde o pino novo saiu. Não aponte o array.

3. **Rascunho e publicado.** A recusa de publicar uma prancha sem chamada nenhuma só morde
   ao publicar; rascunho atravessa. Se ele salvar rascunho e considerar terminado,
   **anote e deixe** — isso é o item 4 do veredito, não uma dica a dar.

4. **Proporção da fotografia.** A foto desta sessão tem a mesma proporção da atual, então
   a moldura não muda de forma. Se em outra rodada você usar uma foto de proporção
   diferente, a caixa muda de forma na hora e todos os pinos escorregam de uma vez —
   **observe se ele estranha** a caixa, e não só os pinos.

5. **A confirmação escrita.** Ao soltar um pino, uma frase aparece abaixo do desenho
   dizendo qual chamada é, se é a etiqueta ou o objeto, e em que porcentagem parou. Ela é
   nova. **Observe se ele a lê**, ou se ela passa despercebida e ele confere olhando os
   números do array. Se passar despercebida, a frase não está fazendo o trabalho dela.

## 8. Depois

- **Comente em PRA-123** com o veredito (PASSA / FALHA, e qual dos quatro modos), a data,
  navegador e sistema, os tempos de T0 a T4 e a lista de perguntas do testador. Um veredito
  sem a lista de perguntas não é reaproveitável.
- **Cada achado que causou FALHA vira issue própria** no projeto Belmare, com
  `needs-triage`. Não emende no ticket original.
- **Não conserte nada durante a sessão** — nem entre a primeira e a segunda. Duas sessões
  contra painéis diferentes não são duas sessões.
- Guarde a gravação, se houver. O relato de segunda mão perde exatamente o que interessa:
  a pausa antes do primeiro clique.
