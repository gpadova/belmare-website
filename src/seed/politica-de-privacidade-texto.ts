import {
  documento,
  listaDePontos,
  paragrafo,
  titulo,
} from "@/seed/texto-formatado";

/**
 * `/politica-de-privacidade` — a composição inteira da página.
 *
 * ⚠️ **ESTA VERSÃO SUBSTITUI O LEVANTAMENTO DE PRA-124.** O que estava no ar
 * até 06/08/2026 abria com um aviso em negrito dizendo que o documento "não é,
 * e não deve ser lido como, uma política de privacidade em vigor", e fechava
 * admitindo que a seção de direitos aguardava redação. Era a saída honesta
 * enquanto ninguém tivesse ido ler a lei: melhor uma lacuna declarada do que
 * texto legal plausível que ninguém confere depois. O que mudou não foi a
 * exigência — foi que a lei foi lida na fonte.
 *
 * ⚠️ **DUAS REGRAS GOVERNAM CADA FRASE ABAIXO, E ELAS SÃO O MOTIVO DE O TEXTO
 * PODER SUBIR SEM ADVOGADO NA FRENTE:**
 *
 *   1. **Toda afirmação de FATO foi conferida contra este repositório**, não
 *      contra a memória de como o site funciona. A lista está no fim deste
 *      comentário, arquivo por arquivo.
 *   2. **Toda afirmação de DIREITO cita o artigo de onde vem** — LGPD (Lei nº
 *      13.709/2018), Marco Civil da Internet (Lei nº 12.965/2014) e Resolução
 *      CD/ANPD nº 2/2022, todos lidos no texto oficial em 06/08/2026. Citação
 *      não é enfeite aqui: é o que faz cada linha ser conferível na fonte, que
 *      é a mesma autoridade de que `/quem-somos` vive.
 *
 * ⚠️ **O QUE ESTA PÁGINA NÃO PROMETE, E POR QUÊ.** Não existe apagamento
 * automático de lead nesta pilha: nenhum cron na Vercel, nenhuma `jobs` queue
 * no Payload, nenhum script agendado — o levantamento está em
 * `docs/prazo-de-guarda-de-leads.md`, Parte 2. Por isso a seção de prazo diz
 * que a Belmare revisa e elimina, e diz explicitamente que apagamento
 * automático não existe. Declarar um prazo fixo que o sistema não cumpre seria
 * a página passando a prometer o que nada garante — exposição nova, não
 * conformidade. **Os 24 meses recomendados em PRA-129 continuam sendo decisão
 * do cliente, e entram nesta seção no mesmo commit em que o mecanismo existir.**
 *
 * ⚠️ **NENHUM CANAL É DIGITADO NO CORPO DO TEXTO.** Endereço, telefones, CNPJ e
 * e-mail saem do bloco `ficha`, que os lê do cadastro em "O site › A Belmare"
 * (`collections/blocos.ts` proíbe redigitá-los na prosa, com todas as letras).
 * O texto diz "a ficha ao final desta página" e a ficha aparece: é ela que
 * cumpre o art. 9º, III e IV, da LGPD — identificação e contato do controlador
 * — sem criar uma segunda cópia do telefone para envelhecer sozinha.
 *
 * ⚠️ **SEM BLOCO `fecho`, E ISSO JÁ ERA REGRA.** "Um documento legal fecha em
 * silêncio" (`collections/blocos.ts`): a política não termina em convite para
 * conversar.
 *
 * A conferência dos fatos, em 06/08/2026:
 *
 *   · quatro campos e nada mais no formulário, com `origem.pagina` e
 *     `origem.marca` preenchidos pela própria página — `collections/leads.ts`;
 *   · `consentimentoMarketing` é caixa separada, `defaultValue: false`, e nunca
 *     pré-marcada — `collections/leads.ts`, `components/formulario-de-lead.tsx`;
 *   · ler, editar e apagar lead exigem sessão de painel; criar é a única escrita
 *     anônima do projeto — `collections/leads.ts`, `access`;
 *   · nenhum rastreador de terceiro no repositório: a busca por `gtag`,
 *     `googletagmanager`, `google-analytics`, pixel de rede social, Hotjar,
 *     Plausible, PostHog, Mixpanel e Segment não devolve uma linha;
 *   · as fontes são servidas pelo próprio domínio (`next/font` as baixa no
 *     build), então nem elas geram requisição para terceiro;
 *   · dois cookies, ambos de operador: a sessão do painel e o
 *     `draftMode()` do Next — `app/(frontend)/preview/route.ts`;
 *   · os operadores são quatro, e o quarto é novo nesta redação: Vercel
 *     (hospedagem, `.env.example`), Neon em `sa-east-1` (banco, `DATABASE_URI`),
 *     Cloudflare R2 (arquivos, `R2_*`) e **Resend** (o aviso de lead por
 *     e-mail, `lib/resend.ts` — a única chamada a terceiro em tempo de
 *     execução). **O texto anterior não mencionava o Resend**, e ele recebe o
 *     que a pessoa escreveu no formulário;
 *   · porte da empresa: o cadastro classificava a Bello Mare Mercantil Ltda
 *     como empresa de pequeno porte (o campo `porte` saiu de `globals/empresa.ts`
 *     em 05/08/2026 por não ter onde aparecer, não por ter deixado de valer).
 *     É desse enquadramento que sai a dispensa de encarregado do art. 11 da
 *     Resolução CD/ANPD nº 2/2022.
 */
export const PRIVACIDADE = {
  slug: "politica-de-privacidade",
  titulo: "Política de privacidade",
  resumo:
    "O que o site da Belmare faz com dados pessoais: o que o formulário coleta, com que base legal, com quem os dados são compartilhados, por quanto tempo ficam guardados e como pedir acesso, correção ou eliminação.",
  composicao: [
    {
      blockType: "prosa",
      corpo: documento([
        paragrafo(
          "Esta política descreve o que o site da Belmare faz com dados pessoais: o que ele coleta, por quê, com quem compartilha, por quanto tempo guarda e o que você pode exigir a respeito. Cada afirmação de fato aqui corresponde ao que o site executa hoje, e cada obrigação citada aponta o artigo de onde vem, na Lei nº 13.709/2018, a Lei Geral de Proteção de Dados Pessoais (LGPD).",
        ),
        paragrafo(
          "Quem responde por esses dados é a Belmare Representações, cujo registro e canais estão na ficha ao final desta página. Ela é a controladora, na definição do art. 5º, VI, da LGPD: é dela a decisão sobre o que este site coleta e sobre o que é feito com o que chega.",
        ),

        titulo("O que este site coleta"),
        paragrafo(
          "Este site tem um único formulário, o de proposta comercial em /contato. Ele pede quatro coisas (nome, e-mail, cidade e a empresa ou escritório que a pessoa representa), e nada além disso. Não há cadastro, não há login de visitante, não se pede CPF e não se pede telefone. Junto do que você escreve, o envio registra de qual página do site ele partiu e de qual marca, quando parte da página de uma representada.",
        ),
        paragrafo(
          "O aceite de novidades por e-mail é uma caixa separada, que nunca vem marcada: deixá-la em branco não muda em nada o atendimento do contato.",
        ),
        paragrafo(
          "Fora esse formulário, o único dado pessoal que chega à Belmare é o que a própria pessoa escreve numa conversa iniciada por ela, por WhatsApp, e-mail ou telefone. Esse dado chega pelo aplicativo ou provedor correspondente, e não por este site.",
        ),
        paragrafo(
          "A Belmare não compra lista de contatos, não completa o que você escreveu com dado comprado de terceiro e não trata dado pessoal sensível, na definição do art. 5º, II, da LGPD: não existe, neste site, campo que peça um.",
        ),

        titulo("Por que cada dado é tratado, e com que base legal"),
        paragrafo(
          "A LGPD só admite tratar dado pessoal nas hipóteses do art. 7º. Três delas se aplicam aqui:",
        ),
        listaDePontos([
          "O formulário de proposta comercial. Para responder a proposta e avaliar se a revenda faz sentido para as duas partes. Base legal: o art. 7º, V, que trata dos procedimentos preliminares relacionados a contrato, tomados a pedido do próprio titular. O titular, aqui, é quem preencheu e enviou.",
          "As novidades por e-mail. Para avisar de coleção, catálogo e material novo a quem pediu para receber. Base legal: o art. 7º, I, o consentimento, dado na caixa separada do formulário e revogável a qualquer momento, sem que a revogação afete o atendimento do contato original.",
          "Os registros de acesso dos servidores. Para operar e proteger o site e os arquivos. Base legal: o art. 7º, II, porque o art. 15 do Marco Civil da Internet (Lei nº 12.965/2014) manda guardar registro de acesso a aplicações pelo prazo de seis meses; e o art. 7º, IX, na parte que é segurança.",
        ]),
        paragrafo(
          "O que você escreve numa conversa que você começou, por WhatsApp, e-mail ou telefone, é tratado para responder o que você perguntou (art. 7º, V e IX).",
        ),

        titulo("Rastreamento e cookies"),
        paragrafo(
          "O site não instala ferramenta de análise de audiência, gerenciador de tags nem pixel de rede social. As fontes tipográficas são servidas pelo próprio domínio, de modo que abrir uma página aqui não gera requisição a terceiro por causa delas.",
        ),
        paragrafo(
          "Existem dois cookies no sistema, e nenhum dos dois alcança o visitante comum:",
        ),
        listaDePontos([
          "a sessão de quem entra no painel de edição, que é da equipe da Belmare;",
          "o cookie de pré-visualização de rascunho, criado apenas quando alguém do painel abre uma página ainda não publicada.",
        ]),
        paragrafo(
          "Por não haver rastreador a consentir, o site não exibe banner de cookies. Se algum dia um rastreador for instalado, esta seção muda antes de ele entrar no ar.",
        ),

        titulo("Com quem estes dados são compartilhados"),
        paragrafo(
          "A Belmare é o único interlocutor: nenhum contato recebido é repassado automaticamente às fábricas representadas, e nenhum endereço de e-mail comercial de fábrica é publicado neste site. Quando um pedido precisa chegar à fábrica, é a Belmare quem o encaminha, e com o que aquele pedido exige.",
        ),
        paragrafo(
          "Fora isso, o site funciona sobre quatro serviços contratados que, para operá-lo, tocam os dados. Eles são operadores na definição do art. 5º, VII, da LGPD: tratam em nome da Belmare e conforme instrução dela, não por conta própria.",
        ),
        listaDePontos([
          "Vercel: a hospedagem. Recebe as requisições do site e registra o acesso.",
          "Neon: o banco de dados onde o contato enviado pelo formulário fica gravado. A instância usada por este site fica em São Paulo.",
          "Cloudflare R2: o armazenamento dos catálogos, dos arquivos 3D e das fotografias. Registra o acesso a cada arquivo baixado.",
          "Resend: o serviço que entrega à Belmare o aviso de que um contato chegou. Recebe o conteúdo desse aviso, que é o que você escreveu no formulário.",
        ]),
        paragrafo(
          "Vercel, Cloudflare e Resend operam a partir de fora do Brasil, e mandar dado a eles é uma transferência internacional na forma do art. 33 da LGPD. Ela se apoia no inciso IX desse artigo, combinado com o art. 7º, V: a transferência é necessária para executar exatamente aquilo que a pessoa pediu ao enviar o formulário. Fora esses quatro operadores, a Belmare não compartilha com ninguém o que recebe aqui, e não vende dado nenhum.",
        ),

        titulo("Por quanto tempo os dados ficam guardados"),
        paragrafo(
          "A LGPD manda eliminar o dado quando a finalidade que o justificou se esgota (arts. 15 e 16). Na prática, aqui:",
        ),
        listaDePontos([
          "O contato enviado pelo formulário fica guardado enquanto a proposta comercial estiver de pé, ou enquanto durar a relação que nasceu dela. A Belmare revisa periodicamente essa lista e elimina o que não virou nada. Não existe, hoje, apagamento automático por prazo fixo, e esta página não vai dizer que existe.",
          "O aceite de novidades por e-mail vale até você pedir para sair da lista. Basta responder a qualquer mensagem pedindo, ou usar os canais desta página.",
          "Os registros de acesso dos servidores seguem o prazo de cada serviço que os guarda, com o mínimo de seis meses do art. 15 do Marco Civil da Internet.",
        ]),
        paragrafo(
          "Você pode pedir a eliminação antes disso, a qualquer momento. É o direito do art. 18, VI, e a seção seguinte diz como.",
        ),

        titulo("Como estes dados são protegidos"),
        paragrafo(
          "O contato enviado pelo formulário só é legível por quem tem login no painel da Belmare. Nenhum visitante enxerga o contato de outra pessoa: não existe página, endereço nem exportação pública dessa lista. O site inteiro é servido por conexão cifrada.",
        ),

        titulo("Seus direitos, e como exercê-los"),
        paragrafo(
          "O art. 18 da LGPD dá a você, sobre os seus dados que a Belmare trata, o direito de pedir a qualquer momento:",
        ),
        listaDePontos([
          "a confirmação de que existe tratamento, e o acesso aos dados;",
          "a correção do que estiver incompleto, inexato ou desatualizado;",
          "a anonimização, o bloqueio ou a eliminação do que for desnecessário, excessivo ou tratado fora da lei;",
          "a portabilidade a outro fornecedor, na forma que a Autoridade Nacional de Proteção de Dados regulamentar;",
          "a eliminação dos dados tratados com o seu consentimento, ressalvado o que os arts. 15 e 16 permitem conservar;",
          "a informação sobre as entidades com as quais a Belmare compartilhou os seus dados;",
          "a informação sobre a possibilidade de não consentir, e sobre o que acontece se você não consentir;",
          "a revogação do consentimento.",
        ]),
        paragrafo(
          "Peça pelos canais da ficha ao final desta página, ou pela página de Contato. O pedido não custa nada (art. 18, § 5º) e é respondido pela própria Belmare; se ela não puder atender de imediato, você recebe uma resposta dizendo por quê (art. 18, § 4º).",
        ),
        paragrafo(
          "A Belmare Representações é uma empresa de pequeno porte, e o art. 11 do Regulamento aprovado pela Resolução CD/ANPD nº 2, de 27 de janeiro de 2022, dispensa empresas desse porte de indicar um encarregado pelo tratamento de dados pessoais, desde que mantenham um canal de comunicação com o titular. Esse canal são os contatos desta página. Você também pode peticionar diretamente à Autoridade Nacional de Proteção de Dados, em gov.br/anpd. É o art. 18, § 1º.",
        ),

        titulo("Mudanças nesta política"),
        paragrafo(
          "Esta é a versão de 6 de agosto de 2026. Ela foi escrita a partir do que este site executa, conferido contra o código que o gera, e das leis citadas ao longo do texto. Quando o site passar a fazer outra coisa com dados, esta página muda antes, e a data acima muda com ela.",
        ),
        paragrafo(
          "O texto ainda não passou por revisão de advogado. Os fatos descritos foram conferidos um a um; as citações de lei são leitura de quem construiu o site.",
        ),
      ]),
    },
    {
      /* ⚠️ O bloco que cumpre o art. 9º, III e IV — identificação e contato do
         controlador. Ele NÃO tem conteúdo próprio: razão social, CNPJ,
         endereço, telefones e e-mail saem do cadastro em "O site › A Belmare",
         e é por isso que o corpo do texto acima não digita nenhum deles. */
      blockType: "ficha",
      titulo: "Quem responde por estes dados",
    },
  ],
};
