import { getPayload } from "payload";

import config from "@payload-config";

/** Só relata. Nada é escrito por este script. */
const payload = await getPayload({ config });

function achar(valor: unknown, caminho: string, achados: string[]): void {
  if (typeof valor === "string") {
    if (valor.includes("—")) achados.push(`${caminho}: ${valor}`);
    return;
  }
  if (Array.isArray(valor)) {
    valor.forEach((v, i) => achar(v, `${caminho}[${i}]`, achados));
    return;
  }
  if (valor && typeof valor === "object") {
    for (const [k, v] of Object.entries(valor)) {
      if (k === "updatedAt" || k === "createdAt") continue;
      achar(v, `${caminho}.${k}`, achados);
    }
  }
}

const achados: string[] = [];

for (const slug of ["home", "quem-somos", "empresa", "prancha", "pacote-3d"] as const) {
  try {
    achar(await payload.findGlobal({ slug, depth: 0 }), `global:${slug}`, achados);
  } catch {
    console.log(`(global "${slug}" não existe)`);
  }
}

for (const slug of ["paginas", "representadas", "pecas"] as const) {
  try {
    const { docs } = await payload.find({ collection: slug, depth: 0, limit: 100 });
    docs.forEach((d, i) => achar(d, `${slug}[${i}]`, achados));
  } catch {
    console.log(`(coleção "${slug}" não existe)`);
  }
}

console.log(`\n=== ${achados.length} campo(s) com travessão no banco ===`);
for (const a of achados) console.log(`\n· ${a}`);

process.exit(0);
