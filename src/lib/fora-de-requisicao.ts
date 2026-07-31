/**
 * O invariante que o Next lança quando um recurso de cache é usado fora de uma
 * requisição — e SÓ ele.
 *
 * ⚠️ Esta função existe porque `catch {}` sozinho seria o bug que o ticket de
 * ISR existe para evitar. A API local do Payload é chamada de dois mundos: das
 * rotas do site, dentro do processo do Next, onde o cache com etiqueta existe;
 * e do teste de integração e de scripts de linha de comando, fora de qualquer
 * requisição, onde o Next nem instancia o cache incremental. No segundo mundo
 * não há rota renderizada para invalidar, e engolir o erro é a resposta certa.
 *
 * Engolir TODA exceção, porém, transforma "a edição não propagou" numa falha
 * invisível: o operador salva, atualiza, vê a página velha e pega o telefone —
 * exatamente o que a revalidação sob demanda foi construída para acabar. Então
 * o silêncio vale só para os dois invariantes conhecidos; qualquer outra coisa
 * tem que aparecer.
 *
 * Se o Next mudar a redação destas mensagens, o teste de integração passa a
 * falhar alto em vez de o site passar a falhar calado. É o lado certo para
 * errar.
 */
const INVARIANTES_FORA_DE_REQUISICAO = [
  "incrementalCache missing",
  "static generation store missing",
];

export function foraDeRequisicao(erro: unknown): boolean {
  return (
    erro instanceof Error &&
    INVARIANTES_FORA_DE_REQUISICAO.some((marca) => erro.message.includes(marca))
  );
}
