# Belmare — site institucional

## Documentação

Quatro arquivos governam, e só eles. Onde qualquer outro documento divergir de um
destes, ou destes divergir do código, **o construído vence**:

- **`CONTEXT.md`** — o glossário. Os termos são vinculantes.
- **`PRODUCT.md`** — verdade de produto: público, território, canal, escopo.
- **`DESIGN.md`** — o sistema de design. Tokens no frontmatter, componentes na prosa.
- **`README.md`** — como rodar, e o índice do resto.

`docs/` guarda o que é procedimento (subir um bucket, criar as contas do painel) ou
registro exigido por um ticket. `briefing/` é arquivo histórico de 30/07/2026 e não
governa nada — está versionado porque comentários em `src/` apontam para ele.

Antes de criar documento novo: estado que envelhece (o que já chegou do cliente, o que
falta fazer) não mora em Markdown — mora no Linear ou no painel. Documento se estende,
não se recomeça.

## Agent skills

### Issue tracker

Issues live in **Linear**, reached through the `linear-server` MCP server declared in
`.mcp.json` — team `Personal` (`PRA-…`), project **Belmare**. The team is shared with two other
products, so every issue must be scoped to the Belmare project.
See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, each label string equal to its role name — `needs-triage`,
`needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.
See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` at the root, one `docs/adr/`. The glossary is pt-BR and its
terms are binding. See `docs/agents/domain.md`.
