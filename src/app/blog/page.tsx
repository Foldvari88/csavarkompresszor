import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BlogBuyerPaths, BlogCard, BlogCta, BlogFooter, BlogHeader, BlogIndustryLinks, CalculatorLink } from "@/components/blog";
import { blogPostPath, blogPosts } from "@/lib/blog";
import { absoluteUrl, siteName } from "@/lib/seo";

const title = "Csavarkompresszor: fogyasztás, gépválasztás és megtérülés";
const description = "Csavarkompresszor döntési útmutatók cégvezetőknek, műszaki vezetőknek és beszerzőknek. Az energiaköltségtől a saját kalkuláción át az ajánlatkérésig.";

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
              <h1>Drága a sűrített levegő?<br /><em>A következő döntéshez legyenek saját számai.</em></h1>
              <p>Cégvezetőknek, műszaki vezetőknek és beszerzőknek: tárja fel a költséget, hasonlítsa össze a megoldásokat, majd kérjen az üzeméhez illő ajánlatot.</p>
              <CalculatorLink /><span className="blog-hero-note">A cikkek után számoljon a saját üzemadataival.</span>
            </div>
            <div className="blog-hero-note-card">
              <span>A saját döntésének három lépése</span>
              <ol className="blog-hero-steps"><li>Költségek és veszteségek feltárása</li><li>Megoldások és teljes költség összevetése</li><li>Saját kalkuláció és konkrét ajánlat</li></ol>
              <p>Van már beszerzési feladata? <Link href="/kompresszor-csere-ajanlat#ajanlatkeres">Közvetlenül is kérhet gépajánlatot.</Link></p>
              <a href="#sajat-helyzet">Kiválasztom a saját helyzetemet <ArrowRight size={17} aria-hidden="true" /></a>
            </div>
          </div>
        </section>
        <BlogIndustryLinks />
        <BlogBuyerPaths />
        <section className="container blog-index-content" id="cikkek" aria-labelledby="cikkek-cim">
          <div className="blog-section-heading"><div><span className="blog-eyebrow">Fogyasztástól a beruházási döntésig</span><h2 id="cikkek-cim">Válaszok a költséges kérdésekre</h2></div><span className="blog-count">{blogPosts.length} szakmai cikk</span></div>
          <div className="blog-card-grid">{blogPosts.map((post, index) => <BlogCard key={post.slug} post={post} number={index + 1} />)}</div>
          <BlogCta title="A következő lépés már az Ön számairól szól" text="Adja meg kompresszora adatait, az éves üzemórát és a villamosenergia-árat. Nézze meg, mekkora lehet a korszerűsítés becsült éves energiahatása." />
        </section>
      </main>
      <BlogFooter />
    </div>
  );
}
