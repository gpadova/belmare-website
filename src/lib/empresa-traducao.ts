import {
  emailComercial,
  numeroDeWhatsapp,
  type Empresa,
  type Endereco,
} from "@/lib/empresa";
import { lista, opcional, presente, texto } from "@/lib/campo-opcional";
import type { Empresa as EmpresaGerada } from "@/payload-types";

/**
 * A camada de tradução do global `Empresa` — o documento do painel virando
 * tipo de domínio.
 *
 * ⚠️ **A FRONTEIRA EXISTE AQUI PELO MESMO MOTIVO DO CATÁLOGO EM
 * `lib/representadas-traducao.ts`: o tipo gerado admite estados que a página
 * não pode receber.** O Payload declara `whatsapp?: string | null` — quatro
 * estados possíveis (ausente, nulo, string em branco, string qualquer) — e
 * apenas UM deles pode virar link. Um `wa.me` montado sobre "48 99137" abre o
 * aplicativo e diz que o número não existe, e quem descobre é o cliente que
 * desiste. Depois desta função, o número que atravessa é E.164 conferido ou
 * não é nada; o estado "número escrito errado" é irrepresentável do lado de cá.
 *
 * ⚠️ **A VALIDAÇÃO DA COLEÇÃO NÃO TORNA ISTO REDUNDANTE — SÃO DOIS TRABALHOS
 * DIFERENTES**, a mesma divisão da decisão 5 da spec. `globals/empresa.ts`
 * recusa a gravação e explica em pt-BR na tela de quem está salvando; este
 * mapper garante que um valor gravado ANTES da validação existir (ou por
 * qualquer caminho que não passe pelo painel) não chegue à página. O painel
 * recusa; o tipo torna impossível.
 *
 * ⚠️ **AUSENTE É AUSENTE, NUNCA VAZIO** (`lib/campo-opcional.ts`). O global
 * pode estar vazio — banco recém-criado, ou o operador ainda não preencheu os
 * canais — e o resultado certo é menos página, nunca página quebrada.
 */
export function empresaDoPainel(doc: EmpresaGerada): Empresa {
  return {
    ...opcional("nomeCompleto", texto(doc.nomeCompleto)),
    ...opcional("razaoSocial", texto(doc.razaoSocial)),
    ...opcional("cnpj", texto(doc.cnpj)),
    ...opcional("abertura", texto(doc.abertura)),
    ...opcional("porte", texto(doc.porte)),
    ...opcional("endereco", enderecoDoPainel(doc.endereco)),
    ...opcional("telefones", telefonesDoPainel(doc.telefones)),
    /* Os dois canais que este ticket desmockou: normalizados e conferidos aqui,
       nunca passados adiante como o operador os digitou. */
    ...opcional("whatsapp", numeroDeWhatsapp(doc.whatsapp)),
    ...opcional("email", emailComercial(doc.email)),
    ...opcional("instagram", texto(doc.instagram)),
  };
}

/**
 * ⚠️ Um endereço sem nenhuma linha preenchida é endereço ausente, não um
 * objeto de cinco `undefined`: é a diferença entre o rodapé não desenhar o
 * bloco e o rodapé desenhar três quebras de linha em cima de nada.
 */
function enderecoDoPainel(
  grupo: EmpresaGerada["endereco"],
): Endereco | undefined {
  const endereco: Endereco = {
    ...opcional("logradouro", texto(grupo?.logradouro)),
    ...opcional("bairro", texto(grupo?.bairro)),
    ...opcional("cidade", texto(grupo?.cidade)),
    ...opcional("uf", texto(grupo?.uf)),
    ...opcional("cep", texto(grupo?.cep)),
  };

  return Object.keys(endereco).length === 0 ? undefined : endereco;
}

function telefonesDoPainel(
  linhas: EmpresaGerada["telefones"],
): string[] | undefined {
  return lista(
    (linhas ?? []).map((linha) => texto(linha.numero)).filter(presente),
  );
}
