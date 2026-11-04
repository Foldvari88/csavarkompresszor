# Napi tudástárcikk – iparikalkulator.hu

Időzítés: minden nap 08:00, Europe/Budapest. A felhasználó napi egy új, éles tudástárcikket kért releváns Google-keresőkifejezések alapján, kalkulátorra vezető CTA-val. A publikálás engedélyezett; a napi cikkhez nem kell új jóváhagyás.

## Egy futás eredménye

Pontosan egy, aznapra dátumozott, egyedi és ellenőrzött cikk a https://www.iparikalkulator.hu/blog alatt. A siker feltétele a tényleges éles URL, a tartalom és a CTA működésének visszaellenőrzése. Egy mentett piszkozat vagy Git-push önmagában nem jelent sikeres publikálást. A felhasználó külön kérésére kézzel létrehozott többcikkes csomag önálló feladat, nem a napi futás visszamenőleges pótlása. A napi automatizáció ne készítse el újra az ezekkel már lefedett témákat.

## Kutatás és témaválasztás

Először olvasd be a jelenlegi főág cikklistáját és a legutóbbi publikálási naplót. Az azonos napi újrapróbálás ugyanazt a cikket fejezze be; ne hozzon létre újabb bejegyzést. A már éles, aznapi cikket ellenőrizd, majd állj meg. Elmulasztott napokból ne készíts egyszerre több cikket.

Vizsgálj meg néhány releváns magyar Google-keresést, a látható találatok szándékát és a kapcsolódó kérdéseket. Ha hozzáférhető, használd a Search Console tényleges lekérdezéseit és a GA4 cikkadatait is. Ezek hiánya nem akadályozza a nyilvános keresésen alapuló témaválasztást. Ellenőrzött mérőszám nélkül ne találj ki keresési volument, CPC-t, rangsorolást vagy forgalmi eredményt.

Válassz egy elsődleges és néhány természetesen kapcsolódó kifejezést. A cél ipari B2B döntéshozó: cégvezető, műszaki vezető, karbantartó vagy beszerző. Váltogasd az iparági felhasználást, az energia- és rendszerproblémákat, az összehasonlítást és az ajánlat-előkészítést. Az új téma más kérdésre válaszoljon, mint a meglévő cikkek; ne készíts azonos szándékú, enyhén átírt másolatot. A meglévő cikkre belső linkkel építs.

A műszaki állításokat gyártói dokumentációval, hivatalos szakmai útmutatóval vagy más elsődleges forrással ellenőrizd. A versenytársak szövegét ne másold. Az ismertetett üzemi helyzet és számítás legyen egyértelműen feltételezett, ha nem igazolt ügyféladat.

## Tartalom és továbbhaladás

Készíts jellemzően 900–1300 szavas, természetes magyar cikket; a szükséges érdemi tartalom fontosabb a szóhossznál. Legyen saját keresési címe, rövid leírása, erős bevezetője, rövid válasza, legalább hat érdemi fejezete, hárompontos előkészítő listája és négy valódi kérdést megválaszoló GYIK-ja. A vásárló a saját üzemi adataival tudjon továbbhaladni. Kitalált referencia, megtakarítási garancia, sürgető akció vagy nem igazolt ajánlati ígéret nem szerepelhet benne.

A fő CTA felirata mindenhol „Tovább a kalkulátorra”. A környező szöveg az adott témára és a saját adatokkal elérhető következő lépésre szóljon. A cikk használja a meglévő `CalculatorLink`/`BlogCta` elemeket és a `contentDestination` által képzett belső URL-t, így a téma megmarad a kalkulátornál. A döntésre kész olvasó kapjon a témához illő gép- vagy szervizajánlatkérési lehetőséget. Ne változtasd meg a kalkulátor képleteit vagy a hozzájárulásokat a napi tartalommunka részeként.

## Megvalósítás és publikálás

Forrás: https://github.com/Foldvari88/csavarkompresszor, főág `main`; élesítés: a meglévő Vercel-kapcsolat. A kis munkapéldány jelenleg `D:\ChatGPT\kompresszor-blog-konverzio\repo`. Frissíts a tényleges főágról, és vizsgáld meg a helyi módosításokat. Más munkáját őrizd meg; ne force-pusholj és ne végezz általános takarító resetet. Használj dátumozott `codex/` ágat.

Az új cikkhez frissítsd együtt a `src/lib/blog/posts.ts`, `src/lib/blog/journeys.ts` és `src/lib/content-context.ts` katalógusait. A meglévő általános iparági útmutatók tartalma és döntési szövege a `src/lib/blog/industry-guides.ts` fájlban van, amelyet a cikk- és továbbhaladási katalógus is beolvas. A napi új cikk saját megjelenési dátummal kerüljön a katalógusba; a kézi iparági csomag rögzített dátumát ne örökölje. Új szakmai hivatkozás a `src/lib/blog/types.ts` forráskatalógusába kerülhet. A kapcsolódó és következő cikk csak létező URL legyen, a továbbhaladás vezessen döntési cikkhez vagy ajánlatkéréshez. A megjelenési és frissítési dátum legyen valós, Europe/Budapest szerinti nap. A lista új cikket előre sorol, a számláló és az oldaltérkép automatikus.

Futtasd a `node scripts/verify-blog-conversion.mjs` ellenőrzést. A meglévő függőségekkel a szerveroldali sémák is vizsgálhatók; csak az ellenőrzés kedvéért ne telepíts nagy függőségcsomagot. A Vercel előnézeti összeállításának sikeresnek kell lennie az éles főági frissítés előtt. Ha a főág közben változott, őrizd meg és illeszd hozzá a változtatást. A meglévő Git-hitelesítést használd; titkot ne írj naplóba.

Élesítés után ellenőrizd a cikk HTTP-válaszát, az új címet, a kanonikus URL-t, a strukturált dátumokat, az indexben való megjelenést, az oldaltérképet és a kalkulátorgomb célját. Ha a böngésző működik, kattints a cikk fő CTA-jára és nézd meg a téma megmaradását. Kliensoldali problémát javíts; valós leadet vagy ügyfélnek szóló tesztlevelet ne hozz létre. Egy önálló böngészőeszköz-hiba mellett az elvégzett HTTP- és forrásellenőrzést pontosan különítsd el a nem elvégzett próbától.

## Mentés, napló és hibakezelés

A BMTender (`info@bmtender.hu`) Drive projektmappája: https://drive.google.com/drive/folders/1vqIDhE529A61iElEdKjzxGKp9VpHSsq5 . Ide kerüljön dátumonként a cikk szerkeszthető tartalma vagy kis forrásváltozása és a publikálási napló. A napló tartalmazza a napot, kulcsszót, keresési bizonyítékot, választási indokot, forrásokat, slugot, Git-verziót, éles URL-t és az ellenőrzés eredményét. A feltöltést olvasd vissza vagy ellenőrizd a metaadatokat. Nagy Git-archívumot, függőséget és cache-t ne másolj újra. Új helyi köztes fájl csak a `D:\ChatGPT` feladatmappájában készülhet; a C: mappákat és a meglévő Drive-junctionöket őrizd meg.

Ha a forrás, hitelesítés, kutatás vagy élesítés nem érhető el, őrizd meg a már elkészült munkát a Drive-on és nevezd meg a konkrét akadályt. Ne írj sikeres publikálást egy nem éles cikkre. Az újrapróbálás ugyanahhoz a napi rekordhoz és cikkhez kapcsolódjon. Az eredményjelentés legyen rövid: cím, elsődleges kulcsszó, éles link és az ellenőrzés állapota.

## Első kézi próba

2026. november 4.: `csavarkompresszor-cnc-muhelybe`, elsődleges kifejezés: „kompresszor CNC géphez”. A magyar Google-találatok között kereskedelmi gép- és rendszerkínálat is megjelenik, a szándék kevert; a cikk ezért pontosan a forgácsoló CNC-műhely levegőellátását határolja le. Volumenadat nincs igazolva. Szakmai alap: Haas VF-4SS előtelepítési útmutató, DOE nyomásstabilitási, levegőminőségi és energiaköltség-témalapok. A 1041 szavas próbacikk a meglévő, témamegőrző kalkulátor- és ajánlatkérési útvonalat használja.
