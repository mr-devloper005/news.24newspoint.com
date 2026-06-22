import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Newspaper, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
const fieldOf = (post: SitePost, keys: string[]) => keys.map((key) => asText(getContent(post)[key])).find(Boolean) || ''

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; badge: string }> = {
  mediaDistribution: { icon: Newspaper, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-4', badge: 'News' },
  article: { icon: FileText, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-4', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = { '--archive-bg': preset.colors.background, '--archive-text': preset.colors.foreground, '--archive-surface': preset.colors.surface, '--archive-accent': preset.colors.accent } as CSSProperties
  const dynamicCategories = Array.from(new Map([
    ...CATEGORY_OPTIONS,
    ...posts.map((post) => {
      const raw = getEditableCategory(post)
      return raw ? { name: raw, slug: normalizeCategory(raw) } : null
    }).filter((item): item is { name: string; slug: string } => Boolean(item)),
  ].map((item) => [item.slug, item])).values())
  const categoryLabel = category === 'all' ? 'All categories' : dynamicCategories.find((item) => item.slug === category)?.name || category

  if (task === 'mediaDistribution' || task === 'article') {
    return (
      <EditorialArchive
        posts={posts}
        pagination={pagination}
        category={category}
        categoryLabel={categoryLabel}
        categories={dynamicCategories}
        basePath={basePath}
        label={label}
      />
    )
  }

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2.3rem] border border-[color:var(--slot4-border)] bg-white p-7 shadow-[0_24px_70px_rgba(26,47,77,0.10)] sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-panel-bg)] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--slot4-page-text)]"><Icon className="h-4 w-4" /> {label}</div>
              <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.07em] sm:text-6xl">{voice?.headline || `Browse ${label}`}</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">{voice?.description || SITE_CONFIG.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={basePath} className="rounded-md bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">Browse all</Link>
                <Link href="/search" className="rounded-md border border-[color:var(--slot4-border)] px-5 py-3 text-sm font-black">Search posts</Link>
              </div>
            </div>

            <form action={basePath} className="self-end rounded-[2rem] border border-[color:var(--slot4-border)] bg-white p-5 shadow-[0_18px_50px_rgba(26,47,77,0.08)]">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]"><Filter className="h-4 w-4" /> Filter</div>
              <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-2xl border border-[color:var(--slot4-border)] bg-[var(--slot4-page-bg)] px-4 text-sm font-bold outline-none">
                <option value="all">All categories</option>
                {dynamicCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="mt-3 h-12 w-full rounded-2xl bg-[var(--slot4-accent-fill)] text-sm font-black text-white">Apply</button>
              <p className="mt-3 text-xs font-bold text-[var(--slot4-soft-muted-text)]">Showing: {categoryLabel}</p>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-4 pb-16 sm:px-6 lg:px-8">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug || `${post.title}-${index}`} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[color:var(--slot4-border)] bg-white p-10 text-center">
              <Search className="mx-auto h-8 w-8 text-[var(--slot4-soft-muted-text)]" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No posts found</h2>
              <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <PaginationBar pagination={pagination} category={category} basePath={basePath} page={page} />
        </section>
      </main>
    </EditableSiteShell>
  )
}

function EditorialArchive({
  posts,
  pagination,
  category,
  categoryLabel,
  categories,
  basePath,
  label,
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  categoryLabel: string
  categories: { name: string; slug: string }[]
  basePath: string
  label: string
}) {
  const page = pagination.page || 1
  const lead = posts[0]
  const side = posts.slice(1, 4)
  const masonry = posts.slice(4)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-transparent text-[var(--slot4-page-text)]">
        <section className="bg-white">
          <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
              <div>
                <p className="editorial-kicker text-[var(--slot4-accent-fill)]">Latest releases</p>
                <h1 className="mt-3 text-5xl font-black tracking-[-0.07em] text-[var(--slot4-page-text)] sm:text-7xl">
                  {category === 'all' ? label : categoryLabel}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">
                  Premium release cards, quick scanning, and a clean archive structure for modern media distribution.
                </p>
              </div>

              <form action={basePath} className="rounded-[2rem] border border-[color:var(--slot4-border)] bg-[var(--slot4-surface-bg)] p-5 shadow-[0_16px_42px_rgba(26,47,77,0.08)]">
                <div className="flex flex-wrap gap-3">
                  <select name="category" defaultValue={category} className="h-12 min-w-44 flex-1 rounded-2xl border border-[color:var(--slot4-border)] bg-white px-4 text-sm font-bold outline-none">
                    <option value="all">All categories</option>
                    {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <button className="h-12 rounded-2xl bg-[var(--slot4-dark-bg)] px-6 text-sm font-black text-white">Filter</button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {lead ? (
          <section className="mx-auto grid max-w-[1320px] gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[1.35fr_.65fr] lg:px-8">
            <Link href={`${basePath}/${lead.slug}`} className="group relative min-h-[34rem] overflow-hidden rounded-[2.4rem] bg-[var(--slot4-dark-bg)] text-white shadow-[0_28px_80px_rgba(26,47,77,0.18)]">
              <img src={getEditablePostImage(lead)} alt={lead.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,36,63,0.95)] via-[rgba(17,36,63,0.2)] to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
                <span className="inline-flex rounded-full bg-[#d8f06d] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-dark-bg)]">{getEditableCategory(lead)}</span>
                <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl">{lead.title}</h2>
                <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-white/80">{summaryOf(lead)}</p>
              </div>
            </Link>

            <div className="grid gap-4">
              <div className="rounded-[2rem] bg-[var(--slot4-dark-bg)] p-6 text-white shadow-[0_18px_42px_rgba(26,47,77,0.14)]">
                <p className="editorial-kicker text-[#d8f06d]">Top stories</p>
                <p className="mt-3 text-3xl font-black leading-tight tracking-[-0.05em]">What distributors are watching now.</p>
              </div>
              {side.map((post, index) => (
                <Link key={post.id || post.slug || `${post.title}-${index}`} href={`${basePath}/${post.slug}`} className="group grid grid-cols-[7rem_1fr] overflow-hidden rounded-[1.8rem] border border-[color:var(--slot4-border)] bg-white shadow-[0_12px_32px_rgba(26,47,77,0.08)]">
                  <img src={getEditablePostImage(post)} alt={post.title} className="h-full min-h-40 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent-fill)]">0{index + 1}</p>
                    <h3 className="mt-3 text-xl font-black leading-tight tracking-[-0.03em]">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 74)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8">
          {masonry.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {masonry.map((post, index) => (
                <EditorialArchiveCard key={post.id || post.slug || `${post.title}-${index}`} post={post} href={`${basePath}/${post.slug}`} index={index + 4} />
              ))}
            </div>
          ) : !lead ? (
            <div className="rounded-[2rem] border border-dashed border-[color:var(--slot4-border)] bg-white p-12 text-center">
              <Search className="mx-auto h-8 w-8 text-[var(--slot4-soft-muted-text)]" />
              <h2 className="mt-4 text-3xl font-black">No stories found</h2>
              <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Try another category or publish a new newsroom story.</p>
            </div>
          ) : null}

          <div className="mt-10 flex justify-center">
            {pagination.hasNextPage ? (
              <Link href={pageHref(basePath, category, page + 1)} className="inline-flex min-w-[320px] items-center justify-center rounded-md bg-[#e8e8e8] px-8 py-4 text-lg font-bold text-[var(--slot4-soft-muted-text)] transition hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)]">
                Load More Stories
              </Link>
            ) : (
              <span className="inline-flex min-w-[320px] items-center justify-center rounded-md bg-[#e8e8e8] px-8 py-4 text-lg font-bold text-[var(--slot4-soft-muted-text)]">
                You&apos;re all caught up
              </span>
            )}
          </div>

          <PaginationBar pagination={pagination} category={category} basePath={basePath} page={page} />
        </section>
      </main>
    </EditableSiteShell>
  )
}

function PaginationBar({ pagination, category, basePath, page }: { pagination: SiteFeedPagination; category: string; basePath: string; page: number }) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
      {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[color:var(--slot4-border)] bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
      <span className="rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">Page {page} of {pagination.totalPages || 1}</span>
      {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[color:var(--slot4-border)] bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
    </div>
  )
}

function EditorialArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  const style = index % 5

  if (style === 0) {
    return (
      <Link href={href} className="group overflow-hidden rounded-[1.9rem] border border-[color:var(--slot4-border)] bg-white shadow-[0_16px_42px_rgba(26,47,77,0.08)]">
        <div className="relative aspect-[16/11] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">{getEditableCategory(post)}</p>
          <h3 className="mt-3 text-2xl font-black leading-[1.05] tracking-[-0.04em]">{post.title}</h3>
          <p className="mt-3 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 150)}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[var(--slot4-accent-fill)]">Read Press Release <ArrowRight className="h-4 w-4" /></span>
        </div>
      </Link>
    )
  }

  if (style === 1) {
    return (
      <Link href={href} className="group overflow-hidden rounded-[1.9rem] border border-[color:var(--slot4-border)] bg-white shadow-[0_16px_42px_rgba(26,47,77,0.08)]">
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-md bg-[var(--slot4-page-bg)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">Press Release</span>
            <span className="text-sm text-[var(--slot4-soft-muted-text)]">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
          </div>
          <h3 className="mt-5 text-2xl font-black leading-[1.1] tracking-[-0.04em]">{post.title}</h3>
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 145)}</p>
        </div>
        <div className="border-t border-[color:var(--slot4-border)] bg-[var(--slot4-accent-fill)] px-5 py-4 text-center text-base font-black text-white">Read Press Release</div>
      </Link>
    )
  }

  if (style === 2) {
    return (
      <Link href={href} className="group overflow-hidden rounded-[1.9rem] border border-[color:var(--slot4-border)] bg-white shadow-[0_16px_42px_rgba(26,47,77,0.08)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">Press Release</p>
          <h3 className="mt-4 text-2xl font-black leading-[1.08] tracking-[-0.04em]">{post.title}</h3>
          <p className="mt-3 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 126)}</p>
          <div className="mt-5 border-t border-[color:var(--slot4-border)] pt-4 text-center text-base font-black text-[var(--slot4-accent-fill)]">Read Press Release</div>
        </div>
      </Link>
    )
  }

  if (style === 3) {
    return (
      <Link href={href} className="group overflow-hidden rounded-[1.9rem] border border-[color:var(--slot4-border)] bg-white shadow-[0_16px_42px_rgba(26,47,77,0.08)]">
        <div className="p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">{getEditableCategory(post)}</p>
          <h3 className="mt-3 text-[2.05rem] font-black leading-[1.1] tracking-[-0.045em]">{post.title}</h3>
        </div>
        <div className="border-t border-[color:var(--slot4-border)] bg-[var(--slot4-accent-fill)] px-5 py-4 text-center text-base font-black text-white">Read Press Release</div>
      </Link>
    )
  }

  return (
    <Link href={href} className="group overflow-hidden rounded-[1.9rem] border border-[color:var(--slot4-border)] bg-white shadow-[0_16px_42px_rgba(26,47,77,0.08)]">
      <div className="relative aspect-[16/11] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">Press Release</p>
        <h3 className="mt-3 text-2xl font-black leading-[1.05] tracking-[-0.04em]">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 118)}</p>
      </div>
    </Link>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}`
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <GenericArchiveCard post={post} href={href} index={index} />
}

function GenericArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[color:var(--slot4-border)] bg-white shadow-[0_16px_42px_rgba(26,47,77,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(26,47,77,0.14)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">Story {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-2 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--slot4-muted-text)]">{summaryOf(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const location = fieldOf(post, ['location', 'address', 'city'])
  const phone = fieldOf(post, ['phone', 'telephone', 'mobile'])
  const website = fieldOf(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-[color:var(--slot4-border)] bg-white p-5 shadow-[0_16px_42px_rgba(26,47,77,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(26,47,77,0.14)] sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--slot4-page-bg)] ring-1 ring-[color:var(--slot4-border)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--slot4-dark-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--slot4-border)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{summaryOf(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold text-[var(--slot4-soft-muted-text)] sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = fieldOf(post, ['price', 'amount', 'budget'])
  const location = fieldOf(post, ['location', 'address', 'city'])
  const condition = fieldOf(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[color:var(--slot4-border)] bg-white shadow-[0_16px_42px_rgba(26,47,77,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(26,47,77,0.14)]">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[var(--slot4-dark-bg)] p-5 text-white">
          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black leading-[1] tracking-[-0.07em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold text-white/75">{location || condition || 'Details inside'}</p>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-6 text-[var(--slot4-muted-text)]">{summaryOf(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[2rem] border border-[color:var(--slot4-border)] bg-white shadow-[0_16px_42px_rgba(26,47,77,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(26,47,77,0.14)]">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = fieldOf(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.7rem] border border-[color:var(--slot4-border)] bg-white p-6 shadow-[0_16px_42px_rgba(26,47,77,0.08)] transition hover:-translate-y-1 hover:bg-[var(--slot4-dark-bg)] hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-70">{summaryOf(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group rounded-[2rem] border border-[color:var(--slot4-border)] bg-white p-6 shadow-[0_16px_42px_rgba(26,47,77,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(26,47,77,0.14)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[var(--slot4-dark-bg)] p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[var(--slot4-page-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{getEditableCategory(post)}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 text-[var(--slot4-muted-text)]">{summaryOf(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const role = fieldOf(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[2rem] border border-[color:var(--slot4-border)] bg-white p-6 text-center shadow-[0_16px_42px_rgba(26,47,77,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(26,47,77,0.14)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-page-bg)] ring-1 ring-[color:var(--slot4-border)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover" />
      </div>
      <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--slot4-muted-text)]">{summaryOf(post)}</p>
    </Link>
  )
}
