"use client";

import Link from "next/link";
import { useActionState, useId } from "react";

import { enviarLead } from "@/lib/lead-acao";
import {
  ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD,
  type OrigemDoLead,
} from "@/lib/lead";

/**
 * O formulário de proposta comercial — PRA-126.
 *
 * ⚠️ **A LISTA DE CAMPOS É FIXA, EM CÓDIGO, E É O PONTO INTEIRO DO TICKET.**
 * Todo o resto deste painel existe para a Belmare decidir o que é campo; aqui
 * é o oposto, e de propósito — decisão 11 da spec, sobre `PRODUCT.md`: "nome,
 * e-mail, cidade e escritório bastam — CPF não". Um construtor de formulário é
 * exatamente a ferramenta que deixaria um operador bem-intencionado
 * acrescentar CPF porque uma fábrica pediu. Isso é violação de minimização de
 * dado criada por acidente, num site cuja política de privacidade ainda espera
 * advogado. Acrescentar um campo aqui é PR, não clique.
 *
 * ⚠️ **FUNCIONA SEM JAVASCRIPT.** É um `<form action={…}>` sobre um Server
 * Action: sem JS o navegador faz o POST normalmente e a página volta com o
 * resultado. O `useActionState` só melhora o que já funciona — estado de envio
 * e mensagem por campo. Um formulário que exige JS para mandar uma mensagem é
 * um formulário que perde o contato de quem está num aparelho ruim, que é
 * exatamente o arquiteto em obra com sinal fraco que este site diz respeitar.
 *
 * ⚠️ **A CAIXA DE CONSENTIMENTO NUNCA VEM MARCADA, E NUNCA É EXIGIDA.** São
 * duas promessas distintas e as duas importam: contatar a empresa não inscreve
 * ninguém em lista nenhuma, e recusar a lista não impede o contato. Marcar por
 * padrão seria consentimento fabricado; exigir a marcação seria trocar o
 * atendimento por um endereço de mala direta.
 *
 * ⚠️ **SEM CAPTCHA E SEM HONEYPOT.** Os dois custam acessibilidade real — um
 * campo escondido que um leitor de tela anuncia mesmo assim, ou um quebra-
 * cabeça que barra quem tem baixa visão — contra spam que ninguém mediu ainda.
 * Se o spam aparecer, ele aparece na lista do painel, onde dá para contar
 * antes de decidir. Cobrar o pedágio antes disso é pagar por um problema
 * hipotético com a pessoa que veio comprar.
 */
export function FormularioDeLead({
  origem,
  rotuloDoEnvio = "Enviar proposta",
}: {
  origem: OrigemDoLead;
  /** Muda entre uma página de revenda e uma de arquiteto — é a única coisa que
   *  varia entre as duas audiências, ver `lib/lead.ts`. */
  rotuloDoEnvio?: string;
}) {
  const [estado, acao, enviando] = useActionState(
    enviarLead,
    ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD,
  );
  const base = useId();

  if (estado.status === "sucesso") {
    return (
      <p className="text-h3 max-w-[52ch] text-pretty font-normal" role="status">
        Recebemos seu contato. A Belmare responde no e-mail que você deixou.
      </p>
    );
  }

  const recusas = estado.status === "erro" ? (estado.campos ?? {}) : {};

  return (
    <form action={acao} className="max-w-[36rem]" noValidate>
      {/* Os dois campos ocultos de origem. O visitante nunca os vê nem os
          digita — a própria página diz de onde o contato veio. */}
      <input type="hidden" name="pagina" value={origem.pagina} />
      {origem.marca !== undefined && (
        <input type="hidden" name="marca" value={origem.marca} />
      )}

      {/* Uma falha de infraestrutura não aponta para campo nenhum, então ela
          aparece aqui em cima. As recusas de campo aparecem sob cada campo. */}
      {estado.status === "erro" && estado.campos === undefined && (
        <p role="alert" className="text-support mb-6 text-pretty text-ink">
          {estado.mensagem}
        </p>
      )}

      <div className="flex flex-col gap-6">
        <Campo
          id={`${base}-nome`}
          nome="nome"
          rotulo="Nome"
          autoComplete="name"
          recusa={recusas.nome}
        />
        <Campo
          id={`${base}-email`}
          nome="email"
          rotulo="E-mail"
          tipo="email"
          autoComplete="email"
          recusa={recusas.email}
        />
        <Campo
          id={`${base}-cidade`}
          nome="cidade"
          rotulo="Cidade"
          autoComplete="address-level2"
          recusa={recusas.cidade}
        />
        <Campo
          id={`${base}-escritorio`}
          nome="escritorio"
          rotulo="Empresa ou escritório"
          autoComplete="organization"
          recusa={recusas.escritorio}
        />
      </div>

      <div className="mt-8 flex items-start gap-3">
        <input
          type="checkbox"
          id={`${base}-consentimento`}
          name="consentimentoMarketing"
          /* Sem `defaultChecked`, e sem `required`. Ver a nota no topo: as duas
             ausências são a promessa, não um esquecimento. */
          className="mt-1 h-4 w-4 shrink-0 accent-ink"
        />
        <label
          htmlFor={`${base}-consentimento`}
          className="text-support text-pretty text-graphite"
        >
          Quero receber novidades da Belmare por e-mail. Deixar em branco não
          muda nada no seu contato — a Belmare responde do mesmo jeito.
        </label>
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="text-support mt-8 border border-ink px-8 py-4 uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
      >
        {enviando ? "Enviando…" : rotuloDoEnvio}
      </button>

      <p className="text-support mt-6 max-w-[52ch] text-pretty text-graphite">
        Pedimos só o necessário para responder.{" "}
        <Link
          href="/politica-de-privacidade"
          className="underline decoration-line underline-offset-4 hover:decoration-ink"
        >
          Política de privacidade
        </Link>
        .
      </p>
    </form>
  );
}

/**
 * Um campo do formulário.
 *
 * ⚠️ A recusa é presa ao campo por `aria-describedby` e anunciada por
 * `aria-invalid`. Uma mensagem vermelha solta embaixo do input é invisível
 * para quem navega por leitor de tela — a pessoa ouve o rótulo, digita, e não
 * fica sabendo que o campo foi recusado.
 */
function Campo({
  id,
  nome,
  rotulo,
  tipo = "text",
  autoComplete,
  recusa,
}: {
  id: string;
  nome: string;
  rotulo: string;
  tipo?: string;
  autoComplete?: string;
  recusa?: string;
}) {
  const idDaRecusa = `${id}-recusa`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-support text-graphite">
        {rotulo}
      </label>
      <input
        type={tipo}
        id={id}
        name={nome}
        autoComplete={autoComplete}
        aria-invalid={recusa !== undefined}
        aria-describedby={recusa === undefined ? undefined : idDaRecusa}
        className={`text-body border-b bg-transparent pb-2 outline-none transition-colors focus:border-ink ${
          recusa === undefined ? "border-line" : "border-ink"
        }`}
      />
      {recusa !== undefined && (
        <p id={idDaRecusa} className="text-support text-ink">
          {recusa}
        </p>
      )}
    </div>
  );
}
