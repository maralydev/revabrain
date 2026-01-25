# claude.md — Ralph loop prompt (RevaBrain)

Je draait in een **Ralph loop** (autonome iteratie) binnen deze repo.

## Jouw taak (per run)

1. Lees `prd.json` en selecteer precies **één** user story met `passes=false` met de **laagste** `priority` waarde.
2. Raadpleeg `prd.md` voor functionele context en business rules.
3. Lees `progress.txt` om bestaande conventies en eerdere keuzes te respecteren.
4. Implementeer de gekozen story **volledig** volgens de acceptatiecriteria.
5. Voer relevante checks uit (minimaal: build/lint/typecheck/tests indien aanwezig). Fix failures.
6. Update:
   - `prd.json`: zet `passes=true` voor die story en vul `notes` enkel als er iets belangrijks is (bv. trade-off).
   - `progress.txt`: voeg een nieuwe entry toe met:
     - datum/tijd
     - story ID + titel
     - wat er gebouwd/gewijzigd is (kort)
     - commando’s die je draaide (tests/build/etc.)
     - eventuele follow-ups/risico’s
7. Commit alle wijzigingen met een duidelijke message (conventional style, met story ID).

## Strikte regels

- Werk aan **slechts één** story per run.
- Geen scope creep: geen extra features buiten de story.
- Houd de code DRY en zo eenvoudig mogelijk; vermijd nieuwe dependencies tenzij strikt noodzakelijk.
- Respecteer privacy/security: log geen PII (zoals RR) in logs of fixtures.
- Als je merkt dat een algemene regel ontbreekt: update `agent.md` (of `.claude/rules/*`) één keer, DRY.

## Klaar?

- Als alle stories `passes=true` zijn, antwoord exact met: `<promise>COMPLETE</promise>`
- Anders: voer de run uit zoals hierboven.
