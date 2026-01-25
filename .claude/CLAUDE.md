# Claude Code project memory — RevaBrain (Ralph loop)

Deze repo gebruikt **Claude Code + Ralph loop** voor autonome ontwikkeling.

## Belangrijk: Ralph loop context

Je draait in een **Ralph loop** - een autonome iteratie cyclus. Zie `claude.md` voor je exacte taak per run.

## Documentatie hiërarchie

1. **Ralph loop regels:** `@agent.md` (werkwijze, DoD, DRY, security)
2. **RevaBrain product:** Zie `/Users/abdul/Documents/MARALYdev/Revabrain/CLAUDE.md`
3. **MARALYdev algemeen:** Zie `/Users/abdul/Documents/MARALYdev/CLAUDE.md`

## Bron van waarheid (Ralph)

- **Product requirements:** `prd.md`
- **Backlog status:** `prd.json` (user stories + `passes` flag)
- **Werkgeheugen:** `progress.txt` (append-only learnings)
- **Prompt per iteratie:** `claude.md`

## Privacy & Security (KRITIEK)

RevaBrain verwerkt medische data:
- **RR (rijksregisternummer)** = hooggevoelige PII
- Log NOOIT plaintext RR in logs, console, of commits
- Mask RR in UI waar mogelijk
- Minimale data opslag (GDPR dataminimalisatie)
- Server-side access control verplicht

## Ralph loop quick reference

```
1. Lees prd.json → selecteer hoogste prioriteit met passes=false
2. Implementeer minimaal (DRY + simpel)
3. Run checks (build/lint/typecheck/tests)
4. Update progress.txt
5. Zet passes=true in prd.json
6. Commit (1 story = 1 commit)
7. Repeat
```

## Praktisch

- Ralph starten: `./ralph.sh [max_iterations]`
- Branch: zie `prd.json.branchName`
- Bij vragen: zie `agent.md` voor engineering principes
