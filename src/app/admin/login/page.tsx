import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, Gauge, LockKeyhole, ShieldCheck } from "lucide-react";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionMaxAgeSeconds,
  isValidAdminCredentials
} from "@/lib/admin-auth";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Admin belépés",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(params.next);
  const hasError = params.error === "1";

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card" aria-label="Admin belépés">
        <div className="admin-login-visual">
          <div className="admin-login-visual-head">
            <div className="admin-login-logo" aria-hidden="true">
              <MiniScrewCompressorLogo />
            </div>
            <div className="admin-login-status">
              <span />
              Védett admin zóna
            </div>
          </div>

          <div className="admin-login-visual-copy">
            <span>Lead tracker</span>
            <h2>Beküldött kalkulációk, riportok és státuszok egy helyen.</h2>
            <p>
              Itt követhetők a céges adatok, a PDF riportok, a kampányforrások és a
              sales folyamat állapota.
            </p>
          </div>

          <div className="admin-login-flow" aria-label="Admin folyamat">
            <span>01 Belépés</span>
            <span>02 Leadek áttekintése</span>
            <span>03 Státusz és score</span>
          </div>

          <div className="admin-login-machine">
            <span />
            <span />
            <span />
          </div>
        </div>

        <form action={loginAction} className="admin-login-form">
          <input type="hidden" name="next" value={nextPath} />
          <span className="eyebrow">
            <LockKeyhole size={15} />
            Védett admin felület
          </span>
          <h1>Lead tracker belépés</h1>
          <p>
            Jelentkezz be az ipari csavarkompresszor kalkulátor admin felületéhez,
            ahol a beküldött leadek és riportok kezelhetők.
          </p>

          {hasError ? (
            <div className="admin-login-error" role="alert">
              Hibás belépési adat. Ellenőrizd a felhasználónevet és a jelszót.
            </div>
          ) : null}

          <label className="admin-login-field">
            <span>Felhasználónév</span>
            <input
              autoComplete="username"
              autoFocus
              name="username"
              placeholder="admin"
              required
              type="text"
            />
          </label>

          <label className="admin-login-field">
            <span>Jelszó</span>
            <input
              autoComplete="current-password"
              name="password"
              placeholder="••••••••"
              required
              type="password"
            />
          </label>

          <button className="admin-login-submit" type="submit">
            Belépés az adminba
            <ArrowRight size={18} />
          </button>

          <div className="admin-login-trust">
            <span>
              <ShieldCheck size={16} />
              Session alapú védelem
            </span>
            <span>
              <Gauge size={16} />
              Lead scoring dashboard
            </span>
          </div>
        </form>
      </section>
    </main>
  );
}

async function loginAction(formData: FormData) {
  "use server";

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = sanitizeNextPath(String(formData.get("next") ?? "/admin"));

  if (!isValidAdminCredentials(username, password)) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, await createAdminSessionToken(), {
    httpOnly: true,
    maxAge: getAdminSessionMaxAgeSeconds(),
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  redirect(nextPath as Parameters<typeof redirect>[0]);
}

function sanitizeNextPath(value?: string) {
  if (!value?.startsWith("/admin") || value.startsWith("/admin/login")) {
    return "/admin";
  }
  return value;
}

function MiniScrewCompressorLogo() {
  return (
    <svg
      aria-hidden="true"
      className="mini-compressor-logo"
      focusable="false"
      viewBox="0 0 32 32"
    >
      <path d="M5.5 21.5h21" />
      <path d="M7.5 12.5h12.4a4.6 4.6 0 0 1 4.6 4.6v4.4h-17z" />
      <path d="M9.5 12.5V9h5.2" />
      <path d="M17 9h4.2" />
      <path d="M24.5 14h2.3v5.2" />
      <circle cx="12.4" cy="17" r="2.45" />
      <circle cx="19.1" cy="17" r="2.45" />
      <path d="M10.35 17h4.1" />
      <path d="M17.05 17h4.1" />
      <path d="M10 21.5v2.7" />
      <path d="M23 21.5v2.7" />
      <path d="M9 24.2h3.4" />
      <path d="M22 24.2h3.4" />
    </svg>
  );
}
