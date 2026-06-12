# Csavarkompresszor kalkulator

Next.js alapu, mobile-first ipari csavarkompresszor energia-hatekonysagi kalkulator lead riporttal, admin felulettel, PDF riporttal es Neon Postgres tarolassal.

## Kornyezeti valtozok

Masold a `.env.example` ertekeit Vercel project environment variable-kent:

- `ADMIN_USERNAME`: admin basic auth felhasznalonev, alapertelmezetten `admin`
- `ADMIN_PASSWORD`: admin basic auth jelszo, atmenetileg `admin`
- `DATABASE_URL`: Neon Postgres connection string, peldaul `postgresql://...neon.tech/...?...sslmode=require`
- `RESEND_API_KEY`: Resend email kuldeshez
- `EMAIL_FROM`: felado email
- `EMAIL_REPLY_TO`: valasz email cim, ha mas legyen mint a felado
- `EMAIL_SEQUENCE_ENABLED`: `true` vagy `false`; kikapcsolja a follow-up sorozat idoziteset
- `APPOINTMENT_URL`: a CTA link az eredmeny es follow-up emailekben
- `REPORT_NOTIFICATION_TO`: belso kalkulacios, aktivitasi es konzultacios visszahivas ertesitesek cimzettje

## Neon adatbazis

Productionben a leadek Neon Postgres adatbazisba kerulnek. A `DATABASE_URL` beallitasa utan az app runtime kozben letrehozza es boviti a `leads` tablat, ha meg nem letezik.

Az admin lead cockpit innen olvas:

- lead lista
- teljes ugyfeladatok
- kalkulacios inputok
- eredmenyek
- 1-5 csillagos ugyfelminosites
- Google Ads click ID tracking adatok

## Resend email flow

Lead bekuldes utan az app Resenddel azonnal kikuldi a kalkulacios eredmenyt PDF csatolmannyal. Ha a felhasznalo kulon hozzajarul a szakmai utankoveteshez, az app tovabbi 5 Resend emailt idozit:

- 1 nap: muszaki adatpontositas
- 3 nap: vezetoi/ROI dontesi anyag
- 6 nap: szivargas, nyomas es terhelesi profil
- 10 nap: ajanlott modell ellenorzese
- 18 nap: vegso egyeztetesi CTA

Az idozites Resend `scheduledAt` mezovel tortenik, minden kuldes idempotency kulcsot es Resend taget kap a lead azonositojaval.

Az eredmeny es follow-up emailek konzultacios CTA-ja eloszor sajat tracking route-ra megy. Kattintas utan az app elkuldi a belso visszahivas-keres ertesitest a `REPORT_NOTIFICATION_TO` cimre, majd tovabbiranyit az `APPOINTMENT_URL` oldalra.

## Deploy

Ajanlott platform: Vercel.

Build parancs:

```bash
pnpm build
```

Production start:

```bash
pnpm start
```
