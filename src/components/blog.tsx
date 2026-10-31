import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, Clock3, Zap } from "lucide-react";
import { blogPostPath, blogPosts, getReadingMinutes, type BlogPost } from "@/lib/blog";
import "./blog.css";

export function CalculatorLink({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`blog-calculator-link${compact ? " is-compact" : ""}`} href="/#kalkulator" prefetch={false}>
      <Calculator size={19} aria-hidden="true" />
      Tovább a kalkulátorra
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}

export function BlogHeader() {
  return (
    <header className="blog-header">
      <div className="container blog-header-inner">
        <Link className="blog-brand" href="/" aria-label="iparikalkulator.hu — főoldal">
          <span><Zap size={21} aria-hidden="true" /></span>iparikalkulator.hu
        </Link>
        <nav aria-label="Fő navigáció">
          <Link className="blog-nav-link" href="/blog">Tudástár</Link>
          <CalculatorLink compact />
        </nav>
      </div>
    </header>
  );
}

export function BlogFooter() {
  return (
    <footer className="blog-footer">
      <div className="container blog-footer-inner">
        <div><Link className="blog-brand" href="/">iparikalkulator.hu</Link><p>Gyakorlati tudás az ipari sűrített levegő energiaköltségéhez.</p></div>
        <nav aria-label="További oldalak">
          <Link href="/blog">Tudástár</Link><Link href="/#kalkulator">Kalkulátor</Link>
          <Link href="/adatkezeles">Adatkezelés</Link><Link href="/impresszum">Impresszum</Link>
          <Link href="/aszf">Felhasználási feltételek</Link><Link href="/sutik">Süti tájékoztató</Link>
        </nav>
      </div>
    </footer>
  );
}

export function BlogCta({ title, text, compact = false }: { title: string; text: string; compact?: boolean }) {
  return (
    <aside className={`blog-cta${compact ? " blog-cta-compact" : ""}`} aria-label="Megtakarítás előkalkuláció">
      <span className="blog-eyebrow"><Calculator size={16} aria-hidden="true" /> Saját adatok. Saját előbecslés.</span>
      <h2>{title}</h2><p>{text}</p><CalculatorLink />
      <small>Ingyenes előbecslés · Éves kWh és Ft · E-mailben kérhető riport</small>
    </aside>
  );
}

export function BlogCard({ post, number }: { post: BlogPost; number?: number }) {
  return (
    <article className="blog-card">
      <div className="blog-card-meta"><span>{post.category}</span>{number !== undefined ? <span className="blog-card-number" aria-hidden="true">{String(number).padStart(2, "0")}</span> : <BookOpen size={19} aria-hidden="true" />}</div>
      <h3><Link href={blogPostPath(post)} prefetch={false}>{post.title}</Link></h3>
      <p>{post.description}</p>
      <div className="blog-card-bottom">
        <span><Clock3 size={14} aria-hidden="true" /> {getReadingMinutes(post)} perc olvasás</span>
        <Link href={blogPostPath(post)} prefetch={false} aria-label={`Cikk elolvasása: ${post.title}`}>Elolvasom <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}

export function BlogTeaser() {
  return (
    <section className="blog-teaser" aria-labelledby="blog-tudastar">
      <div className="container">
        <div className="blog-section-heading">
          <div><span className="blog-eyebrow"><BookOpen size={16} aria-hidden="true" /> Csavarkompresszor tudástár</span><h2 id="blog-tudastar">Jobb döntés, kevesebb energiaköltség</h2><p>Gyakorlati útmutatók fogyasztáshoz, gépválasztáshoz és megtérüléshez.</p></div>
          <Link className="blog-text-link" href="/blog">Mind a 10 cikk <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className="blog-card-grid">{blogPosts.slice(0, 3).map((post, index) => <BlogCard key={post.slug} post={post} number={index + 1} />)}</div>
      </div>
    </section>
  );
}
