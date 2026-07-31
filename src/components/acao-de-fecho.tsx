import { FaixaDeAcao } from "@/components/faixa-de-acao";
import { linkDeWhatsapp } from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";

/**
 * A ação de fecho — a faixa de `components/faixa-de-acao.tsx` com o número do
 * painel já resolvido.
 *
 * ⚠️ `contexto` não é enfeite: `linkDeWhatsapp` pré-preenche a mensagem, e quem
 * clica na página da Trisol chega dizendo de onde veio. Custo zero, e é a única
 * qualificação de lead que o site tem enquanto não há formulário.
 *
 * ⚠️ Todo lead passa pela Belmare. Nenhum e-mail de fábrica em lugar nenhum.
 *
 * ⚠️ **SEM NÚMERO NO PAINEL, A AÇÃO INTEIRA NÃO É DESENHADA** — a decisão mora
 * na faixa, que recebe `undefined` e não devolve nada.
 *
 * ⚠️ **O DESENHO SAIU DAQUI EM PRA-124, E A LEITURA FICOU.** Este componente é
 * `async` porque busca o cadastro, e uma página livre não pode usá-lo: a
 * composição dela é redesenhada pelo cliente durante o live preview, onde não
 * existe `await`. A rota livre lê o cadastro uma vez e desenha a faixa direto.
 * As rotas que já usavam esta função — `/catalogos` e a página de cada marca —
 * continuam idênticas.
 */
export async function AcaoDeFecho({
  rotulo,
  contexto,
  className,
}: {
  rotulo?: string;
  contexto: string;
  className?: string;
}) {
  const { whatsapp } = await buscarEmpresa();

  return (
    <FaixaDeAcao
      rotulo={rotulo}
      link={linkDeWhatsapp(whatsapp, contexto)}
      className={className}
    />
  );
}
