import type { BlogJourney, BuyerRole, BlogStage } from "./types";
import type { BlogSlug } from "../content-context";

export const buyerRoleLabels: Record<BuyerRole, string> = {
  owner: "Cégvezetőknek és pénzügyi döntéshozóknak",
  technical: "Műszaki vezetőknek és karbantartóknak",
  procurement: "Beszerzőknek és beruházást előkészítőknek"
};

export const blogStageLabels: Record<BlogStage, string> = {
  discovery: "Költségek feltárása",
  comparison: "Megoldások összevetése",
  decision: "Ajánlat előkészítése"
};

export const buyerPaths = [
  { id: "cegvezetoknek", role: "owner", title: "Magas a villanyszámla, de még nincs beruházási terv?", text: "Fordítsa éves forintra a fogyasztást, majd nézze meg, milyen költséggel és megtérüléssel érdemes gépcserét vizsgálni.", slugs: ["csavarkompresszor-aramfogyasztas-szamitasa", "csavarkompresszor-teljes-elettartam-koltseg", "csavarkompresszor-csere-megterulese"] },
  { id: "muszaki-vezetoknek", role: "technical", title: "Sokat jár a gép, ingadozik a nyomás vagy változik a levegőigény?", text: "Válassza külön a hálózat veszteségét a gép feladatától. A mérési adatokból készítsen megalapozott műszaki javaslatot.", slugs: ["suritett-levego-szivargas-koltsege", "suritett-levego-energiaaudit-elokeszites", "fix-vagy-vsd-csavarkompresszor"] },
  { id: "beszerzoknek", role: "procurement", title: "Már ajánlatokat kér, és összehasonlítható gépeket szeretne?", text: "Tisztázza a méretezést, az ajánlat teljes tartalmát és a döntéshez szükséges adatokat. Ha készen áll, közvetlenül kérhet ajánlatot.", slugs: ["csavarkompresszor-meretezes-hibak", "csavarkompresszor-teljes-elettartam-koltseg", "kompresszor-kalkulator-adatok"] }
] satisfies Array<{ id: string; role: BuyerRole; title: string; text: string; slugs: BlogSlug[] }>;

export const blogJourneys = {
  "csavarkompresszor-aramfogyasztas-szamitasa": {
    title: "Csavarkompresszor áramfogyasztása: mennyibe kerül évente a sűrített levegő?",
    seoTitle: "Csavarkompresszor áramfogyasztása és éves költsége",
    description: "Mennyi a csavarkompresszor éves áramköltsége? kW, üzemóra és Ft/kWh alapján számolunk, majd megmutatjuk a gépcsere vizsgálatának következő lépését.",
    stage: "discovery", audience: ["owner", "technical"],
    intro: [
      "A gyártógépek leálltak, a kompresszor még működik. A villanyszámlán közben nem látszik külön sorban, mennyibe került a sűrített levegő. Cégvezetőként így nehéz eldönteni, érdemes-e beruházást indítani; műszaki vezetőként pedig nehéz számszerűsíteni, miért foglalkozzon ezzel a vezetőség.",
      "A megoldás első lépése egy ellenőrizhető éves költségbecslés. Ebben a cikkben kiszámoljuk az összefüggést, megmutatjuk a leggyakoribb tévedéseket, és azt is, milyen adatból lehet továbblépni a saját kompresszor energiaoldali összehasonlításához. A példák feltételezett üzemi helyzeteket mutatnak; a saját áramárával és üzemórájával a kalkulátorban számolhat."
    ],
    quickAnswer: "Az éves villamosenergia-költség közelítése: átlagos felvett teljesítmény × éves üzemóra × saját Ft/kWh. Például 32 kW × 4 000 óra × 70 Ft/kWh = 8,96 millió Ft/év. Ez szemléltető energiasor, nem egy 37 kW-os gépre általánosan érvényes számla vagy garantált megtakarítás.",
    outcome: "Látni fogja az éves költség nagyságrendjét, és össze tudja készíteni az előkalkuláció hat bemenetét.",
    decisionSection: {
      id: "mikor-induljon-el-a-vizsgalat", title: "Cégvezetői kérdés: elég nagy a költség ahhoz, hogy foglalkozzunk vele?",
      paragraphs: ["Egy CNC-műhely, egy műanyag-feldolgozó üzem vagy egy összeszerelő sor másképp használ levegőt. A közös döntési pont az, hogy a jelenlegi éves energiaköltséghez képest mekkora igazolható csökkentés érhető el. Az első egyeztetésen ezért az éves Ft-érték mellé tegye oda az üzemórát és az adat bizonytalanságát is.", "Ha még nincs beruházási keret, kezdje a jelenlegi gép előbecslésével. Ha már van ajánlat, ugyanazt az üzemórát és energiaárat használja mindkét változathoz. Ha a gép termelés nélkül is rendszeresen jár, a szivárgást és a vezérlést is vizsgálni kell: egy új kompresszor nem javítja meg automatikusan a hálózatot.", "A vezetői döntéshez nem kell rögtön teljes projektet jóváhagyni. Először azt érdemes eldönteni, indokol-e a becsült költség mérési és ajánlatkérési munkát. Ez már konkrét, kis kockázatú következő lépés."]
    },
    checklist: ["Adattábla: márka, névleges kW, gép kora.", "Üzemóraszámláló vagy ellenőrzött éves műszakrend.", "Saját fogyasztásarányos Ft/kWh és a terhelés jellege."],
    objections: [
      { question: "Még nincs külön fogyasztásmérőnk. Van értelme elindulni?", answer: "Igen. A gépadatokból és az ismert üzemidőből készíthet előbecslést. Jelölje a bizonytalan bemeneteket, és a döntés előtt méréssel pontosítsa azokat. Az induláshoz nem szükséges kitalált pontosságot adni a becslésnek." },
      { question: "A számítás után kötelező gépet vásárolnom?", answer: "A kalkuláció egy előbecslés. A gépajánlatkérés külön lépés; a konkrét műszaki és kereskedelmi feltételek egyeztetése után lehet beszerzési döntést hozni." }
    ],
    midCta: { title: "A példa helyett most a saját éves költségét nézze meg", text: "Írja be a gépét, üzemóráját és energiaárát. A becsült kWh- és Ft-különbség megmutatja, mekkora ügy lehet a korszerűsítés az Ön üzemében." },
    finalCta: { title: "Adjon forintértéket a következő kompresszordöntésnek", text: "Készítse el az energiaoldali előbecslést. A részletes riportot e-mailben is kérheti, így a műszaki vagy vezetői egyeztetésen ugyanazokból az adatokból indulhatnak." },
    offer: "replacement", offerLabel: "Már gépajánlatot szeretnék", offerText: "Ha a beszerzés már napirenden van, a jelenlegi gép adataival közvetlenül is kérhet személyre szabott ajánlatot.",
    nextSlug: "csavarkompresszor-teljes-elettartam-koltseg", nextReason: "Az éves fogyasztás után nézze meg, hogyan írhatja felül az üzemeltetés költsége az olcsóbb vételár előnyét."
  },
  "csavarkompresszor-csere-megterulese": {
    title: "Mikor éri meg a csavarkompresszor-csere? Megtérülési példa a beruházási döntéshez",
    seoTitle: "Csavarkompresszor-csere megtérülése: számítás és döntés",
    description: "Mikor éri meg lecserélni a működő csavarkompresszort? Beruházási költség, éves megtakarítás és három forgatókönyv a döntéshez.",
    stage: "decision", audience: ["owner", "procurement"],
    intro: ["A régi kompresszor még ellátja az üzemet. Az új gép ajánlati ára viszont azonnali kiadás, a kisebb fogyasztás előnye pedig később jelentkezik. A beszerzési döntés ezért akkor lesz meggyőző, ha a teljes beruházási költséget ellenőrizhető éves megtakarítással tudja összevetni.", "Ez a cikk cégvezetőknek és beruházást előkészítőknek segít eldönteni, mikor érdemes a kompresszorcserét továbbvinni a jó ötlettől a konkrét ajánlatig. Végigszámolunk egy feltételezett példát, megmutatjuk a költségből gyakran kimaradó tételeket, és azt is, mi történik gyengébb kihasználtság mellett."],
    quickAnswer: "Az egyszerű megtérülés a teljes telepített beruházás és az éves nettó üzemeltetési megtakarítás hányadosa. Ha 6 millió Ft a beruházás és 1,68 millió Ft/év az igazolható megtakarítás, az eredmény körülbelül 3,6 év. A konkrét gép műszaki alkalmasságát és az ajánlati feltételeket külön kell egyeztetni.",
    outcome: "Össze tud állítani egy vezetői döntési lapot, és látni fogja, milyen ajánlat hiányzik a végleges számításhoz.",
    decisionSection: { id: "dontes-mukodo-gep-mellett", title: "Működő gépet cserélne? Ezt a három összeget tegye egymás mellé", paragraphs: ["A működőképesség fontos, de az üzemeltetés gazdaságosságát nem dönti el. Egy több műszakban dolgozó gépnél a további használat energiaára és az új rendszer teljes költsége együtt számít. A csere időzítését a termelési tervvel és a tervezett karbantartással is össze kell hangolni.", "A vezetői összefoglaló tartalmazza a jelenlegi éves energiaköltséget, a korszerűsítés utáni becsült éves költséget és a teljes telepített ajánlati árat. Mellé kerüljön az üzemóra és az energiaár forrása. Így a döntéshozó azt is látja, melyik feltételezés változtatná meg az eredményt.", "Ha az óvatos forgatókönyv elfogadható, kérjen a valós légszállításra és nyomásra szóló ajánlatot. Ha csak a legkedvezőbb változat mellett működik a számítás, előbb mérjen és pontosítsa az igényt. A kalkuláció célja az is, hogy egy gyenge beruházási indok időben láthatóvá váljon."] },
    checklist: ["Teljes telepített ár, azonos nettó vagy bruttó alapon.", "Éves energiahatás saját üzemórával és energiaárral.", "Szervizkülönbség, mérési alap és tervezett csereidőpont."],
    objections: [
      { question: "Miért kérjek ajánlatot, ha még nincs jóváhagyott beruházási keret?", answer: "A jóváhagyáshoz a teljes beruházás ára is kell. Az előbecslés és az igényre szóló ajánlat együtt teszi konkréttá a döntési anyagot. Az ajánlatkérésben jelezheti, hogy a beruházás előkészítési szakaszban van." },
      { question: "A termelésünk változó. Nem túl bizonytalan a megtérülés?", answer: "Éppen ezért érdemes több üzemórával számolni. Az óvatos, várható és magas kihasználtságú változat megmutatja a döntés érzékenységét. A feltételeket a beruházási javaslatban is tüntesse fel." }
    ],
    midCta: { title: "Mekkora éves összeg állna az Ön beruházása mögött?", text: "Számolja ki a gépcsere becsült éves energiahatását a saját használattal. Ezt az összeget tudja majd a konkrét telepített ajánlati árhoz viszonyítani." },
    finalCta: { title: "Készüljön számokkal a beruházás jóváhagyására", text: "Indítsa el az előkalkulációt, majd kérje e-mailben a részletes riportot. Ha már ismeri az igényt, az alábbi ajánlatkérési útvonalon a beszerzés műszaki és kereskedelmi részét is pontosíthatja." },
    offer: "replacement", offerLabel: "Konkrét csereajánlatot kérek", offerText: "A márka, a becsült teljesítmény és a gép kora jó kiindulópont. Az ajánlat előtt a valós levegőigényt és a telepítés feltételeit egyeztetjük.",
    nextSlug: "kompresszor-kalkulator-adatok", nextReason: "Összekészítené az adatokat? Ez a rövid útmutató megmutatja, mit hol talál meg, és hogyan használja a riportot az ajánlatkéréshez."
  },
  "fix-vagy-vsd-csavarkompresszor": {
    title: "Fix vagy RS/VSD csavarkompresszor? A terhelési profil alapján döntsön",
    seoTitle: "Fix vagy VSD csavarkompresszor? Terhelés és választás",
    description: "Fix fordulat vagy RS/VSD kompresszor illik az üzeméhez? Részterhelés, üresjárat és ajánlati adatok a műszakilag megalapozott választáshoz.",
    stage: "comparison", audience: ["technical", "procurement"],
    intro: ["Az első műszakban minden fogyasztó működik, a másodikban csak néhány gép kér levegőt. A kiválasztott kompresszornak mindkét helyzetben el kell látnia a termelést. Ha az ajánlat csak a legnagyobb légszállítást mutatja, a nap jelentős részének energiaköltsége rejtve maradhat.", "Műszaki vezetőként és beszerzőként azt érdemes összehasonlítania, hogyan teljesít a fix és az RS/VSD gép a saját terhelési tartományában. A technológia neve helyett nézze meg az időarányokat, a gyártói adatokat és a teljes csomag költségét. Az alábbi példa és ajánlatkérési lista ebben segít."],
    quickAnswer: "Változó levegőigénynél érdemes vizsgálni a fordulatszám-szabályozott gépet. Egyenletes alapterhelésre a megfelelő fix gép is lehet jó megoldás. Az éves előnyt a valós igényprofil, a gyártói részterhelési görbe, a szabályozási tartomány és a rendszer vezérlése együtt dönti el.",
    outcome: "Tudni fogja, mely adatokat kérje ugyanarra a feladatra a kétféle ajánlathoz.",
    decisionSection: { id: "ajanlatkeres-sajat-muszakra", title: "Gyakorlati döntési helyzet: a második műszak nem az első másolata", paragraphs: ["Egy fémmegmunkáló műhelyben előfordulhat, hogy nappal több CNC-gép és kézi munkahely kér levegőt, este viszont csak néhány automatizált fogyasztó marad. Ez szemléltető helyzet, nem mért ügyféleredmény. A beszerzéshez a két üzemállapot óraszáma és légigénye külön adatként szükséges.", "Kérje meg az ajánlatadót, hogy ugyanennek a profilnak megfelelő villamosenergia-igényt mutasson a fix és a szabályozott megoldásra. Ellenőrizze azt is, mi történik a VSD minimális légszállítása alatti igénynél. A legjobb teljes terhelési adat nem feltétlenül jelenti a legalacsonyabb éves költséget.", "Ha több gép marad a rendszerben, tisztázzák, melyik lesz az alapgép, melyik követi az ingadozást és melyik a tartalék. Így nem egyetlen új gépet vásárol a meglévő vezérlés mellé, hanem működő gépkombinációt készít elő."] },
    checklist: ["Órák kis, közepes és nagy igénynél, műszakonként.", "Azonos nyomáshoz tartozó légszállítás és teljes villamos felvétel.", "Minimális szabályozási tartomány, tartály és közös vezérlés."],
    objections: [
      { question: "Válasszam automatikusan a VSD-t, ha bizonytalan a levegőigény?", answer: "A bizonytalanság önmagában nem méretezési adat. Kérjen igényfeltárást, és ellenőrizze a várható alsó és felső tartományt. A túl nagy szabályozott gép is kerülhet kedvezőtlen üzemállapotba." },
      { question: "Azonos kW-os fix és VSD gép ajánlati árát hasonlítom. Ez elég?", answer: "Egyeztesse a szállított levegőt, az üzemi nyomást, a csomag teljes felvételét és a telepítés tartalmát is. Ezután a saját üzemprofilra számolt éves költséggel egészítse ki az árkülönbséget." }
    ],
    midCta: { title: "Nézze meg az energiaoldali különbség nagyságrendjét", text: "A kalkulátorban azonos üzemórával és energiaárral készíthet előbecslést. A terhelési profilt a saját működéséhez igazítsa; a végleges választáshoz a gyártói adatokat is egyeztetni kell." },
    finalCta: { title: "A következő ajánlat már a saját terhelésére szóljon", text: "Induljon az előkalkulációval, és a riport mellé gyűjtse össze a műszakonkénti igényeket. A konkrét ajánlatkérésnél ezekből lehet jól illeszkedő gépet és vezérlést választani." },
    offer: "replacement", offerLabel: "A terhelésemhez illő gépajánlatot kérek", offerText: "Írja le a jelenlegi gépet és az egyenletes vagy ingadozó üzemet. A műszaki pontosítás segít eldönteni, mely konfigurációt érdemes ajánlatban összevetni.",
    nextSlug: "csavarkompresszor-teljes-elettartam-koltseg", nextReason: "A műszaki irány után ellenőrizze, hogyan hasonlítható össze a magasabb vételár és a kisebb éves üzemeltetési költség."
  },
  "suritett-levego-szivargas-koltsege": {
    title: "Termelés nélkül is jár a kompresszor? Így keresse a sűrített levegő veszteségét",
    seoTitle: "Sűrített levegő szivárgás: veszteség és éves költség",
    description: "Műszak után is elindul a kompresszor? Válassza külön a szivárgást a szükséges fogyasztástól, és számolja ki a javítás mérhető energiahatását.",
    stage: "discovery", audience: ["technical", "owner"],
    intro: ["A műszak véget ért, a kompresszor mégis rendszeresen elindul. A karbantartás hall néhány szivárgást, de a javítás a sürgősebb munkák mögé kerül. A veszteség akkor lesz vezetői szinten is kezelhető ügy, ha a hibajegyzék mellé üzemóra és becsült éves költség kerül.", "Ez az útmutató segít elkülöníteni a szándékos levegőhasználatot a veszteségtől, rangsorolni a feladatokat és visszamérni a javítást. A cél először a rendszer rendbetétele. Az esetleges kompresszorcsere vizsgálata ezután épülhet a ténylegesen szükséges levegőmennyiségre."],
    quickAnswer: "A termelés nélküli gépjárás vizsgálandó jel, de nem bizonyít automatikusan szivárgást. Az engedélyezett fogyasztókat, a szárítót és az ürítőket is ellenőrizni kell. A javítás pénzügyi hatását összehasonlítható üzemállapotban mért villamos teljesítmény- vagy kWh-különbségből érdemes meghatározni.",
    outcome: "Kézbe kap egy javítási és visszamérési sorrendet, amelyet a karbantartási tervbe is be lehet vinni.",
    decisionSection: { id: "karbantartasi-feladatbol-uzleti-ugy", title: "Így lesz a hallható szivárgásból jóváhagyható javítási feladat", paragraphs: ["Egy gyártóműhelyben a termelés szünete alkalmas lehet a fogyasztók elkülönítésére, de csak a technológiai követelmények tisztázása után. A felméréshez jelölje meg, mely ágak maradhatnak ellátás nélkül, és hol szükséges folyamatos levegő. A vizsgálati sorrendet a felelős műszaki csapat határozza meg.", "A vezetőség számára a hasznos eredmény nem pusztán a megtalált hibák száma. Mutassa meg a javítás várható költségét, a kieső termelési időt és azt, hogyan ellenőrzik az energiahatást. A nagyobb, egyszerűen javítható hibák kerülhetnek előre, a többi pedig tervezett karbantartási ablakba.", "Ha a veszteség csökkentése után is indokolt a korszerűsítés, a gépet már az új igényre lehet méretezni. A kalkulátor ebben az energiaoldali előszűrésben segít. A szivárgás javítása és a gépcsere nem ugyanaz a megtakarítás, ezért külön alapállapottal kell őket dokumentálni."] },
    checklist: ["Mely fogyasztóknak kell működniük termelésen kívül is?", "Hol, mikor és milyen nyomáson mérték a kiinduló kWh-t?", "Ki javít, ki állítja be a vezérlést, és ki méri vissza?"],
    objections: [
      { question: "Elég egy új kompresszor, ha a régi túl sokat jár?", answer: "Ha az igényt szivárgás vagy szükségtelen levegőhasználat növeli, az új gép is ezt az igényt fogja ellátni. Először a veszteség és a vezérlés vizsgálata segít megalapozni a későbbi méretezést." },
      { question: "Nincs időnk teljes felmérésre. Mivel kezdjünk?", answer: "Rögzítsenek egy ismert termelésmentes időablakot, a működő fogyasztókat és a gép állapotait. Ezt vigyék tovább egy célzott szakmai egyeztetésre; a mérés terjedelmét a konkrét panasz alapján lehet kialakítani." }
    ],
    midCta: { title: "Lássa, mekkora éves energiaköltséget érdemes megvizsgálni", text: "A saját gép előbecslése megadja a nagyságrendet a javítási és korszerűsítési egyeztetéshez. Szivárgási arányt a kalkulátor nem mér; az helyszíni feladat." },
    finalCta: { title: "A veszteség feltárása után döntsön a gépről", text: "Készítsen kiinduló energiaoldali becslést, és írja mellé a javítás utáni állapotot. Ha most műszaki segítségre van szüksége, közvetlenül szervizügyben is jelentkezhet." },
    offer: "service", offerLabel: "Szervizről és a tapasztalt hibáról egyeztetek", offerText: "A márka és a tünet rövid leírásával elindítható az egyeztetés. Jelezze, hogy műszakon kívüli gépjárást vagy levegőveszteséget tapasztal.",
    nextSlug: "suritett-levego-energiaaudit-elokeszites", nextReason: "A javítandó tünet után nézze meg, milyen mérési adatokkal lehet eldönteni a rendszer és a gépcsere következő lépését."
  },
  "kompresszor-uzemi-nyomas-energiakoltseg": {
    title: "Kevés a nyomás a gépnél, mégis magas a számla? Az üzemi nyomás rejtett költsége",
    seoTitle: "Kompresszor üzemi nyomása: veszteség és energiaköltség",
    description: "A nyomáspanasz nem mindig kapacitáshiány. Nyomásprofil, szűk keresztmetszetek és költségpélda a rendszer javításához és a gépválasztáshoz.",
    stage: "discovery", audience: ["technical"],
    intro: ["Az egyik munkapont levegőhiányra panaszkodik, ezért feljebb állítják a kompresszor nyomását. A termelés átmenetileg helyreáll, a magasabb beállítás viszont a teljes hálózatra érvényes marad. Később már nehéz megmondani, valóban nagyobb gép kell-e, vagy egy helyi szűkületet szolgál ki drágábban az üzem.", "Karbantartóként és műszaki vezetőként a nyomásprobléma okát érdemes a beállítás előtt megérteni. Ebben a cikkben végigvesszük, hol kell mérni, mit kell összehasonlítani, és hogyan lesz egy igazolt teljesítménykülönbségből éves költségadat."],
    quickAnswer: "A szükséges üzemi nyomást a fogyasztók minimumigénye és a mért hálózati nyomásesés együtt határozza meg. A távoli nyomáspanasz oka lehet szűrő, csatlakozó, csőhálózat, tárolás vagy vezérlés is. A gépházi nyomás emelése helyett először azonos időben felvett nyomásprofil szükséges.",
    outcome: "Olyan hibalistát készíthet, amellyel célzottabban indul a karbantartási vagy méretezési egyeztetés.",
    decisionSection: { id: "ketfele-panasszal-ketfele-lepes", title: "Ugyanaz a nyomáspanasz, két különböző következő lépés", paragraphs: ["Ha a gépházban stabil a nyomás, de egy távoli fogyasztónál terheléskor leesik, az odavezető elemeket kell megvizsgálni. Ha a fő hálózati nyomás is csökken, és a gépek tartósan teljes terhelésen futnak, a kapacitás és a szabályozás kérdése is felmerül. A két helyzet eltérő ajánlati feladatot jelent.", "Egy új gyártósor üzembe állítása előtt rögzítse a korábbi és az új fogyasztók egyidejű igényét. Egy festő- vagy szerelőmunkahely panaszánál pedig a helyi tömlő, csatlakozás és levegőkezelés is fontos adat. Ezek szemléltető döntési helyzetek; a konkrét okot a mérések mutatják meg.", "A műszaki egyeztetéshez írja le, mikor jelentkezik a hiba, mely fogyasztót érinti és milyen értéket mértek a gépházban. Ezzel egy szerviz- vagy gépajánlatkérés már pontos kérdésre indul, és csökken a felesleges kapacitásvásárlás esélye."] },
    checklist: ["Kritikus fogyasztó előírt nyomása és mérési pontja.", "Egyidejű gépházi és fogyasztói nyomásadat terhelés alatt.", "Panasz időpontja, érintett gép és párhuzamos fogyasztók."],
    objections: [
      { question: "A nagyobb kompresszor biztosan megoldja a nyomáspanaszt?", answer: "Egy hálózati szűkületet vagy hibás helyi levegőkezelőt önmagában nem javít meg. A gépházi és fogyasztói nyomás összevetése segít eldönteni, hol szükséges beavatkozni." },
      { question: "A nyomás csökkentése nem veszélyezteti a termelést?", answer: "A technológiai minimum ellenőrzése és a kontrollált visszamérés szükséges. A módosítást a felelős szakember végezze, a kritikus fogyasztók működésének ellenőrzésével." }
    ],
    midCta: { title: "Nézze meg a gép energiaoldali kiindulópontját is", text: "A nyomásvizsgálat mellé készítsen saját gépadatokból éves költségbecslést. Így a rendszerjavítás és a későbbi gépcsere műszaki és pénzügyi kérdése összeér." },
    finalCta: { title: "A következő lépés egy jól megfogalmazott műszaki kérdés", text: "A kalkulátorral felmérheti a gépcsere energiahatásának nagyságrendjét. A nyomásveszteség feltárásához a fenti mérési adatokkal indítson szakmai egyeztetést." },
    offer: "service", offerLabel: "A nyomáspanaszomról egyeztetek", offerText: "A szervizűrlapon írja le az érintett fogyasztót és a terhelési helyzetet. Így a műszaki csapat konkrét tünetből indulhat.",
    nextSlug: "csavarkompresszor-meretezes-hibak", nextReason: "Ha a rendszerigény már tisztább, a méretezési útmutató segít elkerülni a következő beszerzés tipikus hibáit."
  },
  "csavarkompresszor-hovisszanyeres": {
    title: "Fűthet a csavarkompresszor hulladékhőjével? Így vizsgálja a hővisszanyerést",
    seoTitle: "Csavarkompresszor hővisszanyerés: megtakarítás és feltételek",
    description: "Mikor használható a kompresszor hulladékhője fűtésre vagy melegvízre? Szezonális igény, hasznos hő és saját gázköltség a beruházás előtt.",
    stage: "comparison", audience: ["owner", "technical"],
    intro: ["A kompresszor hűtése hőt ad le, miközben az üzem másik részében gázzal fűtenek vagy meleg vizet állítanak elő. Ez jó ok a hővisszanyerés vizsgálatára. A gazdasági kérdés azonban az, hogy a hő ténylegesen felhasználható-e akkor, amikor a gép működik.", "Cégvezetőként az elkerülhető fűtési költséget, műszaki vezetőként a hőmérsékletet, időzítést és rendszerillesztést kell összehoznia. Az alábbi feltételezett számítás segít kiszűrni a túlzó várakozásokat és előkészíteni egy konkrét műszaki ajánlatot."],
    quickAnswer: "A hővisszanyerés akkor adhat megtakarítást, ha a kompresszor működésével egy időben megfelelő hőigény áll rendelkezésre, és az átadott hő egy jelenlegi költséget vált ki. A megtermelt, de fel nem használt hő nem teljes értékű megtakarítás; a villamos és a hőoldali hatást külön kell számolni.",
    outcome: "El tudja dönteni, milyen hőigényt és üzemadatot kell összegyűjteni egy hőhasznosítási egyeztetéshez.",
    decisionSection: { id: "telephelyi-hasznositas", title: "Csarnokfűtés vagy egész éves melegvíz? Más a beruházás alapja", paragraphs: ["Ha csak télen fűt egy csarnokot, a nyári kompresszorhőre nem lehet ugyanazt a megtakarítást elszámolni. Ha egész évben van mosási vagy melegvíz-előmelegítési igény, hosszabb hasznosítási időszak is vizsgálható. Ez nem jelenti automatikusan azt, hogy az adott hőmérséklet minden technológiához elegendő.", "A következő egyeztetésre készítsen havi bontású vázlatot: mikor működik a kompresszor, hol és milyen hőre van szükség, jelenleg miből készül ez a hő, és mennyibe kerül a fogyasztásarányos energia. A kazán szezonális hatásfoka és a csővezeték távolsága is az értékelés része.", "Ha kompresszorcsere is felmerül, a két tervet együtt vizsgálja. A hatékonyabb új gép hőtermelése eltérhet a régiétől, ezért a régi gép teljes hulladékhőjét nem helyes az új gép energiamegtakarítása mellé változatlanul hozzáadni."] },
    checklist: ["Fűtési és melegvízigény hónapok és műszakok szerint.", "Elvárt hőmérséklet, jelenlegi hőtermelés és saját energiadíj.", "Gép kialakítása, tervezett csere és a hőátvevő távolsága."],
    objections: [
      { question: "Csak télen kell a hő. Akkor is lehet értelme?", answer: "Igen, vizsgálható, de a megtakarítást a tényleges téli felhasználásra kell számolni. A beruházási költséget és a segédenergia-igényt ehhez az időszakhoz kell viszonyítani." },
      { question: "A kalkulátor eredménye alapján már megrendelhetem a hőcserélőt?", answer: "Az előbecslés a további vizsgálat nagyságrendjét mutatja. A kivitelezéshez hőtechnikai méretezés, gyártói megfelelőség és a meglévő hőrendszer egyeztetése szükséges." }
    ],
    midCta: { title: "A saját fűtési időszakával számoljon tovább", text: "Kapcsolja be a kalkulátor hővisszanyerési lehetőségét, és ellenőrizze a hónapokat és a gázárat. A megadott alapértékeket a saját felhasználására kell igazítani." },
    finalCta: { title: "A hulladékhőből akkor lesz üzleti előny, ha van hová tenni", text: "Nézze meg az előzetes lehetőséget, majd a hőigény adataival kérjen műszaki egyeztetést. A gépcsere és a hőhasznosítás így közös, követhető tervként készülhet elő." },
    offer: "replacement", offerLabel: "Gépcseréről és hőhasznosításról egyeztetek", offerText: "Az ajánlatkérő üzenetében jelezze a fűtési vagy melegvíz-igényt. A konkrét kialakítás és megtakarítás műszaki pontosítást igényel.",
    nextSlug: "csavarkompresszor-csere-megterulese", nextReason: "A műszaki lehetőség után nézze meg, hogyan kerülhet a hőhasznosítás a teljes beruházási és megtérülési számításba."
  },
  "csavarkompresszor-meretezes-hibak": {
    title: "Mekkora csavarkompresszort vegyen? 5 méretezési hiba ajánlatkérés előtt",
    seoTitle: "Csavarkompresszor méretezése: 5 hiba beszerzés előtt",
    description: "Mekkora kompresszor kell az üzemébe? Légszállítás, nyomás, csúcsigény és tartalék: kerülje el az öt tipikus hibát a gépajánlatok bekérése előtt.",
    stage: "comparison", audience: ["technical", "procurement"],
    intro: ["A termelés bővül, a régi gép nehezen tartja a nyomást, az ajánlatban pedig egy mérettel nagyobb kompresszor szerepel. Ez lehet megfelelő irány, de a nagyobb névleges kW önmagában nem igazolja a választást. A túl nagy gép évekig, a túl kicsi gép már az első terhelt műszakban okozhat gondot.", "Műszaki vezetőknek és beszerzőknek az alábbi öt ellenőrzési pont segít olyan igényleírást készíteni, amelyre összehasonlítható ajánlatokat kaphatnak. A cél az üzemi feladathoz és a tervezett bővítéshez illő kapacitás, az éves költség figyelembevételével."],
    quickAnswer: "A megfelelő kompresszorméret a szükséges légszállításból, üzemi nyomásból, levegőminőségből és időbeli igényprofilból indul ki. A névleges kW alapján készült előkalkuláció nem helyettesíti ezt a méretezést. A csúcsot, az alapterhelést és a tartalékigényt külön kell rögzíteni.",
    outcome: "Össze tud állítani egy egyoldalas műszaki igényleírást, amellyel elindítható a gépajánlatkérés.",
    decisionSection: { id: "egyoldalas-igenyleiras", title: "Az ajánlatkérés melléklete: egy oldal, amely sok félreértést megelőz", paragraphs: ["Írja össze a működő fogyasztókat, az egyidejűséget, a jellemző és a csúcsigényt. Ha új gyártósor érkezik, a beszállítói légigényt és az indulás várható időpontját külön tüntesse fel. A dokumentált bővítési igény jobb indok a tartalékra, mint egy általános biztonsági szorzó.", "A műszaki adatok mellé írja oda a rendelkezésre állási elvárást. Leállhat-e a teljes levegőellátás karbantartáskor? Megmarad-e tartaléknak a régi kompresszor? Az üzembiztonságot nem lehet pusztán egyetlen nagyobb gép névleges teljesítményével leírni.", "Ha néhány adat még hiányzik, ezt jelezze az ajánlatkérésben. A márka, a jelenlegi gép kora, a becsült teljesítmény és a működés rövid leírása elindíthatja az egyeztetést. A hiányzó légszállítási és nyomásadatokat a végleges gépválasztás előtt kell tisztázni."] },
    checklist: ["Jellemző és csúcslégszállítás, időtartam, egyidejűség.", "Nyomás és levegőminőség a kritikus felhasználásnál.", "Bővítési terv, tartalék gép és karbantarthatóság."],
    objections: [
      { question: "Kérhetek ajánlatot, ha még nem ismert a m³/perc igény?", answer: "Az első egyeztetés elindítható a jelenlegi gép adataival és a termelési helyzet leírásával. A konkrét gép végleges kiválasztásához a légszállítási igényt is pontosítani kell." },
      { question: "A régi gépet megtartanánk tartaléknak. Ezt mikor jelezzük?", answer: "Már az ajánlatkéréskor. Ez befolyásolja az új gép szerepét, a vezérlést, a csatlakozást és a karbantartás alatti ellátást is." }
    ],
    midCta: { title: "A méretezés mellé tegye oda az éves költséget is", text: "A kalkulátorban előzetesen összevetheti a jelenlegi gép és egy korszerűbb megoldás energiahatását. A konkrét légszállítási alkalmasságot az ajánlatnál kell ellenőrizni." },
    finalCta: { title: "A következő gép az üzemi feladatára legyen méretezve", text: "Készítsen energiaoldali előbecslést, és vigye tovább a fenti igényleírással. Ha már beszerzést készít elő, a gépajánlatkérés a megfelelő következő lépés." },
    offer: "replacement", offerLabel: "Méretezéshez kapcsolódó gépajánlatot kérek", offerText: "A meglévő gépadatok és a tervezett felhasználás alapján elindítható a műszaki pontosítás. Az is jelezhető, ha néhány adat még nem ismert.",
    nextSlug: "fix-vagy-vsd-csavarkompresszor", nextReason: "A szükséges méret után a terhelési profil dönti el, milyen szabályozást érdemes összehasonlítani."
  },
  "suritett-levego-energiaaudit-elokeszites": {
    title: "Kompresszorcsere előtt: mit mérjen egy sűrített levegő energiaaudit?",
    seoTitle: "Sűrített levegő energiaaudit: mérési terv gépcsere előtt",
    description: "Mit mérjen meg kompresszorcsere előtt? Mérési terv, üzemi adatok és intézkedési sorrend, hogy a felmérésből használható beruházási döntés legyen.",
    stage: "comparison", audience: ["technical", "owner"],
    intro: ["Van egy magas villanyszámla, néhány nyomáspanasz és egy új kompresszorra szóló ajánlat. Ami hiányzik: az adat, amely megmutatja, a gép, a hálózat vagy a használat okozza-e a költség döntő részét. E nélkül könnyű jó berendezést vásárolni egy rosszul feltett kérdésre.", "A jól előkészített sűrítettlevegő-vizsgálat a döntést szolgálja. Műszaki vezetőként világos mérési feladatot, cégvezetőként rangsorolt beavatkozási tervet érdemes kérnie. Az alábbi lista segít, hogy a felmérés végén konkrét következő lépés álljon a grafikonok mellett."],
    quickAnswer: "A hasznos vizsgálat együtt értékeli a villamos felvételt, a nyomást, a levegőigényt és az üzemállapotokat. A mérést a termeléssel és a gépek vezérlésével együtt kell értelmezni. A végén mért alapállapot, rangsorolt intézkedési terv és visszamérési módszer szükséges.",
    outcome: "Meg tudja fogalmazni a vizsgálat kérdését és a jelentésből elvárt döntési adatokat.",
    decisionSection: { id: "meresbol-ajanlati-feladat", title: "A felmérés végén ezt kell tudnia megkérdezni az ajánlatadótól", paragraphs: ["Mely beavatkozás szükséges a termelés biztos ellátásához, és melyik csökkenti a költséget? Melyik tétel javítás, melyik vezérlési feladat, és melyik új berendezés? Ezeket külön soron érdemes látni, a költséggel és az egymásra épüléssel együtt.", "Egy több gépből álló állomásnál kérjen képet a gépek szerepéről és az egyidejű működésről is. Egy új gép előnye eltűnhet, ha a régi szabályozási gond megmarad. A javaslat értéke abban áll, hogy az egész rendszer működésére ad követhető tervet.", "Az ajánlatkéréshez vigye tovább a jelenlegi állapotot, a javítás utáni várható igényt és a termelési elvárásokat. Ha csak előzetes gépadat áll rendelkezésre, a kalkulátor segíthet a nagyságrendet felmérni; a mért alapállapotot viszont később nem szabad a modellbecsléssel összekeverni."] },
    checklist: ["Egy mondatos döntési kérdés és a vizsgálat határa.", "Géplista, műszakrend, kritikus nyomás és ismert panaszok.", "Elvárt intézkedési terv: költség, sorrend, feltételek, visszamérés."],
    objections: [
      { question: "Az energiaaudit minden esetben gépcserét javasol?", answer: "Nem ez a vizsgálat előre eldöntött eredménye. A mért állapot alapján lehet karbantartás, szabályozási módosítás, hálózati javítás, gépcsere vagy ezek kombinációja a megfelelő irány." },
      { question: "Miért nem elég a kompresszor üzemóráját leolvasni?", answer: "Az üzemóra a használat idejét mutatja, de nem írja le a nyomást, a légigényt és a részterhelési működést. A beruházási döntéshez az adatok kapcsolatát kell megérteni." }
    ],
    midCta: { title: "A felmérés előtt is legyen képe a költség nagyságrendjéről", text: "A meglévő gépadatokból készített előbecslés jó első adatlap a műszaki egyeztetéshez. A mérési eredményekkel később pontosítható a döntési alap." },
    finalCta: { title: "Következő lépés: saját adatokból konkrét vizsgálati kérdés", text: "Készítse el az előkalkulációt, vagy a jelenlegi gép és a tapasztalt probléma leírásával indítson műszaki egyeztetést az ajánlatkérésen keresztül." },
    offer: "replacement", offerLabel: "Felmérésről és korszerűsítésről egyeztetek", offerText: "A csereajánlatkérésben jelezheti, hogy először helyszíni műszaki pontosításra van szükség. Írja le a panaszt és a tervezett beruházás helyzetét.",
    nextSlug: "csavarkompresszor-meretezes-hibak", nextReason: "A felmérés adataiból ezekkel a szempontokkal lehet jól megfogalmazott gép- és rendszerigényt készíteni."
  },
  "csavarkompresszor-teljes-elettartam-koltseg": {
    title: "Olcsóbb kompresszor vagy kisebb üzemeltetési költség? Így hasonlítsa össze az ajánlatokat",
    seoTitle: "Csavarkompresszor teljes költsége: vételár vagy TCO?",
    description: "Két csavarkompresszor-ajánlat között dönt? Ötéves költségpélda és beszerzési ellenőrzőlista a vételár, energia és szerviz összevetéséhez.",
    stage: "decision", audience: ["owner", "procurement"],
    intro: ["Az egyik ajánlat olcsóbb, a másik kisebb fogyasztást ígér. A beszerzés a vételárat látja, a termelés üzembiztonságot kér, a pénzügy pedig az éves hatást szeretné tudni. A teljes költség szemlélete ezeket a szempontokat hozza közös időtávra.", "Ez a cikk olyan cégvezetőknek és beszerzőknek szól, akik már ajánlatokból készítenek döntést. Egy feltételezett ötéves példán megmutatjuk, miért kell a telepítést, az energiát és a szervizt együtt értékelni, és milyen kérdésekkel lehet valóban összehasonlíthatóvá tenni a két ajánlatot."],
    quickAnswer: "A gép teljes költségéhez a telepített beruházás, az energia és az igazolt üzemeltetési tételek tartoznak, azonos műszaki feladatra és időtávra számolva. A magasabb vételár akkor lehet indokolt, ha a többi költségcsökkenés ezt a saját üzemadataival alátámasztja.",
    outcome: "Összehasonlítható ajánlati táblát készíthet, amelyet a pénzügyi és műszaki döntéshozó együtt tud értékelni.",
    decisionSection: { id: "ajanlati-sorok-egyeztetese", title: "Beszerzési ellenőrzés: ugyanaz van a két végösszegben?", paragraphs: ["Az egyik ajánlat tartalmazhat szárítót, beüzemelést és csatlakoztatást, miközben a másik csak a gép árát mutatja. Először ezeket a tartalmi eltéréseket rendezze. A hiányzó tételek nélkül a kisebb végösszeg nem azonos szolgáltatást jelent.", "Kérje az éves energiaigény számításának alapját is: milyen nyomásra, légszállításra és terhelési profilra vonatkozik? A szerviznél egyeztesse a vizsgált üzemórát és az időszakra eső nagyobb karbantartásokat. Minden bizonytalan tételt ugyanúgy kezeljen a két ajánlatban.", "A döntési lapon legyen egy műszaki minimum és egy költségösszesítő. Az a konfiguráció, amely nem látja el a feladatot, az olcsóbb becsléstől még nem lesz megfelelő. A megfelelő gépek közül viszont már megítélhető, melyik árkülönbség mögött van az Ön üzemében érvényesülő előny."] },
    checklist: ["Azonos légszállítás, nyomás, levegőminőség és értékelési időtáv.", "Teljes telepített ár és részletezett szerviztartalom.", "Saját üzemórára és energiaárra készült éves költség."],
    objections: [
      { question: "A beszerzési keretünk a vételárra szól. Mire jó a TCO?", answer: "Megmutatja, milyen üzemeltetési költséget vállal a vállalat az egyes ajánlatokkal. A keretet ettől még külön kell kezelni, de a döntéshozó láthatja a kisebb kezdő kiadás későbbi következményét." },
      { question: "Mit kérdezzek, ha az egyik ajánlat százalékos megtakarítást ígér?", answer: "Kérje a kiinduló állapotot, az éves üzemórát, a nyomást és a terhelési profilt. A százalék akkor értelmezhető, ha megmutatható, milyen azonos feladathoz és milyen feltételekhez tartozik." }
    ],
    midCta: { title: "A saját üzemórája dönti el az energiakülönbség értékét", text: "Készítsen előbecslést a saját gépadatokkal, és a kapott éves Ft-értéket tegye a tételes ajánlati árak mellé. Így a vételár és az üzemeltetés együtt látható." },
    finalCta: { title: "Kérjen olyan ajánlatot, amelyet össze is tud hasonlítani", text: "Indítsa el az energiaoldali előkalkulációt, vagy közvetlenül adja meg a gépigényét. A műszaki egyeztetésben tisztázható a légszállítás, a szabályozás és a teljes telepítési tartalom." },
    offer: "replacement", offerLabel: "Összehasonlítható gépajánlatot kérek", offerText: "Ha már van másik ajánlata, annak műszaki feladatát és a szükséges teljesítményt is leírhatja. Azonos feladatra érdemes összevetni a konfigurációkat.",
    nextSlug: "csavarkompresszor-csere-megterulese", nextReason: "A teljes költség után a megtérülési útmutató segít az ajánlatból jóváhagyható beruházási javaslatot készíteni."
  },
  "kompresszor-kalkulator-adatok": {
    title: "6 adat a kompresszor kalkulátorhoz: a saját becsléstől a gépajánlatig",
    seoTitle: "Kompresszor kalkulátor: 6 adat és a következő lépés",
    description: "Készítse elő a kompresszor kalkulátor hat bemenetét. Megmutatjuk az adatok forrását, a riport tartalmát és a személyre szabott ajánlatkérés lépéseit.",
    stage: "decision", audience: ["owner", "technical", "procurement"],
    intro: ["Már eljutott odáig, hogy a saját kompresszorára szeretne számokat látni. Nem biztos azonban az üzemórában, nem talál minden gépadatot, vagy attól tart, hogy az előkalkulációhoz kész műszaki specifikáció kell. Ezek miatt nem érdemes félretenni a vizsgálatot.", "A kalkulátor hat fő bemenettel indul. Ebben az útmutatóban megmutatjuk, mit hol talál meg, mi becslés és mi mért adat, illetve hogyan lehet a kapott riportból konkrét gépajánlatkérési alap. Ha már a beszerzésnél tart, a közvetlen ajánlatkérési lehetőséget is megtalálja a cikk végén."],
    quickAnswer: "A hat fő adat: márka, névleges kW, életkor, éves üzemóra, saját Ft/kWh és terhelési profil. A gépadatokhoz az adattábla, az üzemidőhöz a számláló vagy a műszakrend, az árhoz a saját szerződés ad támpontot. A részletes riporthoz kapcsolattartási adatok és adatkezelési elfogadás szükséges.",
    outcome: "Végig tud menni a kalkuláción, és tudni fogja, mikor érdemes riportot, illetve konkrét gépajánlatot kérni.",
    decisionSection: { id: "elobecsles-riport-ajanlat", title: "Előbecslés, riport vagy ajánlat? Válassza a döntéséhez illő lépést", paragraphs: ["Ha most a nagyságrendet szeretné látni, kezdjen a saját gépadatok megadásával. A megjelenő energiaoldali előnézet segít megérteni a feltételek hatását. Egy bizonytalan üzemórát több változatban is kipróbálhat anélkül, hogy ezt mért tényként kellene kezelnie.", "Ha a számítást a kollégáival is egyeztetné, kérje a részletes riportot e-mailben. A kalkulátornál a telefonszám nem kötelező a riportkéréshez. A szakmai utánkövetés hozzájárulása külön döntés; az alap riporthoz szükséges adatkezelési feltételt az űrlapnál tudja elolvasni.", "Ha a beszerzés már feladat, a gépajánlatkérés rövidebb út lehet. A cégnév, a kapcsolattartó és legalább egy elérhetőség mellett a gépadatokat és a helyzetét is megadhatja. Az első egyeztetés célja az igény pontosítása; a műszakilag alkalmas konfiguráció és a kereskedelmi feltételek ezután állíthatók össze."] },
    checklist: ["Készítse elő a márkát, kW-ot és gépkort az adattáblából vagy nyilvántartásból.", "Válasszon reális üzemórát, saját árat és terhelési profilt.", "Döntse el: belső egyeztetéshez riportot, beszerzéshez ajánlatot kér."],
    objections: [
      { question: "A riporthoz kötelező telefonszámot megadnom?", answer: "A kalkulátor e-mailes riportjához a telefonszám nem kötelező. A szükséges adatokat és az adatkezelési feltételeket az űrlap jelöli. A gépajánlatkérésnél legalább e-mail vagy telefon szükséges a válaszhoz." },
      { question: "Nem tudom a gép pontos típusát. Elakad az ajánlatkérés?", answer: "Az első egyeztetéshez a márka, a becsült teljesítmény és a gép kora is segíthet. Az ajánlatkérőn a nem ismert műszaki adat jelezhető; a végleges kiválasztás előtt a szükséges részleteket pontosítani kell." }
    ],
    midCta: { title: "Az adatok megvannak? Indulhat a saját előbecslés", text: "Adja meg a hat bemenetet, és nézze meg a becsült éves kWh- és Ft-különbséget. A bizonytalan üzemórát vagy energiaárat külön változatban ellenőrizheti." },
    finalCta: { title: "A következő kattintás már az Ön kompresszoráról szól", text: "Nyissa meg a kalkulátort, és készítse el a saját becslését. Ha a beszerzést már előkészítette, a személyre szabott gépajánlatkérést válassza." },
    offer: "replacement", offerLabel: "Már konkrét gépajánlatot kérek", offerText: "A jelenlegi berendezés adataival és a tervezett felhasználással elindítható az egyeztetés. A műszaki mezők között a nem ismert adat is jelezhető.",
    nextSlug: "csavarkompresszor-csere-megterulese", nextReason: "Ha a saját riport már megvan, ezzel az útmutatóval tudja a konkrét beruházási árat a várható éves előnyhöz viszonyítani."
  }
} satisfies Record<BlogSlug, BlogJourney>;
