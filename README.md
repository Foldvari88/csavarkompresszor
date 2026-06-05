# Csavarkompresszor kalkulátor

Next.js alapú, mobil-first ipari csavarkompresszor energiahatékonysági kalkulátor lead riporttal, admin felülettel, PDF riporttal és Supabase/Postgres tárolással.

## Környezeti változók

Másold a `.env.example` értékeit Vercel project environment variable-ként:

- `ADMIN_PASSWORD`: admin basic auth jelszó
- `DATABASE_URL`: Supabase Postgres connection string
- `RESEND_API_KEY`: Resend email küldéshez
- `EMAIL_FROM`: feladó email
- `EMAIL_REPLY_TO`: válasz email cím, ha más legyen mint a feladó
- `EMAIL_SEQUENCE_ENABLED`: `true` vagy `false`; kikapcsolja a follow-up sorozat időzítését
- `APPOINTMENT_URL`: a CTA link az eredmény és follow-up emailekben
- `REPORT_NOTIFICATION_TO`: belső kalkulációs értesítések címzettje

## Resend email flow

Lead beküldés után az app Resenddel azonnal kiküldi a kalkulációs eredményt PDF csatolmánnyal. Ha a felhasználó külön hozzájárul a szakmai utánkövetéshez, az app további 5 Resend emailt időzít:

- 1 nap: műszaki adatpontosítás
- 3 nap: vezetői/ROI döntési anyag
- 6 nap: szivárgás, nyomás és terhelési profil
- 10 nap: ajánlott modell ellenőrzése
- 18 nap: végső egyeztetési CTA

Az időzítés Resend `scheduledAt` mezővel történik, minden küldés idempotency kulcsot és Resend taget kap a lead azonosítójával.

## Supabase

A táblát a `supabase/migrations/0001_create_leads.sql` migration hozza létre. Az app runtime közben is képes létrehozni a `leads` táblát, ha a `DATABASE_URL` be van állítva.

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
