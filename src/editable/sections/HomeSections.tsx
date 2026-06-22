import Link from 'next/link'
import { ArrowRight, CheckCircle2, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import {
  CompactIndexCard,
  EditorialFeatureCard,
  EditorialListCard,
  getEditableCategory,
  getEditableExcerpt,
  HorizontalFeatureCard,
  ImageFirstCard,
  postHref,
  RailPostCard,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/18 bg-[rgba(255,255,255,0.14)] px-5 py-4 backdrop-blur">
      <p className="text-2xl font-black tracking-[-0.05em] text-black">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-black/80">{label}</p>
    </div>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const rightCards = posts.slice(1, 3)

  return (
    <section className="bg-white">
      <div className={`${dc.shell.section} py-10 lg:py-14`}>
        <div className="grid gap-8 lg:grid-cols-[1.02fr_.98fr] lg:items-center">
          <div className="space-y-6">
            <p className="editorial-kicker text-[var(--slot4-accent-fill)]">{pagesContent.home.hero.badge}</p>
            <div className="max-w-3xl">
              <h1 className="text-5xl font-black leading-[0.94] tracking-[-0.07em] text-[var(--slot4-accent-fill)] sm:text-6xl">
                Press Release
              </h1>
              <h2 className="mt-2 text-5xl font-black leading-[0.94] tracking-[-0.07em] text-[var(--slot4-page-text)] sm:text-6xl">
                Distribution Since 2004
              </h2>
              <p className="mt-5 text-2xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)] sm:text-3xl">
                Get Published on Authority News Sites
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-9 text-[var(--slot4-muted-text)]">
                {pagesContent.home.hero.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href={'/signup'} className={dc.button.accent}>Sign Up</Link>
             </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-[color:var(--slot4-border)] bg-[var(--slot4-surface-bg)] p-4">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]">Trusted network</p>
                <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">Built for launches, updates, statements, and public news circulation.</p>
              </div>
              <div className="rounded-[1.5rem] border border-[color:var(--slot4-border)] bg-[var(--slot4-surface-bg)] p-4">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]">Flexible coverage</p>
                <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">Surface brand, market, company, and campaign news in one flow.</p>
              </div>
              <div className="rounded-[1.5rem] border border-[color:var(--slot4-border)] bg-[var(--slot4-surface-bg)] p-4">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]">Searchable archive</p>
                <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">Every release remains easy to revisit, share, and discover.</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-[color:var(--slot4-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f6faf5_100%)] p-6 shadow-[0_28px_80px_rgba(26,47,77,0.12)] sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.08fr_.92fr]">
              <div className="grid gap-6">
                <div className="overflow-hidden rounded-[2rem] bg-[var(--slot4-dark-bg)] text-white">
                  <div className="grid gap-0 sm:grid-cols-[1fr_180px]">
                    <div className="p-7 sm:p-8">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d8f06d]">Distribution brief</p>
                      <h3 className="mt-4 max-w-lg text-5xl font-black leading-[0.92] tracking-[-0.06em]">A premium release surface built for visibility, trust, and clean scanning.</h3>
                      <p className="mt-5 max-w-xl text-sm leading-7 text-white/76">
                        This layout reframes the homepage panel as an executive summary instead of a cluster of mini-cards, giving the section a more confident editorial presence.
                      </p>
                    </div>
                    <div className="border-t border-white/10 bg-white/6 p-6 sm:border-l sm:border-t-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/50">Network set</p>
                      <div className="mt-4 space-y-2 text-sm font-black text-white">
                        <p>Benzinga</p>
                        <p>Yahoo</p>
                        <p>Google</p>
                        <p>MarketWatch</p>
                        <p>Digital Journal</p>
                        <p>Bing</p>
                      </div>
                    </div>
                  </div>
                </div>

                
              </div>

              <div className="rounded-[2rem] border border-[color:var(--slot4-border)] bg-white">
                <div className="border-b border-[color:var(--slot4-border)] px-6 py-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">Release queue</p>
                  <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">What visitors see next</h3>
                </div>
                <div className="divide-y divide-[color:var(--slot4-border)]">
                  {rightCards.map((post, index) => (
                    <div key={post.id || post.slug || `${post.title}-${index}`} className="px-6 py-5">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">{index === 0 ? 'Primary release' : 'Secondary release'}</p>
                        <span className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]">0{index + 1}</span>
                      </div>
                      <h4 className="mt-3 line-clamp-3 text-2xl font-black leading-[1.04] tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h4>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 120)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 8)
  return (
    <section className="luxury-band luxury-grid-lines">
      <div className={`${dc.shell.section} py-12 text-center sm:py-14`}>
        <h2 className="text-4xl font-black tracking-[-0.06em] text-black sm:text-6xl">Experience The 24-7 Press Release Difference</h2>
        <p className="mx-auto mt-5 max-w-4xl text-lg font-semibold leading-8 text-black/80">
          With a refined distribution experience and a deep archive of recent releases, the platform is designed to help public stories look credible, searchable, and ready to circulate.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <StatPill value="20+" label="Years of presence" />
          <StatPill value="500k+" label="Stories surfaced" />
          <StatPill value="24/7" label="Archive access" />
          <StatPill value="100%" label="Publishing focus" />
        </div>

        <div className="mt-10 flex snap-x gap-4 overflow-x-auto pb-3 text-left [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {railPosts.map((post, index) => <RailPostCard key={post.id || post.slug || `${post.title}-${index}`} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const feature = posts[2] || posts[0]
  const featureB = posts[3] || posts[1] || posts[0]
  const featureC = posts[4] || posts[2] || posts[0]
  const featureD = posts[5] || posts[3] || posts[0]

  if (!feature) return null

  return (
    <section className="bg-white">
      <div className={`${dc.shell.section} py-14 lg:py-20`}>
        <div className="grid gap-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="editorial-kicker text-[var(--slot4-accent-fill)]">Competitive pricing</p>
              <h2 className="mt-3 text-5xl font-black tracking-[-0.06em] text-[var(--slot4-page-text)]">Competitive Pricing</h2>
              <p className="mt-5 max-w-2xl text-lg leading-9 text-[var(--slot4-muted-text)]">
                Our distribution presentation is designed to feel established and premium while keeping the browsing path efficient for media distributors, brands, and public-facing teams.
              </p>
            </div>
            <div className="mx-auto w-full max-w-[460px] rounded-[2.5rem] bg-[linear-gradient(180deg,#f6fbf8_0%,#eff6ef_100%)] p-6 shadow-[0_18px_60px_rgba(26,47,77,0.10)]">
              <img src="/pricing.png" alt="Competitive pricing" className="mx-auto h-auto w-full max-w-[360px] object-contain" />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 mx-auto w-full max-w-[420px] rounded-[2.5rem] bg-[linear-gradient(180deg,#f6fbf8_0%,#eff6ef_100%)] p-6 shadow-[0_18px_60px_rgba(26,47,77,0.10)]">
              <img src="/value.png" alt="Value driven approach" className="mx-auto h-auto w-full max-w-[320px] object-contain" />
            </div>
            <div className="order-1 lg:order-2">
              <p className="editorial-kicker text-[var(--slot4-accent-fill)]">Value driven approach</p>
              <h2 className="mt-3 text-5xl font-black tracking-[-0.06em] text-[var(--slot4-page-text)]">Value Driven Approach</h2>
              <p className="mt-5 max-w-2xl text-lg leading-9 text-[var(--slot4-muted-text)]">
                Every release page, card treatment, and archive block is shaped to increase clarity, keep key details visible, and make fresh distribution easier to scan.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="editorial-kicker text-[var(--slot4-accent-fill)]">Caring customer service</p>
              <h2 className="mt-3 text-5xl font-black tracking-[-0.06em] text-[var(--slot4-page-text)]">Caring Customer Service</h2>
              <p className="mt-5 max-w-2xl text-lg leading-9 text-[var(--slot4-muted-text)]">
                A clean publishing path, reliable archive structure, and accessible detail pages make every update easier to prepare, review, and revisit.
              </p>
            </div>
            <div className="mx-auto w-full max-w-[420px] rounded-[2.5rem] bg-[linear-gradient(180deg,#f6fbf8_0%,#eff6ef_100%)] p-6 shadow-[0_18px_60px_rgba(26,47,77,0.10)]">
              <img src="/customer.png" alt="Caring customer service" className="mx-auto h-auto w-full max-w-[320px] object-contain" />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 mx-auto w-full max-w-[420px] rounded-[2.5rem] bg-[linear-gradient(180deg,#f6fbf8_0%,#eff6ef_100%)] p-6 shadow-[0_18px_60px_rgba(26,47,77,0.10)]">
              <img src="/award.png" alt="Industry excellence" className="mx-auto h-auto w-full max-w-[320px] object-contain" />
            </div>
            <div className="order-1 lg:order-2">
              <p className="editorial-kicker text-[var(--slot4-accent-fill)]">Industry excellence</p>
              <h2 className="mt-3 text-5xl font-black tracking-[-0.06em] text-[var(--slot4-page-text)]">Industry Excellence</h2>
              <p className="mt-5 max-w-2xl text-lg leading-9 text-[var(--slot4-muted-text)]">
                Clear information hierarchy, richer release cards, and a more established visual system help the site feel closer to a real distribution platform than a generic catalog.
              </p>
            </div>
          </div>

         

          <HorizontalFeatureCard post={feature} href={postHref(primaryTask, feature, primaryRoute)} />
          {featureB ? <ImageFirstCard post={featureB} href={postHref(primaryTask, featureB, primaryRoute)} badge={getEditableCategory(featureB)} /> : null}
          {featureC ? <ImageFirstCard post={featureC} href={postHref(primaryTask, featureC, primaryRoute)} badge={getEditableCategory(featureC)} /> : null}
          {featureD ? <ImageFirstCard post={featureD} href={postHref(primaryTask, featureD, primaryRoute)} badge={getEditableCategory(featureD)} /> : null}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collected = timeSections.flatMap((section) => section.posts)
  const source = collected.length ? collected : posts.slice(4)
  const lead = source[0] || posts[0]
  const grid = source.slice(1, 9)
  const briefing = posts.slice(0, 5)
  const sideFeature = source[9] || source[1] || posts[1]

  if (!lead) return null

  return (
    <section className="bg-white">
      <div className={`${dc.shell.section} py-14 lg:py-18`}>
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-[-0.06em] text-[var(--slot4-page-text)] sm:text-5xl">Latest 24-7 Press Releases</h2>
          </div>
          <Link href={'/search'} className="hidden items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[var(--slot4-accent-fill)] sm:inline-flex">
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.22fr_.78fr]">
          <div className="grid gap-6">
            <div className="grid gap-6 lg:grid-cols-[1.08fr_.92fr]">
              <div className="rounded-[2.2rem] bg-[var(--slot4-dark-bg)] p-7 text-white shadow-[0_22px_58px_rgba(26,47,77,0.18)] sm:p-9">
                <p className="editorial-kicker text-[#d8f06d]">Lead release</p>
                <h3 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-5xl">{lead.title}</h3>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/78">{getEditableExcerpt(lead, 200)}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={postHref(primaryTask, lead, primaryRoute)} className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-dark-bg)]">
                    Open release <ArrowRight className="h-4 w-4" />
                  </Link>
                  
                </div>
              </div>

              <div className="rounded-[2.2rem] border border-[color:var(--slot4-border)] bg-[linear-gradient(180deg,#fbfdf9_0%,#eef5ea_100%)] p-6 shadow-[0_16px_42px_rgba(26,47,77,0.08)]">
                <p className="editorial-kicker text-[var(--slot4-accent-fill)]">Release spotlight</p>
                {sideFeature ? (
                  <>
                    <h3 className="mt-3 text-3xl font-black leading-[1.02] tracking-[-0.045em] text-[var(--slot4-page-text)]">{sideFeature.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(sideFeature, 150)}</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    
                
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {grid.map((post, index) => (
                <Link
                  key={post.id || post.slug || `${post.title}-${index}`}
                  href={postHref(primaryTask, post, primaryRoute)}
                  className={`rounded-[1.8rem] border border-[color:var(--slot4-border)] bg-white p-5 shadow-[0_14px_32px_rgba(26,47,77,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(26,47,77,0.12)] ${index === 0 ? 'md:col-span-2' : ''}`}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">{index === 0 ? 'Featured queue item' : 'Release update'}</p>
                  <h3 className={`mt-3 font-black leading-[1.04] tracking-[-0.04em] text-[var(--slot4-page-text)] ${index === 0 ? 'text-3xl' : 'text-2xl'}`}>{post.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, index === 0 ? 170 : 120)}</p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="grid gap-6 content-start">
            <div className="rounded-[2rem] border border-[color:var(--slot4-border)] bg-white p-6 shadow-[0_18px_50px_rgba(26,47,77,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="editorial-kicker text-[var(--slot4-accent-fill)]">The briefing</p>
                  <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">Quick reads</h3>
                </div>
                <span className="rounded-full bg-[var(--slot4-page-bg)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--slot4-page-text)]">Top 05</span>
              </div>
              <div className="mt-4">
                {briefing.map((post, index) => (
                  <CompactIndexCard key={post.id || post.slug || `${post.title}-${index}-brief`} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-[linear-gradient(180deg,var(--slot4-dark-bg)_0%,#223f65_100%)] p-6 text-white shadow-[0_20px_56px_rgba(26,47,77,0.16)]">
              <p className="editorial-kicker text-[#d8f06d]">Search the archive</p>
              <h3 className="mt-2 text-3xl font-black tracking-[-0.05em]">Find releases faster</h3>
              <p className="mt-3 text-sm leading-7 text-white/76">Jump directly into updates, company announcements, or category-specific coverage.</p>
              <form action="/search" className="mt-5 space-y-3">
                <label className="flex items-center rounded-2xl bg-white px-4 text-[var(--slot4-page-text)]">
                  <Search className="h-4 w-4 text-[var(--slot4-soft-muted-text)]" />
                  <input name="q" placeholder={`Search ${taskLabel(primaryTask).toLowerCase()}`} className="h-12 flex-1 border-0 bg-transparent px-3 text-sm outline-none" />
                </label>
                <button className="w-full rounded-2xl bg-[var(--slot4-highlight)] px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-[var(--slot4-dark-bg)]">Search</button>
              </form>
            </div>
          </aside>
        </div>

        <div className="mt-10 flex justify-center">
          <Link href={'/search'} className="inline-flex min-w-[320px] items-center justify-center rounded-md bg-[#e8e8e8] px-8 py-4 text-lg font-bold text-[var(--slot4-soft-muted-text)] transition hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)]">
            Load More Stories
          </Link>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-white">
      <div className={`${dc.shell.section} py-14 lg:py-20`}>
        <div className="overflow-hidden rounded-[2.5rem] luxury-band luxury-grid-lines">
          <div className="grid gap-8 px-6 py-12 sm:px-10 lg:grid-cols-[1.05fr_.95fr] lg:px-14 lg:py-16">
            <div>
              <p className="editorial-kicker text-[#d8f06d]">{pagesContent.home.cta.badge}</p>
              <h2 className="mt-4 max-w-xl text-5xl font-black leading-[0.94] tracking-[-0.06em] text-black">{pagesContent.home.cta.title}</h2>
            </div>
            <div className="flex flex-col justify-center">
              <p className="max-w-xl text-lg leading-8 text-black/80">{pagesContent.home.cta.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={pagesContent.home.cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 text-xs font-black uppercase tracking-[0.14em] text-[var(--slot4-dark-bg)]">
                  {pagesContent.home.cta.primaryCta.label}
                </Link>
                <Link href={pagesContent.home.cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-md border border-black/20 px-7 py-3.5 text-xs font-black uppercase tracking-[0.14em] text-black">
                  {pagesContent.home.cta.secondaryCta.label}
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-black/80">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent-fill)]" /> Release-ready presentation</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent-fill)]" /> Searchable archive structure</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent-fill)]" /> Cleaner public visibility</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {postsPreviewCards().map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-[color:var(--slot4-border)] bg-[var(--slot4-surface-bg)] p-6 shadow-[0_16px_40px_rgba(26,47,77,0.08)]">
              <p className="editorial-kicker text-[var(--slot4-accent-fill)]">{item.eyebrow}</p>
              <h3 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">{item.title}</h3>
              <p className="mt-4 text-base leading-8 text-[var(--slot4-muted-text)]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function postsPreviewCards() {
  return [
    {
      eyebrow: 'Distribution flow',
      title: 'Built to feel premium on desktop and polished on mobile.',
      description: 'A cleaner masthead, stronger release cards, and sharper detail pages help every update feel more intentional across screen sizes.',
    },
    {
      eyebrow: 'Editorial variety',
      title: 'Multiple card styles make the archive feel alive.',
      description: 'Featured, horizontal, compact, editorial, and image-first layouts keep the homepage and archive from collapsing into one repeated template.',
    },
  ]
}
