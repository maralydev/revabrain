# agent.md — RevaBrain (Claude Code + Ralph loop)

Dit document definieert hoe we in deze repository werken met **Claude Code** en de **Ralph loop** om de features uit `prd.md` (RevaBrain) iteratief te bouwen, zonder kwaliteit, veiligheid of onderhoudbaarheid op te offeren.

## 1. Doel en scope

**Doel:** een herhaalbaar, veilig en kwaliteitsgedreven ontwikkelproces waarin een agent (Claude Code) per iteratie één user story oplevert, met duidelijke acceptatiecriteria en een strikt “Definition of Done”.

**Scope van dit procesdocument:**
- Werkwijze (Ralph loop)
- Engineering-principes (DRY, vereenvoudiging)
- Dependency-hygiëne + auto-update beleid
- Kwaliteits- en beveiligingsgates (GDPR/PII-gevoelige context)

De productscope staat in `prd.md`.

## 2. Bron van waarheid

- **Product requirements:** `prd.md`
- **Backlog voor de loop:** `prd.json` (user stories + status `passes`)
- **Werkgeheugen / learnings:** `progress.txt`
- **Claude Code project memory:** `.claude/CLAUDE.md` (importeert o.a. `agent.md`)

Principe: **één bron van waarheid per type informatie**. Vermijd duplicatie; als er overlap is (bv. user stories in `prd.md` én `prd.json`), dan blijft `prd.md` leidend voor requirements en `prd.json` leidend voor “wat is al gebouwd”.

## 3. De Ralph loop

De Ralph loop is een deterministische iteratie-cyclus: **één story per run**, met commit en voortgangsupdate.

### 3.1 Loop (overzicht)

1. **Read**  
   Lees `prd.json` (selecteer hoogste prioriteit met `passes=false`) en raadpleeg relevante delen van `prd.md`.

2. **Plan**  
   Bepaal minimale implementatie die alle acceptatiecriteria dekt. Vermijd scope creep.

3. **Implement**  
   Wijzig code zo klein mogelijk, met focus op eenvoud en hergebruik (DRY).

4. **Verify**  
   Run de afgesproken checks (lint/test/typecheck/build). Fix failures.

5. **Document**  
   Werk `progress.txt` bij: wat is gedaan, belangrijke beslissingen, valkuilen, commando’s.

6. **Mark**  
   Zet in `prd.json` de story `passes=true` en voeg eventueel korte `notes` toe.

7. **Commit**  
   Eén commit per story. Message: `feat: US-XXX <korte titel>` of `fix: ...` waar relevant.

8. **Repeat**  
   Volgende run pakt de volgende story.

### 3.2 Definition of Done (DoD)

Een story mag enkel op `passes=true` gezet worden als:
- Alle acceptatiecriteria aantoonbaar gerealiseerd zijn
- De codebase buildt en de tests (waar aanwezig) slagen
- Typecheck/lint (waar aanwezig) slagen
- Geen “TODO: later” over kernfunctionaliteit (toegestaan: technische schuld expliciet gelogd in `progress.txt` met reden en vervolgactie)

## 4. DRY + auto-update

### 4.1 DRY (Don’t Repeat Yourself)

- Centraliseer business rules (bv. afspraakstatussen, RR-validatie, conflictregels) in één module/service.
- Geen kopieer/plak varianten van dezelfde query/validator/formatter.
- UI: hergebruik componenten (bijv. DateTimePicker, StatusBadge, AlertNoteIcon) en vermijd “per scherm” forked varianten.

### 4.2 Auto-update van instructies en werkwijze

Om te vermijden dat instructies divergeren:
- **Claude Code memory** staat in `.claude/CLAUDE.md` en importeert dit bestand (`@agent.md`). Als `agent.md` verandert, wordt dat automatisch meegenomen in nieuwe sessies.
- Houd projectregels modulair waar nuttig via `.claude/rules/*.md` (bv. `security.md`, `frontend.md`), maar voorkom dubbele regels.
- Als je een nieuwe codebase-conventie ontdekt, update **één** plek (bij voorkeur `agent.md` of een dedicated rule file), en verwijs daarnaar.

## 5. Dependency-hygiëne (en “auto-update” voor dependencies)

### 5.1 Basisprincipes

- Voeg **geen** dependency toe zonder duidelijke noodzaak en afweging.
- Prefer: standaard library / bestaande dependencies boven nieuwe packages.
- Houd dependencies up-to-date en verwijder ongebruikte packages.
- Lockfiles zijn verplicht (npm/yarn/pnpm, pip-tools/uv/poetry, etc. afhankelijk van stack).

### 5.2 Automatische dependency updates (GitHub)

Deze repo bevat een Dependabot configuratie (`.github/dependabot.yml`) die periodiek dependency updates voor ondersteunde ecosystemen aanmaakt. Richtlijnen:
- Kleine, frequente updates (wekelijkse cadence) > zelden grote upgrades.
- Security updates krijgen voorrang.
- Elke dependency update PR moet CI groen krijgen vóór merge.
- Groepeer updates waar zinvol (bv. devDependencies samen), maar houd “breaking changes” liever apart.

### 5.3 Hygiene checks per iteratie (agent verantwoordelijkheid)

Bij elke story (zeker als dependencies wijzigen):
- Run `npm audit` / `pip-audit` of equivalente security check (indien van toepassing)
- Verwijder ongebruikte dependencies (bv. `depcheck`, `npm prune`)
- Houd versies consistent (geen dubbele major versies zonder noodzaak)
- Update documentatie/lockfile mee

## 6. Code vereenvoudiging (simplicity-first)

- Kies de simpelste oplossing die het probleem correct oplost.
- Vermijd premature abstraction. Eerst correct, dan klein refactoren naar herbruikbaarheid.
- Prefer compositie boven complexe inheritance/over-engineering.
- Houd functies klein en testbaar; vermijd “god objects”.
- Onnodige configuratie/boilerplate verwijderen zodra stabiliteit is aangetoond.

## 7. Security, privacy en GDPR (RevaBrain context)

RevaBrain verwerkt privacy-gevoelige data. Minimale baseline:
- Bewaar enkel noodzakelijke patiëntgegevens (dataminimalisatie).
- Encryptie in transit (HTTPS) en waar relevant at rest.
- Audit logging voor alle mutaties van gevoelige data (zie PRD).
- Vermijd tracking (geen analytics cookies zonder expliciete keuze).
- Access control: least privilege (admin vs zorgverlener) en server-side enforcement.

**RR (rijksregisternummer):** behandel als **hooggevoelige identifier**. Mask in UI waar mogelijk, log nooit plaintext RR in logs, foutenmeldingen of analytics.

## 8. Teststrategie en kwaliteitsgates

Minimale verwachting:
- Unit tests voor pure business rules (RR-validatie, conflict detection, status transitions).
- Integratietests voor kritieke flows (CRUD afspraak, herhaalreeks).
- UI smoke tests waar haalbaar (agenda dag/week views, admin CRUD).
- Lint + format + typecheck als CI gate.

Als er nog geen test harness bestaat in de codebase: eerste stories moeten de basis neerzetten.

## 9. Commit- en branchbeleid

- Werk op de branch uit `prd.json.branchName` (Ralph gebruikt deze).
- Eén story = één commit (liefst). Als het echt moet: max 2 commits, maar documenteer waarom.
- Commit messages: conventioneel, met story-ID.

## 10. “Ralph loop” quick reference

```text
Loop:
  pick next story (passes=false) →
  implement minimal changes →
  run checks →
  update progress.txt →
  set passes=true in prd.json →
  commit →
  repeat
```
