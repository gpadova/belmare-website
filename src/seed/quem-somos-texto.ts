/**
 * O texto de partida de `/quem-somos` — a página inteira, título por título.
 *
 * ⚠️ **ISTO É O CONTEÚDO DE PARTIDA, NÃO O CONTEÚDO DA PÁGINA.** Desde
 * 05/08/2026 nenhum texto desta rota mora em código: título, parágrafo e etapa
 * são campos do painel. O que este objeto faz é dar ao global recém-criado algo
 * publicável no primeiro minuto. Editar aqui não muda o site de ninguém — muda
 * o ponto de partida da próxima instalação.
 *
 * ⚠️ **MÓDULO SEM EFEITO COLATERAL, E É POR ISSO QUE ELE EXISTE SEPARADO.**
 * Ele nasceu dentro de `semear-globais.ts`, que roda `await semear()` no topo:
 * qualquer outro script que importasse a constante de lá semeava o banco só de
 * abrir o arquivo. Uma constante compartilhada mora onde importá-la não faz
 * nada acontecer.
 *
 * ⚠️ **NENHUMA CONTAGEM DIGITADA, E É POR ISSO QUE TEM CHAVE NO MEIO DA
 * FRASE.** `{anos}`, `{fabricas}`, `{cidade}`, `{estados}` e `{quantosEstados}`
 * são trocados pelo dado a cada renderização (`lib/marcadores.ts`). Escrever
 * "quatro" com todas as letras dentro de um destes campos é como a página
 * amanhece dizendo quatro no dia em que a quinta fábrica entra pelo painel,
 * três centímetros acima de uma lista com cinco linhas.
 *
 * ⚠️ **O REGISTRO É O DE UM SITE BRASILEIRO, NÃO O DE UM PORTFÓLIO DE DESIGN.**
 * Uma tentativa anterior de reescrita caiu num estilo pior que o original:
 * fragmentos sem sujeito e substantivo no singular sem artigo, antíteses de
 * duas frases nominais, travessão a cada parágrafo. Ninguém escreve assim em
 * português. O polo oposto, que a lista vinculante desta página já proíbe, é o
 * "somos mais do que uma representação comercial: somos parceiros estratégicos
 * da indústria" que a categoria escreve.
 *
 * Ao editar estes campos, o teste é ler em voz alta: se soar como legenda de
 * catálogo ou como slogan, está errado nos dois casos.
 */
export const QUEM_SOMOS = {
  titulo: "A Belmare atende lojas e escritórios de arquitetura no Sul do país.",
  apresentacao:
    "São {anos} anos de atuação no mercado de móveis, com ênfase em área externa. A Belmare representa {fabricas} fábricas brasileiras e vende sempre através de loja: quem compra trata das marcas todas na mesma conversa, com a mesma pessoa.",

  atuacaoTitulo: "O que a Belmare faz.",
  atuacao:
    "A Belmare trabalha junto da loja e do escritório de arquitetura, do primeiro desenho até a peça instalada. A venda é sempre fechada pela loja, e o contato com as fábricas passa pela Belmare.",
  atuacaoLinhas: [
    {
      rotulo: "Representação",
      texto:
        "Apresenta as linhas das {fabricas} fábricas às lojas e aos escritórios de arquitetura do Sul, e responde por todas elas na mesma conversa.",
    },
    {
      rotulo: "Especificação",
      texto:
        "Responde medida, material, acabamento e prazo, e reúne num lugar só os catálogos e os arquivos 3D das {fabricas} fábricas.",
    },
    {
      rotulo: "Pedido",
      texto:
        "Acompanha o pedido junto com a loja que fecha a venda, da proposta até a entrega.",
    },
    {
      rotulo: "Pós-venda",
      texto:
        "Resolve a assistência depois da entrega, para qualquer uma das marcas representadas.",
    },
  ],

  acervoTitulo: "As fábricas representadas.",
  acervo:
    "São {fabricas} fábricas brasileiras. Cada uma cobre uma parte da área externa, e as linhas não se sobrepõem. O catálogo completo de cada fábrica está na página dela.",

  territorioTitulo: "Onde a Belmare atende.",
  territorio:
    "As {fabricas} fábricas representadas atendem o mesmo território: {estados}. Não há divisão de região por marca, e o atendimento cobre os {quantosEstados} estados por inteiro. A sede fica em {cidade}.",

  projetosTitulo: "Projetos entregues no Sul.",
  projetos:
    "Obras em que peças das representadas foram especificadas e instaladas. Cada uma com ano, cidade, as marcas envolvidas e o crédito de quem assinou o projeto.",

  contatoTitulo: "Fale com a Belmare.",
  contato:
    "Quem atende é quem representa as fábricas. A mesma pessoa responde à primeira dúvida de especificação, acompanha o pedido na loja e resolve a assistência três anos depois, para qualquer uma das marcas.",
  contatoLegenda: "Imagem de referência, não é obra entregue pela Belmare",
};
