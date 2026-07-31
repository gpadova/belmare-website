# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the
actual label strings used in this repo's issue tracker (Linear — see `issue-tracker.md`).

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding
label string from this table.

Edit the right-hand column to match whatever vocabulary you actually use.

## Linear specifics

These are Linear labels on the **`Personal`** team, which is shared with the `Dynamis` and
`Practiq` projects — so the five roles are visible workspace-side beyond this repo. That's
intended; they're a triage vocabulary, not a per-repo one.

Two rules that matter more in Linear than elsewhere:

- **Labels must exist before they can be applied.** There is no create-on-apply. Run
  `list_issue_labels` for team `Personal` first. Create a missing one with `create_issue_label`
  scoped to `teamId`, using the exact string above — never a near-duplicate.
- **`save_issue`'s `labels` parameter replaces the whole set.** Applying a triage label means
  reading the issue's current labels and sending them back along with the new one. See
  `issue-tracker.md`.

These five are a triage vocabulary, not a workflow state. They live alongside Linear's own
states (Backlog / Todo / In Progress / Done / Canceled / Duplicate) and don't replace them, and
alongside the type labels (`Bug` / `Improvement` / `Feature`).
