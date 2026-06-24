---
name: sync
description: "Sync project to GitHub — stage, commit, and push all changes in one step."
---

# Sync to GitHub

Stage all changes, commit with a descriptive message, and push to the configured remote.

## Workflow

1. **Check git status** — show what's changed
2. **Stage all changes** — `git add -A`
3. **Generate commit message** — summarize changes by category (feat/fix/docs/chore)
4. **Commit** — `git commit -m "[message]"`
5. **Push** — `git push origin main`

## Arguments

- No argument: auto-generate commit message from changes
- With message: `/sync "my custom message"` — use provided message

## Commit Message Convention

Auto-generated messages follow Conventional Commits:
- New GDD files → `docs:`
- New code files → `feat:`
- Modified configs → `chore:`
- Bug fixes → `fix:`

## Remote

Pushes to the remote configured in `git remote -v`.
Default: `git@github.com:hongshaodalao/Minecraft-Encyclopedia.git`
