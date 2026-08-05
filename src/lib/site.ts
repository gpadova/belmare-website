/**
 * A navegação do site — **fixo**, e o único conteúdo que sobrou deste arquivo.
 *
 * ⚠️ **AQUI MORAVAM O WHATSAPP E O E-MAIL MOCKADOS, E ELES SAÍRAM DO CÓDIGO EM
 * PRA-122.** O arquivo inteiro era a identidade da Belmare escrita à mão —
 * razão social, CNPJ, endereço, telefones, território — com um aviso de
 * "trocar os dois valores marcados antes do lançamento", o que significava um
 * commit e um deploy para corrigir um número de telefone. Tudo isso é campo do
 * global `Empresa` agora; quem lê é `lib/empresa-consulta.ts` e quem define a
 * forma é `lib/empresa.ts`.
 *
 * ⚠️ **A NAVEGAÇÃO FICA, E FICA DE PROPÓSITO.** Ela não é conteúdo dentro do
 * desenho: é a estrutura do site — quais rotas existem e em que ordem elas se
 * apresentam. Uma rota nova exige uma página nova, que é código; um item de
 * menu editável só serviria para apontar para um 404 que o operador não tem
 * como criar. O que ele pode editar é o que há DENTRO de cada página.
 *
 * ⚠️ `/arquitetos` fica fora da lista de propósito — é destino da porta da home,
 * não item de navegação, e mantê-lo fora preserva o peso das duas portas.
 *
 * ✅ **OS QUATRO RESOLVEM A PARTIR DE PRA-127.** `/arquivos-3d` foi o último
 * item do menu apontando para 404 — o menu prometia a rota desde o primeiro dia
 * porque a estrutura do site foi decidida de uma vez, e a rota chegou no último
 * ticket do projeto. É a versão boa do risco que a nota acima descreve: o item
 * de menu não é editável, então o buraco era um, era conhecido e tinha dono.
 */
export const NAVEGACAO = [
  { rotulo: "Quem somos", href: "/quem-somos" },
  { rotulo: "Representadas", href: "/representadas" },
  { rotulo: "Catálogos", href: "/catalogos" },
  { rotulo: "Arquivos 3D", href: "/arquivos-3d" },
] as const;

/**
 * As três rotas de **página livre** que existem em código — PRA-124.
 *
 * ⚠️ **ESTA LISTA É O QUE IMPEDE O PAINEL DE PUBLICAR UMA PÁGINA SEM ROTA.** A
 * nota acima diz por que a navegação não é editável: "um item de menu editável
 * só serviria para apontar para um 404 que o operador não tem como criar". A
 * coleção `Página` tem exatamente o mesmo risco pelo outro lado — um campo de
 * endereço livre deixaria o operador compor uma página inteira, publicá-la, e
 * ela não existir em URL nenhuma. Por isso o endereço de uma página livre não é
 * texto digitado: é uma ESCOLHA dentro desta lista, e a lista só cresce quando
 * um arquivo de rota nasce em `app/(frontend)/`. Ver `collections/paginas.ts`.
 *
 * ⚠️ **AS TRÊS SÃO PÁGINA LIVRE PORQUE NUNCA FORAM ESCRITAS EM CÓDIGO.** Não há
 * argumento de desenho a proteger nelas — nascem CMS-nativas. A home,
 * `/quem-somos` e `/representadas/[marca]` continuam de **espinha fixa** e não
 * ganham construtor de blocos: `/quem-somos` carrega uma lista vinculante do
 * que nunca pode aparecer nela, e um array de blocos é exatamente a ferramenta
 * que contorna essa lista. Ver `CONTEXT.md`, seção "Composição de página".
 *
 * O `rotulo` é o sobretítulo em mono que abre cada uma dessas páginas — o mesmo
 * lugar onde `/catalogos` escreve "Catálogos". É **gerado** daqui, e não um
 * campo: ele nomeia a rota, e a rota é decisão de código.
 */
export const ROTAS_LIVRES = [
  { slug: "arquitetos", rotulo: "Arquitetos e designers" },
  { slug: "contato", rotulo: "Contato" },
  { slug: "politica-de-privacidade", rotulo: "Política de privacidade" },
] as const;

/**
 * Para onde um caminho de página livre pode apontar DENTRO do site.
 *
 * ✅ **`/arquivos-3d` ENTROU EM PRA-127, E COM ELE A LISTA FICOU COMPLETA — não
 * há mais link interno morto no site.** Ele ficou de fora deste registro desde
 * PRA-124 por uma razão que a entrada de hoje confirma em vez de contradizer:
 * ele era o único item da `NAVEGACAO` sem rota, e uma opção de painel para uma
 * rota que não existe é a Belmare montando, com as próprias mãos, um caminho
 * para lugar nenhum, sem ter como saber disso. A lista nunca foi a lista de
 * "páginas do site" — é a lista de **endereços que resolvem**, e é por isso que
 * ela cresceu no mesmo commit em que o arquivo de rota nasceu, nem antes nem
 * depois. Mesma regra que mantém a navegação fora do CMS, aplicada do lado do
 * painel.
 *
 * ⚠️ Não é a `NAVEGACAO`, e não deve virar ela: o menu tem quatro itens por
 * decisão de desenho (topo curto), enquanto um caminho pode apontar para
 * `/arquitetos` e `/contato`, que ficam FORA do menu justamente para preservar
 * o peso das duas portas da home.
 */
export const DESTINOS_DE_CAMINHO = [
  { href: "/representadas", rotulo: "Representadas" },
  { href: "/catalogos", rotulo: "Catálogos" },
  { href: "/arquivos-3d", rotulo: "Arquivos 3D" },
  { href: "/quem-somos", rotulo: "Quem somos" },
  { href: "/arquitetos", rotulo: "Arquitetos e designers" },
  { href: "/contato", rotulo: "Contato" },
  { href: "/politica-de-privacidade", rotulo: "Política de privacidade" },
] as const;
