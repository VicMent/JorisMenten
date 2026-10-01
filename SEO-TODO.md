# SEO — uitvoeringschecklist

Status per onderdeel. Alles wat in deze lijst onder "Code" staat is in de repo
geïmplementeerd. Alles onder "Handmatig" kan niet vanuit de code gebeuren.

## Beslissing nodig: welk adres is officieel?

De site en de live site gebruiken **Ambachtenlaan 19, 3294 Diest**.Bedrijfsgidsen
(Elders Vandaag, Infobel, openingsuren.vlaanderen) noemen **Vispoel 14, 2230
Herselt**, met hetzelfde telefoonnummer. Daarnaast zegt de site zelf dat het
werkgebied "Herselt" is terwijl het adres in Diest ligt.

Er is één officiële keuze nodig. Alles hieronder gebruikt nu Diest, omdat dat
het adres is dat op de site en de live site staat. **Als Herselt officieel is,
moeten deze bestanden aangepast worden:**
| Wat | Waar |
| --- | --- |
| JSON-LD `address` + `geo` | `index.html`, `product-template.html`, en de 5 productpagina's + `projecten.html` |
| Zichtbaar adres | `data/site.json` → `shared.contact.address` en `pages.*.closing.contactCard.text` |
| Maps-embed | `data/site.json` → `shared.map.embedUrl` |
| `areaServed` | idem, plus het werkgebied in de trustbar |

Het telefoonnummer is wel overal consistent: 0494 22 58 59.

## Tier 1 — Techniek (klaar)

| Item | Status |
| --- | --- |
| `.htaccess`: HTTPS-afdwinging, www → apex | klaar |
| `.htaccess`: `/index.html` → `/` (301) | klaar |
| `.htaccess`: oude `?p=`-paginaparameters → `/` (301) | klaar |
| `.htaccess`: `garagepoorten.html` → `poorten.html`, `terras.html` → `overkappingen.html` (301) | klaar |
| `.htaccess`: oude `sitemapNN.xml` → 410 | klaar |
| `.htaccess`: `ErrorDocument 404 /404.html` | klaar |
| `.htaccess`: gzip, cache-headers, blokkade op `/inc/` en `/data/` | klaar |
| `robots.txt` met bestaande AI-bot-blocks + nieuwe sitemap-regel | klaar |
| `sitemap.xml` met de 7 echte pagina's | klaar |
| `404.html` met links terug naar alle pagina's | klaar |
| `<html lang="nl-BE">` op alle pagina's | klaar |
| Zelfverwijzende `rel="canonical"` op alle pagina's | klaar |
| Open Graph + Twitter Card | klaar |
| `width`/`height` op alle afbeeldingen (CLS) | klaar |
| `fetchpriority="high"` op eerste hero-slide, `loading="lazy"` op de rest | klaar |
| `width`/`height` op de Maps-iframe | klaar |
| Google Fonts niet meer render-blokkerend (`@import` → preload) | klaar |
| Click-to-call `tel:` in de contactkaarten en het afsluitende contactblok | klaar |

### Belangrijk bij deployment

De live site draait nu nog de **oude bestandsnamen** (`garagepoorten.html`,
`terras.html`) en de `.htaccess` is daar nog niet actief. De 301-redirects
werken pas na upload. Tot dan bestaan beide versies naast elkaar.

De live site serveert ook nog `sitemap27.xml` en `sitemap30.xml` met **762
WordPress-URLs** (`?p=41391` enz.). Die komen allemaal uit op de homepage. De
nieuwe `robots.txt` verwijst niet meer naar die bestanden en de `.htaccess`
geeft ze een 410, maar verwijder ze ook handmatig van de server.

## Tier 2 — Structured data (klaar)

| Pagina | Markup |
| --- | --- |
| Home | `HomeAndConstructionBusiness` + `WebSite`, `@graph` |
| Productpagina's | `HomeAndConstructionBusiness` + `Service` + `BreadcrumbList` |
| Projecten | `HomeAndConstructionBusiness` + `CollectionPage` + `BreadcrumbList` |
| Template | idem, placeholders worden gevuld door `cms.php` en `generate-product-pages.py` |

Niet gedaan, bewust: reviews als sterretjes op de eigen site. Google waardeert
dat niet en het is een de-facto self-serving markup.

Eén technische correctie is wel doorgevoerd en raakt geen bestaande tekst: de
`<h1>` van de **sjabloonpagina's** stond identiek aan de `<title>`. In de
sjabloon is de H1 nu de productnaam alleen, zodat een nieuw product via het
admin-paneel geen dubbele titel/H1 krijgt. De vijf bestaande productpagina's
hebben die identieke H1 nog wel en die staan in de Tier-3-lijst.

Niet gedaan, uit de Tier-2-scope gehaald: het herschrijven van titels,
meta descriptions en H1's. De guide vroeg daarom, maar de opdracht was om
teksten niet aan te passen. Zie onderaan.

## Tier 3 — Inhoud (niet gedaan, wacht op akkoord)

| Item | Status |
| --- | --- |
| Titels met locatie en keyword eerst | wacht |
| Meta descriptions (~150 tekens, met CTA) | wacht |
| H1's die niet gelijk zijn aan de titel | wacht |
| Productpagina's uitbreiden naar 600–1.000 woorden | wacht |
| Prijsindicaties ("vanaf €…") | wacht |
| FAQ-secties | wacht |
| Alt-teksten herschrijven | wacht |
| Bestandsnamen hernoemen (`1.jpeg` → `sectionale-garagepoort.webp`) | wacht |
| WebP-conversie (nu: JPEG, tot 880 KB) | wacht |
| Bestand `product-template.html` bevat nog poorten-teksten | zie "Bekende bugs" |

Huidige paginalengtes: index 543 woorden, productpagina's 400–600, projecten
405. De guide streeft naar 600–1.000 op productpagina's.

## Tier 4 — Off-page (handmatig, buiten de repo)

### 1. Google Business Profile — grootste hefboom

- [ ] Profiel claimen en verifiëren
- [ ] Naam, adres, telefoon exact gelijk aan de site (zie adresbeslissing hierboven)
- [ ] Primaire categorie: garagepoortenleverancier. Secundair: zonwering, rolluiken, overkappingen
- [ ] Servicegebied toevoegen: Diest, Herselt, Aarschot, Scherpenheuvel-Zichem, Westerlo, Heist-op-den-Berg
- [ ] Producten/diensten per product met korte beschrijving
- [ ] 5–10 echte projectfoto's per maand toevoegen, descriptief benoemd
- [ ] Website-link met tracking: `https://jorismenten.be/?utm_source=google&utm_medium=organic&utm_campaign=gbp`
- [ ] Maandelijks één post over een afgewerkt project
- [ ] Na elke plaatsing een directe review-link sturen (QR op de factuur werkt goed)
- [ ] Op elke review antwoorden. Nooit reviews kopen of fabriceren

### 2. Citations corrigeren

Alle bestaande vermeldingen nakijken en het **oude Herselt-adres** corrigeren:

- [ ] Google Business Profile
- [ ] Bing Places
- [ ] Apple Business Connect
- [ ] Facebook
- [ ] Instagram
- [ ] LinkedIn
- [ ] Gouden Gids
- [ ] Infobel
- [ ] openingsuren.vlaanderen
- [ ] Eigen gidsen (bvb. 0790.be, bedrijvenregister)

### 3. Links — fabrikanten

De site installeert of toont bewezen producten van deze merken: **Pinela**,
**Pergola Da Vinci**, **Wilms** (de map `images/Wilms_Referentiebeelden_Rolluiken_Hires/`
getuigt van een leveranciersrelatie). Vraag deze drie om een vermelding in hun
dealer-zoeker met link. Dit zijn de beste links die beschikbaar zijn.

- [ ] Pinela
- [ ] Pergola Da Vinci
- [ ] Wilms
- [ ] Overige merken uit de productlijst controleren

### 4. Links — overig

- [ ] Partners: architecten, aannemers, interieurarchitecten, makelaars
- [ ] Lokale aanwezigheid: sponsoring van een club, gemeente, Unizo/Voka
- [ ] Lokaal nieuws over een opvallend project
- [ ] Klanten die zelf bloggen of posten over hun project

Niet doen: gekochte links, linkfarms, geautomatiseerde directory-dumps.

## Bekende bugs (niet gefixt, buiten de opdracht)

**Dode subcategorie-links in het mega-menu.** `java/cms.js:346` bouwt
sub-subcategory-links als `product.html#slug`, maar die anchor-ID's bestaan
niet. `poorten.html` heeft `id="sectionale-poorten"` maar niets voor
`sectionale-prive`, `sectionale-industrie`, `hekken-staal` of `hekken-alu`.
Zelfde voor acht `screens-*` en `zonnetenten-*` slugs in `zonwering.html`. Die
menu-kliks blijven bovenaan de pagina. Ook relevant voor SEO: het zijn
gebruikers die op zoek zijn naar die specifieke producten.

**`product-template.html` bevat nog poorten-teksten.** Regels 60, 99 en 119
hardcoden "Een poort die de gevel optilt", "meest zichtbare onderdelen van de
woning" en "Op zoek naar een poort…". De vijf bestaande productpagina's zijn
handmatig schoon (nul "poort"-vermeldingen op de andere pagina's), maar een
**nieuw** product via het admin-paneel regenereert vanuit deze template en
verschijnt met poorten-teksten. Dit is deels opgelost: de `<h1>` en de
template-teksten voor `statement`/`approach` zijn nog origineel poorten-koop,
dus de fout blijft bestaan zodra de admin een product aanmaakt. Opgelost zodra
de inhoudelijke revisie (Tier 3) gebeurt.

**Oude tekst op de live site.** De live versie van de site bevat nog de
oudere teksten ("Garagepoorten", "terrasoverkappingen") en de oude
`href="garagepoorten.html"`-links. De repo staat verder vooruit; deployen lost
het op.

## Meten

- [ ] Google Search Console: property `jorismenten.be` aanmelden (DNS of URL-prefix)
- [ ] `sitemap.xml` submitten in Search Console en Bing Webmaster Tools
- [ ] Rich Results Test op de homepage en één productpagina
- [ ] PageSpeed Insights op mobiel: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1
- [ ] Keywords valideren in Search Console na 4–6 weken, niet gokken op volumes
- [ ] Titel, H1 en meta description per pagina uniek houden
