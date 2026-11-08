import type { BlogArticle, BlogPost } from "./types";
import { blogJourneys } from "./journeys";
import type { BlogSlug } from "../content-context";
import { industryArticles } from "./industry-guides";

const sourcePosts: BlogArticle[] = [
  ...industryArticles,
  {
    "slug": "hutveszarito-vagy-adszorpcios-szarito",
    "title": "Hűtveszárító vagy adszorpciós szárító? Így hasonlítsa össze az ajánlatokat",
    "description": "Melyik sűrítettlevegő-szárító illik az üzeméhez? Harmatpont, méretezés, regenerálás és éves költség az összehasonlítható ajánlatokhoz.",
    "category": "Levegőkezelés",
    "publishedAt": "2026-11-08",
    "intro": [],
    "takeaways": [
      "A nyomás alatti harmatpontot a fogyasztói igényhez és a hálózathoz kell illeszteni.",
      "A névleges légszállítás csak a hozzá tartozó üzemi feltételekkel értelmezhető.",
      "A szárító saját fogyasztása mellett a regenerálást és a nyomásveszteséget is vizsgálja."
    ],
    "sections": [
      {
        "id": "nyomas-alatti-harmatpont",
        "title": "1. Először a szükséges harmatpontot rögzítse",
        "paragraphs": [
          "A nyomás alatti harmatpont azt mutatja meg, milyen hőmérsékleten kezd kicsapódni a vízgőz az adott nyomású levegőből. Ez eltérhet a légköri nyomáson megadott harmatponttól. Az ajánlatokban ezért azonos fogalmat és azonos mérési feltételeket kérjen.",
          "A követelményt a felhasználó gép dokumentációjából és a hálózat körülményeiből gyűjtse ki. Jelölje a fűtetlen vagy kültéri szakaszokat is. A kelleténél mélyebb szárítás többletköltséget jelenthet, a nem elegendő szárítás pedig a lehűlő hálózatban újabb vízkiválást engedhet. A cél a szükséges minőség tartós biztosítása."
        ],
        "sourceIds": [
          "dryerSelection",
          "dryerSourcebook"
        ]
      },
      {
        "id": "hutve-vagy-adszorpcio",
        "title": "2. Mitől különbözik a két szárítási elv?",
        "paragraphs": [
          "A hűtveszárító lehűti a sűrített levegőt, leválasztja a kicsapódó vizet, majd rendszerint visszamelegíti a kilépő levegőt. Gyakori ajánlati érték a +3 °C körüli nyomás alatti harmatpont, de mindig a konkrét adatlap vállalását kell ellenőrizni.",
          "Az adszorpciós szárító nedvességmegkötő anyaggal dolgozik. Ezt regenerálni kell; az ehhez használt levegő és energia a konstrukciótól függ. Kaphatók például −40 °C harmatpontra megadott változatok. Az alacsonyabb szám önmagában nem beszerzési előny: akkor indokolt, ha a feladat ezt igényli."
        ],
        "sourceIds": [
          "dryerSelection",
          "dryerDesiccant"
        ]
      },
      {
        "id": "szarito-tenyleges-kapacitas",
        "title": "3. A katalógus légszállítása mellé kérje oda a feltételeket",
        "paragraphs": [
          "Azonos m³/perc érték mögött eltérő belépési nyomás, levegő-hőmérséklet és környezeti hőmérséklet állhat. A helyszíni feltételek megváltoztathatják a kezelhető légmennyiséget. A gyártó korrekciós tényezőit az adott típusra kell alkalmazni.",
          "Ne csak egy átlagos tavaszi műszakot írjon az adatlapra. Kérje a választás ellenőrzését a várható legkedvezőtlenebb feltételekre is, beleértve a nyári gépházat és a szükséges csúcsterhelést. Az ajánlatadó mutassa meg, milyen belépési adatok mellett biztosítja az elvárt kimeneti minőséget. A kompresszor motorjának kW-értéke ezt a vizsgálatot nem helyettesíti."
        ],
        "sourceIds": [
          "dryerSourcebook"
        ]
      },
      {
        "id": "szaritas-eves-koltsege",
        "title": "4. A saját villamos felvétel csak az egyik költségsor",
        "paragraphs": [
          "Kérjen külön adatot a szárító villamosenergia-igényéről, az esetleges regeneráló levegőről, a szűrőkről és a nyomásveszteségről. A regenerálásra elhasznált sűrített levegő előállítása a kompresszort is terheli. A hővel vagy fúvóval regenerált kiviteleknél ezek energiaigényét is számításba kell venni.",
          "Szemléltető számpéldaként 1 kW átlagos többletfelvétel, évi 4 000 óra és kizárólag példának választott 70 Ft/kWh mellett 280 000 Ft éves energiaköltség adódik. Ez feltételezett költség, nem szárítótípusokra érvényes különbség vagy megtakarítási ígéret.",
          "A két ajánlatot ugyanarra a hasznos levegőigényre számoltassa ki. Tisztázzák, melyik mérési pont tartalmazza már a szárítót, hogy egy tételt se számoljanak kétszer."
        ],
        "formula": "1 kW × 4 000 óra/év × 70 Ft/kWh = 280 000 Ft/év",
        "sourceIds": [
          "dryerSourcebook"
        ]
      },
      {
        "id": "viz-a-halozatban",
        "title": "6. Meglévő vizesedésnél a hibát is tárják fel",
        "paragraphs": [
          "Ha korábban megfelelő rendszerben jelenik meg a víz, jegyezze fel az időpontot, a terhelést, a gépház hőmérsékletét és a kijelzett harmatpontot. A romló teljesítmény hátterében túlterhelés, nem megfelelő hűtés vagy hibás kondenzátumürítés is állhat. Ezekre más beavatkozás szükséges, mint egy új minőségi követelmény teljesítésére.",
          "A szervizzel ellenőriztesse a szárítót és a hozzá tartozó előkészítő elemeket. Kérjen diagnózist és javítási tartalmat, mielőtt pusztán a panasz alapján nagyobb berendezést rendelne. Az új gépajánlatban pedig rögzítsék, mely meglévő elemek maradnak, és melyeket cserélik."
        ],
        "sourceIds": [
          "dryerMaintenance"
        ]
      }
    ],
    "faq": [
      {
        "question": "A szárító kiváltja a sűrítettlevegő-szűrőt?",
        "answer": "A szárítás és a részecske-, illetve olajterhelés kezelése külön feladat. Az elő- és utószűrést a szárító gyártói előírásához és a fogyasztó minőségi követelményéhez kell kiválasztani. A szárító önmagában nem igazolja a teljes levegőminőséget."
      },
      {
        "question": "A kalkulátor kiválasztja a megfelelő szárítót?",
        "answer": "A kalkulátor a kompresszor energiaoldali előbecsléséhez ad kiindulópontot. A szárítót a harmatpont, légigény és üzemi körülmények alapján külön kell méretezni. A szárítás éves költségét az ajánlatadóval egészítse hozzá a teljes összehasonlításhoz."
      }
    ],
    "cta": {
      "title": "Készítse elő a saját üzemére szóló összehasonlítást",
      "text": "Számolja át a kompresszor energiaoldali kiinduló költségét, majd az adatlapjával kérjen teljes gépajánlatot. A kalkulátor eredményét a szárítás és a telepítés külön tételeivel egészítse ki."
    },
    "relatedSlugs": [
      "csavarkompresszor-meretezes-hibak",
      "csavarkompresszor-teljes-elettartam-koltseg",
      "csavarkompresszor-cnc-muhelybe"
    ]
  },
  {
    slug: "csavarkompresszor-cnc-muhelybe",
    title: "Kompresszor CNC-géphez: méretezés, levegőminőség és éves költség",
    description: "CNC-műhelyre szabott ajánlatkérési útmutató és energiaoldali számítási példa.",
    category: "Iparági útmutató", publishedAt: "2026-11-04",
    intro: [],
    takeaways: ["A megmunkálógép gyártói levegőelőírása az első adatforrás.", "A rövid igénycsúcs és a tartós kapacitáshiány eltérő feladat.", "Az éves áramköltséget azonos üzemi feladatra érdemes összehasonlítani."],
    sections: [
      {
        id: "cnc-gepoldali-kovetelmenyek", title: "1. A CNC kézikönyvét nyissa ki a kompresszorkatalógus előtt",
        paragraphs: [
          "A szerszámgép előtelepítési útmutatójából gyűjtse ki a szükséges levegőmennyiséget, a nyomástartományt és a csatlakozási feltételeket. A Haas VF-4SS útmutatója is külön kezeli ezeket az adatokat, és tiszta, száraz levegőellátást ír elő. Egy másik gép követelményeit a saját dokumentációjából kell ellenőrizni.",
          "Több CNC esetén készítsen gépenként egy sort. A pontos típus, a felszereltség és az alkalmazott műveletek is szerepeljenek benne. Egyetlen gép adatából nem következik az egész műhely légigénye. Az ajánlatadó így látja, melyik követelmény gyártói adat, és melyik részhez szükséges még mérés vagy pontosítás."
        ], sourceIds: ["haasAir"]
      },
      {
        id: "cnc-egyidejuseg-es-csucs", title: "2. Mikor kér egyszerre levegőt a gép és a műhely?",
        paragraphs: [
          "A gépi ciklusok mellé vegye fel a kézi lefúvatást, a további pneumatikus fogyasztókat és a termelésen kívül is fennmaradó igényt. A műszak átlagos fogyasztása és egy rövid, nagy igényű pillanat külön adat. Jegyezze fel, mikor jelenik meg nyomásesés, melyik fogyasztónál, és mi működik ugyanakkor.",
          "A megfelelően méretezett tárolás segíthet egy ismert időtartamú csúcs kiszolgálásában. A tartály azonban nem állít elő levegőt, ezért tartós kapacitáshiányt nem lehet pusztán több literrel megoldani. A nyomásprofilt, a hálózat szűkületeit és a kompresszor vezérlését együtt kell értékelni."
        ], sourceIds: ["pressure"]
      },
      {
        id: "cnc-szaritas-szures", title: "3. A szárító és a szűrő az ajánlat része legyen",
        paragraphs: [
          "Ne csak a kompresszoregység árát kérje be. Tisztázza az alkalmazáshoz szükséges szárítást, szűrést és kondenzátumkezelést is. A levegőminőség követelménye a végfelhasználásból indul ki; a szükségesnél szigorúbb kezelés is növelheti a beruházási és üzemeltetési költséget.",
          "Az ajánlatban szerepeljen, milyen környezeti és üzemi feltételekre érvényes a levegő-előkészítés teljesítménye. Kérdezzen rá a szűrőcserére, a kondenzátumürítők ellenőrzésére és a karbantartás alatti ellátásra. A megfelelő minőséget a napi üzem során is fenn kell tartani; nem elegendő egyszer felsorolni a berendezéseket."
        ], sourceIds: ["quality"]
      },
      {
        id: "cnc-energiakoltseg-pelda", title: "4. Szemléltető példa: mit jelent 3 kW különbség éves szinten?",
        paragraphs: [
          "Tegyük fel, hogy azonos levegőellátási feladat mellett a jelenlegi rendszer átlagosan 18 kW-ot, a vizsgált másik megoldás 15 kW-ot vesz fel. Évi 4 000 üzemórával és kizárólag példaként választott 70 Ft/kWh fogyasztásarányos energiaárral a különbség 840 000 Ft évente. Ezek feltételezett adatok, nem CNC-műhelyre általánosan érvényes fogyasztási értékek.",
          "A jelenlegi energiasor ebben a példában 5,04 millió, a másik 4,2 millió Ft/év. A teljes döntéshez az ajánlati árat, a telepítést és az igazolt szervizkülönbséget is hozzá kell tenni. A névleges motorteljesítményt ne cserélje fel a mért átlagos villamos felvétellel; a kettő eltérő szerepet tölt be az értékelésben."
        ], formula: "(18 − 15) kW × 4 000 óra/év × 70 Ft/kWh = 840 000 Ft/év", sourceIds: ["cost"]
      },
      {
        id: "cnc-ajanlatkeresi-adatlap", title: "5. Ezt küldje el az összehasonlítható ajánlathoz",
        paragraphs: [
          "Az első egyeztetéshez nem kell kész gépházterv. A CNC-gépek adatlapja, a jelenlegi kompresszor márkája és teljesítménye, valamint a műszakrend már használható kiindulópont. Külön soron jelezze az új gép várható indulását, a későbbi bővítést és azt, marad-e tartalék berendezés a rendszerben.",
          "Az ajánlatban ugyanarra az üzemi feladatra kérje a légszállítást, a nyomást, a levegőkezelést és a teljes villamos felvételt. Az ismert adatokból közben készíthet energiaoldali előkalkulációt. Ha pedig már a beszerzést szervezi, közvetlenül a CNC-műhelyre szóló gépajánlatkérést válassza; a hiányzó részletek az egyeztetésen pontosíthatók."
        ], bullets: ["CNC-géptípusok, gyártói levegőelőírások és egyidejű működés.", "Meglévő kompresszor, ismert panasz, rendelkezésre állási elvárás.", "Műszakrend, saját energiaár és a telepítés helyszíni feltételei."]
      }
    ],
    faq: [
      { question: "Nagyobb tartállyal elkerülhető a kompresszorcsere?", answer: "Ismert, rövid igénycsúcsnál a megfelelő tárolás része lehet a megoldásnak. Tartósan nagyobb levegőigénynél azonban a feltöltési kapacitást is biztosítani kell. A mért nyomásprofil és az időarányok alapján lehet a két helyzetet elkülöníteni." },
      { question: "A kalkulátor megmondja, melyik gép látja el a CNC-műhelyt?", answer: "A kalkulátor energiaoldali előbecslést és további egyeztetéshez használható kiindulópontot ad. A tényleges légszállítási, nyomás- és levegőminőségi alkalmasságot a CNC-gépek előírásai és az üzemi igény alapján külön kell ellenőrizni." }
    ],
    cta: { title: "Nézze meg saját műhelye energiaoldali lehetőségét", text: "A gépadatok és a saját üzemóra alapján indulhat az előbecslés." },
    relatedSlugs: ["csavarkompresszor-meretezes-hibak", "fix-vagy-vsd-csavarkompresszor", "csavarkompresszor-teljes-elettartam-koltseg"]
  },
  {
    slug: "csavarkompresszor-aramfogyasztas-szamitasa",
    title: "Mennyi áramot fogyaszt a csavarkompresszora? Számolja ki az éves költséget",
    description: "Felvett teljesítmény, üzemóra és áramár: így számolja ki csavarkompresszora éves fogyasztását. Konkrét példák és ingyenes kalkulátor.",
    category: "Áramfogyasztás",
    publishedAt: "2026-10-31",
    intro: [
      "A kompresszor adattábláján 37 kW szerepel. De ebből még nem derül ki, mennyibe kerül egy év sűrített levegő. A villanyszámlát a tényleges felvett teljesítmény, az egyes üzemállapotok időtartama és a fizetett energiaár együtt alakítja.",
      "Ha csak egy adatot tisztáz a következő beszerzés előtt, az legyen az éves energiaköltség. Ezzel a gépek ára mellé oda tudja tenni az üzemeltetés árát is. Az alábbi számítások szemléltető példák; a saját gép előzetes becslését a kalkulátorban készítheti el."
    ],
    takeaways: [
      "A névleges motorteljesítmény és a hálózatból felvett teljesítmény eltérhet.",
      "A fogyasztás alapképlete: átlagos felvett kW × üzemóra.",
      "Azonos műszaki feltételekkel hasonlítsa össze a régi és az új gépet."
    ],
    sections: [
      {
        id: "nevleges-es-felvett-teljesitmeny",
        title: "Miért nem elég az adattáblán szereplő kW?",
        paragraphs: [
          "A motor névleges teljesítménye nem azonos a teljes kompresszoregység villamosenergia-igényével. A hajtás, a segédberendezések, az üzemi nyomás és a szabályozás is számít. A terhelt és az üresjárati állapot különböző fogyasztást jelent.",
          "Pontos éves elszámoláshoz mért kWh-adat a legjobb kiindulópont. Ennek hiányában reprezentatív időszakra mért átlagos felvett teljesítményből és üzemidőből készíthető becslés. Az amperérték önmagában nem helyettesíti a háromfázisú villamos teljesítmény mérését."
        ],
        sourceIds: ["cost"]
      },
      {
        id: "eves-koltseg-keplete",
        title: "Az éves fogyasztás és költség két egyszerű lépésben",
        paragraphs: [
          "Tegyük fel, hogy egy gép a vizsgált üzemmenetben átlagosan 32 kW-ot vesz fel, és évente 4 000 órát működik. Az éves fogyasztás ekkor 128 000 kWh. A kizárólag szemléltetésre választott 70 Ft/kWh árral az energiaköltség 8 960 000 Ft évente.",
          "Ez a példa az energiafogyasztás költségét mutatja. A karbantartás, a beruházás és a fogyasztástól független díjak külön tételek. Ha a tarifa időszakonként változik, az időszakok költségét külön kell kiszámolni, majd összeadni."
        ],
        formula: "32 kW × 4 000 óra/év = 128 000 kWh/év; 128 000 × 70 Ft/kWh = 8 960 000 Ft/év"
      },
      {
        id: "muszakok-hatasa",
        title: "Ugyanaz a gép, eltérő üzemidő: milliós különbség",
        paragraphs: [
          "Az alábbi példában a 32 kW-os átlagos felvétel és a 70 Ft/kWh ár változatlan. Csak az éves üzemidőt módosítjuk. Így látható, miért nem érdemes egy egyműszakos műhely és egy folyamatos termelésű üzem gépcseréjét ugyanazzal a megtérülési elvárással megítélni."
        ],
        table: {
          caption: "Szemléltető éves költség azonos teljesítmény és áramár mellett",
          headers: ["Éves üzemidő", "Fogyasztás", "Energiaköltség"],
          rows: [["2 000 óra", "64 000 kWh", "4 480 000 Ft"], ["4 000 óra", "128 000 kWh", "8 960 000 Ft"], ["6 000 óra", "192 000 kWh", "13 440 000 Ft"]]
        }
      },
      {
        id: "gyakori-hibak",
        title: "Három tévedés, amely félreviszi a becslést",
        paragraphs: [
          "A termelési naptár nem feltétlenül azonos a kompresszor üzemidejével. A gép műszak előtt feltöltheti a hálózatot, szünetben üresjáratban maradhat, vagy munkaidő után is elláthat egy fogyasztót. Ellenőrizze az üzemóraszámlálót két ismert időpont között.",
          "A teljes telephely villanyszámláját se rendelje a kompresszorhoz. Ugyanígy kerülje az egységes terhelési százalék találomra történő használatát: 50% levegőigény nem jelent automatikusan 50% villamos teljesítményt. A becslés akkor javul, ha az üzemállapotokról is van adat."
        ]
      },
      {
        id: "sajat-szamitas",
        title: "Így lesz a fogyasztási adatból döntési alap",
        paragraphs: [
          "Először írja fel a jelenlegi gép márkáját, korát és névleges teljesítményét. Adja mellé az éves üzemórát, a terhelés jellegét és a saját villamosenergia-árát. A kalkulátor ezekből modellalapú előbecslést készít a fogyasztásról és a lehetséges gépcsere energiahatásáról.",
          "A kapott Ft/év érték megmutatja a vizsgálat nagyságrendjét. Ha jelentős különbséget lát, kérjen mérést és olyan gépajánlatot, amely az elvárt légszállításra és üzemi nyomásra is kitér. Így a következő döntés mögött már összehasonlítható adatok állnak."
        ]
      }
    ],
    faq: [
      { question: "Egy 37 kW-os kompresszor mindig 37 kWh-t fogyaszt óránként?", answer: "Nem. A 37 kW jellemzően névleges motorteljesítmény. Az óránként felhasznált energia a teljes gépegység tényleges felvételétől és az üzemállapotoktól függ." },
      { question: "Milyen áramárat adjak meg a kalkulátorban?", answer: "A saját szerződéséhez tartozó, a megtakarított kWh-val ténylegesen elkerülhető egységköltséget használja. Nettó és bruttó összegeket ne keverjen; a fix díjakat kezelje külön." }
    ],
    cta: { title: "Mennyibe kerül az Ön kompresszorának egy éve?", text: "Adja meg a gép adatait, az üzemórát és az áramárat. Nézze meg a becsült fogyasztást és a korszerűsítés lehetséges éves megtakarítását." },
    relatedSlugs: ["fix-vagy-vsd-csavarkompresszor", "csavarkompresszor-csere-megterulese", "kompresszor-kalkulator-adatok"]
  },
  {
    slug: "csavarkompresszor-csere-megterulese",
    title: "Csavarkompresszor-csere: mikor térül meg a korszerűbb gép?",
    description: "Gyakorlati útmutató a csavarkompresszor-csere megtérüléséhez: energiamegtakarítás, teljes beruházási költség és érzékenységi számítás.",
    category: "Megtérülés",
    publishedAt: "2026-10-31",
    intro: [
      "A régi kompresszor még működik. A kérdés az, hogy mennyibe kerül megtartani. Ha az üzem sok órán át használ sűrített levegőt, egy mérsékelt teljesítménykülönbség is jelentős éves költséggé állhat össze.",
      "A jó cserejavaslat összeköti a műszaki illeszkedést az éves pénzügyi hatással. Ehhez világos beruházási összeg, ellenőrizhető megtakarítás és több üzemeltetési forgatókönyv kell. Az alábbi módszerrel előkészítheti a döntést anélkül, hogy egy általános megtakarítási ígéretre támaszkodna."
    ],
    takeaways: ["A teljes telepített beruházási költséggel számoljon.", "Az energiamegtakarítást azonos levegőellátási feltételekre vizsgálja.", "Az egyszerű megtérülést több üzemórával és energiaárral is ellenőrizze."],
    sections: [
      {
        id: "mit-hasonlitson-ossze",
        title: "Először a feladatot rögzítse, utána a gépet",
        paragraphs: [
          "Két gépet azonos szükséges légszállítás, nyomás és levegőminőség mellett lehet értelmesen összevetni. A kisebb névleges motor önmagában nem jelent jobb ajánlatot, ha a gép nem tudja kiszolgálni a termelést. Ugyanilyen fontos a részterhelési működés és a meglévő gépekkel való együttműködés.",
          "A rendszer egészének értékelése azért lényeges, mert a kompresszorcsere mellett a szabályozás, a tárolás és a hálózati veszteségek is befolyásolják az eredményt. A DOE útmutatója is rendszerszintű műszaki és gazdasági összevetésre épít."
        ],
        sourceIds: ["sourcebook"]
      },
      {
        id: "megterulesi-pelda",
        title: "Szemléltető példa: 6 kW különbségből 1,68 millió Ft évente",
        paragraphs: [
          "Tegyük fel, hogy az azonos feladatra alkalmas új megoldás átlagosan 6 kW-tal kevesebbet vesz fel. Évi 4 000 órával ez 24 000 kWh különbség. A példabeli 70 Ft/kWh egységárral az éves energiamegtakarítás 1 680 000 Ft.",
          "Ha a teljes telepített beruházás 6 000 000 Ft, és más költségkülönbséget most nem veszünk figyelembe, az egyszerű megtérülés körülbelül 3,6 év. Ez feltételezett számítás, nem gépajánlat és nem ügyféleredmény. A kalkulátor az energiaoldali előbecsléshez ad kiindulópontot."
        ],
        formula: "6 000 000 Ft ÷ 1 680 000 Ft/év ≈ 3,6 év"
      },
      {
        id: "teljes-beruhazas",
        title: "A vételár mellől ne maradjanak le a beüzemelés tételei",
        paragraphs: [
          "A megtérülés számlálójába az üzemképes állapot elérésének költsége kerüljön. Ha az egyik ajánlat telepítést és szárítót tartalmaz, a másik csak a gépet, a két végösszeg közvetlen összevetése félrevezető.",
          "Kérje külön soron a szükséges tartozékokat és munkákat. Az üzemszünet költségét akkor vegye figyelembe, ha azt a saját termelési adataival alá tudja támasztani. A biztonságosabb üzem értékes előny, de ne rendeljen hozzá bizonyíték nélkül tetszőleges forintösszeget."
        ],
        bullets: ["Kompresszor és szükséges levegőkezelés.", "Szállítás, villamos és csőhálózati csatlakozás.", "Beüzemelés, vezérlés és mérés.", "Igazolt karbantartási költségkülönbség, azonos időtávon."]
      },
      {
        id: "erzekenyseg",
        title: "Mi történik, ha kevesebbet termel az üzem?",
        paragraphs: [
          "Az előző példában 2 000 éves üzemórával az energiaoldali megtakarítás 840 000 Ft-ra csökken, a megtérülés pedig körülbelül 7,1 évre nő. Ha 6 000 óra a tényleges futás, a megtakarítás 2 520 000 Ft, a megtérülés közel 2,4 év.",
          "Ezért készítsen óvatos, várható és magas kihasználtságú változatot. Az áramárat is vizsgálja több értéken, saját szerződéses adatokból. A döntés akkor stabilabb, ha az óvatos forgatókönyv mellett is vállalható az eredmény."
        ]
      },
      {
        id: "kovetkezo-lepes",
        title: "A becsléstől a mérhető beruházásig",
        paragraphs: [
          "A kalkulátorban először a jelenlegi állapotot írja le. A becsült éves kWh- és Ft-megtakarítást vigye tovább a beszerzési egyeztetésre. A konkrét ajánlat teljes költségével ezután külön kiszámítható az egyszerű megtérülés.",
          "Az egyszerű megtérülési mutató nem tartalmazza a pénz időértékét, a finanszírozást és az energiaár jövőbeli alakulását. Nagy beruházásnál a vállalat saját pénzügyi módszerével is értékelje az ajánlatot. Beüzemelés után pedig azonos termelési feltételek mellett mérje vissza az energiahatást."
        ]
      }
    ],
    faq: [
      { question: "A tízéves kompresszort mindenképpen le kell cserélni?", answer: "Az életkor önmagában nem dönt. A mért energiaigény, a műszaki állapot, a terhelési profil, az alkatrészellátás és a termelési feladat együtt határozza meg a csere indokoltságát." },
      { question: "A kalkulátor végleges megtérülést ad?", answer: "Energiaoldali előbecslést ad. A beruházás megtérüléséhez szükséges a konkrét telepített ajánlati ár és a tényleges üzemeltetési költségek egyeztetése is." }
    ],
    cta: { title: "Mekkora éves megtakarítás indokolhatná a cserét?", text: "Kezdje a saját gépe energiaoldali előbecslésével. Az éves Ft- és kWh-különbséget használja a következő beszerzési egyeztetésen." },
    relatedSlugs: ["fix-vagy-vsd-csavarkompresszor", "csavarkompresszor-teljes-elettartam-koltseg", "suritett-levego-energiaaudit-elokeszites"]
  },
  {
    slug: "fix-vagy-vsd-csavarkompresszor",
    title: "Fix fordulat vagy RS/VSD? Így válasszon csavarkompresszort a terheléshez",
    description: "Mikor előnyös az RS/VSD csavarkompresszor, és mikor lehet megfelelő a fix fordulat? Terhelési profilok, üresjárat és összehasonlítási szempontok.",
    category: "Gépválasztás",
    publishedAt: "2026-10-31",
    intro: [
      "Az egyik műszakban szinte minden gép dolgozik, a másikban csak néhány fogyasztó kér levegőt. Ilyenkor a kompresszor feladata is változik. Ha a kiválasztás csak a legnagyobb pillanatnyi levegőigényre épül, a részterhelés költsége könnyen háttérbe szorul.",
      "Az RS/VSD szabályozás értékét a saját terhelési profilhoz kell mérni. Egyenletes alapterhelésre és erősen ingadozó fogyasztásra eltérő megoldás lehet gazdaságos. Nézzük meg, milyen adatokkal érdemes nekivágni az összehasonlításnak."
    ],
    takeaways: ["A VSD előnye a megfelelő szabályozási tartományban jelentkezik.", "A változó légszállítás és a villamos felvétel kapcsolata gépfüggő.", "Több gépnél a közös vezérlés és a gépek szerepe is döntő."],
    sections: [
      {
        id: "hogyan-szabalyoz",
        title: "Mit csinál másképp a fordulatszám-szabályozott gép?",
        paragraphs: [
          "A VSD, azaz variable speed drive a hajtás fordulatszámának változtatásával igazítja a légszállítást az igényhez. Az RS jelölést is használják fordulatszám-szabályozott sorozatoknál. A gép azonban csak a gyártó által megadott tartományban működtethető így; a minimális és maximális légszállítást is ellenőrizni kell.",
          "Az előny megítéléséhez a részterhelési teljesítménygörbe és a tárolókapacitás együtt fontos. A Natural Resources Canada útmutatója a VSD-k értékelésénél a változó igényt, a szabályozást és a megfelelő légtartályt is tárgyalja."
        ],
        sourceIds: ["guide"]
      },
      {
        id: "ket-terhelesi-profil",
        title: "Két üzem, két különböző választási helyzet",
        paragraphs: [
          "Az első üzem egy műszakon belül közel állandó mennyiségű levegőt használ. Itt egy megfelelően méretezett fix fordulatú gép is jó alapterhelési megoldás lehet. A második üzemben a fogyasztók szakaszosan indulnak, és a műszakok között is nagy az eltérés. Itt érdemes részletesen vizsgálni a szabályozott gép működését.",
          "A lényeg az időbeli megoszlás: hány órát tölt a rendszer kis, közepes és nagy igénynél? Egy átlagos m³/perc érték elfedheti, hogy a gép a nap jelentős részében a kedvezőtlen működési tartományába kerül."
        ],
        table: {
          caption: "Vizsgálati szempontok a saját terhelési profilhoz",
          headers: ["Üzemmenet", "Mit érdemes ellenőrizni?"],
          rows: [["Egyenletes, magas alapterhelés", "Fix gép hatásfoka és tényleges légszállítása"], ["Gyakran változó igény", "VSD részterhelési görbéje és szabályozási tartománya"], ["Több kompresszor", "Alapgép, szabályozó gép és közös vezérlés"]]
        }
      },
      {
        id: "uresjarat-koltsege",
        title: "Az üresjárat nem ingyenes készenlét",
        paragraphs: [
          "Terhelés–üresjárat szabályozásnál a gép levegőtermelés nélkül is fogyaszthat villamos energiát. A szabályozás értékeléséhez ezért a termelt levegő mellett a terhelt, üresjárati és leállított állapotok időarányát is látni kell. A vezérlés és a tároló összhangja befolyásolja a működést.",
          "Szemléltető példaként: ha egy mérés 9 kW átlagos felvételt mutat egy évi 1 200 órában jelentkező üresjárati állapotban, annak energiaigénye 10 800 kWh. 70 Ft/kWh feltételezett árral ez 756 000 Ft. Ez az üzemállapot költsége, nem automatikusan elérhető megtakarítás."
        ],
        sourceIds: ["controls"]
      },
      {
        id: "ajanlat-osszehasonlitas",
        title: "Ezt az öt adatot kérje az ajánlathoz",
        paragraphs: [
          "A technológia neve helyett az ajánlott konfigurációt hasonlítsa össze. Kérjen adatokat azonos üzemi nyomásra, és tisztázza, hogy a megadott villamos felvétel a teljes csomagra vagy csak egy részére vonatkozik. A segédberendezések fogyasztását azonos módon kezelje mindkét ajánlatban."
        ],
        bullets: ["Szállított levegőmennyiség a szükséges nyomáson.", "Teljes felvett villamos teljesítmény több terhelési ponton.", "Minimális és maximális szabályozott légszállítás.", "Tartály- és vezérlési igény a meglévő rendszerben.", "Karbantartási feltételek és teljes telepített ár."]
      },
      {
        id: "elso-osszevetes",
        title: "Kezdje két összehasonlítható előkalkulációval",
        paragraphs: [
          "A kalkulátorban rögzítse ugyanazt a gépméretet, üzemórát és áramárat, majd vizsgálja a fix és az RS/VSD lehetőséget a valós terheléshez illő beállításokkal. A különbség előszűrésre alkalmas: megmutatja, melyik irányt érdemes tovább mérni.",
          "A modellalapú kalkuláció nem helyettesíti a gyártói részterhelési görbéket és a helyszíni igényprofilt. Ha a rendszer sok időt tölt a kiválasztott VSD minimális légszállítása alatt, a kisebb gép, az eltérő gépkombináció vagy a vezérlés módosítása is vizsgálandó."
        ]
      }
    ],
    faq: [
      { question: "A VSD kompresszor minden üzemben kevesebbet fogyaszt?", answer: "Nem következik automatikusan a technológiából. A légszállítási igény, a részterhelési hatásfok, a nyomás, a vezérlés és a gépméretezés együtt dönti el az éves fogyasztást." },
      { question: "Meglévő fix gép mellé tehető szabályozott kompresszor?", answer: "Lehet megfelelő megoldás, de a gépek szerepét, nyomásbeállításait és közös vezérlését össze kell hangolni. Ezt a mért igényprofil alapján érdemes megtervezni." }
    ],
    cta: { title: "Melyik megoldás illik az Ön üzeméhez?", text: "Hasonlítsa össze a fix és az RS/VSD lehetőséget a saját üzemórájával, terhelési profiljával és energiaárával." },
    relatedSlugs: ["csavarkompresszor-meretezes-hibak", "csavarkompresszor-aramfogyasztas-szamitasa", "csavarkompresszor-csere-megterulese"]
  },
  {
    slug: "suritett-levego-szivargas-koltsege",
    title: "A szivárgó sűrített levegő ára: miért dolgozik a kompresszor termelés nélkül is?",
    description: "Szivárgáskeresés és energiaköltség: hogyan derítse ki, miért jár a kompresszor termelés nélkül, és hogyan igazolja a javítás hatását?",
    category: "Veszteségcsökkentés",
    publishedAt: "2026-10-31",
    intro: [
      "Leállt a termelés, de a kompresszor újra és újra elindul. Ez jó ok a vizsgálatra. A háttérben szivárgás is lehet, de működhetnek technológiai fogyasztók, szárítók vagy olyan ágak is, amelyekre műszakon kívül nincs szükség.",
      "Az elvesző levegő költsége nem egy látványos számlasor. Az üzemórában, a villamosenergia-fogyasztásban és a gép igénybevételében jelenik meg. Ha ezt megméri és forintra fordítja, a javítások sorrendje is sokkal könnyebben eldönthető."
    ],
    takeaways: ["Előbb válassza külön a szándékos fogyasztást a szivárgástól.", "A javítás után a kompresszor vezérlését is felül kell vizsgálni.", "A kalkulátor gépcsere-becslése nem szivárgásmérés."],
    sections: [
      {
        id: "hol-veszik-el",
        title: "A veszteség gyakran a csatlakozásoknál kezdődik",
        paragraphs: [
          "Gyorscsatlakozók, tömlők, menetes kötések, szerelvények és kondenzátum-elvezetők is lehetnek szivárgási pontok. A DOE szakanyaga szerint egyes ipari rendszerekben a szivárgás a kompresszor légszállításának jelentős részét emésztheti fel; ez azonban nem az Ön telephelyére mért arány.",
          "Az ultrahangos keresés segíthet a hibák feltárásában. A javítást érdemes nyilvántartással összekötni: azonosító, hely, becsült veszteség, felelős, javítási dátum és utóellenőrzés. Az egyszeri körbejárás helyett így követhető karbantartási folyamat alakul ki."
        ],
        sourceIds: ["leaks"]
      },
      {
        id: "mit-merjen",
        title: "Műszakon kívüli járás: erős jelzés, de még nem bizonyíték",
        paragraphs: [
          "Először tisztázza, mely fogyasztók maradnak jogszerűen üzemben a termelés leállítása után. Lehet olyan technológia, amely folyamatos levegőellátást kér. A szárító regenerálási levegője vagy egy automata ürítő működése is látható fogyasztást okozhat.",
          "Ezután kijelölt, összehasonlítható időablakban rögzítse a kWh-t, a nyomást és a kompresszor állapotait. Ha nincs folyamatos termelési levegőigény, az adatok segítenek megvizsgálni a veszteséget. Nyomásesésből csak a tárolótérfogat és a rendszer viselkedésének ismeretében szabad mennyiségi következtetést levonni."
        ]
      },
      {
        id: "javitas-erteke",
        title: "A megtakarítást a villamos oldalon igazolja",
        paragraphs: [
          "Tegyük fel, hogy azonos összehasonlítási feltételek mellett a javítás és az újraszabályozás után 4 kW-tal csökken az átlagos felvétel. Ha ez évi 3 000 órára érvényes, 12 000 kWh a különbség. 70 Ft/kWh szemléltető árral az energiahatás 840 000 Ft évente.",
          "A számítás szándékosan mért teljesítménykülönbségből indul ki. Egy becsült légveszteségi százalékot nem célszerű egyszerűen azonos villamos megtakarítási százalékként kezelni. A gép részterhelési működése és a vezérlés dönt arról, hogyan követi az energiafelvétel a csökkenő levegőigényt."
        ],
        formula: "Mért átlagteljesítmény-csökkenés × érintett éves üzemóra × saját Ft/kWh"
      },
      {
        id: "javitas-menete",
        title: "Javítson célzottan, és ellenőrizze az eredményt",
        paragraphs: [
          "A legjobb első lista azokat a hibákat emeli előre, amelyek nagy veszteséget okoznak, és a termeléshez igazodva javíthatók. A hibás kondenzátum-elvezető vagy a rossz csatlakozó cseréjének műszaki feltételeit a karbantartó csapat határozza meg.",
          "A javítás után ismételje meg a korábbi mérési időablakot hasonló nyomáson és termelés mellett. Ellenőrizze a vezérlést is: a kisebb igény akkor hoz energiamegtakarítást, ha a kompresszor ezt kedvezőbb üzemállapottal vagy rövidebb futással le tudja követni."
        ],
        sourceIds: ["leaks"]
      },
      {
        id: "csere-es-szivargas",
        title: "Mit jelent mindez a kompresszorcserére nézve?",
        paragraphs: [
          "A javítás után kisebb lehet az ellátandó igény. Ezért új gép méretezését lehetőleg a rendezett rendszer adataira alapozza. Ellenkező esetben a korábbi veszteség egy része beépülhet az új kapacitásba is.",
          "A kalkulátor segít az energiaoldali nagyságrend és a gépcsere lehetőségének felmérésében. Szivárgási arányt nem mér és nem állapít meg. A javítási megtakarítást és a gépcsere megtakarítását mindig közös, javítás utáni alapállapothoz igazítsa, hogy ugyanazt a veszteséget ne számolja el kétszer."
        ]
      }
    ],
    faq: [
      { question: "Ha hallom a szivárgást, tudom a veszteség forintértékét?", answer: "A hang önmagában nem ad megbízható költségadatot. A levegőveszteség becslése, az üzemidő és a rendszer energiaigénye együtt szükséges a pénzügyi értékeléshez." },
      { question: "Szivárgásjavítás után azonnal kisebb lesz a villanyszámla?", answer: "A levegőigény csökkenhet, de a villamos hatás a vezérléstől és az üzemállapotoktól függ. A javítást követő mérés és szükség szerinti újraszabályozás igazolja az eredményt." }
    ],
    cta: { title: "Mekkora energiaköltségből gazdálkodik a rendszere?", text: "Készítsen előzetes becslést a jelenlegi kompresszorra. A gépcsere vizsgálatát ezután kapcsolja össze a veszteségek helyszíni felmérésével." },
    relatedSlugs: ["kompresszor-uzemi-nyomas-energiakoltseg", "suritett-levego-energiaaudit-elokeszites", "csavarkompresszor-meretezes-hibak"]
  },
  {
    slug: "kompresszor-uzemi-nyomas-energiakoltseg",
    title: "Túl magas az üzemi nyomás? Így növelheti a kompresszor energiaköltségét",
    description: "Miért drága a felesleges nyomás, és mit vizsgáljon a beállítás módosítása előtt? Nyomásprofil, hálózati veszteség és szemléltető költségszámítás.",
    category: "Rendszeroptimalizálás",
    publishedAt: "2026-10-31",
    intro: [
      "Az egyik távoli munkaponton kevés a levegő, ezért feljebb állítják a kompresszor nyomását. A panasz átmenetileg megszűnik, a teljes hálózat viszont magasabb nyomáson működik tovább. Az eredeti szűkület vagy hibás beállítás közben megmaradhat.",
      "A helyes kérdés az, hogy a kritikus fogyasztó a szükséges időpontban megkapja-e az előírt nyomást és levegőmennyiséget. Ennek tisztázásával elválasztható a valódi kapacitásigény az elosztóhálózat problémájától."
    ],
    takeaways: ["A kompresszornál és a fogyasztónál mért nyomás együtt értelmezhető.", "A magasabb nyomás többletenergiát és nagyobb szivárgást is jelenthet.", "Csökkentés előtt a technológiai minimumot és a csúcsterhelést is ellenőrizni kell."],
    sections: [
      {
        id: "nyomas-koltsege",
        title: "Miért van ára a felesleges nyomásnak?",
        paragraphs: [
          "Magasabb kilépőnyomás előállítása több munkát igényelhet. A nyomás emelése az állandóan nyitott vagy szabályozatlan fogyasztók levegőigényét és a szivárgási veszteséget is növelheti. A tényleges hatás gép- és rendszerfüggő.",
          "A kanadai energiahatékonysági útmutató ezért a lehető legalacsonyabb, a feladatot még megbízhatóan kiszolgáló nyomást és a hálózati nyomásveszteség csökkentését hangsúlyozza. Az általános ökölszabályok helyett a saját gép gyártói adataival és helyszíni méréssel készítsen becslést."
        ],
        sourceIds: ["guide"]
      },
      {
        id: "nyomasprofil",
        title: "A nyomásprofil megmutatja, hol keletkezik a probléma",
        paragraphs: [
          "Egyetlen, a gépházban leolvasott érték kevés. Rögzítse a nyomást a kompresszor után, a levegőkezelés után és a kritikus fogyasztónál, lehetőleg azonos időben. A rövid idejű eséseket az egyszeri kézi leolvasás könnyen elvéti.",
          "A DOE nyomásstabilizálási anyaga szerint az időszakos nagy levegőigény és a vezérlés reakciója is okozhat nyomásingadozást. A megfelelő tárolás és szabályozás vizsgálata ezért ugyanúgy része a feladatnak, mint a kompresszor teljesítményének ellenőrzése."
        ],
        sourceIds: ["pressure"]
      },
      {
        id: "szuk-keresztmetszetek",
        title: "Ezeket nézze meg, mielőtt nagyobb kompresszort rendel",
        paragraphs: [
          "Ha a gépházban megfelelő a nyomás, de a felhasználás helyén terhelés alatt leesik, vizsgálja meg az odavezető út elemeit. Jegyezze fel, mely termelési eseménynél jelentkezik a panasz: egy új fogyasztó indulásánál, párhuzamos használatnál vagy tartós csúcsterhelésnél.",
          "Az ellenőrzési sorrendet a nyomásmérési adatok alapján alakítsa ki. Így a karbantartás célzott beavatkozás lehet, és a méretezéshez is jobb alapadat keletkezik."
        ],
        bullets: ["Eltömődött vagy nem megfelelően méretezett szűrők.", "Szárító és vízleválasztó nyomásesése.", "Hosszú tömlők, szűk gyorscsatlakozók, csőhálózati szűkületek.", "Szabályozók, vezérlés és helyi tárolási igény."]
      },
      {
        id: "meresi-pelda",
        title: "A nyomásrendezés energiahatását így fordítsa forintra",
        paragraphs: [
          "Szemléltető esetben a veszteségek rendezése után a mért átlagos villamos felvétel 32 kW-ról 30,5 kW-ra csökken, miközben a termelési követelmények változatlanok. A különbség 1,5 kW. Évi 4 000 órával 6 000 kWh, a példabeli 70 Ft/kWh árral 420 000 Ft az éves energiahatás.",
          "Ez nem egy adott nyomáscsökkentéshez ígért eredmény. A példa azt mutatja meg, hogyan értékeljen egy már igazolt teljesítménykülönbséget. A nyomás és az energia kapcsolatát a saját rendszerén kell meghatározni."
        ],
        formula: "(32 − 30,5) kW × 4 000 óra × 70 Ft/kWh = 420 000 Ft/év"
      },
      {
        id: "kalkulator-szerepe",
        title: "Előbb rendszeradat, aztán gépcsere-becslés",
        paragraphs: [
          "A szükséges üzemi nyomást a fogyasztók előírásai és az ellenőrzött rendszerfeltételek alapján rögzítse. A beállítás módosítását a felelős műszaki szakember végezze, termelési ellenőrzéssel. Egy véletlenszerű csökkentés selejtet vagy leállást okozhat.",
          "A kalkulátor a kompresszorcsere energiaoldali előszűrésére használható; a hálózat nyomásveszteségét nem számítja ki. A két vizsgálat egymást egészíti ki: a rendezett nyomásigény mellett már jobban megítélhető, milyen gépnek kell ellátnia a feladatot."
        ]
      }
    ],
    faq: [
      { question: "Csökkenthetem egyszerűen egy barral a nyomást?", answer: "Előbb ellenőrizni kell a fogyasztók minimumkövetelményeit és a csúcsigénynél jelentkező nyomásesést. A változtatás szakemberrel, kontrollált lépésekben és termelési visszaellenőrzéssel végezhető." },
      { question: "A kalkulátor kiszámítja egy bar nyomáscsökkentés megtakarítását?", answer: "Nem. A kalkulátor gépadatokból, üzemórából, terhelési profilból és energiaárból ad előbecslést. A nyomásmódosítás hatásához külön műszaki vizsgálat szükséges." }
    ],
    cta: { title: "Mekkora megtakarítási lehetőség van a gépcserében?", text: "A nyomásvizsgálat mellé készítsen energiaoldali előbecslést is. A saját kompresszoradataival láthatja az éves különbség nagyságrendjét." },
    relatedSlugs: ["suritett-levego-szivargas-koltsege", "csavarkompresszor-meretezes-hibak", "suritett-levego-energiaaudit-elokeszites"]
  },
  {
    slug: "csavarkompresszor-hovisszanyeres",
    title: "Csavarkompresszor-hővisszanyerés: mikor lesz a hulladékhőből valódi megtakarítás?",
    description: "Fűtés, melegvíz és szezonális hőigény: így értékelje a csavarkompresszor hővisszanyerését. Hasznos hő és elkerülhető gázköltség, példával.",
    category: "Hővisszanyerés",
    publishedAt: "2026-10-31",
    intro: [
      "A csavarkompresszor működés közben hőt termel. Ha az üzemben eközben fűtésre vagy melegvízre is szükség van, érdemes megvizsgálni, hasznosítható-e ennek egy része. A gépházban keletkező meleg azonban önmagában még nem jelent pénzben realizálható megtakarítást.",
      "Az üzleti eredményt a hasznosítható hőmennyiség, a hőigény időzítése és a ténylegesen kiváltott energia határozza meg. A jó becslés ezekből indul ki, és külön kezeli a fűtési szezont, a nyári felhasználást és a beruházási költséget."
    ],
    takeaways: ["A rendelkezésre álló hőből csak a ténylegesen felhasznált rész értékes.", "A kompresszor üzemidejének és a hőigénynek egybe kell esnie.", "A hőhasznosítás a fűtési költséget csökkentheti; a villamos megtakarítás külön tétel."],
    sections: [
      {
        id: "felhasznalasi-lehetosegek",
        title: "Hová kerülhet a visszanyert hő?",
        paragraphs: [
          "Lehetséges felhasználás a helyiségfűtés, a használati melegvíz előmelegítése vagy bizonyos technológiai hőigények kiszolgálása. A konkrét megoldást a kompresszor kialakítása, a rendelkezésre álló hőmérséklet, a hőcserélő és az elosztás együtt határozza meg.",
          "A Compressed Air Challenge szakanyaga hangsúlyozza, hogy a hőhasznosítás gazdasági értékét a jelenlegi hőtermelés költségéhez kell viszonyítani. Ugyanakkora hőmennyiség más megtakarítást ér, ha eltérő energiahordozót vagy eltérő hatásfokú berendezést vált ki."
        ],
        sourceIds: ["heat"]
      },
      {
        id: "egyidejuseg",
        title: "A döntő kérdés: akkor kell-e a hő, amikor a gép működik?",
        paragraphs: [
          "Egy nyáron is sokat futó kompresszor éves hőtermelése magas lehet, de kizárólag téli csarnokfűtésnél ennek csak egy része használható. Ha egész évben van melegvíz-igény, a szezonon kívüli hasznosítás is vizsgálható. A két igény hőmérséklete és napi időzítése eltérhet.",
          "Készítsen havi üzemóra- és hőigénytáblát. Jelölje benne a műszakokat, a fűtési hónapokat, a melegvíz-felhasználást és azokat az időszakokat, amikor nincs hőátvevő. A tárolás javíthatja az időbeli illeszkedést, de annak mérete, vesztesége és ára is a terv része."
        ]
      },
      {
        id: "hasznos-ho-pelda",
        title: "Szemléltető számítás: 50 000 kWh helyett 30 000 kWh hasznos hő",
        paragraphs: [
          "Tegyük fel, hogy a hőátadási ponton 25 kW teljesítmény áll rendelkezésre évi 2 000, hőigénnyel egybeeső órában. Ez 50 000 kWh elméletileg átadható hő. Ha az elosztás és a tényleges igény miatt ennek 60%-át használja fel az üzem, a hasznos éves mennyiség 30 000 kWh.",
          "Ha ez a hő egy 90%-os szezonális hatásfokú kazán hőtermelését váltja ki, az elkerülhető tüzelőanyag-energia körülbelül 33 333 kWh. Gázmennyiségre a saját elszámolási fűtőértékkel váltható át. Az árhoz a saját szerződés fogyasztásarányos díját kell használni; itt nincs feltételezett aktuális gázár."
        ],
        formula: "Hasznos hő = 25 kW × 2 000 óra × 0,60 = 30 000 kWh/év"
      },
      {
        id: "koltsegek-es-kettos-szamitas",
        title: "A kiegészítő költségeket és az új gép hőtermelését is számolja bele",
        paragraphs: [
          "A hőcserélő, csővezeték, szivattyú, szabályozás, tároló és szerelés együtt adja a beruházási oldalt. Az üzemeltetésnél a szivattyú energiáját és a karbantartást is vegye figyelembe. A megoldásnak a kompresszor gyártói előírásaival és a meglévő fűtési rendszerrel is össze kell férnie.",
          "Ha a kompresszort is lecseréli, az új gép hőtermelésével készítsen közös becslést. A régi, nagyobb villamos felvételű gép hőmennyiségét nem helyes változatlanul továbbvinni az új gép energiamegtakarítása mellé. Ugyanazt az energiaáramot két külön előnyként elszámolva túlzó eredmény adódhat."
        ]
      },
      {
        id: "hovisszanyeres-kalkulator",
        title: "Mit nézzen meg a kalkulátor hővisszanyerési részében?",
        paragraphs: [
          "A kalkulátorban kapcsolja be a hővisszanyerést, majd ellenőrizze a fűtési hónapok és a saját gázár értékét. Ha szezonon kívül is van hőigény, a használati melegvíz lehetőségét is a valós felhasználás szerint állítsa be. Az alapbeállítások feltételezések, nem telephelyi mérési eredmények.",
          "Az előbecslés alapján látható, érdemes-e hőtechnikai tervet készíteni. A végleges döntéshez hőmérsékletek, térfogatáramok, rendelkezésre álló hőátvevő és tételes kivitelezési ajánlat szükséges. A pénzügyi számításban a villamos és a hőoldali hatást külön soron tartsa nyilván."
        ]
      }
    ],
    faq: [
      { question: "A hővisszanyerés csökkenti a kompresszor áramfogyasztását?", answer: "Elsősorban a más forrásból előállított hő egy részét válthatja ki. A kompresszor villamos megtakarítását külön kell értékelni, a hőhasznosítás segédenergia-igényével együtt." },
      { question: "Minden megtermelt hő megtakarításnak számít?", answer: "Csak az a hő jelent elkerülhető költséget, amely megfelelő időben és hőmérsékleten valódi hőigényt lát el. A fel nem használt hőt nem szabad teljes értéken elszámolni." }
    ],
    cta: { title: "Hasznosulhatna a kompresszor hője az Ön üzemében?", text: "Nézze meg a gépcsere energiahatását és a hővisszanyerés előzetes lehetőségét. A fűtési időszakot és a gázárat a saját adataihoz igazíthatja." },
    relatedSlugs: ["csavarkompresszor-teljes-elettartam-koltseg", "csavarkompresszor-csere-megterulese", "kompresszor-kalkulator-adatok"]
  },
  {
    slug: "csavarkompresszor-meretezes-hibak",
    title: "Csavarkompresszor-méretezés: 5 hiba, amely évekre megdrágíthatja az üzemeltetést",
    description: "Túlméretezés, csúcsigény, légszállítás és nyomás: az öt legfontosabb méretezési hiba kompresszorbeszerzés előtt, gyakorlati ellenőrzőlistával.",
    category: "Gépválasztás",
    publishedAt: "2026-10-31",
    intro: [
      "A nagyobb kompresszor biztonságos választásnak tűnhet. Ha azonban a gép az év nagy részében kedvezőtlen részterhelésen dolgozik, a tartalék kapacitásnak tartós üzemeltetési ára lehet. A túl kis gép közben nyomásproblémát és termelési fennakadást okozhat.",
      "A megfelelő méret a levegőigény időbeli alakulásából, a szükséges nyomásból és a levegőminőségi feladatból vezethető le. A motor kW-értéke ennek csak egy része. Az alábbi öt hiba elkerülésével jobb kérdéseket tehet fel az ajánlatadó műszaki csapatnak."
    ],
    takeaways: ["A méretezés alapja a légszállítási igény és annak időbeli lefutása.", "A csúcsigényt, az átlagot és a jövőbeli bővítést külön kezelje.", "A kalkulátor energiaoldali előszűrés; nem automatikus légtechnikai méretezés."],
    sections: [
      {
        id: "csak-kw-alapjan",
        title: "1. hiba: csak a névleges kW alapján választ",
        paragraphs: [
          "Az azonos névleges motorteljesítményű gépek szállított levegőmennyisége és teljes villamos felvétele eltérhet. Az üzemi nyomás is befolyásolja az összevetést. Először azt írja le, mekkora levegőmennyiségre van szükség az adott feladathoz, és milyen nyomáson.",
          "Az ajánlatban kérje a tényleges légszállítást, a teljes csomag villamos felvételét és az adatok mérési feltételeit. A DOE rendszerelemzési útmutatója a mennyiség, a minőség, a nyomás és a terhelési profil közös meghatározásából indul ki."
        ],
        sourceIds: ["analysis"]
      },
      {
        id: "csucs-es-atlag",
        title: "2. hiba: a csúcsterhelést egész napos igényként kezeli",
        paragraphs: [
          "Néhány másodperces vagy perces csúcsot másképp kell kezelni, mint a többórás magas fogyasztást. Jegyezze fel a csúcs időtartamát, ismétlődését és a fogyasztók egyidejűségét. A névleges igények egyszerű összeadása túlzó eredményt adhat, ha a berendezések ritkán működnek egyszerre.",
          "Szemléltető üzemmenetben napi hat órán át 3 m³/perc, majd két órán át 6 m³/perc a levegőigény. A nagyobb érték teljesítése szükséges, de az éves hatékonyságot a kisebb igénynél töltött idő is alakítja. A teljes profil alapján kell gépkombinációt és szabályozást vizsgálni."
        ]
      },
      {
        id: "vesztesegekre-meretezes",
        title: "3. hiba: a szivárgásnak és a nyomásveszteségnek vásárol kapacitást",
        paragraphs: [
          "Ha a meglévő hálózat rendezetlen, a jelenlegi gép terhelése nem feltétlenül a termelés hasznos igényét mutatja. A veszteségek javítása után kisebb lehet a szükséges légszállítás. A régi állapotból kiinduló új gép így feleslegesen nagy maradhat.",
          "A bővítési tervet válassza külön a fennálló hibáktól. A tervezett új gyártósor dokumentált igénye indokolhat tartalékot; egy meg nem vizsgált nyomáspanasz ennél gyengébb alap. Rögzítse, milyen termelési változásra és milyen időponttól kell a többletkapacitás."
        ]
      },
      {
        id: "levego-kezeles",
        title: "4. hiba: kimarad a szárító, a szűrés és a levegőminőség",
        paragraphs: [
          "A termelés nem egyszerűen levegőt, hanem meghatározott minőségű levegőt igényel. A szárítót és a szűrőket ehhez kell illeszteni. A nem megfelelő levegőkezelés minőségi problémát okozhat, a szükségtelenül szigorú kezelés pedig plusz beruházást és üzemeltetési költséget jelenthet.",
          "A DOE levegőminőségi anyaga szerint a szűrők nyomásesése a szennyeződéssel növekedhet. Az ajánlatban ezért a levegőkezelés méretezése és nyomásvesztesége is szerepeljen, a tényleges üzemi feltételekhez igazítva."
        ],
        sourceIds: ["quality"]
      },
      {
        id: "tartalek-es-vezerles",
        title: "5. hiba: az üzembiztonságot egyszerű túlméretezéssel oldja meg",
        paragraphs: [
          "A tartalék gép, a karbantarthatóság és a termelés folytonossága külön tervezési kérdés. Egy nagyobb egyetlen kompresszor nem ad automatikusan ellátási tartalékot meghibásodáskor. Több gépnél pedig a közös működést is meg kell tervezni.",
          "A döntés előtt készítsen egyoldalas igényleírást: jellemző és csúcslégszállítás, szükséges nyomás, levegőminőség, üzemidő, tervezett bővítés és tartalékigény. A kalkulátorban ezzel párhuzamosan ellenőrizheti a gépcsere becsült energiahatását. A konkrét légtechnikai alkalmasságot a felmérés és az ajánlat igazolja."
        ]
      }
    ],
    faq: [
      { question: "A kalkulátor megmondja, hány m³/perc levegőre van szükségem?", answer: "Nem. A termelés légszállítási igényét mérésből és a fogyasztók adataiból kell meghatározni. A kalkulátor a megadott gépadatok energiaoldali összevetésében segít." },
      { question: "Érdemes automatikusan egy mérettel nagyobb gépet választani?", answer: "A tartalék indokát és mértékét dokumentált bővítési vagy üzembiztonsági igényre alapozza. A nagyobb gép részterhelési működését és éves költségét külön ellenőrizni kell." }
    ],
    cta: { title: "A megfelelő méret mellé lássa az éves energiaköltséget is", text: "Nézze meg a jelenlegi gép és egy korszerűbb megoldás becsült energiaigényét. Az eredményt vigye tovább a műszaki méretezési egyeztetésre." },
    relatedSlugs: ["fix-vagy-vsd-csavarkompresszor", "kompresszor-uzemi-nyomas-energiakoltseg", "suritett-levego-energiaaudit-elokeszites"]
  },
  {
    slug: "suritett-levego-energiaaudit-elokeszites",
    title: "Sűrített levegő energiaaudit: mit mérjen meg kompresszorcsere előtt?",
    description: "Mérési terv kompresszorcsere előtt: villamos felvétel, nyomás, légszállítás, terhelési profil és veszteségek. Így készítse elő az energiaauditot.",
    category: "Energiaaudit",
    publishedAt: "2026-10-31",
    intro: [
      "Magas a villanyszámla, gyakori a nyomáspanasz, és az új kompresszor ajánlata már az asztalon van. Mielőtt dönt, érdemes tisztázni, hogy a költség mekkora része kötődik a géphez, a hálózathoz és a termelés levegőigényéhez.",
      "Egy jól előkészített sűrítettlevegő-vizsgálat az üzem tényleges feladatát mutatja meg. Nemcsak egy nagyobb vagy újabb gép kiválasztásához ad adatot: a javítások, a vezérlés és a beruházások sorrendjét is segít meghatározni."
    ],
    takeaways: ["A mérési időszak fedje le a jellemző műszakokat és termelési állapotokat.", "A villamos, nyomás- és légszállítási adatok időben legyenek összevethetők.", "A javítások és a gépcsere hatását közös alapállapotra kell számolni."],
    sections: [
      {
        id: "jo-audit-kerdese",
        title: "Mit kell megválaszolnia a vizsgálatnak?",
        paragraphs: [
          "Előre rögzítse a döntési kérdést. Például: elegendő-e a jelenlegi kapacitás a következő gyártósorhoz; indokolt-e a kompresszorcsere; vagy milyen beavatkozás csökkenti leginkább a műszakon kívüli fogyasztást? Egy világos kérdéshez célzott mérési terv készíthető.",
          "A DOE útmutatója a kiinduló villamos teljesítmény, a nyomásprofil, az igényprofil és a szivárgási terhelés meghatározását is javasolja. A beavatkozás utáni újramérés ugyanennek a folyamatnak a része."
        ],
        sourceIds: ["analysis"]
      },
      {
        id: "mit-keszitsen-elo",
        title: "Milyen adatokat készítsen elő a méréshez?",
        paragraphs: [
          "A géplistát egészítse ki a szárítók, tartályok és főbb levegőkezelők adataival. Egy egyszerű hálózati vázlat is hasznos: jelölje a gépházat, a fő ágakat és a kritikus fogyasztókat. A korábbi nyomáspanaszok időpontjai segíthetnek a mérési pontok kijelölésében.",
          "A termelési csapat adja meg a műszakrendet és a jellemző termékváltásokat. A karbantartás készítse elő a gépállapotokat és a számlálóadatokat. Az energiaköltséghez a szerződéses egységár szükséges, az adat fogalmának és adózási alapjának egyértelmű rögzítésével."
        ],
        bullets: ["Géptípus, névleges teljesítmény, életkor és szabályozás.", "Összes és terhelt üzemóra, szervizelőzmény.", "Műszakrend, termelési volumen, szükséges levegőminőség.", "Nyomásbeállítások és kritikus fogyasztói követelmények.", "Villamosenergia-ár és a mérendő segédberendezések köre."]
      },
      {
        id: "meresi-idoszak",
        title: "A jó mérés a termeléssel együtt értelmezhető",
        paragraphs: [
          "Egy rövid, rendhagyó műszak nem feltétlenül írja le az egész évet. A mérési időszak tartalmazzon jellemző alacsony és magas terhelést, indulást, leállást és szükség szerint termelésmentes időt. A szükséges időtartamot az üzem változékonysága határozza meg.",
          "Az adatsorhoz eseménynapló is kell. Ha egy fogyasztó a mérés alatt kiesett, vagy szokatlanul nagy sorozat futott, ezt jelöljék. Ellenkező esetben a grafikon pontos mérést mutathat, mégis rossz éves következtetéshez vezethet."
        ]
      },
      {
        id: "intezkedesek-sorrendje",
        title: "A jelentés végén intézkedési tervet kérjen",
        paragraphs: [
          "A hasznos jelentés megmutatja a kiinduló állapotot, a beavatkozás műszaki feltételeit, költségét és várható hatását. Külön kezelje a karbantartást, a vezérlés módosítását, a hálózati javítást és a gépcserét. Az egyes intézkedések egymásra hatását is fel kell tüntetni.",
          "Például a szivárgásjavítás csökkentheti az új gép ellátandó igényét. Ha a gépcsere megtakarítását még a javítás előtti állapotra számolják, az összesített ígéret túlzó lehet. Kérjen egyértelmű választ arra, melyik adat mért, melyik becsült, és melyik beavatkozási sorrendre érvényes."
        ]
      },
      {
        id: "kalkulacio-es-visszameres",
        title: "A kalkulátor az első szűrésben, a mérés a döntésben segít",
        paragraphs: [
          "A felmérés előtt a kalkulátorral gyorsan elkészítheti az energiaoldali előbecslést a rendelkezésre álló gépadatokból. Ezzel már nagyságrendi kérdésekkel érkezhet az egyeztetésre. A kalkuláció kiindulási adatlapként is használható a pontosításhoz.",
          "A beruházás után a siker feltétele az összehasonlítható visszamérés. A kisebb kWh csak hasonló termelés, nyomás és levegőminőség mellett igazolhatja közvetlenül a javulást. Ha a termelési volumen változott, a fajlagos mutatókat és a működési feltételeket is értékelni kell."
        ]
      }
    ],
    faq: [
      { question: "Az online kalkuláció energiaauditnak számít?", answer: "Nem. A kalkulátor modellalapú előbecslés. A helyszíni vizsgálat a valós villamos, nyomás- és igényadatokat, valamint a rendszer működését értékeli." },
      { question: "Mi legyen a felmérés kézzelfogható eredménye?", answer: "Dokumentált alapállapot, értelmezhető mérési adatsor, rangsorolt intézkedési terv és a becslések feltételei. Legyen meghatározva az eredmény későbbi visszamérésének módja is." }
    ],
    cta: { title: "Érdemes részletesen megvizsgálni az Ön rendszerét?", text: "Induljon egy energiaoldali előkalkulációval. A saját adataiból becsült éves megtakarítás megmutatja a további vizsgálat nagyságrendjét." },
    relatedSlugs: ["kompresszor-kalkulator-adatok", "suritett-levego-szivargas-koltsege", "csavarkompresszor-csere-megterulese"]
  },
  {
    slug: "csavarkompresszor-teljes-elettartam-koltseg",
    title: "A csavarkompresszor valódi ára: mit mutat a teljes üzemeltetési költség?",
    description: "A vételár mellett energia, szerviz és telepítés is számít. Így hasonlítsa össze a csavarkompresszorok teljes költségét egy ötéves példán.",
    category: "Beszerzési döntés",
    publishedAt: "2026-10-31",
    intro: [
      "Két kompresszorajánlat közül az olcsóbb gép elsőre jobb üzletnek látszik. Több ezer éves üzemóra mellett azonban az energiaigény különbsége idővel felülírhatja a beszerzési ár előnyét. Ugyanígy számíthat a telepítés tartalma és a szerviz feltételrendszere.",
      "A teljes költség szemlélete közös időtávra hozza ezeket a tételeket. Így láthatóvá válik, mennyi pénzbe kerül az elvárt levegőellátás öt vagy több éven át. Ez az összehasonlítás a műszaki alkalmasság ellenőrzése után igazán hasznos."
    ],
    takeaways: ["Az ajánlatokat azonos műszaki tartalommal és időtávon hasonlítsa össze.", "Az energiakülönbség sok üzemórán át jelentős költséggé adódhat össze.", "A szerviz- és állásidőköltséghez saját adatot vagy tételes ajánlatot használjon."],
    sections: [
      {
        id: "koltsegtetelek",
        title: "Mi tartozik a teljes költségbe?",
        paragraphs: [
          "Az egyszeri beruházáshoz a gép, a szükséges tartozékok, a szállítás és az üzembe helyezés tartozik. Az éves oldalon a villamos energia, a karbantartás és az igazolható egyéb üzemeltetési tételek jelennek meg. A költségek körét még az ajánlatok bekérése előtt rögzítse.",
          "A DOE ipari útmutatója is a rendszer gazdasági értékelésének részeként kezeli az energiát és az üzemeltetést. A cél olyan összehasonlítás, amelyben ugyanarra a termelési feladatra és azonos feltételekkel számolnak."
        ],
        sourceIds: ["sourcebook"]
      },
      {
        id: "ot-eves-pelda",
        title: "Szemléltető ötéves példa: a magasabb vételár is lehet kedvezőbb",
        paragraphs: [
          "Az A ajánlat teljes telepített ára a példában 4,5 millió Ft, a B ajánlaté 6 millió Ft. A feladatuk azonos, de a feltételezett átlagos villamos felvétel A esetén 32 kW, B esetén 27 kW. Évi 4 000 órával és 70 Ft/kWh állandó árral számolunk.",
          "Öt év alatt A energiaigénye 44,8 millió Ft-ba, B energiaigénye 37,8 millió Ft-ba kerül. A beruházással együtt ez 49,3, illetve 43,8 millió Ft. A példában B 5,5 millió Ft-tal kedvezőbb, mielőtt az itt még nem ismert szerviz-, finanszírozási és egyéb tételeket hozzáadnánk."
        ],
        table: {
          caption: "Feltételezett beruházási és energiaköltség öt évre; nem teljes ajánlat",
          headers: ["Tétel", "A megoldás", "B megoldás"],
          rows: [["Telepített beruházás", "4 500 000 Ft", "6 000 000 Ft"], ["Átlagos villamos felvétel", "32 kW", "27 kW"], ["Öt év energiaköltsége", "44 800 000 Ft", "37 800 000 Ft"], ["Beruházás + energia", "49 300 000 Ft", "43 800 000 Ft"]]
        }
      },
      {
        id: "szerviz-es-allapot",
        title: "A karbantartást tételesen, a kockázatot bizonyítékkal kezelje",
        paragraphs: [
          "Kérjen azonos időtávra és üzemórára szerviztervet. Tisztázza az alkatrész- és munkadíjakat, a kiszállást és azt, mely nagyobb munkák eshetnek az értékelési időszakra. Az ajánlatokban szereplő éves összegek csak azonos tartalom mellett összevethetők.",
          "A karbantartás az energiahatékonyságot és a rendelkezésre állást is befolyásolhatja. A DOE megelőző karbantartási anyaga rendszeres, gyártói előíráson alapuló és dokumentált programot javasol. Az állásidő pénzügyi hatását viszont a saját termelési adatai alapján értékelje."
        ],
        sourceIds: ["maintenance"]
      },
      {
        id: "ar-es-ido",
        title: "A hosszabb időtáv több feltételezést is jelent",
        paragraphs: [
          "Az ötéves példa változatlan áramárat és üzemmenetet feltételez. Ez jó összehasonlítási alap, de nem előrejelzés. A valós tervben az energiaár, a kihasználtság és a termelés változása miatt több forgatókönyvet érdemes készíteni.",
          "Ha a vállalat beruházási döntése diszkontált pénzáramot használ, alkalmazza azt az ajánlatokra is. A maradványértéket, a finanszírozást és az esetleges hőhasznosítást külön, következetes feltételekkel vegye fel. Nettó költségsort nettó költségsorral hasonlítson össze."
        ]
      },
      {
        id: "vezetoi-osszehasonlitas",
        title: "Milyen adat kerüljön a döntéshozó elé?",
        paragraphs: [
          "Egy rövid összehasonlításban mutassa meg a műszaki feladatot, a teljes telepített árat, az éves kWh-t, az éves energiaköltséget és a szervizkeretet. Jelölje külön, mi mért adat, mi ajánlati vállalás és mi modellalapú becslés.",
          "A kalkulátor az energiaoldali adatokat segít előkészíteni. A saját üzemórával és áramárral számolt előbecslést egészítse ki a két ajánlat konkrét áraival. Így a megbeszélésen a vételár mellett az üzemeltetés várható nagyságrendje is látható lesz."
        ]
      }
    ],
    faq: [
      { question: "Az olcsóbb kompresszor mindig drágább lesz hosszú távon?", answer: "Nem. A teljes költséget az adott gépek ára, energiaigénye, üzemórája és karbantartása együtt határozza meg. Az eredményt azonos műszaki feladatra kell kiszámolni." },
      { question: "A kalkulátor ötéves megtakarítása árprognózis?", answer: "Nem. A megadott üzemóra és energiaár mellett számolt nagyságrend, változatlan feltételekkel. A jövőbeli árak és a termelési változások külön forgatókönyvet igényelnek." }
    ],
    cta: { title: "Mennyit számítana az energia az Ön következő beszerzésénél?", text: "Számolja ki a becsült éves megtakarítást a saját üzemadataival, majd tegye az eredményt a konkrét gépajánlat mellé." },
    relatedSlugs: ["csavarkompresszor-csere-megterulese", "csavarkompresszor-hovisszanyeres", "csavarkompresszor-aramfogyasztas-szamitasa"]
  },
  {
    slug: "kompresszor-kalkulator-adatok",
    title: "Kompresszor kalkulátor: ezt a 6 adatot készítse elő a használatához",
    description: "Márka, teljesítmény, életkor, üzemóra, áramár és terhelés: útmutató a csavarkompresszor kalkulátor bemeneteihez és az eredmény értelmezéséhez.",
    category: "Kalkulátor útmutató",
    publishedAt: "2026-10-31",
    intro: [
      "Szeretné látni, mekkora éves energiamegtakarítást jelenthet egy korszerűbb csavarkompresszor? Az előkalkulációhoz nem kell teljes mérési jelentés. Néhány alapadatból elindulhat, és később pontosíthatja azokat.",
      "A használható eredményhez azt érdemes tudni, honnan származik az egyes bemenet. Egy leolvasott üzemóra, egy szerződésből vett áramár és egy reálisan választott terhelési profil együtt jobb döntési alapot ad, mint a véletlenszerűen elfogadott alapbeállítások."
    ],
    takeaways: ["Hat fő bemenet írja le a jelenlegi gépet és a használatát.", "A bizonytalan adatokat több forgatókönyvvel vizsgálja.", "Az eredmény előbecslés, amelyet ajánlattal és méréssel lehet pontosítani."],
    sections: [
      {
        id: "marka-es-teljesitmeny",
        title: "1–2. adat: a jelenlegi márka és névleges teljesítmény",
        paragraphs: [
          "A márkát és a motor névleges kW-értékét a gép adattábláján vagy dokumentációjában találja meg. Ha több különböző teljesítményadat szerepel, ellenőrizze, melyik a főmotor névleges értéke. A kalkulátor ezt a kategóriát használja a gépméret megadásához.",
          "A megadott kW nem közvetlen fogyasztásmérés. Az alkalmazás a márkához, kategóriához és gépmérethez tartozó modelladatokból becsül felvett teljesítményt. A tényleges villamos felvételt külön mérés igazolhatja; az eltérés okát a gép állapota és működése alapján lehet vizsgálni."
        ]
      },
      {
        id: "eletkor-es-uzemora",
        title: "3–4. adat: életkor és éves üzemóra",
        paragraphs: [
          "A gép korát az üzembe helyezési dokumentum vagy a szerviznyilvántartás alapján válassza ki. Az életkor itt modellfeltételezéshez használt adat. Nem állítja, hogy minden azonos korú gép műszaki állapota vagy hatásfoka azonos lenne.",
          "Az éves üzemórához lehetőleg számlálóleolvasások különbségét használja. Ha csak a műszakrend ismert, számoljon munkanap × napi működési idő alapján, és jelölje ezt becslésként. Az üresjárat és a műszakon kívüli működés miatt az adatot később érdemes ellenőrizni."
        ]
      },
      {
        id: "aramar-es-terheles",
        title: "5–6. adat: saját energiaár és terhelési profil",
        paragraphs: [
          "Az áramárat a saját villamosenergia-szerződéséből vagy számlájából vegye. Olyan fogyasztásarányos egységköltséget használjon, amely a megtakarított kWh-val valóban elkerülhető. A fix díjak és az adózási alap kezelését szükség szerint a vállalat pénzügyi felelősével egyeztesse.",
          "A terhelési profilnál az egyenletes vagy az ingadozó igény közül a működéshez közelebb állót válassza. Az alapgép folyamatos ellátása és a szakaszos fogyasztók követése eltérő feladat. A DOE szabályozási anyaga is a nyomás- és igényprofil megismerését helyezi a vezérlési döntés elé."
        ],
        sourceIds: ["controls"]
      },
      {
        id: "eredmeny-ertelmezese",
        title: "Mit mond a kWh/év és a Ft/év eredmény?",
        paragraphs: [
          "A kWh/év az energiaoldali különbség becslése, a Ft/év ennek a megadott árral számolt költséghatása. Ugyanaz az energiamegtakarítás eltérő áramárral más pénzügyi összeget ad. Az éves üzemóra pedig mindkettő nagyságát befolyásolja.",
          "Az ajánlott modell kiindulópont a műszaki egyeztetéshez. A kalkuláció nem méri meg a levegőigényt, a hálózati nyomásesést vagy a szivárgást, és nem igazolja önmagában a gép technológiai alkalmasságát. A beszerzéshez a szükséges légszállítást és nyomást is egyeztetni kell."
        ]
      },
      {
        id: "riport-es-kovetkezo-lepes",
        title: "Így vigye tovább a kalkulációt a döntésig",
        paragraphs: [
          "Készítsen egy várható és egy óvatos változatot. Ha az üzemóra bizonytalan, ezt módosítsa először; ha az energiaár változik, több saját szerződéses értékkel számoljon. Egyszerre egy bemenetet változtatva könnyebben láthatja, mi mozgatja az eredményt.",
          "A részletes riport kéréséhez adja meg a szükséges kapcsolattartási adatokat és fogadja el az adatkezelési feltételeket. Az e-mailben kapott eredményt vigye tovább a műszaki felmérésre. A helyszíni mérés, a teljes telepített ajánlat és az üzemeltetési adatok együtt alapozzák meg a végleges döntést."
        ],
        bullets: ["Rögzítse a bemenetek forrását és dátumát.", "Az előbecslést vesse össze a mért fogyasztással.", "Kérjen ajánlatot azonos légszállításra és nyomásra.", "A teljes beruházási költséggel külön értékelje a megtérülést."]
      }
    ],
    faq: [
      { question: "Használhatom a kalkulátort mérési adatok nélkül?", answer: "Igen, előbecsléshez a gépadatok és az üzemeltetés ismert jellemzői használhatók. A bizonytalan üzemórát vagy energiaárat több változatban vizsgálja, a döntés előtt pedig pontosítsa az adatokat." },
      { question: "Mit jelent az ajánlott gép a riportban?", answer: "Modellalapú kiindulópontot a további egyeztetéshez. A tényleges alkalmasságot a szükséges légszállítás, nyomás, levegőminőség, vezérlés és telepítési feltételek alapján kell ellenőrizni." }
    ],
    cta: { title: "Megvannak az adatok? Nézze meg a saját eredményét", text: "Adja meg a hat fő bemenetet, és készítse el a kompresszorcsere energiaoldali előbecslését. A részletes riportot e-mailben is kérheti." },
    relatedSlugs: ["csavarkompresszor-aramfogyasztas-szamitasa", "csavarkompresszor-hovisszanyeres", "suritett-levego-energiaaudit-elokeszites"]
  }
];

export const blogPosts: BlogPost[] = sourcePosts.map((post) => {
  const journey = blogJourneys[post.slug as BlogSlug];
  return {
    ...post,
    title: journey.title,
    seoTitle: journey.seoTitle,
    description: journey.description,
    intro: journey.intro,
    updatedAt: post.updatedAt ?? (post.publishedAt > "2026-11-01" ? post.publishedAt : "2026-11-01"),
    journey,
    sections: post.slug === "csavarkompresszor-meretezes-hibak"
      ? [...post.sections, journey.decisionSection]
      : [...post.sections.slice(0, 4), journey.decisionSection, ...post.sections.slice(4)],
    faq: [...journey.objections, ...post.faq],
    cta: journey.finalCta
  };
}).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
