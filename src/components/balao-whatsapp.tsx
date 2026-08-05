import { IconeWhatsApp } from "@/components/icones";
import { linkDeWhatsapp } from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";

/**
 * O balão fixo de WhatsApp — ação persistente sobre o conteúdo, em toda rota.
 *
 * ⚠️ **É QUADRADO, NÃO REDONDO.** O balão de WordPress de toda representada é
 * um círculo verde preenchido — exatamente o "piso do segmento" que o
 * `PRODUCT.md` registra como o que a Belmare decidiu destoar, não competir.
 * `--radius-*` está `initial` no `@theme` de propósito: não existe
 * `rounded-full` neste projeto, e este componente não reabre o namespace.
 *
 * ⚠️ **FUNDO SÓLIDO SEMPRE, NÃO SÓ NO `HOVER`.** Em todo outro lugar do
 * sistema, `{colors.surface}` só aparece como elevação transitória (linha de
 * ledger e ação de fecho, ambas no `hover`) — ver a Regra da Elevação por Tom
 * em `DESIGN.md`. Este é o primeiro elemento permanentemente elevado: ele
 * fica sobre fotografia tanto quanto sobre papel, e um fundo que só aparece no
 * `hover` deixaria o ícone ilegível sempre que estivesse sobre uma imagem
 * clara. A exceção é do CONTEXTO (chrome fixo sobre conteúdo arbitrário), não
 * uma reversão da regra.
 *
 * ⚠️ **SEM NÚMERO CADASTRADO, O BALÃO NÃO EXISTE.** Mesma regra de
 * `AcaoDeFecho`, do cabeçalho e do rodapé: um `wa.me` para um número que não
 * existe abre o aplicativo e diz que o contato não existe. Um elemento fixo
 * sobre toda página inteira quebrado seria o pior caso de todos — visível em
 * toda rota, sempre.
 */
export async function BalaoWhatsapp() {
  const { whatsapp } = await buscarEmpresa();
  const link = linkDeWhatsapp(whatsapp, "clicou no ícone de WhatsApp do site");

  if (link === undefined) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      className="fixed right-5 bottom-5 z-30 flex h-12 w-12 items-center justify-center border border-ink bg-surface text-ink transition-colors hover:bg-paper motion-reduce:transition-none md:right-8 md:bottom-8"
    >
      <IconeWhatsApp className="h-6 w-6" />
    </a>
  );
}
