import type { Metadata } from "next";
import { ArrowRight, BookOpen } from "lucide-react";
import { BlogCard, BlogCta, BlogFooter, BlogHeader, CalculatorLink } from "@/components/blog";
import { blogPostPath, blogPosts } from "@/lib/blog";
import { absoluteUrl, siteName } from "@/lib/seo";

const title = "Csavarkompresszor blog és tudástár";
const description = "10 gyakorlati útmutató a csavarkompresszor fogyasztásáról, megtérüléséről, RS/VSD választásról és hővisszanyerésről. Számoljon a saját adataival.";

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: "/blog" },
  openGraph: {
    title, description, url: "/blog", type: "website", locale: "hu_HU", siteName,
    images: [{ url: "/images/industrial-compressor-og.jpg", width: 1200, height: 630, alt: "Csavarkompresszor tudástár és energiamegtakarítás kalkulátor" }]
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/industrial-compressor-og.jpg"] }
};

export default function BlogIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Blog", "@id": absoluteUrl("/blog#blog"),
    name: "Csavarkompresszor tudástár", description, url: absoluteUrl("/blog"), inLanguage: "hu-HU",
    publisher: { "@type": "Organization", name: siteName, url: absoluteUrl("/") },
    blogPost: blogPosts.map((post) => ({ "@type": "BlogPosting", headline: post.title, url: absoluteUrl(blogPostPath(post)) }))
  };
  return (
    <div className="blog-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <a className="blog-skip-link" href="#blog-tartalom">Ugrás a tartalomhoz</a>
      <BlogHeader />
      <main id="blog-tartalom">
        <section className="blog-index-hero">
          <div className="container blog-index-hero-grid">
            <div>
              <span className="blog-eyebrow"><BookOpen size={17} aria-hidden="true" /> Csavarkompresszor tudástár</span>
              <h1>A sűrített levegőnek ára van.<br /><em>Ismerje meg a sajátját.</em></h1>
              <p>10 gyakorlati útmutató, hogy átlássa a fogyasztást, megtalálja a veszteségeket és adatokkal készüljön a következő gépbeszerzésre.</p>
              <CalculatorLink /><span className="blog-hero-note">A cikkek után számoljon a saját üzemadataival.</span>
            </div>
            <div className="blog-hero-note-card">
              <span>Az éves költség mögött</span>
              <strong>kW <span>×</span> óra <span>×</span> Ft/kWh</strong>
              <p>A felvett teljesítmény, az üzemidő és az energiaár együtt mutatja meg, hol érdemes keresni a megtakarítást.</p>
              <a href="#cikkek">Válasszon témát <ArrowRight size={17} aria-hidden="true" /></a>
            </div>
          </div>
        </section>
        <section className="container blog-index-content" id="cikkek" aria-labelledby="cikkek-cim">
          <div className="blog-section-heading"><div><span className="blog-eyebrow">Fogyasztástól a beruházási döntésig</span><h2 id="cikkek-cim">Válaszok a költséges kérdésekre</h2></div><span className="blog-count">10 szakmai cikk</span></div>
          <div className="blog-card-grid">{blogPosts.map((post, index) => <BlogCard key={post.slug} post={post} number={index + 1} />)}</div>
          <BlogCta title="A következő lépés már az Ön számairól szól" text="Adja meg kompresszora adatait, az éves üzemórát és a villamosenergia-árat. Nézze meg, mekkora lehet a korszerűsítés becsült éves energiahatása." />
        </section>
      </main>
      <BlogFooter />
    </div>
  );
}
