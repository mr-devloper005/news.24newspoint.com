import Link from 'next/link'
import { ArrowRight, Compass, Layers3, ShieldCheck } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-transparent text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="overflow-hidden rounded-[2.8rem] bg-white shadow-[0_30px_90px_rgba(26,47,77,0.12)]">
            <div className="relative overflow-hidden border-b border-[color:var(--slot4-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f6f8f3_100%)] px-8 py-12 text-[var(--slot4-page-text)] sm:px-12 lg:px-16 lg:py-16">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(182,206,180,0.22),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(150,167,141,0.16),transparent_24%)]" />
              <div className="relative">
              <p className="editorial-kicker text-black/50">{pagesContent.about.badge}</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.06em] text-black sm:text-7xl">
                Built for clear distribution, organized discovery, and stronger public-facing presentation.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-black/70">
                {SITE_CONFIG.name} is shaped around clarity, premium structure, and a cleaner path through releases, updates, and connected content.
              </p>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.6rem] border border-[color:var(--slot4-border)] bg-white/85 p-5 text-[var(--slot4-page-text)] shadow-[0_16px_40px_rgba(26,47,77,0.06)] backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">Reading flow</p>
                  <p className="mt-3 text-3xl font-black">Clear</p>
                  <p className="mt-2 text-sm leading-6 text-black/68">Structured layouts that keep long-form reading and release discovery easier to follow.</p>
                </div>
                <div className="rounded-[1.6rem] border border-[color:var(--slot4-border)] bg-white/85 p-5 text-[var(--slot4-page-text)] shadow-[0_16px_40px_rgba(26,47,77,0.06)] backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">Content system</p>
                  <p className="mt-3 text-3xl font-black">Connected</p>
                  <p className="mt-2 text-sm leading-6 text-black/68">Articles, listings, visuals, and resources stay linked inside one consistent experience.</p>
                </div>
                <div className="rounded-[1.6rem] border border-[color:var(--slot4-border)] bg-white/85 p-5 text-[var(--slot4-page-text)] shadow-[0_16px_40px_rgba(26,47,77,0.06)] backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">Presentation</p>
                  <p className="mt-3 text-3xl font-black">Premium</p>
                  <p className="mt-2 text-sm leading-6 text-black/68">A more deliberate UI that feels closer to a real media distribution platform.</p>
                </div>
              </div>
              </div>
            </div>

            <div className="grid gap-8 px-8 py-10 sm:px-12 lg:grid-cols-[1.1fr_.9fr] lg:px-16 lg:py-14">
              <article>
                <p className="editorial-kicker text-[var(--slot4-accent-fill)]">About {SITE_CONFIG.name}</p>
                <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">{pagesContent.about.title}</h2>
                <p className="mt-5 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{pagesContent.about.description}</p>
                <div className="article-content mt-10 space-y-6">
                  {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </article>

              <aside className="grid gap-5 content-start">
                {[
                  { icon: Compass, ...pagesContent.about.values[0] },
                  { icon: Layers3, ...pagesContent.about.values[1] },
                  { icon: ShieldCheck, ...pagesContent.about.values[2] },
                ].map((value, index) => (
                  <div key={value.title} className={`rounded-[1.8rem] border border-[color:var(--slot4-border)] p-6 shadow-[0_16px_40px_rgba(26,47,77,0.08)] ${index === 1 ? 'bg-[var(--slot4-page-bg)]' : 'bg-white'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <value.icon className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">0{index + 1}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">{value.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                  </div>
                ))}
              </aside>
            </div>

            <div className="border-t border-[color:var(--slot4-border)] bg-[linear-gradient(180deg,#f7faf6_0%,#eef5ea_100%)] px-8 py-10 sm:px-12 lg:px-16">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="editorial-kicker text-[var(--slot4-accent-fill)]">Explore next</p>
                  <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">Read the latest releases, discover archived updates, and keep the conversation moving.</h2>
                </div>
                <Link href="/search" className="inline-flex w-fit items-center gap-2 rounded-md bg-[var(--slot4-dark-bg)] px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-white">
                  Explore the archive <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
