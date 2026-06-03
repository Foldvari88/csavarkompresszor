# Csavarkompresszor kalkulátor

Next.js alapú, mobil-first ipari csavarkompresszor energiahatékonysági kalkulátor lead riporttal, admin felülettel, PDF riporttal és Supabase/Postgres tárolással.

## Környezeti változók

Másold a `.env.example` értékeit Vercel project environment variable-ként:

- `ADMIN_PASSWORD`: admin basic auth jelszó
- `DATABASE_URL`: Supabase Postgres connection string
- `RESEND_API_KEY`: Resend email küldéshez
- `EMAIL_FROM`: feladó email
- `REPORT_NOTIFICATION_TO`: belső kalkulációs értesítések címzettje

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
