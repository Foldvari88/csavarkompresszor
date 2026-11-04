import type { BlogArticle, BlogJourney, BlogSection } from "./types";
import type { BlogSlug } from "../content-context";

type IndustryGuide = {
  label: string;
  keyword: string;
  takeaways: string[];
  sections: BlogSection[];
  faq: { question: string; answer: string }[];
  relatedSlugs: string[];
  journey: BlogJourney;
};

export const industryGuideDefinitions = {
  "csavarkompresszor-nyomdaba": {
    label: "Nyomda", keyword: "kompresszor nyomdába",
    takeaways: ["A sűrített levegő és a nyomdagép vákuumellátása külön műszaki feladat.", "Az átállás, a termelés és a kötészeti csúcs eltérő igényprofilt adhat.", "A gépár mellett az egész levegőellátási csomag éves költségét hasonlítsa össze."],
    sections: [
      { id: "nyomdai-felhasznalasi-pontok", title: "1. Melyik géphez milyen levegő kell?", paragraphs: [
        "Írja össze a nyomó-, hajtogató-, vágó- és egyéb kötészeti gépek ellátási pontjait. A gépkönyvből külön kerüljön a listára a nyomás, a levegőmennyiség és a tisztaság követelménye. Az, hogy egy berendezés papírt mozgat, még nem mondja meg, milyen levegőellátásra van szüksége.",
        "A Becker nyomdai megoldásainál például a lap megfogásához vákuum, a lapok szétválasztásához nyomólevegő is szerepet kap. Ezért az ajánlatban pontosan nevezze meg a feladatot: központi sűrített levegőt, kis nyomáskülönbségű fúvólevegőt vagy vákuumot vizsgál. Egy központi csavarkompresszor előkalkulációját nem helyes automatikusan a nyomdagép összes légtechnikai feladatára kiterjeszteni."
      ], sourceIds: ["printingAir"] },
      { id: "nyomdai-muszakprofil", title: "2. A nyomásesést a konkrét termelési helyzettel együtt rögzítse", paragraphs: [
        "Más lehet az igény, amikor egyetlen gép dolgozik hosszú sorozaton, és amikor a kötészet több munkahelye egyszerre indul. A gépkezelői panasz mellé írja oda a munkafázist, az érintett gépet és az időpontot. A műszakonkénti termelési rendből készítsen áttekintést az egyidejű működésről.",
        "A rövid igénycsúcs, a hálózati szűkület és a tartós kapacitáshiány eltérő beavatkozást kíván. A kompresszorházban és a panaszos fogyasztónál egy időben mért nyomás segíti a kérdés pontosítását. Egy magasabb központi beállítás átmenetileg elfedheti a helyi problémát; az ajánlatkérésben ezért a tünetet is adja meg, ne csak a kívánt nagyobb gépet."
      ], sourceIds: ["pressure"] },
      { id: "nyomdai-levegominoseg", title: "3. A nyomdagép és a környezet előírása adja a minőségi célt", paragraphs: [
        "A levegő-előkészítés tartalmát a gép gyártói előírása és az adott felhasználás alapján kérje. Ne általános nyomdaipari tisztasági osztályból induljon ki. Más kérdést vethet fel a gép működtető levegője és egy olyan alkalmazás, ahol az áramlás a feldolgozott anyag közelében jelenik meg.",
        "A teljes ajánlatból legyen látható a szárítás, a szűrés, a kondenzátumkezelés és ezek karbantartása. Kérjen meghatározott üzemi feltételekre szóló teljesítményadatot. Így nem csupán két kompresszor árát, hanem ugyanannak a nyomdai feladatnak a teljes ellátását tudja összevetni. A pontos követelményhez a gépkezelőt és a karbantartást is érdemes bevonni."
      ], sourceIds: ["quality"] },
      { id: "nyomdai-eves-koltseg", title: "4. Egy vagy két műszak: a használati időt is tegye az ár mellé", paragraphs: [
        "Szemléltetésként legyen egy rendszer átlagos felvétele 12 kW. Évi 3 000 órával és példaként választott 70 Ft/kWh-val az energiasor 2,52 millió Ft; 6 000 órával 5,04 millió Ft. Ez a használati idő hatása, nem gépcsere-megtakarítás, és a 12 kW nem nyomdákra ajánlott általános gépméret.",
        "A példából a döntési módszer vihető tovább: saját üzemórát, saját energiaárat és ellenőrizhető teljesítményadatot használjon. Ha a következő évre második műszakot tervez, azt külön forgatókönyvként rögzítse. A kalkulátor a jelenlegi gépadatokból energiaoldali előbecslést ad; a vákuum- vagy speciális fúvólevegő-ellátás értékelését külön kell elvégezni."
      ], formula: "12 kW × 3 000 óra × 70 Ft/kWh = 2 520 000 Ft/év" },
      { id: "nyomdai-ajanlatkeres", title: "5. Így kérjen a saját nyomdájára szóló ajánlatot", paragraphs: [
        "Küldje el az ellátandó gépek listáját, a meglévő kompresszor adatait és az ismert panaszokat. Jelezze, ha új nyomógép vagy kötészeti berendezés érkezik. Az indulás dátuma, a telepítés helye és a karbantartás alatti ellátási elvárás az ajánlat része legyen, ne utólag felmerülő kiegészítés.",
        "Az ajánlatadóval tisztázza, mely gép adata gyártói előírás, melyik becslés, és hol kell még mérni. A beszerzési döntéshez a telepített árat, az energiaigényt és a szerviz tartalmát azonos feladatra hasonlítsa össze. A saját kalkulációt vigye tovább az egyeztetésre, a hiányzó műszaki részleteket pedig jelölje nyitott kérdésként."
      ] }
    ],
    faq: [
      { question: "A nyomógép saját levegőellátó egysége kiváltható központi kompresszorral?", answer: "Ez a gyártói rendszer és az ellátandó funkció kérdése. A vákuum, a kis nyomáskülönbségű fúvólevegő és a központi sűrített levegő igényét külön kell azonosítani; csak ezután dönthető el a kiváltás műszaki lehetősége." },
      { question: "Elindulhat az egyeztetés teljes gépkönyv nélkül?", answer: "Igen. A géptípusok, a jelenlegi rendszer és a tünet rövid leírása használható kezdet. A hiányzó ellátási előírásokat a végleges kiválasztás előtt a gyártói dokumentációból vagy műszaki egyeztetéssel pontosítani kell." }
    ], relatedSlugs: ["fix-vagy-vsd-csavarkompresszor", "kompresszor-uzemi-nyomas-energiakoltseg", "csavarkompresszor-teljes-elettartam-koltseg"],
    journey: {
      title: "Kompresszor nyomdába: gépigény, üzembiztonság és éves költség", seoTitle: "Kompresszor nyomdába: méretezés és energiaköltség",
      description: "Nyomdai kompresszort választ? Válassza külön a sűrített levegőt és a vákuumot, majd saját műszakrenddel készítse elő a gépajánlatot.",
      stage: "comparison", audience: ["owner", "technical", "procurement"],
      intro: ["A nyomógép mellett elindul a kötészet, és az egyik munkahelyen bizonytalanná válik a levegőellátás. Közben a kompresszor sokat jár, de a számlából nem derül ki, mihez tartozik a költség. Nyomdában az új gép kiválasztása a felhasználási pontok tisztázásával kezdődik.", "Ez az útmutató a központi sűrítettlevegő-ellátás ajánlatkérését segíti. Megmutatja, mely adatokat gyűjtse össze a gépekhez, hogyan írja le a termelési profilt, és miként kapcsolja az éves energiaköltséget a beruházási kérdéshez."],
      quickAnswer: "Nyomdai kompresszorhoz a gépenkénti nyomás-, légszállítási és minőségi követelmény, az egyidejű használat és a műszakrend szükséges. A nyomógép vákuum- és fúvólevegős funkcióit külön azonosítsa; a névleges kW és a tartályméret önmagában nem elég a kiválasztáshoz.",
      outcome: "A nyomda géplistájából és munkarendjéből használható ajánlatkérési alapot készíthet.",
      decisionSection: { id: "nyomdai-beruhazasi-helyzet", title: "Új kötészeti gép érkezik? Az egész műszakot nézze meg", paragraphs: [
        "Egy új berendezés nem feltétlenül ugyanabban az időben kér levegőt, mint a meglévők. Egy szemléltető nyomdai bővítésnél ezért először a várható munkarendet és az egyidejűséget érdemes a jelenlegi géplistához adni. Ez üzemi feladatleírás, nem automatikus indok egy nagyobb kompresszorra.",
        "A beruházási összefoglalóban válassza külön a termelés biztos ellátását, a meglévő panasz javítását és az energiahatás vizsgálatát. Az ajánlatban legyen egyértelmű, mely tétel melyik kérdést oldja meg. A számok mellé kerüljenek a feltételezések és az adatforrások is.",
        "Ha az igény már körvonalazódott, a kalkulációval és a géplistával indítsa el a szakmai egyeztetést. Így a beszélgetés nem általános kompresszorárakról, hanem a nyomda következő termelési időszakáról szólhat."
      ] },
      checklist: ["Nyomó- és kötészeti gépek, ellátási funkciók, gyártói követelmények.", "Műszakrend, egyidejű indítások és a nyomáspanasz időpontja.", "Meglévő kompresszor, saját energiaár és tervezett bővítés."],
      objections: [
        { question: "A nagyobb teljesítmény biztosan megoldja a nyomdai nyomásesést?", answer: "Egy helyi szűkület vagy rosszul leírt ellátási feladat esetén nem feltétlenül. A gépházi és fogyasztói állapot összevetése segít eldönteni, hogy kapacitás, hálózat vagy szabályozás kérdésével kell foglalkozni." },
        { question: "Változó rendelésállománnyal hogyan számoljak?", answer: "Készítsen külön visszafogott és erősebb termelési forgatókönyvet. A műszakok és az üzemóra változását dokumentálja; az ajánlatok energiaértékelése mindkét használati helyzetre elkészíthető." }
      ],
      midCta: { title: "A következő nyomdai döntéshez legyen saját éves költsége", text: "A jelenlegi kompresszor adataival, a nyomda üzemórájával és saját energiaárával indíthatja az előkalkulációt." },
      finalCta: { title: "Számoljon a saját nyomdájával, majd pontosítsa az ajánlati feladatot", text: "Készítsen energiaoldali előbecslést, és a géplistával együtt vigye tovább a szakmai egyeztetésre." },
      offer: "replacement", offerLabel: "Nyomdai felhasználásra kérek gépajánlatot", offerText: "Adja meg a nyomda gépeit és a tervezett üzemet. Jelezze külön, ha vákuum- vagy speciális fúvólevegős feladat is érintett.",
      nextSlug: "csavarkompresszor-teljes-elettartam-koltseg", nextReason: "A nyomdai gépigény után az ajánlatok teljes költsége segít a vételárat és az éves üzemeltetést együtt mérlegelni."
    }
  },
  "csavarkompresszor-autoszervizbe": {
    label: "Autószerviz", keyword: "kompresszor autószervizbe",
    takeaways: ["Az egyidejű szerszámhasználat fontosabb adat, mint a szerelőállások száma önmagában.", "A gumiszezon és a normál műhelynap eltérő terhelést jelenthet.", "A szerszámok és a fényezés levegőellátási igényét külön írja le."],
    sections: [
      { id: "szerviz-szerszamlista", title: "1. A szerszámoktól induljon, ne a tartály literétől", paragraphs: [
        "Gyűjtse össze az ütvecsavarozó, a csiszoló, a gumiabroncs-kezelő és minden további levegős fogyasztó gyártói adatát. A működési nyomás, a levegőigény és a használat időaránya együtt számít. Csak azt a műhelyberendezést vegye a listába, amely ténylegesen sűrített levegőt használ.",
        "A Chicago Pneumatic méretezési útmutatója is a fogyasztók nyomását, levegőigényét és az egyidejű használatot emeli ki. A szerelők számából legfeljebb első tájékozódó kérdés készülhet, végleges gépválasztás nem. A rövid ideig működő szerszám és a hosszan járó fogyasztó igényét eltérően kell az üzemi profilba rendezni."
      ], sourceIds: ["vehicleAir"] },
      { id: "szerviz-gumiszezon", title: "2. A gumiszezon csúcsát és az átlagos napot is mutassa meg", paragraphs: [
        "Egy csendes délelőtt és egy telített kerékcsere-időszak között nagy különbség lehet az egyidejű működésben. Írja le, mely fogyasztók dolgoznak együtt, és mennyi ideig tart az erős terhelés. A tartós igényt különítse el az alkalmi, rövid csúcstól.",
        "Ha csak a távoli szerelőállásnál esik a nyomás, a tömlő, a gyorscsatlakozó és a helyi levegő-előkészítés vizsgálata is indokolt. Ha a központi nyomás is tartósan csökken, a teljes ellátási kapacitás kérdése kerül elő. A panasz rögzítése így megóvhat attól, hogy egy hálózati hibára kizárólag nagyobb gép legyen a válasz."
      ], sourceIds: ["pressure"] },
      { id: "szerviz-fenyezes-minoseg", title: "3. Van fényezési feladat? Kerüljön külön sor az ajánlatba", paragraphs: [
        "A fényezéshez használt levegő követelményét a pisztoly és a technológia előírása alapján kérje. Ne feltételezze, hogy a levegős kéziszerszám ellátására kialakított ág változtatás nélkül megfelelő lesz a felületkezeléshez is. A műhely által használt konkrét anyagok és gépek adatai szükségesek a pontosításhoz.",
        "A gépajánlat mellett legyen látható a szükséges szárítás, szűrés és kondenzátumkezelés tartalma. Kérdezzen rá az üzemi feltételekre és a karbantartási feladatokra. A választásban a teljes műhelyrendszer számít; a cikk és az energiakalkulátor nem helyettesíti a fényezési technológia vagy a munkakörnyezet szakmai megtervezését."
      ], sourceIds: ["quality"] },
      { id: "szerviz-eves-forint", title: "4. Kisebb műhelyben is a saját üzemóra adja a forintértéket", paragraphs: [
        "Tegyük fel, hogy két, azonos feladatot ellátó megoldás között 1 kW az igazolt átlagos villamos különbség. Évi 1 800 üzemórával és szemléltető 70 Ft/kWh-val ez 126 000 Ft/év. A példa nem javasolt gépméret, és nem a szerszámok légfogyasztásából közvetlenül képzett megtakarítás.",
        "A saját számításnál ne a műhely nyitvatartását másolja automatikusan az üzemórához. Ellenőrizze a kompresszor működését, a szüneteket és a munkaidőn túli járást is. A kalkulátor előbecslése jó alap lehet az ajánlatkéréshez, a telepített ár és a szerviz tartalma pedig a teljes beruházási döntéshez szükséges."
      ], formula: "1 kW × 1 800 óra/év × 70 Ft/kWh = 126 000 Ft/év" },
      { id: "szerviz-ajanlatkeresi-adatok", title: "5. A következő szezonra szóljon a gépajánlat", paragraphs: [
        "Az ajánlatkérésben írja le a szerelőállásokat, a fogyasztókat, az egyidejűséget és a várható bővítést. Jelezze, ha a régi kompresszor tartaléknak megmaradna. Külön kérdés legyen, mennyi ideig maradhat a műhely levegő nélkül karbantartáskor, és hol helyezhető el a berendezés.",
        "A hiányzó műszaki adat nem akadálya az első egyeztetésnek. A meglévő gép márkája, kora és névleges teljesítménye, valamint egy érthető panaszleírás már kiindulópont. A végleges ajánlat előtt a légszállítást, a nyomást és a levegőminőséget pontosítani kell; a puszta liter- vagy kW-összehasonlítás ehhez kevés."
      ] }
    ],
    faq: [
      { question: "Elég megadni, hány szerelő dolgozik a műhelyben?", answer: "Hasznos háttéradat, de a fogyasztókat és azok egyidejű használatát is ismerni kell. Két azonos létszámú autószerviz eltérő levegőigényt mutathat a szerszámpark és a munkák időtartama miatt." },
      { question: "Megtarthatom a régi kompresszort tartaléknak?", answer: "Ez műszakilag vizsgálandó lehetőség. Már az ajánlatkérésben jelezze a tervet, mert a gépek állapota, csatlakozása, vezérlése és a karbantartási rend együtt határozza meg a használható tartalékellátást." }
    ], relatedSlugs: ["csavarkompresszor-meretezes-hibak", "suritett-levego-szivargas-koltsege", "kompresszor-kalkulator-adatok"],
    journey: {
      title: "Kompresszor autószervizbe: szerszámigény, gumiszezon és költség", seoTitle: "Kompresszor autószervizbe: méretezés és éves költség",
      description: "Autószervizhez választ kompresszort? Szerszámigény, egyidejű használat, gumiszezon és fényezés: így készítse elő a saját gépajánlatát.",
      stage: "comparison", audience: ["owner", "technical"],
      intro: ["A kerékcsere pörögne, de az egyik állásnál elfogy a levegő. Kézenfekvő egy nagyobb tartályt vagy erősebb kompresszort keresni. Az autószerviz jó ajánlatkérési adata azonban az, hogy melyik szerszám, mikor és milyen más fogyasztókkal együtt nem kap megfelelő ellátást.", "Ez a cikk műhelytulajdonosoknak és a berendezésekért felelős kollégáknak mutatja meg a kiválasztás menetét. A saját szerszámlistából és üzemidőből indulunk, majd a szezonális csúcsot és az éves költséget is a döntés mellé tesszük."],
      quickAnswer: "Autószervizbe a szerszámok előírt nyomása, levegőigénye, működési ideje és egyidejű használata alapján válasszon ellátást. A tartály a tárolást segíti; a tartós fogyasztáshoz megfelelő termelőkapacitás is kell. A fényezési feladatot és a szezonális csúcsot külön rögzítse.",
      outcome: "A műhely munkarendjéből és szerszámlistájából konkrét, összehasonlítható gépajánlatkérést állíthat össze.",
      decisionSection: { id: "szerviz-bovitesi-dontes", title: "Még egy szerelőállás nyílik: mitől lesz használható a bővítési terv?", paragraphs: [
        "Egy szemléltető műhelybővítésnél az új állásra tervezett feladatokat és a meglévőkkel közös használati időt kell először leírni. A csúcsnapok száma és a szezonon kívüli terhelés egyaránt fontos. Ezek nélkül könnyű csak a legerősebb hét alapján gépet választani.",
        "A vezetői döntési lap külön mutassa a megbízható ellátás igényét, a telepített ajánlati árat és a várható éves energiahatást. Ha a cél elsősorban a termelési kapacitás bővítése, ezt ne nevezze kizárólag megtakarítási beruházásnak. A két üzleti indokot a saját adataik támasztják alá.",
        "A kalkuláció után az ajánlatkérőn írja le a műhely helyzetét és a tervezett indulást. A szerszámtípusokat és a még bizonytalan bemeneteket is megadhatja; ez jobb kiindulópont, mint egy általános nagyobb kompresszorra szóló kérés."
      ] },
      checklist: ["Levegős szerszámok, gyártói adatok és egyidejű használat.", "Gumiszezon, normál üzem, fényezés és a panasz pontos helye.", "Régi gép, saját üzemóra és a következő műhelybővítés."],
      objections: [
        { question: "Csavarkompresszor kell minden autószerviznek?", answer: "A megfelelő megoldást a tartós igény, a működési rend, a gyártói terhelhetőség és az éves költség együtt dönti el. A szerviz megnevezése önmagában nem elég egy technológia vagy gépméret kijelöléséhez." },
        { question: "Ha nagyobb a tartály, tovább használható minden szerszám?", answer: "A tárolt levegő egy meghatározott idejű igényt segíthet kiszolgálni. Ha a tartós fogyasztás meghaladja a termelést, a rendszer később is kimerül. A tartály és a kompresszor szerepét együtt kell méretezni." }
      ],
      midCta: { title: "Nézze meg, mennyit érhet az energiahatás a saját műhelyében", text: "A jelenlegi géphez adja meg a reális üzemórát és a saját energiaárat. A szezonon kívüli működésre is készíthet külön változatot." },
      finalCta: { title: "A következő szezon előtt legyen saját kalkulációja és műhelyre szóló ajánlata", text: "Készítse el az energiaoldali előbecslést, majd a szerszámlistával és a bővítési tervvel folytassa az egyeztetést." },
      offer: "replacement", offerLabel: "Autószervizhez kérek gépajánlatot", offerText: "Írja le a műhely méretét, a levegős szerszámokat és az egyidejű használatot. A fényezést és a gumiszezon csúcsát külön is jelezheti.",
      nextSlug: "kompresszor-kalkulator-adatok", nextReason: "A műhelyigény után ez az útmutató segít megtalálni az előkalkulációhoz szükséges gépadatokat és elindítani a saját számítást."
    }
  },
  "csavarkompresszor-elelmiszeriparba": {
    label: "Élelmiszeripar", keyword: "élelmiszeripari kompresszor",
    takeaways: ["A termékkel érintkező és a gépet működtető levegőt külön térképezze fel.", "A szükséges levegőminőséget a felhasználás és az üzem minőségi követelménye határozza meg.", "Energiaköltséget azonos, igazolt feladatot teljesítő megoldások között hasonlítson össze."],
    sections: [
      { id: "elelmiszer-levego-utja", title: "1. Hol találkozik a levegő a termékkel?", paragraphs: [
        "Kezdje a felhasználási pontok térképével: melyik ág működtet munkahengert, melyik végez fúvatást, és hol érintkezhet a levegő a termékkel vagy annak környezetével. Az egy helyiségben álló gépekhez sem feltétlenül ugyanaz a követelmény tartozik. A csomagolósor és az előkészítés levegőigényét a tényleges művelet alapján írja le.",
        "A Parker szakmai anyaga a víz, az olaj, a részecskék és a mikrobiológiai szennyeződés lehetséges szerepére is kitér. Az ajánlatkérésben ezért a minőségért felelős kollégával közösen jelölje az érintkezés jellegét és a vizsgálandó kockázatot. A kompresszor helye helyett a levegő útját és felhasználását érdemes végigkövetni."
      ], sourceIds: ["foodAir"] },
      { id: "elelmiszer-minosegi-specifikacio", title: "2. Az olajmentes megnevezésből még nem áll össze a követelmény", paragraphs: [
        "Az ajánlat tartalmazza a szükséges részecske-, víz- és olajkövetelményt, valamint az alkalmazásból adódó további ellenőrzést. A célértékeket az üzem felelősei és a műszaki szállító tisztázzák. Egyetlen, minden élelmiszeripari felhasználásra automatikusan megfelelő tisztasági osztály helyett a saját felhasználási pontokra készüljön specifikáció.",
        "Az Atlas Copco minőségi útmutatója külön tárgyalja a szennyeződési kategóriákat. A Class 0 megjelölés nem minden szennyező teljes hiányának ígérete; a hozzá tartozó határértéket is ismerni kell. A gép technológiáját, a szárítást, a szűrést és a csőhálózatot együtt vizsgálja. Az olajmentes kompresszor megnevezése önmagában nem igazolja a felhasználási pont teljes levegőminőségét."
      ], sourceIds: ["airPurity"] },
      { id: "elelmiszer-ellenorzes-es-uzem", title: "3. Már az ajánlatban látszódjon az ellenőrzés és a karbantartás", paragraphs: [
        "Rögzítse, hol és milyen üzemi állapotban kell a követelményt teljesíteni. Kérdezzen rá a mintavétel vagy mérés helyére, a dokumentálásra és az átadás feltételeire. Az ellenőrzési módszert és gyakoriságot az alkalmazáshoz kell meghatározni; ezt egy általános energiakalkuláció nem tudja helyettesíteni.",
        "A minőség fenntartásához a szűrőcsere, a szárító és a hálózat állapota is tartozik. Az ajánlatkérésben jelenjen meg a karbantartási ablak és a tartalékellátás elvárása. Tisztázza, ki engedi vissza a rendszert termelésbe egy beavatkozás után, és milyen dokumentumot vár az üzem. Így a szolgáltatási csomag tartalma is összehasonlíthatóvá válik."
      ], sourceIds: ["foodAir", "airPurity"] },
      { id: "elelmiszer-energiaosszevetes", title: "4. Azonos minőségi feladat mellé kerüljön az energiasor", paragraphs: [
        "Ha két megfelelően specifikált megoldás teljes rendszerének átlagos villamos felvétele között igazoltan 1 kW a különbség, évi 6 000 órával és szemléltető 70 Ft/kWh-val 420 000 Ft az éves eltérés. Ez feltételezett számítás, nem egy adott üzemre ígért megtakarítás. A szárítás és más segédberendezések energiaigényét is vegye figyelembe.",
        "A költségértékelés csak akkor értelmes, ha a két megoldás ugyanazt a kapacitási és minőségi feladatot teljesíti. Az alacsonyabb energiaérték nem indok egy szükséges tisztasági feltétel elhagyására. A kalkulátorban saját gépadatokkal készítsen előbecslést, a végleges összevetéshez pedig kérjen az üzemi feltételekre vonatkozó teljes rendszeradatot."
      ], formula: "1 kW × 6 000 óra/év × 70 Ft/kWh = 420 000 Ft/év" },
      { id: "elelmiszer-ajanlatlap", title: "5. Az első egyeztetéshez ezeket készítse össze", paragraphs: [
        "Az ajánlatkérési csomagba kerüljön a géplistán kívül a felhasználási pontok leírása, a rendelkezésre álló minőségi előírás, a szükséges nyomás és légszállítás. Mutassa meg a műszakok rendjét és a tervezett új termék vagy gépsor indulását. A meglévő dokumentáció és a bizonytalan pontok külön listája sok felesleges körkérdést megelőzhet.",
        "Ha a célérték még nincs meghatározva, ezt írja le nyíltan. Az első szakmai beszélgetés elindítható, de a végleges gépválasztást és a megfelelőség értékelését a tisztázott követelményekre kell alapozni. A kalkuláció mellé az ajánlatkérőben röviden adja meg, mi érintkezik a levegővel és melyik üzemi felelős tudja a minőségi feladatot pontosítani."
      ] }
    ],
    faq: [
      { question: "Az olajmentes kompresszor steril levegőt jelent?", answer: "A megnevezés önmagában nem bizonyít sterilitást vagy minden minőségi követelmény teljesítését. A felhasználás, a teljes előkészítő rendszer, a hálózat és a felhasználási pont ellenőrzése együtt szükséges a saját előírás értékeléséhez." },
      { question: "Kérhetek ajánlatot, ha még nincs minden minőségi adat meg?", answer: "Az egyeztetés megkezdhető a folyamat és az ismert követelmények leírásával. Jelölje a nyitott kérdéseket; a végleges specifikációhoz vonja be az üzem minőségért felelős kollégáját is." }
    ], relatedSlugs: ["suritett-levego-energiaaudit-elokeszites", "csavarkompresszor-teljes-elettartam-koltseg", "kompresszor-kalkulator-adatok"],
    journey: {
      title: "Élelmiszeripari kompresszor: levegőminőség és ajánlatkérési adatok", seoTitle: "Élelmiszeripari kompresszor: minőség és költség",
      description: "Élelmiszeripari kompresszorhoz készül ajánlatot kérni? Felhasználási pontok, levegőminőség, ellenőrzés és éves költség egy átgondolt döntéshez.",
      stage: "decision", audience: ["technical", "procurement", "owner"],
      intro: ["Új töltő- vagy csomagolósor érkezik, és a beszerzés kompresszorárat kér. Élelmiszeripari üzemben előbb azt érdemes tisztázni, mire és hol használják a levegőt. A gép működtetése és a termékkel érintkező alkalmazás eltérő követelményeket vethet fel.", "Az útmutató a minőségügyi, műszaki és beszerzési egyeztetést segíti. A felhasználásból vezetjük le az ajánlatkérési adatokat, majd megmutatjuk, hova illeszkedik az éves energiaoldali előbecslés a beruházási döntésben."],
      quickAnswer: "Élelmiszeripari kompresszorhoz először a felhasználási pontot, az érintkezés jellegét és az üzem által elvárt levegőminőséget rögzítse. A kompresszor és a levegő-előkészítés együttes ajánlatát kérje, ellenőrzési feltételekkel. Költséget azonos követelményt teljesítő megoldások között hasonlítson össze.",
      outcome: "A minőségi feladatot és az energiaköltséget egyértelműen el tudja választani, mégis közös ajánlatkérésben tudja kezelni.",
      decisionSection: { id: "elelmiszer-uj-sor", title: "Új csomagolósor indul: a kapacitás és a minőség együtt változhat", paragraphs: [
        "Egy feltételezett bővítésnél ne csak az új sor levegőmennyiségét adja hozzá a meglévő értékhez. Először az új felhasználási pontokat és az érintkezési helyzeteket nézze meg. Egy új fúvatási művelet más minőségi kérdést vethet fel, mint egy további pneumatikus mozgatóelem.",
        "A döntési anyag három önálló része legyen a rögzített követelmény, az ellátási és ellenőrzési megoldás, valamint a telepített ár és éves költség. A felelősök így ugyanarról a feladatról tudnak beszélni. Az általános élelmiszeripari alkalmasság helyett az adott folyamatra szóló vállalást kérje az ajánlatban.",
        "A saját energia-előbecslés után adja át a meglévő követelménylistát a szakmai egyeztetéshez. Ha valamelyik célérték még bizonytalan, maradjon jelölve, hogy tisztázás szükséges. A kalkulátor eredménye az üzleti előkészítést segíti, nem a termékbiztonsági megfelelőséget igazolja."
      ] },
      checklist: ["Felhasználási pontok és a termékkel való érintkezés leírása.", "Minőségügyi követelmények, ellenőrzés és átadás felelőse.", "Légigény, műszakrend, tartalékellátás és meglévő gépadatok."],
      objections: [
        { question: "Minden ághoz ugyanazt a levegőminőséget kell kérni?", answer: "A követelményt az adott alkalmazás és az üzem értékelése határozza meg. A működtető és az érintkezésben részt vevő ágakat először külön azonosítsa, majd szakmailag tisztázza a szükséges ellátást." },
        { question: "Elég a kompresszor adatlapját összevetni?", answer: "A felhasználási ponton elvárt minőséget és kapacitást a teljes rendszernek kell biztosítania. Az ajánlatból a levegő-előkészítés, a hálózat érintett része, az ellenőrzés és a karbantartás tartalma is derüljön ki." }
      ],
      midCta: { title: "Tegye a minőségi feladat mellé a saját éves energiasort", text: "A meglévő gép és a saját üzemóra adataival készítsen energiaoldali előbecslést. A minőségi követelményeket külön adja át az ajánlatkéréskor." },
      finalCta: { title: "Készítsen számítást, majd kérjen a saját élelmiszeripari feladatra ajánlatot", text: "A gépadatokból induló előbecslést egészítse ki a felhasználási pontok és a minőségügyi elvárások listájával." },
      offer: "replacement", offerLabel: "Élelmiszeripari feladatra kérek egyeztetést", offerText: "Írja le a folyamatot, a levegővel érintkező pontokat és a már ismert minőségi követelményeket. A még nyitott kérdéseket is jelezheti.",
      nextSlug: "kompresszor-kalkulator-adatok", nextReason: "A minőségi feladat tisztázása mellett a meglévő gép és az energia-előbecslés bemeneteit ezzel az adatgyűjtő útmutatóval készítheti elő."
    }
  },
  "csavarkompresszor-faipari-muhelybe": {
    label: "Faipar", keyword: "kompresszor asztalosműhelybe",
    takeaways: ["A gépek működtető levegőjét és a vákuumos leszorítást külön azonosítsa.", "Az élzáró, a szorítók és a kéziszerszámok egyidejű használata adja a műhely profilját.", "A felületkezelés követelménye és a telepítési környezet is kerüljön az ajánlatba."],
    sections: [
      { id: "faipar-geplista", title: "1. Melyik faipari gép fogyaszt ténylegesen sűrített levegőt?", paragraphs: [
        "Az asztalosműhely géplistáján külön jelölje a pneumatikus szorítókat, az élzáró gép ellátását és a levegős kéziszerszámokat. A gép teljes villamos teljesítményéből nem vezethető le a légfogyasztása. A gyártói előírásból a csatlakozási nyomást, a levegőigényt és a tisztasági követelményt kell megkeresni.",
        "A Kaeser faipari alkalmazásai között a gépek és szerszámok sűrítettlevegő-ellátása mellett külön szerepel a vákuumos feladat. Egy CNC-asztal vákuumos leszorítását ezért ne adja automatikusan a központi csavarkompresszorhoz tartozó fogyasztólistához. Az ajánlatadó akkor tud érdemben segíteni, ha a tényleges ellátási funkciót ismeri."
      ], sourceIds: ["woodAir"] },
      { id: "faipar-terheles", title: "2. A rövid csúcs és a hosszú munkanap más adatot kíván", paragraphs: [
        "A szakaszos szegezés és a folyamatosabban működő fogyasztó nem azonos terhelési mintát ad. Írja le, mi dolgozik együtt az élzáróval, és mikor indulnak egyszerre a munkahelyek. A készülő bútorok vagy elemek darabszáma önmagában még nem mutatja meg, mennyi levegőt használ a műhely.",
        "Ha egy távoli gépnél gyenge az ellátás, rögzítse a tünet idejét és a közben működő többi fogyasztót. A helyi csatlakozó, tömlő vagy hálózati ág állapotát a gépházi adatokkal együtt kell értékelni. A nyomás egyszerű megemelése helyett olyan ajánlatot kérjen, amely a panasz okát és a szükséges beavatkozást is megnevezi."
      ], sourceIds: ["pressure"] },
      { id: "faipar-felulet-es-telepites", title: "3. Felületkezelés és telepítési környezet: két külön kérdés", paragraphs: [
        "Ha a műhelyben felületkezeléshez is használnak levegőt, a technológia saját előírását külön gyűjtse össze. A nedvesség és a szennyeződés a felhasználástól függően befolyásolhatja a munkát. A megfelelő szárítás és szűrés feladatát a konkrét eszköz és folyamat alapján kell meghatározni, nem pusztán a faipar megnevezéséből.",
        "A telepítésnél mutassa meg a rendelkezésre álló helyet, a szellőzés és a karbantartási hozzáférés lehetőségét. A poros környezetet a helyszíni tervezés részeként jelezze. A beszállítóval tisztázza az elhelyezési és üzemeltetési feltételeket; a gép beszerzési ára mellett a szükséges kialakítás is legyen látható költségtétel."
      ], sourceIds: ["woodAir", "quality"] },
      { id: "faipar-muszak-es-koltseg", title: "4. A második műszak az éves költséget is átírja", paragraphs: [
        "Tegyük fel, hogy az érintett rendszer átlagosan 16 kW-ot vesz fel. Szemléltető 70 Ft/kWh és 3 000 éves üzemóra mellett 3,36 millió Ft az energiasor, 4 500 órával pedig 5,04 millió Ft. Ez az üzemidő változását mutatja; a példában szereplő teljesítmény nem általános faipari gépméret és nem mért ügyféleredmény.",
        "A saját döntéshez külön számoljon a jelenlegi és a tervezett használattal. Az ajánlatban kérdezzen rá, milyen terhelési profillal adták meg az energiaadatot, és mit tartalmaz a rendszerhatár. A kompresszor mellett a szárító, a szerviz és a telepítés tételeit is tegye az összehasonlításba, hogy a kedvező gépár teljes jelentését lássa."
      ], formula: "16 kW × 3 000 óra × 70 Ft/kWh = 3 360 000 Ft/év" },
      { id: "faipar-beszerzes", title: "5. A műhely következő évére kérjen megoldást", paragraphs: [
        "Az ajánlatkérésben szerepeljen, hogy új gép, új munkatárs vagy hosszabb nyitvatartás várható-e. A jelenlegi legnagyobb panasz és a bővítési terv külön kerüljön a listára. Egy létező hálózati probléma javítása és egy új fogyasztó kiszolgálása eltérő tétel lehet, még ha ugyanabban a beruházásban történnek is.",
        "Kérjen telepített árat, leírt levegő-előkészítést és egyértelmű szerviztartalmat. Tisztázza azt is, mi történik egy karbantartási napon a műhely ellátásával. A saját kalkulációt a géplistával együtt küldje tovább: ebből az ajánlatadó látja az üzleti nagyságrendet és a még tisztázandó műszaki részleteket is."
      ] }
    ],
    faq: [
      { question: "A faipari CNC vákuumos leszorítását is a kompresszor látja el?", answer: "A vákuum és a sűrített levegő külön ellátási feladat. A gép kialakítását és gyártói előírását kell megvizsgálni; a vákuumrendszer fogyasztását ne sorolja automatikusan a központi sűrítettlevegő-igényhez." },
      { question: "Mire elég a meglévő kompresszor adattáblája?", answer: "Az első energiaoldali előbecslés és az egyeztetés kiindulópontja lehet. Az új gép kiválasztásához a műhely tényleges fogyasztóit, egyidejű működését és a levegőminőségi követelményt is ismerni kell." }
    ], relatedSlugs: ["csavarkompresszor-meretezes-hibak", "suritett-levego-energiaaudit-elokeszites", "csavarkompresszor-teljes-elettartam-koltseg"],
    journey: {
      title: "Kompresszor asztalosműhelybe: gépigény, felületkezelés és költség", seoTitle: "Kompresszor asztalosműhelybe: igény és éves költség",
      description: "Faipari műhelyhez keres kompresszort? Élzáró, pneumatikus szorítók, kéziszerszámok és felületkezelés alapján készítse elő az ajánlatkérést.",
      stage: "comparison", audience: ["owner", "technical"],
      intro: ["Megérkezik az új élzáró, miközben a régi gépsor és a kéziszerszámok is dolgoznak. A műhely több levegőt kér, de egyelőre csak a kompresszor kW-ja ismert. A jó választás a tényleges levegős fogyasztók és a napi munkarend összerakásával kezdődik.", "Ez a cikk az asztalos- és faipari műhelyek ajánlat-előkészítését segíti. Külön foglalkozik a működtető levegővel, a felületkezelés követelményével, a telepítéssel és azzal, hogyan jelenik meg a bővülő használat az éves költségben."],
      quickAnswer: "Faipari műhelyhez a gépenkénti légigény, a szükséges nyomás és a tényleges egyidejű működés alapján készítsen kompresszorajánlatot. A vákuumos leszorítást külön kezelje. A felületkezelés levegőminőségét, a telepítési környezetet és a tervezett műszakokat is adja meg.",
      outcome: "Az élzáró és a többi műhelygép adatából a mostani és a bővített termelésre is értelmezhető beszerzési alap készülhet.",
      decisionSection: { id: "faipar-uj-elzaro", title: "Új élzáró mellett nem feltétlenül az egész műhely indul egyszerre", paragraphs: [
        "Egy szemléltető bővítésnél írja fel a gépek várható napi sorrendjét és az átfedéseket. Ha az új élzáró más munkaszakaszban működik, mint a nagyobb levegős fogyasztó, a csúcsterhelés más lehet, mint a névleges értékek egyszerű összege. A tényleges munkarend ezért értékes ajánlatkérési adat.",
        "A döntési lapon külön jelenjen meg a jelenlegi nyomáspanasz, a bővítésből eredő igény és az energiahatás. Minden tétel mellé kerüljön feltételezés vagy adatforrás. Így a nagyobb termelési kapacitás üzleti előnye és az üzemeltetési költség változása is a saját helyén értékelhető.",
        "A kalkulátorral nézze meg a saját gépadatokhoz tartozó előbecslést, majd az ajánlatkérőben nevezze meg az új és a meglévő berendezéseket. A felületkezelést és a telepítési helyet se hagyja a későbbi egyeztetés végére."
      ] },
      checklist: ["Élzáró, szorítók, szerszámok és a külön vákuumfeladat adatai.", "Egyidejű használat, tervezett műszak és felületkezelési előírás.", "Meglévő gép, telepítési hely és karbantartás alatti ellátás."],
      objections: [
        { question: "Elég egy másik asztalosműhely gépméretét lemásolni?", answer: "A géppark, a munkafolyamatok és a műszakrend műhelyenként eltérhet. A másik üzem tapasztalata hasznos kérdéseket adhat, a saját légigényt és minőségi előírást azonban külön kell meghatározni." },
        { question: "Ha csak csúcsidőben kevés a levegő, rögtön gépet kell cserélni?", answer: "A csúcs időtartamát, a hálózatot, a tárolást és a kompresszor működését együtt kell vizsgálni. A tünet pontos leírása segít kiválasztani a szükséges beavatkozást és elkerülni a pusztán kW alapján hozott döntést." }
      ],
      midCta: { title: "Mennyit jelent a műhely saját üzemórája forintban?", text: "Adja meg a jelenlegi kompresszor adatait, a reális éves használatot és a saját energiaárat. A bővítésre készíthet külön forgatókönyvet." },
      finalCta: { title: "A következő faipari gép mellé legyen előkészített levegőellátása", text: "Induljon a saját éves energia-előbecslésből, majd a műhely géplistájával kérjen pontosított megoldást." },
      offer: "replacement", offerLabel: "Faipari műhelyhez kérek gépajánlatot", offerText: "Írja le a műhelygépeket, az egyidejű használatot és a várható bővítést. A felületkezelést és a vákuumos feladatokat külön is megnevezheti.",
      nextSlug: "csavarkompresszor-teljes-elettartam-koltseg", nextReason: "A műhely igénye után az energia, a telepítés és a szerviz közös költségösszevetésével készítheti elő a beszerzést."
    }
  },
  "csavarkompresszor-csomagolouzembe": {
    label: "Csomagolóipar", keyword: "kompresszor csomagológéphez",
    takeaways: ["A ciklusidő, a formátum és az egyidejű sorindítás is befolyásolja a levegőigényt.", "A sűrített levegővel működő vákuumejektor a fogyasztólista része.", "A termelési és szüneti üzemállapotot külön mutassa meg az ajánlatadónak."],
    sections: [
      { id: "csomagolas-fogyasztok", title: "1. A csomagolósort bontsa levegőt használó egységekre", paragraphs: [
        "A sor géplistáján jelölje a pneumatikus hengereket, a megfogókat, a fúvatási pontokat és az esetleges vákuumejektorokat. A vákuum feladatát és előállítási módját is rögzítse: a sűrített levegővel működő ejektor fogyasztása másként jelenik meg, mint egy külön villamos vákuumszivattyúé. A csomagológép teljes villamos adatából nem számítható ki a kompresszor szükséges mérete.",
        "Az SMC csomagolóipari anyaga több ilyen pneumatikus és vákuumos feladatot mutat be. A saját listában a gépazonosítóhoz rendelje a gyártói levegőigényt és a megadott üzemi feltételt. Legyen látható, hogy ciklusonkénti mennyiséget vagy időegységre vetített fogyasztást kapott; ezek csak megfelelő átszámítással hasonlíthatók össze."
      ], sourceIds: ["packagingAir"] },
      { id: "csomagolas-formatum-es-sebesseg", title: "2. Melyik formátummal és sebességgel fut a sor?", paragraphs: [
        "A termék- és csomagolásváltás megváltoztathatja a működő egységeket és azok ciklusát. Az ajánlatkérésben ezért a normál terméket és a tervezett nagyobb igényű változatot is nevezze meg. A névleges legnagyobb sebesség mellett a tényleges napi sebesség és az átállások ideje is fontos adat.",
        "Ha ciklusonkénti fogyasztás ismert, az adott ciklusszámmal és működési renddel kell összekapcsolni. Ellenőrizze a gyártó mértékegységét és vonatkoztatási feltételét. A párhuzamos soroknál az egyidejűségből induljon ki, és rögzítse a rövid nyomásesés helyét. A gépház állapota és a fogyasztási pont adata együtt segít elkülöníteni a tartós hiányt a helyi ellátási problémától."
      ], sourceIds: ["pressure"] },
      { id: "csomagolas-szunet-es-vakuum", title: "3. Mi működik akkor, amikor nem készül csomag?", paragraphs: [
        "Nézze meg a formátumváltás, az anyagpótlás és a műszakszünet állapotát is. Kérdés, hogy a fúvatás vagy a sűrített levegős vákuumképzés mikor áll le, és melyik funkciónak kell valóban aktívnak maradnia. Az esetleges változtatást a gép gyártói működésével és a folyamat követelményével együtt kell értékelni.",
        "Egy szüneti fogyasztás felismerése még nem jelent automatikusan végrehajtható megtakarítást. Először rögzítse a funkciót, az időtartamot és a szükséges üzemi állapotot. Az ajánlat vagy felülvizsgálat ezután térjen ki a vezérlésre és a megfelelő megoldásra. Rögzített százalékos nyereség helyett a saját sor vizsgált adataiból induljon."
      ], sourceIds: ["packagingAir"] },
      { id: "csomagolas-minoseg-es-koltseg", title: "4. Azonos feladatot és minőséget hasonlítson össze", paragraphs: [
        "A levegő-előkészítéshez adja meg a gépek előírását és az anyaggal vagy termékkel való érintkezést. Élelmiszer csomagolásakor a minőségügyi felelős bevonásával kell a felhasználási pont követelményét tisztázni. A csomagolósor megnevezése önmagában nem határoz meg egy általános tisztasági osztályt vagy teljes kezelési csomagot.",
        "Szemléltetésként két, ugyanazt a megfelelő levegőellátási feladatot teljesítő megoldás átlagos felvétele legyen 22 és 19 kW. Évi 5 000 órával és példaként választott 70 Ft/kWh-val 1,05 millió Ft az éves eltérés. Ez feltételezett összehasonlítás, nem csomagolóüzemekre ígért eredmény. A saját értékhez a valós sorprofil és a teljes csomag energiaadata kell."
      ], formula: "(22 − 19) kW × 5 000 óra × 70 Ft/kWh = 1 050 000 Ft/év", sourceIds: ["airPurity"] },
      { id: "csomagolas-ajanlatkeres", title: "5. A sorbővítést és az átállásokat is írja az ajánlatba", paragraphs: [
        "Az ajánlatkéréshez adja meg a sorazonosítókat, a formátumokat, a sebességeket és a rendelkezésre álló gyártói levegőadatokat. A jelenlegi gép és az előkészítő berendezések adatai mellé kerüljön a műszakrend, a leállási ablak és a tervezett új sor indulása. A hiányzó adatot jelölje nyitott feladatként.",
        "Kérjen egyértelmű leírást arról, milyen párhuzamos működésre és nyomásra adták az ajánlatot. A telepített árat, a karbantartást és a teljes rendszer fogyasztását azonos feltételekkel vesse össze. A saját energia-előbecslés jó beszélgetési alap, de a ciklusfüggő igény pontosításához szükség lehet részletesebb helyszíni adatokra."
      ] }
    ],
    faq: [
      { question: "A vákuumos megfogó levegőfogyasztónak számít?", answer: "Az ellátási módjától függ. Ha sűrített levegős ejektor állítja elő a vákuumot, annak fogyasztását és vezérlését fel kell venni a listába. A külön villamos vákuumszivattyú energiaértékelése más rendszerhatárhoz tartozik." },
      { question: "Elég a csomagológép maximális sebességét megadni?", answer: "A csúcs fontos, de a valós napi sebesség, formátumok, átállások és párhuzamos sorok is szükségesek. Ezek nélkül az éves költség és a terhelés lefutása csak durván becsülhető." }
    ], relatedSlugs: ["csavarkompresszor-elelmiszeriparba", "kompresszor-uzemi-nyomas-energiakoltseg", "suritett-levego-energiaaudit-elokeszites"],
    journey: {
      title: "Kompresszor csomagológéphez: ciklusok, vákuum és éves költség", seoTitle: "Kompresszor csomagológéphez: légigény és költség",
      description: "Csomagolósorhoz keres levegőellátást? Ciklusidő, formátumváltás, vákuumejektor és műszakrend alapján készítse elő a kompresszorajánlatot.",
      stage: "comparison", audience: ["technical", "procurement"],
      intro: ["Az új csomagformátum gyorsabb ciklust kér, közben a másik sor is elindul. A gépek névleges adatai megvannak, a valódi egyidejű levegőigény mégsem egyértelmű. Csomagolóüzemben a géplista mellé a sorok működési rendjét is oda kell tenni.", "Ez az útmutató a hengerek, megfogók, fúvatások és vákuumos feladatok ellátását rendezi ajánlatkérési kérdésekké. A termelési profilból indulunk, majd a szüneti állapot és az éves energiaköltség vizsgálatához jutunk."],
      quickAnswer: "Csomagológéphez a gyártói légigényt a használt formátummal, ciklusszámmal és a párhuzamos sorokkal együtt adja meg. A vákuumejektort és a fúvatást is vegye számba. Külön rögzítse a termelési, átállási és szüneti állapotot, valamint a felhasználási pont minőségi igényét.",
      outcome: "A csomagolósor ciklusaiból és formátumaiból olyan feladatleírást készíthet, amelyhez összehasonlítható ellátási ajánlat kérhető.",
      decisionSection: { id: "csomagolas-masodik-sor", title: "Második sor indul: a közös csúcs időpontja döntő adat", paragraphs: [
        "Egy feltételezett bővítésnél készítsen rövid napi időrendet a két sorhoz. Mutassa meg, mikor termelnek egyszerre, mikor van átállás, és melyik fogyasztó marad aktív leállás alatt. A teljes telephely névleges adatainak összege helyett ez ad használható kiindulást a valós ellátási feladathoz.",
        "Az ajánlat értékelésénél külön sor legyen az új termelési kapacitás, a már tapasztalt nyomásprobléma és az energiaköltség. A rendszerhatárt és a feltételezett egyidejűséget minden ajánlatnál ellenőrizze. Eltérő feladatra adott árakból nem születik megbízható beszerzési sorrend.",
        "A kalkuláció után a sorok üzemrendjével és a formátumok adataival folytassa az egyeztetést. Ha a gyártói fogyasztási adat még hiányzik, a géptípust és a tervezett sebességet így is megadhatja, és kérheti a szükséges pontosítás meghatározását."
      ] },
      checklist: ["Sorok, pneumatikus egységek, ejektorok és gyártói mértékegységek.", "Formátum, ciklusszám, egyidejű termelés és szüneti működés.", "Levegőminőség, leállási ablak és a bővítés tervezett indulása."],
      objections: [
        { question: "Minden álló soron elzárható a levegő?", answer: "A szükséges funkciókat és a gép előírt működését előbb tisztázni kell. A szüneti fogyasztás vizsgálható, de a leállítás módját a konkrét technológiára kell meghatározni; az általános elzárási javaslat nem helyettesíti ezt." },
        { question: "A gyorsabb gép arányosan több kompresszort igényel?", answer: "A ciklushoz kötött fogyasztást a valós sebességgel kell összekapcsolni, de a különböző funkciók működése és az egyidejűség is számít. A gép adatlapja és a termelési profil együtt szükséges az értékeléshez." }
      ],
      midCta: { title: "Mekkora éves tétel a csomagolósor levegőellátása?", text: "A jelenlegi kompresszor adataival és a sorhoz tartozó éves üzemórával indítson saját energiaoldali előbecslést." },
      finalCta: { title: "A következő formátum vagy sor előtt számoljon a saját üzemével", text: "Készítsen előbecslést, majd a ciklusok és az egyidejű termelés adataival kérjen pontosított levegőellátási ajánlatot." },
      offer: "replacement", offerLabel: "Csomagolósorhoz kérek gépajánlatot", offerText: "Adja meg a sorokat, a használt formátumokat és a sebességet. A vákuumejektort, a fúvatást és a tervezett bővítést külön is írja le.",
      nextSlug: "csavarkompresszor-teljes-elettartam-koltseg", nextReason: "A ciklusok tisztázása után a teljes költség segít az azonos csomagolási feladatra szóló ajánlatok összehasonlításában."
    }
  },
  "csavarkompresszor-muanyag-feldolgozas": {
    label: "Műanyag-feldolgozás", keyword: "kompresszor műanyagiparba",
    takeaways: ["A fröccsöntő gép villamos teljesítménye nem azonos a sűrítettlevegő-igényével.", "A működtető levegőt és a PET-fúvás speciális levegőellátását külön feladatként kezelje.", "A segédberendezések és az éjszakai működés költsége is kerüljön az összevetésbe."],
    sections: [
      { id: "muanyag-tenyleges-fogyasztok", title: "1. A fröccsöntő mellé készítsen tényleges fogyasztólistát", paragraphs: [
        "A gép fő hajtása, fűtése és a sűrített levegőt használó kiegészítők eltérő energiafeladatok. A műanyag-feldolgozó üzem listáján ezért a tényleges pneumatikus működtetést, megfogót, kifúvatást és a sűrített levegős vákuumképzést nevezze meg. Csak a gép villamos kW-adata alapján nem lehet kompresszort választani.",
        "Minden fogyasztóhoz keresse meg az előírt csatlakozási nyomást, légigényt és minőségi követelményt. Jelölje, ha az adat ciklusonként értendő, vagy csak egy meghatározott üzemi beállításra érvényes. A gyártói előírás és a saját termelési adat külön oszlopban is szerepelhet, így a későbbi ajánlat alapja visszakövethető marad."
      ] },
      { id: "muanyag-fuvos-es-mukodteto-levego", title: "2. A PET-palack fúvása külön ellátási feladat", paragraphs: [
        "Az Atlas Copco PET- és műanyagfúvási ismertetője eltérő nyomásszintű feladatokat különít el. A telephely működtető levegőjét ezért nem helyes automatikusan a palack fő fúvási feladatával azonosítani. Az ajánlatban nevezzék meg, pontosan melyik folyamatot és csatlakozási pontot látja el a javasolt rendszer.",
        "Ha PET-fúvás vagy más speciális technológia is szerepel a telephelyen, a gyártói követelményt és a hozzá tartozó rendszerhatárt külön kérje. A jelen útmutató főként az üzemi működtető és kiegészítő levegő ajánlat-előkészítéséről szól. Egy általános energiakalkulátor eredménye nem egy speciális nagynyomású fúvórendszer méretezési terve."
      ], sourceIds: ["plasticAir"] },
      { id: "muanyag-ciklus-es-muszak", title: "3. A ciklus, a szerszámcsere és az éjszakai üzem is látszódjon", paragraphs: [
        "A tényleges levegőigényhez a gyártott termékek ciklusát és a párhuzamos gépek működését is írja le. Egy új automatizáló egység vagy másik szerszám új fogyasztót és más időbeli lefutást hozhat. A napi darabszám csak a kapcsolódó működési feltételekkel együtt használható a levegőellátás értékelésében.",
        "A hosszú műszak és a ritkább személyes felügyelet miatt az üzemszüneti állapotot is rögzítse. Mely gépek állnak, mely ágak maradnak nyomás alatt, és mikor jár a kompresszor? A leírt időrend segít elkülöníteni a termeléshez tartozó fogyasztást a vizsgálandó üres időszakoktól. Az esetleges változtatást a gépek működési követelményeivel együtt kell megtervezni."
      ] },
      { id: "muanyag-teljes-csomag", title: "4. A szárító és a segédenergia ne maradjon a gépár mögött", paragraphs: [
        "A két ajánlat azonos rendszerhatárra szóljon. Ha az egyik adat csak a kompresszort, a másik a szükséges levegő-előkészítést is tartalmazza, a számok közvetlen összevetése félrevezető. A telepített ár mellett kérje a figyelembe vett segédberendezések és az üzemi feltételek tételes felsorolását.",
        "Tegyük fel, hogy egy költségtervből 2 kW átlagos segédenergia kimaradt. Évi 6 500 órával és szemléltető 70 Ft/kWh-val ez 910 000 Ft hiányzó éves költség. Ez nem megtakarítás és nem tipikus műanyagipari adat; azt mutatja meg, miért fontos a teljes rendszerhatár. Saját számításhoz saját felvételt, üzemórát és energiaárat használjon."
      ], formula: "2 kW × 6 500 óra/év × 70 Ft/kWh = 910 000 Ft/év" },
      { id: "muanyag-minoseg-ajanlat", title: "5. A késztermék és a gép követelménye legyen az ajánlatban", paragraphs: [
        "Az alkalmazásnál rögzítse, érintkezik-e a levegő a munkadarabbal, és milyen előírás vonatkozik a gépre vagy a termékre. A szárítást és szűrést ezekhez kell meghatározni. A műanyagipar megnevezéséből nem következik automatikusan egy adott tisztasági csomag, ahogy egy másik gyár gépajánlata sem helyettesíti a saját követelménylistát.",
        "Az ajánlatkérés tartalmazza az ellátandó gyártócellákat, a meglévő kompresszort, a munkarendet és a tervezett automatizálást. A karbantartási idő és a tartalékellátási igény is legyen egyértelmű. A kalkuláció után ezzel a listával folytassa az egyeztetést, hogy az ár mellett a kapacitási, minőségi és rendelkezésre állási feladat is összehasonlítható legyen."
      ], sourceIds: ["airPurity"] }
    ],
    faq: [
      { question: "A fröccsöntő gép kW-adata alapján választhatok kompresszort?", answer: "A főgép villamos teljesítménye nem mondja meg a kiegészítő pneumatikus elemek légigényét. Az adott fogyasztók gyártói adatait és működési rendjét külön kell összegyűjteni." },
      { question: "A PET-fúvás ugyanazt az ellátást használja, mint a működtető levegő?", answer: "A folyamat különböző nyomás- és ellátási feladatokat tartalmazhat. A fő fúvás és az üzemi működtető levegő követelményét külön kell azonosítani; a konkrét gép gyártói előírása adja a tervezés alapját." }
    ], relatedSlugs: ["fix-vagy-vsd-csavarkompresszor", "csavarkompresszor-teljes-elettartam-koltseg", "suritett-levego-szivargas-koltsege"],
    journey: {
      title: "Kompresszor műanyagiparba: gyártócellák, műszakok és költség", seoTitle: "Kompresszor műanyagiparba: üzemi levegő és költség",
      description: "Műanyag-feldolgozó üzemhez keres kompresszort? Különítse el a gyártócellák működtető levegőjét, a PET-fúvást és a teljes éves költséget.",
      stage: "comparison", audience: ["technical", "procurement", "owner"],
      intro: ["Új megfogó és automatizáló egység kerül a fröccsöntő mellé, a gyártás pedig hosszabb műszakra áll át. A kompresszorajánlat előkészítéséhez ilyenkor a levegőt ténylegesen használó egységeket és a működésüket kell megismerni, nem a főgépek összes villamos teljesítményét összeadni.", "Az útmutató a műanyag-feldolgozás üzemi és kiegészítő levegőellátását fogja össze. Külön jelzi a speciális fúvási feladat határát, és megmutatja, hogyan kerüljön az energia, a segédberendezés és az üzemrend a beszerzési döntésbe."],
      quickAnswer: "Műanyag-feldolgozó üzemhez az egyes pneumatikus fogyasztók előírását, ciklusát és egyidejű működését adja meg. A PET fő fúvási feladatát külön kezelje az üzemi működtető levegőtől. Az ajánlatokban egyeztesse a teljes rendszerhatárt, a levegőminőséget és az éves üzemórát.",
      outcome: "A gyártócellák tényleges levegős feladatait és a teljes költséget közös, áttekinthető ajánlatkérési alapba rendezheti.",
      decisionSection: { id: "muanyag-automatizalas", title: "Új automatizálás: ne csak az új kompresszor kW-járól szóljon a döntés", paragraphs: [
        "Egy feltételezett gyártócella-bővítésnél az új megfogó, az esetleges vákuumejektor és a ciklus változása kerüljön a fogyasztólistához. Jelezze, mely cellák működnek vele párhuzamosan. A konkrét funkciókból induló leírás sokkal pontosabb kiindulás, mint az, hogy eggyel több fröccsöntő dolgozik a csarnokban.",
        "A vezetői anyag külön mutassa a termelési igényt, a telepített rendszer árát és a saját munkarendre számolt éves energiaértéket. Ellenőrizze, hogy a levegő-előkészítés mindkét oldalon szerepel-e. A feltételezett megtérüléshez csak az azonos feladatra vonatkozó, igazolható eltérést használja; a bővülő termelést önálló üzleti indokként értékelje.",
        "A kalkulátorral készített előbecslés mellé az ajánlatkérésben adja meg a gyártócellákat, a műszakok számát és a tervezett változtatást. A speciális fúvási igényt rögtön külön nevezze meg, hogy a szakmai egyeztetés a megfelelő rendszerhatárral induljon."
      ] },
      checklist: ["Pneumatikus fogyasztók, gyártói légadatok és ciklusok.", "Párhuzamos cellák, éjszakai üzem és tervezett automatizálás.", "Levegőminőség, teljes segédenergia és különleges fúvási feladat."],
      objections: [
        { question: "A folyamatos üzem önmagában eldönti, milyen szabályozás kell?", answer: "A hosszú üzemidő fontos, de a terhelés változása és a párhuzamos gépek működése is számít. A technológiák energiaértékeléséhez a saját fogyasztási profilra és azonos ellátási feltételekre van szükség." },
        { question: "A kedvezőbb kompresszorár biztosan kisebb éves kiadást jelent?", answer: "Az energia, a szárítás, a karbantartás és a telepítés tartalma módosíthatja az összköltséget. Először a rendszerhatárt és a szolgáltatási tartalmat egyeztesse, majd saját üzemórával hasonlítsa össze az ajánlatokat." }
      ],
      midCta: { title: "Hosszú műszakok mellett mennyi az éves energiahatás?", text: "A jelenlegi kompresszor adataival, a gyártás valós üzemórájával és a saját energiaárával készítsen előbecslést." },
      finalCta: { title: "A következő gyártócella mellé készítsen saját kalkulációt", text: "Induljon a meglévő gépadatokból, majd az új fogyasztókkal és a teljes rendszerhatárral pontosítsa a gépajánlatot." },
      offer: "replacement", offerLabel: "Műanyagipari üzemhez kérek gépajánlatot", offerText: "Nevezze meg a gyártócellákat és a levegős funkciókat, a műszakokat és az automatizálást. A PET- vagy más speciális fúvási feladatot külön is jelezze.",
      nextSlug: "csavarkompresszor-teljes-elettartam-koltseg", nextReason: "A gyártócellák ellátási feladata után a teljes rendszer költségét érdemes azonos feltételekkel összevetni az ajánlatok között."
    }
  }
} satisfies Partial<Record<BlogSlug, IndustryGuide>>;

export const industryArticles: BlogArticle[] = Object.entries(industryGuideDefinitions).map(([slug, guide]) => ({
  slug, title: guide.journey.title, description: guide.journey.description, category: guide.label,
  publishedAt: "2026-11-04", intro: guide.journey.intro, takeaways: guide.takeaways,
  sections: guide.sections, faq: guide.faq, cta: guide.journey.finalCta, relatedSlugs: guide.relatedSlugs
}));

export const industryJourneys = Object.fromEntries(Object.entries(industryGuideDefinitions).map(([slug, guide]) => [slug, guide.journey])) as {
  [Slug in keyof typeof industryGuideDefinitions]: BlogJourney;
};

export const industryGuideLinks: Array<{ slug: BlogSlug; label: string }> = [
  ...Object.entries(industryGuideDefinitions).map(([slug, guide]) => ({ slug: slug as BlogSlug, label: guide.label })),
  { slug: "csavarkompresszor-cnc-muhelybe", label: "CNC-műhely" }
];
