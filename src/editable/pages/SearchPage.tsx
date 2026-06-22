import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search, SlidersHorizontal } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'

  return (
    <Link href={href} className={`group rounded-[1.8rem] border border-[color:var(--slot4-border)] bg-white p-5 shadow-[0_14px_34px_rgba(26,47,77,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(26,47,77,0.12)] ${index === 0 ? 'md:col-span-2' : ''}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-[var(--slot4-panel-bg)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">{taskLabel}</span>
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h2 className={`mt-4 font-black leading-[1.02] tracking-[-0.04em] text-[var(--slot4-page-text)] ${index === 0 ? 'text-3xl' : 'text-2xl'}`}>{post.title}</h2>
      {summary ? <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{summary}</p> : null}
      <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">Open result <ArrowRight className="h-4 w-4" /></span>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="bg-transparent text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="overflow-hidden rounded-[2.6rem] bg-white shadow-[0_28px_80px_rgba(26,47,77,0.12)]">
            <div className="border-b border-[color:var(--slot4-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f6f8f3_100%)] px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
              <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
                <div className="relative overflow-hidden rounded-[2.2rem] border border-[color:var(--slot4-border)] bg-white/88 p-8 shadow-[0_16px_40px_rgba(26,47,77,0.06)] sm:p-10 lg:p-12">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(182,206,180,0.18),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(150,167,141,0.12),transparent_24%)]" />
                  <div className="relative">
                    <p className="editorial-kicker text-black/45">{pagesContent.search.hero.badge}</p>
                    <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[0.94] tracking-[-0.06em] text-black sm:text-6xl">
                      {pagesContent.search.hero.title}
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-8 text-black/72">{pagesContent.search.hero.description}</p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-[1.4rem] border border-[color:var(--slot4-border)] bg-[var(--slot4-page-bg)] p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">Deep archive</p>
                        <p className="mt-2 text-2xl font-black text-black">All posts</p>
                      </div>
                      <div className="rounded-[1.4rem] border border-[color:var(--slot4-border)] bg-[var(--slot4-page-bg)] p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">Fast filters</p>
                        <p className="mt-2 text-2xl font-black text-black">Smart scan</p>
                      </div>
                      <div className="rounded-[1.4rem] border border-[color:var(--slot4-border)] bg-[var(--slot4-page-bg)] p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">Content reach</p>
                        <p className="mt-2 text-2xl font-black text-black">Cross-section</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5">
                  <div className="rounded-[2.2rem] border border-[color:var(--slot4-border)] bg-white p-5 shadow-[0_16px_40px_rgba(26,47,77,0.06)] sm:p-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-bg)] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">
                      <SlidersHorizontal className="h-4 w-4" /> Search controls
                    </div>
                    <form action="/search" className="mt-5 grid gap-4">
                      <input type="hidden" name="master" value="1" />
                      <label className="flex items-center gap-3 rounded-2xl border border-[color:var(--slot4-border)] bg-[var(--slot4-page-bg)] px-4">
                        <Search className="h-5 w-5 text-[var(--slot4-soft-muted-text)]" />
                        <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="h-14 min-w-0 flex-1 bg-transparent text-base font-semibold text-black outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="flex items-center gap-2 rounded-2xl border border-[color:var(--slot4-border)] bg-[var(--slot4-page-bg)] px-4">
                          <Filter className="h-4 w-4 text-[var(--slot4-soft-muted-text)]" />
                          <input name="category" defaultValue={category} placeholder="Category" className="h-14 min-w-0 flex-1 bg-transparent text-sm font-semibold text-black outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                        </label>
                        <select name="task" defaultValue={task} className="h-14 rounded-2xl border border-[color:var(--slot4-border)] bg-[var(--slot4-page-bg)] px-4 text-sm font-black text-black outline-none">
                          <option value="">All content types</option>
                          {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                        </select>
                      </div>
                      <button className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[var(--slot4-dark-bg)] px-6 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-[var(--slot4-accent-fill)]" type="submit">Search archive</button>
                    </form>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    {[
                      { title: 'Refine quickly', body: 'Filter by topic, task, or keyword without leaving the page.' },
                      { title: 'Read in context', body: 'Open a result and continue with the connected article flow.' },
                      { title: 'Browse the archive', body: 'Use the latest results panel to discover recent posts faster.' },
                    ].map((item) => (
                      <div key={item.title} className="rounded-[1.6rem] border border-[color:var(--slot4-border)] bg-white/88 p-5 shadow-[0_14px_34px_rgba(26,47,77,0.05)]">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-black/45">{item.title}</p>
                        <p className="mt-3 text-sm leading-7 text-black/68">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[color:var(--slot4-border)] px-6 py-8 sm:px-10">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--slot4-soft-muted-text)]">{results.length} results</p>
                <h2 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
              </div>
              <Link href="/article" className="inline-flex items-center gap-2 rounded-md border border-[color:var(--slot4-border)] bg-white px-5 py-3 text-xs font-black uppercase text-[var(--slot4-page-text)]">Browse latest <ArrowRight className="h-4 w-4" /></Link>
            </div>

            {results.length ? (
              <div className="grid gap-5 px-6 py-8 sm:px-10 lg:grid-cols-3">
                {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
              </div>
            ) : (
              <div className="m-8 rounded-[2rem] border border-dashed border-[color:var(--slot4-border)] bg-[var(--slot4-page-bg)] p-10 text-center">
                <p className="text-3xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">No matching posts found.</p>
                <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">Try a different keyword, task type, or category.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
