# Issue tracker: Linear

Issues and specs (you may know a spec as a PRD) for this repo live in **Linear**, reached
through the `linear-server` MCP server declared in this repo's `.mcp.json`.

- **Workspace** — `guriai`
- **Team** — `Personal` (key `PRA`). Issue identifiers look like `PRA-123`.
- **Project** — `Belmare` — <https://linear.app/guriai/project/belmare-d66c6a4ce2cb>

## Always scope to the Belmare project

The `Personal` team is **shared** — `Dynamis` and `Practiq` are projects in it too. The team
alone does not identify this repo; the project does.

Every issue these skills create **must** pass `project: "Belmare"`. Every issue these skills
list **must** filter by it. An issue created with only `team: "Personal"` lands in a shared
backlog next to two unrelated products, and nothing downstream will notice.

## Reaching the tools

The Linear tools are named `mcp__linear-server__*` and are deferred — load them with
`ToolSearch` before calling them, batching everything you expect to need into **one** call:

```
ToolSearch "select:mcp__linear-server__list_issues,mcp__linear-server__get_issue,mcp__linear-server__save_issue,mcp__linear-server__list_comments,mcp__linear-server__save_comment,mcp__linear-server__list_issue_labels"
```

Never shell out to `curl` against the Linear API — go through the MCP server.

## Conventions

Linear's MCP surface is **upsert-shaped**: one `save_*` tool per entity, which creates when `id`
is absent and updates when it's present. There is no separate create/update/close verb.

- **Create an issue** — `save_issue` with no `id`, plus `title`, `team: "Personal"`,
  `project: "Belmare"`. Body goes in `description` as Markdown, with literal newlines — do not
  send `\n` escape sequences.
- **Update an issue** — `save_issue` with `id` set to the identifier (`PRA-123`). For a small
  edit to a long description, pass `patch` instead of resending the whole body.
- **Read an issue** — `get_issue`, plus `list_comments` for the conversation. Read both before
  acting; the decisive context is often in a comment, not the description.
- **List issues** — `list_issues` filtered by `project: "Belmare"`.
- **Comment** — `save_comment` with `issueId` and `body`. Reply into a thread with `parentId`.
- **Close** — `save_issue` with `state: "Done"` (or `"Canceled"`). Linear has no close verb; it
  has workflow states. The team's states are **Backlog**, **Todo**, **In Progress**, **Done**,
  **Canceled**, **Duplicate**.

### Labels replace, they don't append

`save_issue`'s `labels` parameter **replaces the entire label set**. Passing
`labels: ["needs-info"]` on an issue that was `["Feature", "wayfinder:research"]` silently drops
both. Always `get_issue` first, then send the existing labels plus the new one. Omit `labels`
entirely to leave them untouched.

Labels must already exist — there is no create-on-apply. `list_issue_labels` for team `Personal`
before assuming a name is available. These already exist and should be reused rather than
duplicated:

- Triage roles — see `triage-labels.md`
- Type — `Bug`, `Improvement`, `Feature`
- Wayfinder — `wayfinder:map`, `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`,
  `wayfinder:task`
- Model — `Opus`, `Sonnet` (children of the `model` group)

Create a genuinely new label with `create_issue_label` scoped to `teamId` (the `Personal` team),
not workspace-wide. Never create a near-duplicate (`Needs-Triage` beside `needs-triage`).

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo treats external PRs as feature
requests; `/triage` reads this flag.)_

This repo has no git remote today, so there is no PR surface to triage. If one appears later,
flip the flag and record here how a PR maps onto a Linear issue.

## When a skill says "publish to the issue tracker"

`save_issue` with `team: "Personal"` and `project: "Belmare"`.

## When a skill says "fetch the relevant ticket"

`get_issue` on the identifier the user gave you, then `list_comments` on the same issue.

## Specs

Belmare is already a Linear *project*, so a spec cannot be one — the project slot is this repo.
A spec is instead:

- **The prose** — a Linear **document** attached to the Belmare project: `save_document` with
  `project: "Belmare"`, `title`, and the spec body in `content`. Find existing ones with
  `list_documents`.
- **The tickets** — issues in the Belmare project, grouped by a **milestone** named for the
  feature (`save_milestone`, then `milestone` on each `save_issue`). `list_milestones` to see
  what's there.

`/to-spec` writes the document; `/to-tickets` creates the milestone and fills it with issues.
Don't scatter a spec across issue descriptions.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a Linear issue with **child** issues as tickets. The
`wayfinder:*` labels already exist on the `Personal` team.

- **Map** — an issue labelled `wayfinder:map`, in the Belmare project, holding the Notes /
  Decisions-so-far / Fog body.
- **Child ticket** — an issue with `parentId` set to the map, labelled `wayfinder:<type>`
  (`research` / `prototype` / `grilling` / `task`).
- **Blocking** — Linear's **native issue relations**, not a text line: `save_issue` with
  `blockedBy: ["PRA-12"]`. It is append-only; use `removeBlockedBy` to drop an edge. A ticket is
  unblocked when every blocker sits in `Done`, `Canceled`, or `Duplicate`.
- **Frontier** — list the map's children that are open, unblocked, and unassigned; first in map
  order wins.
- **Claim** — `save_issue` with `assignee: "me"` and `state: "In Progress"`. This is the
  session's first write, before any work.
- **Resolve** — `save_comment` the answer on the child, `save_issue` it to `Done`, then append a
  context pointer (gist + link) to the map's Decisions-so-far.
