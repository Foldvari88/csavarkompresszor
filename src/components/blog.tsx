import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ArrowRight, BookOpen, Calculator, Check, Clock3 } from "lucide-react";
import { blogPostPath, blogPosts, blogStageLabels, buyerPaths, buyerRoleLabels, getBlogPost, getReadingMinutes, type BlogPost } from "@/lib/blog";
import { contentDestination, type BlogSlug } from "@/lib/content-context";
import "./blog.css";

type Placement = "header" | "intro" | "inline" | "closing" | "sidebar" | "index";

export function CalculatorLink({ compact = false, slug, placement = "index" }: { compact?: boolean; slug?: BlogSlug; placement?: Placement }) {
  return (
    <Link className={`blog-calculator-link${compact ? " is-compact" : ""}`} href={slug ? contentDestination(slug, "calculator") : "/#kalkulator"} prefetch={false}
      data-blog-action="calculator" data-blog-slug={slug} data-blog-placement={placement}>
      <Calculator size={19} aria-hidden="true" />
      Tovább a kalkulátorra
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}

export function BlogHeader({ slug }: { slug?: BlogSlug }) {
  return (
    <header className="blog-header">
      <div className="container blog-header-inner">
        <Link className="brand-home" href="/" aria-label="iparikalkulator.hu — főoldal">
          <BrandLogo />
        </Link>
        <nav aria-label="Fő navigáció">
          <Link className="blog-nav-link" href="/blog">Tudástár</Link>
          <CalculatorLink compact slug={slug} placement="header" />
        </nav>
      </div>
    </header>
  );
}

export function BlogFooter() {
  return (
    <footer className="blog-footer">
      <div className="container blog-footer-inner">
        <div><Link className="brand-home" href="/"><BrandLogo /></Link><p>Gyakorlati tudás az ipari sűrített levegő energiaköltségéhez.</p></div>
        <nav aria-label="További oldalak">
          <Link href="/blog">Tudástár</Link><Link href="/#kalkulator">Kalkulátor</Link>
          <Link href="/kompresszor-csere-ajanlat">Gépajánlatkérés</Link>
          <Link href="/adatkezeles">Adatkezelés</Link><Link href="/impresszum">Impresszum</Link>
          <Link href="/aszf">Felhasználási feltételek</Link><Link href="/sutik">Süti tájékoztató</Link>
        </nav>
      </div>
    </footer>
  );
}

export function BlogCta({ title, text, compact = false, post, placement = "closing" }: { title: string; text: string; compact?: boolean; post?: BlogPost; placement?: Placement }) {
  return (
    <aside className={`blog-cta${compact ? " blog-cta-compact" : ""}`} aria-label="Megtakarítás előkalkuláció">
      <span className="blog-eyebrow"><Calculator size={16} aria-hidden="true" /> Saját gép. Saját üzemóra. Saját energiaár.</span>
      <h2>{title}</h2><p>{text}</p><CalculatorLink slug={post?.slug as BlogSlug | undefined} placement={placement} />
      <small>Ingyenes előbecslés · A részletes riport e-mailben kérhető · Telefon nem kötelező a riporthoz</small>
    </aside>
  );
}

export function BlogCard({ post, number }: { post: BlogPost; number?: number }) {
  return (
    <article className="blog-card">
      <div className="blog-card-meta"><span>{post.category}</span>{number !== undefined ? <span className="blog-card-number" aria-hidden="true">{String(number).padStart(2, "0")}</span> : <BookOpen size={19} aria-hidden="true" />}</div>
      <span className="blog-card-stage">{blogStageLabels[post.journey.stage]}</span>
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
          <div><span className="blog-eyebrow"><BookOpen size={16} aria-hidden="true" /> Csavarkompresszor tudástár</span><h2 id="blog-tudastar">A magas számlától a megalapozott gépajánlatig</h2><p>Költséget tárna fel, műszaki megoldást választana vagy már ajánlatokat hasonlítana össze? Kezdje a saját döntésénél.</p></div>
          <Link className="blog-text-link" href="/blog">Mind a 10 cikk <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className="blog-card-grid">{blogPosts.slice(0, 3).map((post, index) => <BlogCard key={post.slug} post={post} number={index + 1} />)}</div>
      </div>
    </section>
  );
}

export function BlogOfferLink({ post, className = "blog-text-link", placement = "closing" }: { post: BlogPost; className?: string; placement?: Placement }) {
  const action = post.journey.offer === "service" ? "service" : "quote";
  return (
    <Link className={className} href={contentDestination(post.slug as BlogSlug, action)} prefetch={false}
      data-blog-action={action} data-blog-slug={post.slug} data-blog-placement={placement}>
      {post.journey.offerLabel}<ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}

export function BlogOffer({ post }: { post: BlogPost }) {
  return (
    <aside className="blog-offer-card" aria-label="Közvetlen szakmai ajánlatkérés">
      <span className="blog-eyebrow">Ha már konkrét feladata van</span>
      <h2>{post.journey.offer === "service" ? "A tapasztalt hibáról szeretne egyeztetni?" : "Már személyre szabott gépajánlatot szeretne?"}</h2>
      <p>{post.journey.offerText}</p>
      <BlogOfferLink post={post} className="blog-offer-link" />
      <small>Az első egyeztetéshez nem kell minden műszaki adatot ismernie. A feltételeket a konkrét igény alapján pontosítjuk.</small>
    </aside>
  );
}

export function BlogPreparation({ post }: { post: BlogPost }) {
  return (
    <section className="blog-preparation" aria-labelledby="sajat-kovetkezo-lepes">
      <span className="blog-eyebrow">Ezt készítse elő a saját ügyéhez</span>
      <h2 id="sajat-kovetkezo-lepes">Három pont a következő lépéshez</h2>
      <ul>{post.journey.checklist.map((item) => <li key={item}><Check size={18} aria-hidden="true" /><span>{item}</span></li>)}</ul>
      <p>Nem ismert minden adat? Jelölje a bizonytalanságot, és az ismert gépadatokkal induljon el az egyeztetés.</p>
    </section>
  );
}

export function BlogBuyerPaths() {
  return (
    <section className="container blog-buyer-paths" aria-labelledby="sajat-helyzet">
      <div className="blog-section-heading"><div><span className="blog-eyebrow">Kezdje ott, ahol most tart</span><h2 id="sajat-helyzet">Melyik döntés előtt áll?</h2></div></div>
      <div className="blog-path-grid">
        {buyerPaths.map((path) => (
          <section className="blog-path-card" id={path.id} key={path.id}>
            <span className="blog-eyebrow">{buyerRoleLabels[path.role]}</span>
            <h3>{path.title}</h3><p>{path.text}</p>
            <ol>{path.slugs.map((slug, index) => {
              const post = getBlogPost(slug)!;
              return <li key={slug}><span aria-hidden="true">0{index + 1}</span><Link href={blogPostPath(post)} prefetch={false}>{post.title}<ArrowRight size={15} aria-hidden="true" /></Link></li>;
            })}</ol>
          </section>
        ))}
      </div>
    </section>
  );
}
