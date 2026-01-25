# Product Requirements Document (PRD)
# RevaBrain - Neurologische Revalidatiepraktijk

**Versie:** 4.2  
**Datum:** 25 januari 2026  
**Status:** Draft

---

## 1. Executive Summary

RevaBrain is een multidisciplinaire groepspraktijk gespecialiseerd in neurologische revalidatie voor volwassenen met niet-aangeboren hersenletsel (NAH) en kinderen met taal/leer- en ontwikkelingsproblemen.

### Projectdoelen

1. **Intern agenda systeem** - Efficiënt afspraken beheren (prioriteit #1)
2. **Professionele website** - Moderne uitstraling die vertrouwen wekt
3. **Schaalbaarheid** - Ondersteuning voor groeiend team en meerdere disciplines
4. **Meertaligheid** - Nederlands, Frans en Engels

### Huidige Situatie

- **Team:** 1 persoon (oprichter)
- **Website:** revabrain.be (basis, geen booking)
- **Agenda:** Geen digitaal systeem

---

## 2. Doelgroepen

### Primair

| Doelgroep | Kernbehoefte |
|-----------|--------------|
| Volwassenen met NAH | Informatie over behandelingen, makkelijk contact |
| Ouders van kinderen | Informatie over kinderlogopedie, vertrouwen |
| Verwijzers (artsen) | Professionele info, snelle doorverwijzing |

### Secundair

- Potentiële teamleden (werving)
- Zorgverzekeraars
- Samenwerkingspartners

---

## 3. Functionele Requirements

### 3.1 Intern Agenda Systeem (Prioriteit #1)

#### FR-001: Afspraken Beheer

**Beschrijving:** Zorgverleners kunnen afspraken inplannen, wijzigen, annuleren en verwijderen.

**Business regels:**
- Patiënten maken afspraken via telefoon, zorgverlener boekt in systeem
- Patiënten hebben GEEN directe toegang tot agenda (toekomstige uitbreiding)
- Afspraken hebben minimaal: patiënt, datum/tijd, duur, type behandeling
- Conflictdetectie voorkomt dubbele boekingen
- Geannuleerde afspraken blijven zichtbaar (met status)
- Verwijderde afspraken worden permanent verwijderd (soft delete met audit trail)

#### FR-001b: Afspraak Types (Behandeltypes)

**Beschrijving:** Configureerbare lijst van afspraak types per discipline.

**Standaard types:**
- Consultatie (reguliere behandelsessie)
- Intake (eerste kennismaking/evaluatie)
- Huisbezoek (behandeling bij patiënt thuis)
- Chronisch huisbezoek (langdurige thuisbehandeling)
- Admin (administratieve tijd, geen patiënt)

**Business regels:**
- Types zijn configureerbaar via admin panel
- Elke discipline kan eigen specifieke types toevoegen
- Types hebben: naam, kleur, standaard duur, factureerbaar (ja/nee)
- Uitbreidbaar zonder code wijzigingen

#### FR-001c: Afspraak Notities

**Beschrijving:** Zorgverleners kunnen notities toevoegen aan afspraken.

**Business regels:**
- Notities zijn alleen zichtbaar voor ingelogde zorgverleners
- Notities kunnen popup/alert triggeren bij openen afspraak
- Voorbeeld alerts: "Tolk nodig", "Rolstoeltoegankelijk", "Betaling openstaand"
- Alert notities worden visueel gemarkeerd in agenda (icoon/kleur)

#### FR-002: Patiënt Identificatie

**Beschrijving:** Patiënten worden geïdentificeerd via rijksregisternummer (RR).

**Business regels:**
- RR is primaire identifier (voorkomt naamverwarring)
- RR-validatie met Belgische checksum (mod 97)
- RR + naam zijn onwijzigbaar na registratie
- Minimale data opslag (GDPR)

#### FR-003: Agenda Weergaven

**Beschrijving:** Zorgverleners kunnen hun agenda bekijken in verschillende formaten.

**Business regels:**
- Dag en week weergave beschikbaar (maand niet nodig)
- Elke zorgverlener ziet eigen agenda na login
- Admin kan agenda van andere teamleden bekijken

#### FR-003b: Afwezigheid & Beschikbaarheid

**Beschrijving:** Zorgverleners kunnen hun afwezigheid registreren.

**Types afwezigheid:**
- Vakantie (geplande vrije dagen)
- Ziekte (ongeplande afwezigheid)
- Opleiding/Conferentie
- Andere (vrij invulveld voor reden)

**Business regels:**
- Afwezigheid blokkeert tijdslots in agenda
- Afspraken kunnen niet ingepland worden tijdens afwezigheid
- Conflictmelding als afwezigheid wordt ingepland over bestaande afspraken
- Admin kan afwezigheid van alle teamleden bekijken/beheren

#### FR-004: Herhalende Afspraken

**Beschrijving:** Revalidatietrajecten bestaan uit meerdere sessies die in één keer ingepland worden.

**Business regels:**
- Reeks sessies inboeken (wekelijks, tweewekelijks, etc.)
- Overzicht van voltooide en resterende sessies
- Wijziging in reeks kan alle of enkele afspraken beïnvloeden
- Conflictdetectie bij het inplannen van reeksen

#### FR-005: Afspraak Statussen

**Beschrijving:** Afspraken doorlopen verschillende statussen.

**Statussen:**
- Te bevestigen → Bevestigd → In wachtzaal → Binnen → Afgewerkt
- No-show (niet komen opdagen)
- Geannuleerd

### 3.2 Team & Disciplines

#### FR-006: Discipline Catalogus

**Beschrijving:** Systeem ondersteunt meerdere zorgdisciplines.

**Disciplines (huidig + gepland):**
- Logopedie (neurologopedie, prelogopedie)
- Kinesitherapie
- Ergotherapie
- Neuropsychologie
- Diëtiek

**Business regels:**
- Alleen actieve disciplines worden getoond
- Uitbreidbaar zonder code wijzigingen
- Per discipline: beschrijving, behandelingen, indicaties

#### FR-007: Team Management

**Beschrijving:** Beheer van zorgverleners en hun koppeling aan disciplines.

**Business regels:**
- Teamlid kan aan meerdere disciplines gekoppeld zijn
- Per teamlid: foto, naam, functie, bio, specialisaties
- Actief/inactief status
- Wachtwoord reset via admin (niet self-service in MVP)

### 3.3 Admin Dashboard & Beheer

#### FR-007b: Admin Dashboard

**Beschrijving:** Centraal overzicht voor beheerders.

**Dashboard widgets:**
- Afspraken vandaag (aantal, eerste/laatste)
- Afspraken deze week
- Onbevestigde afspraken (actie nodig)
- Team overzicht (wie is beschikbaar/afwezig)

#### FR-007c: Configuratie Beheer

**Beschrijving:** Admin kan systeem configuratie aanpassen.

**Configureerbare items:**
- Disciplines (toevoegen/wijzigen/deactiveren)
- Afspraak types per discipline
- Contact types voor contactformulier
- Teamleden (CRUD + wachtwoord reset)
- Openingstijden praktijk

#### FR-007d: Content Beheer (CMS)

**Beschrijving:** Admin kan website content aanpassen zonder developer.

**Bewerkbare content:**
- Teksten op alle publieke pagina's (Home, Over Ons, etc.)
- Discipline beschrijvingen
- Team bio's en foto's
- Tarieven informatie
- Contact informatie
- Blog artikelen

**Business regels:**
- Rich text editor voor opmaak
- Afbeeldingen uploaden en beheren
- Preview voor publicatie
- Wijzigingen direct zichtbaar na opslaan

### 3.4 Rapportage & Statistieken

#### FR-007e: Rapportages

**Beschrijving:** Admin kan rapporten genereren voor inzicht in praktijkvoering.

**Beschikbare rapporten:**
- Aantal behandelingen per maand/kwartaal/jaar
- Behandelingen per discipline
- Behandelingen per zorgverlener
- No-show percentage (per periode/zorgverlener)
- Bezettingsgraad per zorgverlener

**Business regels:**
- Filterbaar op periode (van/tot datum)
- Filterbaar op discipline/zorgverlener
- Export naar Excel/CSV mogelijk
- Grafieken voor visueel overzicht

### 3.5 GDPR & Privacy Compliance

#### FR-007f: Audit Logging

**Beschrijving:** Alle wijzigingen aan gevoelige data worden gelogd.

**Gelogde acties:**
- Patiënt aangemaakt/gewijzigd/verwijderd
- Afspraak aangemaakt/gewijzigd/verwijderd
- Login/logout van gebruikers
- Wachtwoord resets
- Export van patiëntgegevens

**Per log entry:**
- Wie (gebruiker)
- Wat (actie + welke data)
- Wanneer (timestamp)
- IP-adres (optioneel)

#### FR-007g: Data Retentie

**Beschrijving:** Automatisch beheer van data levenscyclus conform GDPR.

**Business regels:**
- Patiëntgegevens worden na X jaar inactiviteit gearchiveerd (configureerbaar)
- Gearchiveerde data kan op verzoek definitief verwijderd worden
- Audit logs worden 10 jaar bewaard (wettelijke verplichting)
- Admin ontvangt notificatie bij naderende retentie deadline

#### FR-007h: Patiënt Privacy Rechten

**Beschrijving:** Ondersteuning voor GDPR rechten van patiënten.

**Functionaliteit:**
- Recht op inzage: export van alle patiëntgegevens (PDF)
- Recht op verwijdering: complete verwijdering van patiëntdata
- Verwijdering wordt gelogd (zonder persoonsgegevens)

**Business regels:**
- Verwijderverzoek vereist bevestiging door admin
- Export bevat alle opgeslagen gegevens over patiënt
- Na verwijdering blijft alleen geanonimiseerde audit log

### 3.6 Publieke Website

#### FR-008: Informatie Pagina's

**Pagina's:**
- Home (visie, verhaal)
- Over Ons / Team
- Disciplines (met subpagina's)
- Behandelingen (per doelgroep)
- Tarieven & Terugbetaling
- Contact & Routebeschrijving

#### FR-009: Blog / Kennisbank (Prioriteit #2)

**Beschrijving:** Artikelen over neurologische revalidatie.

**Business regels:**
- Categorieën per discipline/onderwerp
- Auteur toewijzen aan artikel
- SEO-geoptimaliseerde URL's

#### FR-010: Meertaligheid (Prioriteit #3)

**Beschrijving:** Website beschikbaar in meerdere talen.

**Talen:** Nederlands (primair), Frans, Engels

**Business regels:**
- Nederlands is standaard
- Gebruiker kan handmatig switchen
- URL-structuur: `/nl/`, `/fr/`, `/en/`

### 3.7 Contact & Communicatie

#### FR-011: Contactformulier

**Business regels:**
- Discipline-keuze toont alleen actieve disciplines
- Spam-bescherming (captcha)
- Bevestigingsmail naar afzender

#### FR-012: Locatie

**Business regels:**
- Kaart zonder tracking (geen Google Maps)
- Openingstijden aanpasbaar via admin
- Routebeschrijving

---

## 4. User Stories met Acceptatiecriteria

### 4.1 Agenda - Zorgverlener

#### US-001: Afspraak Inplannen

**Als** zorgverlener  
**Wil ik** een afspraak kunnen inplannen  
**Zodat** mijn agenda up-to-date is

**Acceptatiecriteria:**
- [ ] Ik kan een patiënt zoeken op naam of RR
- [ ] Ik kan datum en tijd selecteren
- [ ] Ik kan duur kiezen (30/45/60/90 min)
- [ ] Ik kan behandeltype selecteren
- [ ] Ik zie een waarschuwing bij conflicten
- [ ] Na opslaan verschijnt de afspraak in mijn agenda

#### US-002: Afspraak Wijzigen

**Als** zorgverlener  
**Wil ik** een afspraak kunnen verplaatsen  
**Zodat** ik flexibel kan plannen

**Acceptatiecriteria:**
- [ ] Ik kan een bestaande afspraak aanklikken
- [ ] Ik kan datum/tijd wijzigen
- [ ] Ik zie een waarschuwing bij conflicten
- [ ] Bij herhalende afspraken kan ik kiezen: alleen deze of hele reeks

#### US-003: Dag/Week Overzicht

**Als** zorgverlener  
**Wil ik** mijn agenda per dag of week kunnen bekijken  
**Zodat** ik overzicht heb van mijn planning

**Acceptatiecriteria:**
- [ ] Ik kan switchen tussen dag en week weergave
- [ ] Ik zie alle afspraken met patiëntnaam en type
- [ ] Ik zie de status van elke afspraak (kleurcode)
- [ ] Ik kan navigeren naar vorige/volgende dag/week
- [ ] Ik kan snel naar "vandaag" springen

#### US-004: Herhalende Afspraken

**Als** zorgverlener  
**Wil ik** een reeks afspraken in één keer kunnen boeken  
**Zodat** ik revalidatietrajecten efficiënt kan inplannen

**Acceptatiecriteria:**
- [ ] Ik kan aangeven dat het een herhalende afspraak is
- [ ] Ik kan frequentie kiezen (wekelijks, tweewekelijks, etc.)
- [ ] Ik kan aantal sessies opgeven
- [ ] Ik zie een overzicht van alle te boeken data
- [ ] Conflicten worden getoond met opties om op te lossen
- [ ] Na bevestiging worden alle afspraken aangemaakt

#### US-005: Afspraak Status Wijzigen

**Als** zorgverlener  
**Wil ik** de status van een afspraak kunnen wijzigen  
**Zodat** ik de voortgang kan bijhouden

**Acceptatiecriteria:**
- [ ] Ik kan status wijzigen via klik of drag
- [ ] Beschikbare statussen: Te bevestigen, Bevestigd, In wachtzaal, Binnen, Afgewerkt, No-show, Geannuleerd
- [ ] Statuswijziging is direct zichtbaar

#### US-005b: Afspraak Annuleren/Verwijderen

**Als** zorgverlener  
**Wil ik** een afspraak kunnen annuleren of verwijderen  
**Zodat** ik mijn agenda correct kan beheren

**Acceptatiecriteria:**
- [ ] Ik kan een afspraak annuleren (status wordt "Geannuleerd")
- [ ] Geannuleerde afspraken blijven zichtbaar in agenda (doorgestreept)
- [ ] Ik kan een afspraak permanent verwijderen (met bevestiging)
- [ ] Bij herhalende reeks: keuze voor "alleen deze" of "alle toekomstige"

#### US-005c: Notities bij Afspraak

**Als** zorgverlener  
**Wil ik** notities kunnen toevoegen aan een afspraak  
**Zodat** ik belangrijke informatie kan bijhouden

**Acceptatiecriteria:**
- [ ] Ik kan een notitie toevoegen aan een afspraak
- [ ] Ik kan een notitie markeren als "alert" (popup bij openen)
- [ ] Alert notities tonen een icoon in de agenda weergave
- [ ] Bij openen van afspraak met alert: popup toont de alert notitie
- [ ] Notities zijn alleen zichtbaar voor ingelogde zorgverleners

#### US-005d: Afwezigheid Registreren

**Als** zorgverlener  
**Wil ik** mijn afwezigheid kunnen registreren  
**Zodat** er geen afspraken worden ingepland wanneer ik er niet ben

**Acceptatiecriteria:**
- [ ] Ik kan een afwezigheidsperiode aanmaken (datum van/tot)
- [ ] Ik kan type kiezen: Vakantie, Ziekte, Opleiding, Andere
- [ ] Bij "Andere" kan ik een reden opgeven
- [ ] Ik zie een waarschuwing als er al afspraken staan in die periode
- [ ] Afwezigheid is visueel gemarkeerd in de agenda

### 4.2 Agenda - Patiënten

#### US-006: Nieuwe Patiënt Registreren

**Als** zorgverlener  
**Wil ik** een nieuwe patiënt kunnen registreren  
**Zodat** ik afspraken voor hen kan maken

**Acceptatiecriteria:**
- [ ] Ik kan RR invoeren
- [ ] RR wordt gevalideerd (Belgische checksum)
- [ ] Geboortedatum en geslacht worden automatisch afgeleid uit RR
- [ ] Ik kan naam en contactgegevens invoeren
- [ ] Dubbele RR's worden geweigerd

#### US-007: Patiënt Zoeken

**Als** zorgverlener  
**Wil ik** een patiënt kunnen zoeken  
**Zodat** ik snel een afspraak kan maken

**Acceptatiecriteria:**
- [ ] Ik kan zoeken op naam (deels)
- [ ] Ik kan zoeken op RR
- [ ] Resultaten verschijnen tijdens het typen
- [ ] Ik zie naam, RR en laatste afspraak in resultaten

### 4.3 Team Beheer - Admin

#### US-008: Teamlid Toevoegen

**Als** admin  
**Wil ik** een nieuw teamlid kunnen toevoegen  
**Zodat** het team up-to-date blijft

**Acceptatiecriteria:**
- [ ] Ik kan naam, functie, bio invoeren
- [ ] Ik kan foto uploaden
- [ ] Ik kan disciplines toewijzen
- [ ] Ik kan specialisaties/opleidingen toevoegen
- [ ] Nieuw teamlid verschijnt op website (indien actief)

#### US-008b: Wachtwoord Reset

**Als** admin  
**Wil ik** het wachtwoord van een teamlid kunnen resetten  
**Zodat** zij weer toegang krijgen bij vergeten wachtwoord

**Acceptatiecriteria:**
- [ ] Ik kan een nieuw tijdelijk wachtwoord genereren
- [ ] Teamlid moet wachtwoord wijzigen bij eerste login
- [ ] Ik zie een bevestiging na succesvolle reset

#### US-008c: Afspraak Types Beheren

**Als** admin  
**Wil ik** afspraak types kunnen configureren  
**Zodat** disciplines hun eigen specifieke types kunnen gebruiken

**Acceptatiecriteria:**
- [ ] Ik kan een nieuw afspraak type aanmaken
- [ ] Ik kan naam, kleur, standaard duur instellen
- [ ] Ik kan type koppelen aan één of meerdere disciplines
- [ ] Ik kan aangeven of type factureerbaar is
- [ ] Ik kan type deactiveren (niet verwijderen)

#### US-008d: Disciplines Beheren

**Als** admin  
**Wil ik** disciplines kunnen beheren  
**Zodat** het aanbod up-to-date blijft

**Acceptatiecriteria:**
- [ ] Ik kan een nieuwe discipline toevoegen
- [ ] Ik kan beschrijving en details aanpassen
- [ ] Ik kan discipline activeren/deactiveren
- [ ] Ik kan teamleden koppelen aan discipline
- [ ] Wijzigingen zijn direct zichtbaar op website

#### US-008e: Website Content Bewerken

**Als** admin  
**Wil ik** teksten op de website kunnen aanpassen  
**Zodat** ik geen developer nodig heb voor kleine wijzigingen

**Acceptatiecriteria:**
- [ ] Ik kan teksten bewerken via een rich text editor
- [ ] Ik kan afbeeldingen uploaden en plaatsen
- [ ] Ik kan een preview zien voor ik publiceer
- [ ] Wijzigingen zijn direct zichtbaar na opslaan
- [ ] Ik kan de volgende pagina's bewerken: Home, Over Ons, Tarieven, Contact

### 4.4 Rapportage - Admin

#### US-012: Rapporten Genereren

**Als** admin  
**Wil ik** rapporten kunnen genereren  
**Zodat** ik inzicht heb in de praktijkvoering

**Acceptatiecriteria:**
- [ ] Ik kan een rapport selecteren (behandelingen, no-shows, bezetting)
- [ ] Ik kan een periode kiezen (van/tot)
- [ ] Ik kan filteren op discipline of zorgverlener
- [ ] Ik zie resultaten als tabel en grafiek
- [ ] Ik kan exporteren naar Excel/CSV

#### US-013: No-Show Analyse

**Als** admin  
**Wil ik** no-show statistieken kunnen bekijken  
**Zodat** ik patronen kan identificeren en actie kan ondernemen

**Acceptatiecriteria:**
- [ ] Ik zie no-show percentage per periode
- [ ] Ik kan filteren per zorgverlener
- [ ] Ik zie welke patiënten meerdere no-shows hebben
- [ ] Ik kan de data exporteren

### 4.5 GDPR & Privacy - Admin

#### US-014: Audit Log Bekijken

**Als** admin  
**Wil ik** kunnen zien wie wat heeft gewijzigd  
**Zodat** ik wijzigingen kan traceren (compliance)

**Acceptatiecriteria:**
- [ ] Ik zie een chronologisch overzicht van alle acties
- [ ] Ik kan filteren op gebruiker, actie type, of datum
- [ ] Ik zie wie, wat, en wanneer per entry
- [ ] Ik kan de log exporteren

#### US-015: Patiëntgegevens Exporteren (Inzage)

**Als** admin  
**Wil ik** alle gegevens van een patiënt kunnen exporteren  
**Zodat** ik kan voldoen aan een inzageverzoek (GDPR)

**Acceptatiecriteria:**
- [ ] Ik kan een patiënt selecteren
- [ ] Ik kan een PDF genereren met alle opgeslagen gegevens
- [ ] De export bevat: persoonsgegevens, afspraakhistorie, notities
- [ ] De actie wordt gelogd in de audit log

#### US-016: Patiënt Verwijderen (Recht op Vergetelheid)

**Als** admin  
**Wil ik** een patiënt volledig kunnen verwijderen  
**Zodat** ik kan voldoen aan een verwijderverzoek (GDPR)

**Acceptatiecriteria:**
- [ ] Ik moet een reden opgeven voor verwijdering
- [ ] Ik moet bevestigen met wachtwoord
- [ ] Alle persoonsgegevens worden permanent verwijderd
- [ ] Afspraken worden geanonimiseerd (voor statistieken)
- [ ] De actie wordt gelogd (zonder persoonsgegevens)

### 4.6 Website - Bezoeker

#### US-009: Contact Opnemen

**Als** potentiële patiënt  
**Wil ik** snel contactgegevens kunnen vinden  
**Zodat** ik telefonisch een afspraak kan maken

**Acceptatiecriteria:**
- [ ] Telefoonnummer is zichtbaar op elke pagina
- [ ] Contactpagina bevat adres, telefoon, email
- [ ] Kaart toont locatie
- [ ] Openingstijden zijn zichtbaar

#### US-010: Disciplines Bekijken

**Als** verwijzer (arts)  
**Wil ik** zien welke disciplines beschikbaar zijn  
**Zodat** ik correct kan doorverwijzen

**Acceptatiecriteria:**
- [ ] Overzichtspagina toont alle actieve disciplines
- [ ] Per discipline is er een detailpagina
- [ ] Ik zie welke teamleden bij elke discipline horen
- [ ] Ik zie welke behandelingen aangeboden worden

#### US-011: Website in Andere Taal

**Als** Franstalige bezoeker  
**Wil ik** de website in het Frans kunnen lezen  
**Zodat** ik alles begrijp

**Acceptatiecriteria:**
- [ ] Taalswitch is zichtbaar in header
- [ ] Na switch wordt alle content in gekozen taal getoond
- [ ] URL verandert naar `/fr/...`
- [ ] Taalkeuze wordt onthouden

---

## 5. Non-Functionele Requirements

### 5.1 Performance

| Metric | Target |
|--------|--------|
| Page load | < 3 seconden |
| Lighthouse mobile | > 90 |
| Uptime | 99.5% |

### 5.2 Security & Privacy

- HTTPS encryptie
- GDPR compliant (minimale data, privacy policy)
- Veilige opslag patiëntgegevens
- Geen tracking cookies

### 5.3 Accessibility

- WCAG 2.1 AA compliant
- Screen reader compatible
- Keyboard navigatie
- Voldoende kleurcontrast

### 5.4 SEO

- Semantic HTML
- Meta tags per pagina
- Schema.org markup voor medische praktijk
- Sitemap.xml

---

## 6. Branding (BEHOUDEN)

- **Logo:** Niet wijzigen (zelf ontworpen door oprichter)
- **Kleuren:** Blauw (primair), Groen (accent), Wit/lichtgrijs (achtergrond)
- **Toon:** Professioneel maar warm en menselijk

---

## 7. Sitemap

```text
PUBLIEK
/                           → Home
/over-ons                   → Over Ons (visie, verhaal, team)
/disciplines                → Overzicht disciplines
/disciplines/[slug]         → Discipline detail
/behandelingen              → Behandelingen overzicht
/tarieven                   → Tarieven & Terugbetaling
/blog                       → Kennisbank
/blog/[slug]                → Blog artikel
/contact                    → Contact & route
/privacy                    → Privacy Policy

ADMIN (intern)
/admin                      → Dashboard (overzicht)
/admin/agenda               → Agenda systeem
/admin/agenda/afwezigheid   → Afwezigheid beheer
/admin/patienten            → Patiënten beheer
/admin/team                 → Teamleden beheer
/admin/disciplines          → Disciplines beheer
/admin/afspraak-types       → Afspraak types configuratie
/admin/blog                 → Blog beheer
/admin/content              → Website content (CMS)
/admin/rapporten            → Rapportages & statistieken
/admin/audit-log            → Audit logging (GDPR)
/admin/instellingen         → Algemene instellingen
```

---

## 8. Project Fasen

### Fase 1: Intern Agenda Systeem (MVP)

- Login/authenticatie voor zorgverleners
- Patiënten registratie en zoeken
- Afspraken CRUD
- Dag/week weergave
- Herhalende afspraken

### Fase 2: Publieke Website

- Basis pagina's (Home, Over Ons, Contact, etc.)
- Discipline pagina's
- Team weergave
- Responsive design

### Fase 3: Blog / Kennisbank

- Blog systeem
- Categorieën
- Rich text editor

### Fase 4: Meertaligheid

- NL/FR/EN ondersteuning
- Taalswitch
- Vertalingen

---

## 9. Success Metrics

| Metric | Target (6 maanden) |
|--------|---------------------|
| Afspraken via systeem | 100% van alle afspraken |
| Website bezoekers | +50% |
| Bounce rate | < 40% |
| Pagina's per sessie | > 3 |

---

## 10. Beslissingen

| Onderwerp | Beslissing |
|-----------|------------|
| Agenda weergaven | Dag + Week (geen maand nodig) |
| Wachtwoord reset | Via admin, niet self-service |
| Afspraak types | Configureerbaar via admin per discipline |
| Afwezigheid | Vakantie, Ziekte, Opleiding, Andere |
| Betalingen/Facturatie | Niet in scope (extern systeem) |
| Patiëntdossier | Niet in scope (alleen basisgegevens) |
| Wachtlijst | Niet in scope |
| Verwijzingen | Niet in scope |
| GDPR | Volledig conform (audit log, inzage, verwijdering) |
| Rapportage | Wel in scope (behandelingen, no-shows, bezetting) |

---

## 11. Open Punten

| Vraag | Status |
|-------|--------|
| Email notificaties voor afspraken? | Te beslissen |
| SMS herinneringen? | Toekomstig |
| Online booking door patiënten? | Toekomstig (toggle via admin) |

---

*Dit document beschrijft WAT we bouwen. Voor HOE we het bouwen, zie Technical Design Document (TDD).*
