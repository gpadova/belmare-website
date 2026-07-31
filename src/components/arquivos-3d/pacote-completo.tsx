import { FormularioDeLead } from "@/components/formulario-de-lead";
import { Seta } from "@/components/icones";
import type { Baixavel } from "@/lib/arquivos3d";
import { pesoEmMB } from "@/lib/representadas";

/** A âncora da seção — uma escrita só, como `lib/paginas.ts#ANCORA_DO_FORMULARIO`:
 *  duas cópias da mesma string é como um link passa a apontar para lugar nenhum
 *  sem nada quebrar. */
export const ANCORA_DO_PACOTE = "pacote-completo";

/**
 * O pacote completo — **o único download do site atrás de cadastro**, PRA-127.
 *
 * ⚠️ **A INVERSÃO É O TICKET INTEIRO.** O briefing recomendava cadastro para
 * baixar QUALQUER 3D (P11). A recomendação não sobrevive ao alerta competitivo
 * escrito no mesmo documento: a **Casoca** é gratuita, dominante e **já
 * distribui a GDA**. Gatear um arquivo que a Casoca serve sem pedir nada não
 * captura o lead — **doa** o lead, e ainda ensina o arquiteto que o site da
 * Belmare cobra pedágio. O gate só tem onde se apoiar sobre o que a Casoca
 * **estruturalmente não pode oferecer**: as quatro fábricas juntas, com
 * acabamentos e tecidos, num arquivo só. É o que este componente é, e é a única
 * coisa nesta página que pede alguma coisa em troca.
 *
 * ⚠️ **O PESO VEM ANTES DO FORMULÁRIO, NÃO DEPOIS DELE.** O cadastro não compra
 * o direito de esconder o tamanho. `ZIP · 62,4 MB` aparece acima dos campos,
 * pela mesma razão que aparece acima de cada linha da biblioteca: quem está em
 * obra com sinal ruim precisa poder decidir NÃO baixar — e descobrir o peso
 * depois de entregar nome, e-mail, cidade e escritório é a versão pior da mesma
 * quebra de promessa, porque aí já se pagou.
 *
 * ⚠️ **O DOWNLOAD É IMEDIATO, SEM APROVAÇÃO MANUAL.** `briefing/audiencias.md`
 * pede isso com todas as letras, e é o que faz o gate valer a pena em vez de
 * custar duas vezes: um cadastro que ainda atrasa o arquivo perde para a Casoca
 * na velocidade E no preço. O link aparece no lugar do formulário assim que o
 * lead é gravado — é o `sucesso` de `components/formulario-de-lead.tsx`, e o
 * caminho funciona sem JavaScript, porque o Server Action devolve o estado e a
 * página se redesenha com ele.
 *
 * **O portão é leve, e isso é escolha, não descuido.** O endereço do arquivo é
 * público depois do envio, e quem quiser contorná-lo contorna. Fechá-lo de
 * verdade exigiria URL assinada e sessão — atrito num público que já tem
 * alternativa gratuita a um clique, para proteger um arquivo cujas PARTES esta
 * mesma página distribui aberto três centímetros acima. O portão existe para
 * ser cruzado por quem acha o troco justo, não para deter quem não acha.
 *
 * ⚠️ **`origem.marca` FICA AUSENTE, E É O DADO CERTO.** O campo responde "qual
 * representada", e o pacote não é de nenhuma — é das quatro. Escrever "todas"
 * ali inventaria uma fábrica que não existe no cadastro e envenenaria a única
 * coluna do painel que se pode agrupar por marca. Quem distingue este contato
 * de um envio de `/contato` é `origem.pagina`, que já chega valendo
 * `arquivos-3d` — o seam que `collections/leads.ts` deixou pronto, usado como
 * está, sem campo novo.
 */
export function PacoteCompleto({ pacote }: { pacote: Baixavel }) {
  const medida = `${pacote.formato} · ${pesoEmMB(pacote.mb)} MB`;

  return (
    /* A âncora vai na seção e o `aria-labelledby` aponta para o h2: dois `id`
       iguais na mesma página é HTML inválido, e o segundo deixa de ser
       alcançável por âncora e por leitor de tela ao mesmo tempo. */
    <section
      aria-labelledby={`${ANCORA_DO_PACOTE}-titulo`}
      id={ANCORA_DO_PACOTE}
      className="scroll-mt-24 border-t border-line px-5 pt-12 pb-16 md:grid md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:px-8 md:pt-16 md:pb-24"
    >
      <div className="md:pr-8">
        <p className="mono uppercase text-graphite">O pacote</p>

        <h2
          id={`${ANCORA_DO_PACOTE}-titulo`}
          className="text-h2 mt-5 max-w-[18ch] font-normal text-balance"
        >
          As quatro fábricas num arquivo só.
        </h2>

        <p className="mono mt-6 uppercase text-graphite">{medida}</p>
      </div>

      <div className="mt-10 md:mt-0 md:border-l md:border-line md:pl-8">
        <p className="text-body max-w-[52ch] text-pretty text-graphite">
          Os blocos das quatro fábricas, com as cartas de tecido e pintura,
          montados num pacote só. É o único arquivo desta página que pede seus
          dados — os de cima baixam direto, sem formulário.
        </p>

        <p className="text-support mt-4 max-w-[52ch] text-pretty text-graphite">
          O pacote é montado à mão e não se atualiza sozinho: quando um arquivo
          novo entra, ele aparece na lista acima antes de entrar aqui.
        </p>

        <div className="mt-10">
          <FormularioDeLead
            origem={{ pagina: "arquivos-3d" }}
            rotuloDoEnvio="Receber o pacote"
            sucesso={<LinkDoPacote pacote={pacote} medida={medida} />}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * O que substitui o formulário depois do envio.
 *
 * ⚠️ **É UM LINK, NÃO UMA PROMESSA DE E-MAIL.** O aviso por e-mail que
 * `lib/lead-acao.ts` dispara vai para a BELMARE, não para quem preencheu —
 * escrever "mandamos o link para o seu e-mail" aqui seria prometer uma mensagem
 * que nunca sai. A mesma linha de medida do formulário reaparece no link, para
 * o número não mudar de lugar entre antes e depois do envio.
 */
function LinkDoPacote({
  pacote,
  medida,
}: {
  pacote: Baixavel;
  medida: string;
}) {
  return (
    <>
      <p className="text-h3 max-w-[52ch] text-pretty font-normal">
        Pronto. O pacote está aqui.
      </p>

      {/* Mesma razão de `linha-de-arquivo.tsx`: `download` é ignorado em URL de
          outra origem, e o endereço é de bucket. Sem `target` o clique levaria
          para fora da página em vez de baixar. */}
      <a
        href={pacote.url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="group mt-6 inline-flex items-baseline gap-4"
      >
        <span className="text-h3 font-normal underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink">
          Baixar o pacote
        </span>
        <span className="mono uppercase text-graphite">{medida}</span>
        <Seta className="h-3 w-8 self-center text-ink transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
      </a>

      <p className="text-support mt-6 max-w-[52ch] text-pretty text-graphite">
        A Belmare recebeu seu contato e responde no e-mail que você deixou se
        precisar de medida, prazo ou de um arquivo que não está no pacote.
      </p>
    </>
  );
}
