# SEO es GEO terv a csavarkompresszor kalkulatorhoz

Ez a dokumentum lepesrol lepesre osszefoglalja, mit erdemes megcsinalni ahhoz, hogy a csavarkompresszor kalkulator jobban megtalalhato legyen Google-ben, Bingben, ChatGPT Searchben, Perplexityben es helyi keresesi feluleteken is.

## 1. Cel es pozicionalas

Eloszor pontosan meg kell fogalmazni, mire akarunk rangsorolni es mire akarunk leadet gyujteni.

Fo pozicio:

- Ipari csavarkompresszor energia-megtakaritas kalkulator.
- Csavarkompresszor csere megterulesi elokalkulacio.
- Suritett levego rendszerek energiahatakony korszerusitese.

Fo celcsoport:

- Gyarto cegek.
- Uzemeltetesi vezetok.
- Karbantartasi vezetok.
- Energetikusok.
- Beszerzok, akik kompresszor csere vagy energiaaudit elott allnak.

Fo konverzio:

- Kalkulacio kitoltese.
- Reszletes riport kerese emailben.
- 15 perces muszaki egyeztetes foglalasa.

## 2. Technikai SEO alapok

Ezek nelkul a jo tartalom is nehezebben teljesit.

### 2.1. Metaadatok

Ellenorizni kell minden publikus oldal title es description mezojet.

Javasolt fooldali title:

```text
Csavarkompresszor megtakaritas kalkulator | Ipari energia koltseg szamitas
```

Javasolt fooldali description:

```text
Szamolja ki, mennyit takarithat meg evente egy korszeru ipari csavarkompresszorral. Energiafogyasztas, kWh es megterulesi elokalkulacio emailes riporttal.
```

Fontos:

- A title legyen kulcsszavas, de termeszetes.
- A description mondja meg, mit kap a felhasznalo.
- Az oldalon levo H1 legyen kozel a keresesi szandekhoz.

### 2.2. Sitemap

Kesziteni kell Next.js-ben egy `src/app/sitemap.ts` fajlt.

Tartalmazza:

- fooldal
- jogi oldalak
- SEO/GEO tartalmi oldalak
- kesobbi esettanulmanyok
- kesobbi iparagi oldalak

Pelda URL-ek:

- `/`
- `/csavarkompresszor-megtakaritas-kalkulator`
- `/csavarkompresszor-csere-megterules`
- `/rs-vsd-csavarkompresszor`
- `/kompresszor-aramfogyasztas-kalkulator`
- `/suritett-levego-energiaaudit`

### 2.3. Robots.txt

Kesziteni kell Next.js-ben egy `src/app/robots.ts` fajlt.

Cel:

- Google es Bing crawl engedese.
- ChatGPT Search es mas AI keresok crawl engedese.
- Admin es API utvonalak tiltasa.

Engedheto AI crawlerek:

- `OAI-SearchBot` ChatGPT Search megjeleneshez.
- `PerplexityBot` Perplexity talalatokhoz.
- `Bingbot` Bing es Copilot feluletekhez.

Tiltando:

- `/admin`
- `/api`
- belso export vagy lead utvonalak

### 2.4. Canonical URL-ek

Minden fontos oldalnak legyen egyertelmu canonical URL-je.

Pelda:

```text
https://csavarkompresszorkalkulator.hu/csavarkompresszor-megtakaritas-kalkulator
```

Ezzel elkerulheto, hogy UTM vagy mas parameterek miatt duplikalt oldalkent kezeljek.

### 2.5. Open Graph es social megosztas

A fooldalhoz es fontos aloldalakhoz kell:

- Open Graph title.
- Open Graph description.
- Open Graph image.
- Twitter card meta.

A jelenlegi `public/images/industrial-compressor-hero.png` jo kiindulas, de kesobb erdemes kulon megosztasi kepet is kesziteni.

## 3. Strukturalt adatok

JSON-LD strukturalt adatot kell betenni a fontos oldalakba. Ez segit a keresoknek es AI rendszereknek ertelmezni, hogy mi az oldal szerepe.

### 3.1. Fooldal

Javasolt schema tipusok:

- `WebSite`
- `Organization`
- `SoftwareApplication` vagy `WebApplication`
- `BreadcrumbList`
- `FAQPage`, ha van lathato FAQ szekcio

### 3.2. Kalkulator schema

A kalkulatorhoz javasolt:

- nev: Csavarkompresszor megtakaritas kalkulator
- alkalmazas tipusa: BusinessApplication
- kategoria: energiahatakonysagi kalkulator
- leiras: ipari csavarkompresszor energiafogyasztas es megtakaritas becslese

### 3.3. Helyi schema

Ha van mogotte ceg vagy szolgaltato, akkor kell:

- `LocalBusiness`
- cegnev
- cim
- telefon
- email
- szolgaltatasi terulet
- nyitvatartas, ha relevans

## 4. GEO, vagyis Generative Engine Optimization

A GEO celja, hogy az AI keresok es valaszrendszerek idezheto, ertheto forraskent kezeljek az oldalt.

### 4.1. AI-barát tartalomformak

Minden fontos tartalmi oldalon legyen:

- rovid definicio
- konkret keplet
- pelda szamitas
- osszefoglalo tabla
- gyakori kerdesek
- tiszta szerkezet H2 es H3 cimekkel
- egyertelmu szakmai allitasok

Pelda blokk:

```text
A csavarkompresszor eves aramkoltsege kozelitoleg:
felvett teljesitmeny kW x eves uzemora x villamosenergia ar Ft/kWh.
```

### 4.2. Valaszolhato kerdesek

Ezekre kulon tartalmi blokkokat kell irni:

- Mennyit fogyaszt egy 37 kW-os csavarkompresszor?
- Mikor eri meg lecserelni egy regi csavarkompresszort?
- Mi a kulonbseg fix es fordulatszam-szabalyozott kompresszor kozott?
- Hany uzemora mellett terul meg a kompresszor csere?
- Hogyan kell kiszamolni a suritett levego rendszer energiakoltseget?
- Milyen adatok kellenek egy kompresszor energiaaudit elott?

### 4.3. Idézheto szakmai tartalom

Az AI rendszerek gyakran olyan forrasokat szeretnek, ahol egy mondat onmagaban is ertheto.

Jo pelda:

```text
Egy 37 kW nevleges teljesitmenyu csavarkompresszor eves energiakoltsege nagyban fugg a tenyleges felvett teljesitmenytol, az eves uzemoratol es a villamosenergia aratol.
```

Gyenge pelda:

```text
Ez sok mindentol fugg, kerjen ajanlatot.
```

## 5. Tartalmi oldalak

A fooldal melle legalabb 8-12 szakmai oldalt kell epiteni. Ezek nem blognak, hanem keresesi szandekra optimalizalt szakmai valaszoldalaknak keszuljenek.

### 5.1. Elso korben keszulo oldalak

1. `csavarkompresszor-megtakaritas-kalkulator`
   - Fo kulcsszo: csavarkompresszor megtakaritas kalkulator
   - Cel: a kalkulator SEO landing oldala

2. `csavarkompresszor-csere-megterules`
   - Fo kulcsszo: csavarkompresszor csere megterules
   - Cel: csere elotti dontestamogatas

3. `rs-vsd-csavarkompresszor`
   - Fo kulcsszo: fordulatszam szabalyozott csavarkompresszor
   - Cel: RS/VSD elonyok magyarazata

4. `kompresszor-aramfogyasztas-kalkulator`
   - Fo kulcsszo: kompresszor aramfogyasztas
   - Cel: fogyasztasi keplet es peldak

5. `suritett-levego-energiaaudit`
   - Fo kulcsszo: suritett levego energiaaudit
   - Cel: szakertoi szolgaltatasi szandek

6. `ipari-kompresszor-energia-megtakaritas`
   - Fo kulcsszo: ipari kompresszor energia megtakaritas
   - Cel: altalanos ipari tema lefedese

### 5.2. Teljesitmeny szerinti oldalak

Kesobb kulon oldalak keszulhetnek:

- 22 kW csavarkompresszor fogyasztas
- 37 kW csavarkompresszor fogyasztas
- 55 kW csavarkompresszor fogyasztas
- 75 kW csavarkompresszor fogyasztas
- 90 kW csavarkompresszor fogyasztas

Ezek csak akkor keszuljenek el, ha mindegyikben van konkret pelda, kalkulacio es hasznos tartalom.

### 5.3. Iparagi oldalak

Kesobb:

- csavarkompresszor megtakaritas gyarto uzemeknek
- csavarkompresszor energia koltseg muanyagiparban
- csavarkompresszor energia koltseg elelmiszeriparban
- suritett levego rendszer koltseg autóipari beszallitoknak

## 6. Lokalis SEO

Ha a cel Magyarorszag vagy konkret regiok, a helyi SEO kulon munkat igenyel.

### 6.1. Google Business Profile

Letre kell hozni vagy rendbe kell tenni:

- cegnev
- weboldal
- telefonszam
- szolgaltatasi terulet
- kategoria
- fotok
- szolgaltatasok
- rendszeres posztok
- ugyfelvelemenyek

### 6.2. NAP egyezoseg

NAP = name, address, phone.

Ugyanaz szerepeljen mindenhol:

- weboldal
- impresszum
- Google Business Profile
- ceges katalogusok
- LinkedIn
- partneroldalak

### 6.3. Varos vagy regio oldalak

Csak akkor szabad kesziteni, ha valos szolgaltatasi terulet.

Pelda:

- ipari kompresszor energiaaudit Budapest
- csavarkompresszor korszerusites Gyor
- suritett levego energia megtakaritas Debrecen

Fontos: ezek ne ures doorway oldalak legyenek, hanem legyen bennuk konkret szolgaltatasi informacio.

## 7. Belső linkeles

A fooldalrol linkelni kell minden fontos tartalmi oldalra.

Minden tartalmi oldalrol vissza kell linkelni:

- kalkulatorra
- riport kerese blokkra
- relevans kapcsolodo cikkekre

Javasolt anchor szovegek:

- csavarkompresszor megtakaritas kalkulator
- kompresszor aramfogyasztas szamitasa
- csavarkompresszor csere megterulese
- RS/VSD csavarkompresszor elonyei

## 8. Konverzios elemek

Minden SEO/GEO oldalnak legyen sajat konverzios celja.

Javasolt blokkok:

- "Szamolja ki a sajat gepere"
- "Kerje a reszletes emailes riportot"
- "Foglaljon 15 perces muszaki egyeztetest"
- "Nem tudja a pontos adatokat? Induljon becslessel"

Fontos:

- Ne csak a fooldalon legyen CTA.
- A CTA kapcsolodjon az oldal temajahoz.
- A kalkulator legyen minden oldalrol 1 kattintassal elerheto.

## 9. Meres es analitika

Be kell kotni:

- Google Search Console
- Bing Webmaster Tools
- Google Analytics 4 vagy mas privacy-barat analitika
- Vercel Analytics, ha Vercelen fut
- UTM parameterek kampanyokhoz

Merendo esemenyek:

- kalkulator inditasa
- mezok kitoltese
- riport bekuldese
- Calendly kattintas
- hibas bekuldes
- sikeres lead

## 10. Linkepites es hitelesseg

A tema B2B ipari, ezert a hitelesseg fontosabb, mint a tomeges linkepites.

Jo linkforrasok:

- szakmai cikkek
- energetikai partnerek
- ipari beszallitok
- esettanulmanyok
- LinkedIn posztok
- konferencia vagy webinar oldalak
- gyartoi vagy forgalmazoi partneroldalak

Kerulendo:

- tomeges katalogus linkek
- irrelevans vendegcikkek
- kulcsszohalmozott footer linkek
- automatikus linkepito csomagok

## 11. Utemezes

### Het 1: Technikai alap

- meta title es description ellenorzes
- sitemap.ts
- robots.ts
- canonical URL-ek
- Open Graph ellenorzes
- strukturalt adat a fooldalra
- Search Console es Bing Webmaster Tools bekotes

### Het 2: Fooldal es FAQ

- fooldali szakmai szoveg bovites
- FAQ szekcio
- kalkulacios keplet lathato magyarazata
- pelda szamitas
- belso link blokk

### Het 3: Elso 3 tartalmi oldal

- csavarkompresszor-megtakaritas-kalkulator
- csavarkompresszor-csere-megterules
- rs-vsd-csavarkompresszor

### Het 4: Kovetkezo 3 tartalmi oldal

- kompresszor-aramfogyasztas-kalkulator
- suritett-levego-energiaaudit
- ipari-kompresszor-energia-megtakaritas

### Honap 2: GEO erosites

- tovabbi kerdes-valasz blokkok
- tablazatos peldak
- teljesitmeny szerinti oldalak
- iparagi oldalak
- esettanulmany sablon

### Honap 3: Hitelesseg es linkek

- Google Business Profile optimalizalas
- ugyfelvelemenyek gyujtese
- LinkedIn szakmai posztok
- partnerlinkek
- esettanulmanyok publikálasa

## 12. Minimum elso sprint

Ha gyors eredmenyt akarunk, ezt kell eloszor megcsinalni:

1. `src/app/sitemap.ts`
2. `src/app/robots.ts`
3. fooldali JSON-LD strukturalt adat
4. FAQ szekcio a fooldalon
5. egy kulon `csavarkompresszor-megtakaritas-kalkulator` oldal
6. egy `kompresszor-aramfogyasztas-kalkulator` oldal
7. Search Console es Bing Webmaster Tools bekotes
8. Google Business Profile, ha van valos ceg/szolgaltatasi hatter

## 13. Forrasok

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google strukturalt adatok: https://developers.google.com/search/docs/guides/search-gallery
- OpenAI crawlerek: https://platform.openai.com/docs/bots
- Bing Webmaster Guidelines: https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a
- Schema.org: https://schema.org/

