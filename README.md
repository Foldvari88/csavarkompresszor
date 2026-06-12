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

Lead beküldés után az app Resenddel azonnal kiküldi a kalkulációs eredményt PDF csatolmánnyal. Ha a felhasználó külön hozzájárul a szakmai utánkövetéshez, az app további 5 Resend emailt időzít:

- 1 nap: műszaki adatpontosítás
- 3 nap: vezetői/ROI döntési anyag
- 6 nap: szivárgás, nyomás és terhelési profil
- 10 nap: ajánlott modell ellenőrzése
- 18 nap: végső egyeztetési CTA

Az időzítés Resend `scheduledAt` mezővel történik, minden küldés idempotency kulcsot és Resend taget kap a lead azonosítójával.

Az eredmény és follow-up emailek konzultációs CTA-ja saját tracking route-ra megy. Kattintás után az app elküldi a belső visszahívás-kérés értesítést a `CONSULTATION_NOTIFICATION_TO` címre, majd a saját köszönő oldalra irányít.

## Email deliverability

A Gmail spam mappa elkerüléséhez a `EMAIL_FROM` domainjét Resendben verifikálni kell. A Resend Domains felületen add hozzá az `iparikalkulator.hu` domaint, majd a DNS szolgáltatódnál állítsd be pontosan a Resend által adott SPF, DKIM és DMARC rekordokat.

Javasolt production értékek:

- `EMAIL_FROM=IpariKalkulator.hu <riport@iparikalkulator.hu>`
- `EMAIL_REPLY_TO=info@iparikalkulator.hu`
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
