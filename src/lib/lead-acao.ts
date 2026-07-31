"use server";

import {
  corpoDoAvisoPorEmail,
  emailValido,
  type DadosDoLead,
  type EstadoDoFormularioDeLead,
} from "@/lib/lead";

/**
 * ⚠️ **O PAYLOAD ENTRA POR `import()` DENTRO DA FUNÇÃO, NUNCA NO TOPO — E ISSO
 * NÃO É ESTILO.** Este módulo é `"use server"` e é importado por
 * `components/formulario-de-lead.tsx`, que é `"use client"`. O corpo de um
 * Server Action de fato não vai para o navegador, mas o bundler ainda
 * ATRAVESSA o grafo estático para descobrir isso — e `@payload-config` puxa
 * junto o adaptador do Postgres, o `sharp`, o cliente S3 e as dez coleções.
 *
 * Com o import no topo, `next build` saiu de ~30 segundos para mais de dez
 * minutos sem terminar, porque `components/paginas/composicao-em-preview.tsx`
 * (o live preview de PRA-124, `"use client"`) alcança este arquivo pela cadeia
 * `pagina-livre` → `caminhos` → formulário. Medido, não suposto: com o import
 * adiado o build volta ao tempo de antes.
 *
 * É a mesma classe de problema que PRA-124 resolveu tirando `FaixaDeAcao` de
 * `acao-de-fecho.tsx`. A diferença é que aqui a fronteira não pode ser movida
 * — o formulário PRECISA chamar o Payload —, então o que se adia é o momento
 * do import, não o lugar dele.
 */
async function painel() {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import("payload"),
    import("@payload-config"),
  ]);
  return getPayload({ config });
}

/**
 * O envio do formulário de proposta — PRA-126.
 *
 * ⚠️ **A ORDEM É GRAVAR PRIMEIRO, AVISAR DEPOIS, E A ORDEM É A FEATURE.** A
 * Belmare quer o lead guardado **além** de mandado por e-mail, porque um
 * contato que só existe numa caixa de entrada já está perdido — bastou o
 * e-mail quicar. Se o aviso fosse tentado antes, uma falha do Resend teria de
 * escolher entre abortar (perdendo o contato de vez) ou seguir mesmo assim
 * (que é o que se faz aqui, só que mais tarde e com mais chance de errar).
 * Gravando primeiro, a pior falha possível vira "a Belmare tem o lead no
 * painel mas não recebeu o aviso" — recuperável, e visível na lista.
 *
 * ⚠️ **`overrideAccess: false` NÃO É DETALHE.** É o que faz esta escrita
 * atravessar exatamente a mesma fronteira que um visitante anônimo de verdade
 * atravessaria — o `access.create` de `collections/leads.ts`, a única criação
 * sem sessão de todo o projeto. Com `true` (o padrão da API local) o Server
 * Action passaria por cima da checagem e o teste de acesso estaria provando
 * uma coisa que a produção não faz.
 *
 * ⚠️ **O VISITANTE NUNCA VÊ "FALHOU" DEPOIS DE UM LEAD GRAVADO.** Contar que
 * deu errado sobre um contato que está salvo faz a pessoa mandar de novo — ou
 * desistir — por uma falha que não é dela e que a Belmare nem percebeu. O
 * aviso de e-mail que não saiu vira `console.error`, que é onde uma falha de
 * infraestrutura pertence.
 */
export async function enviarLead(
  _anterior: EstadoDoFormularioDeLead,
  formulario: FormData,
): Promise<EstadoDoFormularioDeLead> {
  const dados = lerFormulario(formulario);
  const recusas = camposRecusados(dados);

  if (Object.keys(recusas).length > 0) {
    return {
      status: "erro",
      mensagem: "Confira os campos marcados abaixo.",
      campos: recusas,
    };
  }

  const lead: DadosDoLead = {
    nome: dados.nome,
    email: emailValido(dados.email) ?? dados.email,
    cidade: dados.cidade,
    escritorio: dados.escritorio,
    consentimentoMarketing: dados.consentimentoMarketing,
    origem: dados.origem,
  };

  try {
    const payload = await painel();
    await payload.create({
      collection: "leads",
      data: lead,
      overrideAccess: false,
    });
  } catch (erro) {
    /* O contato NÃO foi gravado — aqui, e só aqui, o erro é do visitante ver.
       Sem lead guardado não há nada a recuperar depois, então a única resposta
       honesta é pedir de novo e oferecer o outro canal. */
    console.error("[lead] não foi possível gravar o contato", erro);
    return {
      status: "erro",
      mensagem:
        "Não conseguimos registrar seu contato agora. Tente de novo em alguns instantes — ou fale com a Belmare pelo WhatsApp.",
    };
  }

  await avisarPorEmail(lead);

  return { status: "sucesso" };
}

/**
 * O aviso por e-mail. Nunca lança, nunca muda o que o visitante vê.
 *
 * ⚠️ **DOIS MOTIVOS DIFERENTES PARA NÃO SAIR, E OS DOIS SÃO ESPERADOS HOJE.**
 * O e-mail comercial entra vazio de propósito (PRA-122 — semear o mock seria
 * movê-lo, não tirá-lo do ar), e `RESEND_API_KEY` não existe em
 * desenvolvimento. Nos dois casos o lead já está no painel, que é a cópia que
 * sempre sobrevive. O log distingue os dois para quem for configurar não ficar
 * adivinhando qual dos dois falta.
 */
async function avisarPorEmail(lead: DadosDoLead): Promise<void> {
  /* Adiados pelo mesmo motivo que o Payload acima: `empresa-consulta` lê o
     painel, e `resend` só é preciso depois que o lead já está gravado. */
  const [{ buscarEmpresa }, { enviarEmail }] = await Promise.all([
    import("@/lib/empresa-consulta"),
    import("@/lib/resend"),
  ]);

  const empresa = await buscarEmpresa();
  const destinatario = empresa.email;

  if (destinatario === undefined || destinatario === "") {
    console.error(
      "[lead] contato gravado, mas sem aviso por e-mail: o e-mail comercial ainda não foi cadastrado no painel (Empresa → Canais).",
    );
    return;
  }

  const entregue = await enviarEmail({
    para: destinatario,
    assunto: `Novo contato pelo site — ${lead.nome}`,
    texto: corpoDoAvisoPorEmail(lead),
    responderPara: lead.email,
  });

  if (!entregue) {
    console.error(
      `[lead] contato de ${lead.email} gravado no painel, mas o aviso por e-mail não saiu. Confira RESEND_API_KEY e RESEND_FROM_EMAIL.`,
    );
  }
}

/** Os campos como chegaram do `FormData`, já em texto aparado. */
function lerFormulario(formulario: FormData) {
  const campo = (nome: string) => {
    const valor = formulario.get(nome);
    return typeof valor === "string" ? valor.trim() : "";
  };

  const marca = campo("marca");

  return {
    nome: campo("nome"),
    email: campo("email"),
    cidade: campo("cidade"),
    escritorio: campo("escritorio"),

    /* ⚠️ Uma caixa não marcada simplesmente NÃO VEM no `FormData` — ela não
       chega como "false". Ler a ausência como recusa é o comportamento certo e
       é o que mantém a promessa de que contatar a empresa nunca inscreve
       ninguém em lista nenhuma. */
    consentimentoMarketing: formulario.get("consentimentoMarketing") !== null,

    origem: {
      pagina: campo("pagina") || "desconhecida",
      ...(marca === "" ? {} : { marca }),
    },
  };
}

/**
 * As recusas, uma por campo.
 *
 * ⚠️ **AS MESMAS MENSAGENS DA COLEÇÃO, E DE PROPÓSITO.** A validação daqui é
 * para quem está preenchendo o formulário; a de `collections/leads.ts` é a que
 * recusa a escrita de verdade. As duas existem pelo mesmo motivo que a decisão
 * 5 dá para o resto do projeto — uma explica, a outra impede — e dizer coisas
 * diferentes nas duas faria a mesma recusa parecer dois problemas.
 */
function camposRecusados(dados: ReturnType<typeof lerFormulario>): Record<string, string> {
  const recusas: Record<string, string> = {};

  if (dados.nome === "") recusas.nome = "Escreva seu nome.";
  if (dados.cidade === "") recusas.cidade = "Escreva a cidade.";
  if (dados.escritorio === "")
    recusas.escritorio = "Escreva a empresa ou o escritório.";

  if (dados.email === "") {
    recusas.email = "Escreva um e-mail para a Belmare poder responder.";
  } else if (emailValido(dados.email) === undefined) {
    recusas.email =
      "Confira o e-mail: falta o @, falta o ponto do domínio, ou sobrou um espaço.";
  }

  return recusas;
}
