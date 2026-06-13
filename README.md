# Csavarkompresszor kalkulátor

Next.js alapú, mobile-first ipari csavarkompresszor energiahatékonysági kalkulátor lead riporttal, admin felülettel, PDF riporttal és Neon Postgres tárolással.

## Környezeti változók

Másold a `.env.example` értékeit Vercel project environment variable-ként:

- `ADMIN_USERNAME`: admin basic auth felhasználónév, alapértelmezetten `admin`
- `ADMIN_PASSWORD`: admin basic auth jelszó, átmenetileg `admin`
- `DATABASE_URL`: Neon Postgres connection string, például `postgresql://...neon.tech/...?...sslmode=require`
- `RESEND_API_KEY`: Resend email küldéshez
- `EMAIL_FROM`: feladó email
- `EMAIL_REPLY_TO`: válasz email cím, ha más legyen mint a feladó
- `EMAIL_SEQUENCE_ENABLED`: `true` vagy `false`; kikapcsolja a follow-up sorozat időzítését
- `EMAIL_SEQUENCE_MODE`: `broadcast` esetben Resend Segmentbe menti a leadet, és Resend Broadcast draftokból kezelhető a szekvencia
- `RESEND_MARKETING_SEGMENT_ID`: Resend Segment ID a broadcast szekvencia kontaktjaihoz
- `RESEND_MARKETING_SEGMENT_NAME`: opcionális Segment név a broadcast setup scripthez
- `REPORT_NOTIFICATION_TO`: belső kalkulációs és aktivitási értesítések címzettje
- `CONSULTATION_NOTIFICATION_TO`: konzultációs visszahívás kattintások értesítési címe, alapértelmezetten `info@iparikalkulator.hu`

## Neon adatbázis

Productionben a leadek Neon Postgres adatbázisba kerülnek. A `DATABASE_URL` beállítása után az app runtime közben létrehozza és bővíti a `leads` táblát, ha még nem létezik.

Az admin lead cockpit innen olvas:

- lead lista
- teljes ügyféladatok
- kalkulációs inputok
- eredmények
- 1-5 csillagos ügyfélminősítés
- Google Ads click ID tracking adatok

## Resend email flow

Lead beküldés után az app Resenddel azonnal kiküldi a kalkulációs eredményt PDF csatolmánnyal. Ha a felhasználó külön hozzájárul a szakmai utánkövetéshez, `broadcast` módban az app Resend Contactként a `RESEND_MARKETING_SEGMENT_ID` Segmentbe menti a leadet. A szekvencia emailjei Resend Broadcast draftok, így a Resend felületen szerkeszthetők:

- 1 nap: műszaki adatpontosítás
- 3 nap: vezetői/ROI döntési anyag
- 6 nap: szivárgás, nyomás és terhelési profil
- 10 nap: ajánlott modell ellenőrzése
- 18 nap: végső egyeztetési CTA

Első beállítás teljes jogosultságú Resend API kulccsal:

```bash
pnpm resend:setup-broadcasts
```

A script létrehozza a Segmentet, a contact property-ket és az 5 Broadcast draftot. Send-only Resend API kulccsal ez nem fut le, mert a Segment, Contact Property és Broadcast létrehozáshoz bővebb jogosultság kell. A parancs kiírja a `RESEND_MARKETING_SEGMENT_ID` értéket; ezt Vercelben Production és Preview környezetre is add hozzá, majd állítsd:

```env
EMAIL_SEQUENCE_MODE=broadcast
```

Az eredmény és follow-up emailek konzultációs CTA-ja saját tracking route-ra megy. Kattintás után az app elküldi a belső visszahívás-kérés értesítést a `CONSULTATION_NOTIFICATION_TO` címre, majd a saját köszönő oldalra irányít.

## Email deliverability

A Gmail spam mappa elkerüléséhez a `EMAIL_FROM` domainjét Resendben verifikálni kell. A Resend Domains felületen add hozzá az `iparikalkulator.hu` domaint, majd a DNS szolgáltatódnál állítsd be pontosan a Resend által adott SPF, DKIM és DMARC rekordokat.

Javasolt production értékek:

- `EMAIL_FROM=IpariKalkulator.hu <riport@iparikalkulator.hu>`
- `EMAIL_REPLY_TO=info@iparikalkulator.hu`
- `EMAIL_SEQUENCE_MODE=broadcast`
- `REPORT_NOTIFICATION_TO=info@iparikalkulator.hu`
- `CONSULTATION_NOTIFICATION_TO=info@iparikalkulator.hu`

Az app multipart emailt küld (`html` és `text` tartalommal), és a PDF riport mellett a letöltési linket is tartalmazza. Ha a DNS rekordok nincsenek rendben, a Gmail ettől függetlenül spambe sorolhatja a levelet.

## Deploy

Ajánlott platform: Vercel.

Build parancs:

```bash
pnpm build
```

Production start:

```bash
pnpm start
```
