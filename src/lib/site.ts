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
 */
export const NAVEGACAO = [
  { rotulo: "Quem somos", href: "/quem-somos" },
  { rotulo: "Representadas", href: "/representadas" },
  { rotulo: "Catálogos", href: "/catalogos" },
  { rotulo: "Arquivos 3D", href: "/arquivos-3d" },
] as const;
