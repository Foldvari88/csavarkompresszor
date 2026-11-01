# Csavarkompresszor blog: vevői útvonal és konverzió

Frissítés: 2026. november 1. A meglévő 10 URL megmarad.

## Üzleti cél és ellenőrizhető eredmény

A cikkek az ipari csavarkompresszort használó vállalkozások döntését segítik: a felismert költségből és műszaki problémából saját előkalkuláció, majd személyre szabott gép- vagy szervizajánlatkérés legyen. A cikkolvasás és a CTA-kattintás önmagában nem ajánlatkérés, és nem jelenti vásárlás létrejöttét.

Elsődleges üzleti eredmény a szerver által elfogadott, tényleges azonosítóval mentett ajánlatkérés. A mentett kalkulációs riport külön, korábbi lépés. A végleges értékesítési eredményt és a megkeresés minőségét az adminban rögzített állapottal és minősítéssel kell értékelni.

## Célcsoportok és olvasási utak

| Döntési szerep | Jelenlegi kérdés | Ajánlott út |
| --- | --- | --- |
| Cégvezető, pénzügyi döntéshozó | Mekkora a költség, és üzletileg indokolt-e foglalkozni vele? | Áramfogyasztás → teljes költség → csere megtérülése |
| Műszaki vezető, karbantartó | A gép, a hálózat vagy a szabályozás okozza a gondot? | Szivárgás → energiaaudit → fix/VSD összehasonlítás |
| Beszerző, beruházást előkészítő | Milyen feladatra és milyen tartalommal kérjünk összehasonlítható ajánlatot? | Méretezés → teljes költség → kalkulátoradatok |

A gyártóműhely, CNC, összeszerelés, műanyag-feldolgozás és csarnokfűtés említése szemléltető üzemi helyzet. Nem ügyfélreferencia vagy mért esettanulmány. Nincs kitalált megtakarítás, garancia, készlethiány vagy sürgető akció.

## A tíz cikk feladata

| Meglévő slug | Szerep a döntésben | Közvetlen üzleti továbbhaladás |
| --- | --- | --- |
| csavarkompresszor-aramfogyasztas-szamitasa | A költség számszerűsítése | Saját kalkuláció; kész beszerzésnél gépajánlat |
| csavarkompresszor-csere-megterulese | A beruházási indok vizsgálata | Kalkuláció és konkrét csereajánlat |
| fix-vagy-vsd-csavarkompresszor | Konfigurációk összevetése | Terheléshez illő gépajánlat |
| suritett-levego-szivargas-koltsege | Rendszerveszteség felismerése | Műszaki/szervizegyeztetés, javítás utáni gépcsere-becslés |
| kompresszor-uzemi-nyomas-energiakoltseg | Panasz és kapacitásigény elkülönítése | Szervizegyeztetés a konkrét tünetről |
| csavarkompresszor-hovisszanyeres | Hőigény és energiaköltség összevetése | Gép- és hőhasznosítási egyeztetés |
| csavarkompresszor-meretezes-hibak | Igényleírás előkészítése | Méretezéshez kapcsolódó gépajánlat |
| suritett-levego-energiaaudit-elokeszites | A mérésből döntési feladat készítése | Felmérés és korszerűsítés egyeztetése |
| csavarkompresszor-teljes-elettartam-koltseg | Ajánlatok közös időtávú értékelése | Összehasonlítható gépajánlat |
| kompresszor-kalkulator-adatok | A következő művelet akadályainak feloldása | Riport vagy közvetlen ajánlatkérés |

## A tartalmak és a felület változásai

Mind a tíz cikk saját keresési szándékhoz igazított címet és metaadatot, új bevezetőt, rövid választ, döntési helyzetet, hárompontos adatlistát és további kifogáskezelő kérdéseket kap. Az eredeti képletek, feltételezett költségpéldák, szakmai források és lényeges műszaki korlátok megmaradnak. A műszaki alapok után a saját üzemi alkalmazás és az ajánlatkéréshez szükséges feladat következik.

A fő gomb felirata továbbra is „Tovább a kalkulátorra”. Az előtte álló indok és a környező szöveg cikkenként változik. A már döntéshez érkező olvasónak külön gép- vagy szervizajánlatkérési út áll rendelkezésre. A további olvasnivalóhoz konkrét indok tartozik; nem kell minden cikket végigolvasni a kapcsolatfelvételhez.

A kalkulátornál rövid, témához kapcsolódó útmutató jelenik meg. Az ajánlatkérőn az üzenet témája előkészíthető és szabadon módosítható. A sikeres riportkérés utáni oldal az újabb kalkuláció mellett konkrét ajánlatkérést is felkínál. Személyes adatok nem kerülnek az URL-be, és egyik hozzájárulást sem jelöljük be automatikusan.

## Mérés és attribúció

| Esemény | Mit jelent? | Nem jelent |
| --- | --- | --- |
| article_view | Cikkmegtekintés analitikai hozzájárulás után | Érdemi elolvasás vagy lead |
| article_engaged | Legalább 45 másodperc látható oldalidő és legalább 50% cikkmélység | Teljes elolvasás vagy vásárlási szándék |
| blog_cta_click | Kalkulátor-, gép- vagy szervizútvonalra kattintás | Sikeres űrlapbeküldés |
| blog_next_article_click | A kiemelt következő cikk választása | Konverzió |
| generate_lead | Az alkalmazás már sikeresen mentette a beküldést, valódi azonosítóval | Megrendelés vagy lezárt értékesítés |

A belső hivatkozások `blog` és `blog_action` paramétert használnak. Nem írják át az eredeti UTM-et vagy a hirdetési kattintásazonosítót. A cikkazonosító és a döntési szakasz csak engedélyezett katalógusból származhat; az utóbbit a rendszer vezeti le. A session a meglévő 30 perces inaktivitási szabályt követi. Hozzájárulás hiányában nincs blogesemény-küldés és nincs eltárolt cikkattribúció.

Az engedélyezett forrásmezők (`blogSlug`, `blogStage`, `blogAction`) a kalkulációs és ajánlatkérési adatokkal megmaradnak, a CSV-exportokban is szerepelnek. A belső értesítés a cikk témáját/azonosítóját segíti visszakeresni; új utánkövető levélsorozat nem indul ettől.

## Minőségellenőrzés és későbbi értékelés

Az automatikus, függőségtelepítés nélkül futtatható célzott ellenőrzés: `node scripts/verify-blog-conversion.mjs`. Ez a tényleges adat- és mérési függvényeket vizsgálja: tartalmi lefedettség, linkcélok, olvasási út, UTM-megőrzés, hozzájárulás, lejárat, események és sikeres beküldés egyszeri mérése. A Next.js/TypeScript összeállítást a Vercel előnézeti kiadása ellenőrzi. Az éles publikáció előtt a cikkeket, mobilnézetet és a továbbhaladási pontokat is vissza kell nézni.

Valódi javulásról csak tényleges forgalomból lehet következtetni. Cikkenként a megtekintés → érdemi aktivitás → kalkuláció/ajánlatkérő → sikeres beküldés → minősített megkeresés láncot kell értékelni. A céges relevancia és a minőség fontosabb a puszta kattintásszámnál. Kevés eseményből, eltérő kampányforgalomból vagy megváltozott mérési hozzájárulásból nem szabad biztos győztest hirdetni.

## Források és folytatás

- A jelenlegi program alapja a GitHub `Foldvari88/csavarkompresszor` főága; a régi teljes forrás- és Git-archívum Drive-on megmarad.
- Szakmai alap: U.S. Department of Energy sűrítettlevegő-témalapok, Compressed Air Challenge, Natural Resources Canada. A pontos hivatkozások a cikkekben és a `src/lib/blog/types.ts` fájlban vannak.
- A keresési vizsgálat szándékokat azonosít; ellenőrzött kulcsszóvolumen vagy garantált helyezés nem áll rendelkezésre.
- A kis D: munkapéldányból a módosított/új források, a Git-változtatás és az ellenőrzési eredmény kerülnek a BMTender Drive projektmappájába. Függőséget, cache-t és teljes nagy Git-mentést nem másolunk újra.
