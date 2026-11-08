import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Check, Clock3 } from "lucide-react";
import { BlogCard, BlogCta, BlogFooter, BlogHeader, BlogOffer, BlogOfferLink, BlogPreparation, CalculatorLink } from "@/components/blog";
import { blogPostPath, blogPosts, blogSources, blogStageLabels, buyerRoleLabels, buildBlogPostJsonLd, formatBlogDate, getBlogPost, getReadingMinutes } from "@/lib/blog";
import { BlogEngagement } from "@/components/blog-engagement";
import type { BlogSlug } from "@/lib/content-context";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  return {
    title: post.seoTitle, description: post.description,
    alternates: { canonical: blogPostPath(post) },
    openGraph: {
      title: post.title, description: post.description, url: blogPostPath(post), type: "article",
      publishedTime: post.publishedAt, modifiedTime: post.updatedAt,
      authors: ["iparikalkulator.hu"], section: post.category,
      locale: "hu_HU", siteName: "iparikalkulator.hu",
      images: [{ url: "/images/industrial-compressor-og.jpg", width: 1200, height: 630, alt: post.title }]
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: ["/images/industrial-compressor-og.jpg"] }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  const related = post.relatedSlugs.map(getBlogPost).filter((item) => item !== undefined);
  const nextPost = getBlogPost(post.journey.nextSlug)!;
  return (
    <div className="blog-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBlogPostJsonLd(post)).replace(/</g, "\\u003c") }} />
      <a className="blog-skip-link" href="#cikk-tartalom">Ugrás a cikkhez</a>
      <BlogHeader slug={post.slug as BlogSlug} />
      <BlogEngagement slug={post.slug as BlogSlug} />
      <main id="cikk-tartalom">
        <div className="container">
          <nav className="blog-breadcrumb" aria-label="Morzsanavigáció"><Link href="/">Kalkulátor</Link><span aria-hidden="true">/</span><Link href="/blog">Tudástár</Link><span aria-hidden="true">/</span><span aria-current="page">{post.category}</span></nav>
          <article data-blog-article={post.slug}>
            <header className="blog-article-hero">
              <span className="blog-eyebrow"><BookOpen size={16} aria-hidden="true" /> {post.category}</span>
              <span className="blog-article-stage">{blogStageLabels[post.journey.stage]}</span>
              <h1>{post.title}</h1><p className="blog-article-deck">{post.description}</p>
              <p className="blog-audience">{post.journey.audience.map((role) => buyerRoleLabels[role]).join(" · ")}</p>
              <div className="blog-article-meta"><span>iparikalkulator.hu</span><span>Frissítve: <time dateTime={post.updatedAt}>{formatBlogDate(post.updatedAt)}</time></span><span><Clock3 size={15} aria-hidden="true" /> {getReadingMinutes(post)} perc olvasás</span></div>
              <div className="blog-article-actions"><CalculatorLink slug={post.slug as BlogSlug} placement="intro" />{post.journey.stage === "decision" ? <BlogOfferLink post={post} placement="intro" /> : null}</div>
            </header>
            <div className="blog-article-layout">
              <div className="blog-prose">
                <section className="blog-quick-answer" aria-label="A rövid válasz"><span className="blog-eyebrow">A rövid válasz</span><p>{post.journey.quickAnswer}</p><strong>{post.journey.outcome}</strong></section>
                <div className="blog-intro">{post.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                <aside className="blog-takeaways" aria-label="A legfontosabb tudnivalók"><h2>Amit érdemes tudni</h2><ul>{post.takeaways.map((item) => <li key={item}><Check size={18} aria-hidden="true" /><span>{item}</span></li>)}</ul></aside>
                <nav className="blog-mobile-toc" aria-label="A cikk tartalma"><details><summary>Ugrás a cikk egy részéhez</summary><ol>{post.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></details></nav>
                {post.sections.map((section, index) => (
                  <div key={section.id}>
                    <section className="blog-prose-section" aria-labelledby={section.id}>
                      <h2 id={section.id}>{section.title}</h2>
                      {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      {section.formula ? <div className="blog-formula"><span>Számítási példa</span><strong>{section.formula}</strong></div> : null}
                      {section.bullets ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
                      {section.table ? (
                        <div className="blog-table-scroll" tabIndex={0} role="region" aria-label={section.table.caption}>
                          <table><caption>{section.table.caption}</caption><thead><tr>{section.table.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{section.table.rows.map((row) => <tr key={row[0]}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th scope="row" key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table>
                        </div>
                      ) : null}
                      {section.sourceIds?.map((id) => <p className="blog-source" key={id}>Szakmai háttér: <a href={blogSources[id].url} target="_blank" rel="noopener noreferrer">{blogSources[id].title} <span className="blog-sr-only">(új lapon nyílik)</span></a></p>)}
                    </section>
                    {index === 2 ? <BlogCta title={post.journey.midCta.title} text={post.journey.midCta.text} compact post={post} placement="inline" /> : null}
                  </div>
                ))}
                <BlogPreparation post={post} />
                <section className="blog-faq" aria-labelledby="blog-gyik"><h2 id="blog-gyik">Kérdések a következő lépés előtt</h2>{post.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
                <BlogCta title={post.cta.title} text={post.cta.text} post={post} />
                <BlogOffer post={post} />
              </div>
              <aside className="blog-sidebar" aria-label="Tartalom és kalkulátor">
                <div className="blog-sidebar-sticky">
                  <nav aria-label="A cikk fejezetei"><span className="blog-eyebrow">Ebben a cikkben</span><ol>{post.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav>
                  <div className="blog-sidebar-cta"><CalculatorLink slug={post.slug as BlogSlug} placement="sidebar" /><p>Hat bemenetből induló energiaoldali előbecslés. A részletes riporthoz telefon nem kötelező.</p></div>
                </div>
              </aside>
            </div>
          </article>
          <section className="blog-related" aria-labelledby="kapcsolodo-cikkek">
            <aside className="blog-next-reading"><span className="blog-eyebrow">Ha előbb tovább tájékozódna</span><h2><Link href={blogPostPath(nextPost)} prefetch={false} data-blog-action="next_article" data-blog-slug={post.slug} data-blog-destination={nextPost.slug}>{nextPost.title} <ArrowLeft className="blog-next-arrow" size={21} aria-hidden="true" /></Link></h2><p>{post.journey.nextReason}</p></aside>
            <div className="blog-section-heading"><div><span className="blog-eyebrow">Folytassa a tájékozódást</span><h2 id="kapcsolodo-cikkek">Kapcsolódó cikkek</h2></div><Link className="blog-text-link" href="/blog"><ArrowLeft size={17} aria-hidden="true" /> Összes cikk</Link></div>
            <div className="blog-card-grid">{related.map((item) => <BlogCard key={item.slug} post={item} />)}</div>
          </section>
        </div>
      </main>
      <BlogFooter />
    </div>
  );
}
