# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the
codebase. This repo is **single-context**: one `CONTEXT.md` at the root, one `docs/adr/`.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root — the project glossary.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest
creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and
`/improve-codebase-architecture`) creates them lazily when terms or decisions actually get
resolved. `docs/adr/` has no entries yet — that's expected, not a gap to fill.

## File structure

```
/
├── CONTEXT.md
├── docs/adr/          ← empty until the first decision is recorded
└── src/
```

If this repo ever splits into multiple packages with their own bounded contexts, the layout
becomes a root `CONTEXT-MAP.md` pointing at one `CONTEXT.md` per context. It hasn't; don't
anticipate it.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis,
a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary
explicitly avoids — each entry carries an `_Avoid_` line naming exactly the words that lose the
distinction.

The glossary is written in pt-BR and its terms are the terms: write **representada**, not
"brand partner"; **espinha fixa**, not "fixed template"; **seção anulável**, not "conditional
section". Translating a glossary term into English is the same failure as reaching for a
synonym — it breaks the shared language between the code, the briefing, and the CMS panel.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing
language the project doesn't use (reconsider) or there's a real gap (note it for
`/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently
overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_
