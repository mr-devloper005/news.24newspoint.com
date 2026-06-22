import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((value): value is string => typeof value === 'string' && Boolean(value))
  const directImage = ['featuredImage', 'image', 'thumbnail', 'coverImage', 'logo']
    .map((key) => content[key])
    .find((value): value is string => typeof value === 'string' && Boolean(value))
  return mediaUrl || directImage || contentImage || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof content.body === 'string' && content.body) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Latest'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group block rounded-[2rem] bg-[var(--slot4-dark-bg)] p-6 text-white shadow-[0_30px_80px_rgba(17,36,63,0.22)] sm:p-9">
      <h3 className="max-w-4xl text-4xl font-black leading-[0.97] tracking-[-0.055em] sm:text-6xl">{post.title}</h3>
      <p className="mt-5 max-w-3xl text-sm leading-7 text-white/82 sm:text-base">{getEditableExcerpt(post, 190)}</p>
    </Link>
  )
}

export function RailPostCard({ post, href }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} luxury-card block overflow-hidden rounded-[1.75rem] ${dc.motion.lift}`}>
      <div className="p-5">
        <h3 className="line-clamp-3 text-xl font-black leading-[1.04] tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 110)}</p>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-w-0 grid-cols-[44px_1fr] gap-4 border-t border-[color:var(--slot4-border)] py-5 first:border-t-0">
      <span className="text-3xl font-black leading-none text-[var(--slot4-accent-fill)]">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-[var(--slot4-soft-muted-text)]"><Clock3 className="h-3 w-3" /> {getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-3 text-lg font-black leading-tight tracking-[-.03em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent-fill)]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-w-0 gap-5 rounded-[1.9rem] border border-[color:var(--slot4-border)] bg-white p-4 shadow-[0_16px_42px_rgba(26,47,77,0.08)] sm:grid-cols-[240px_minmax(0,1fr)] sm:gap-7">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.3rem] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 pt-1">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">{String(index + 1).padStart(2, '0')} / {getEditableCategory(post)}</p>
        <h2 className="mt-3 line-clamp-3 text-3xl font-black leading-[1.02] tracking-[-0.05em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent-fill)]">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 190)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-[var(--slot4-page-text)]">Read story <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export function HorizontalFeatureCard({ post, href }: { post: SitePost; href: string; badge?: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[2rem] border border-[color:var(--slot4-border)] bg-white p-6 shadow-[0_20px_54px_rgba(26,47,77,0.10)] sm:p-8">
      <h3 className="text-3xl font-black leading-[1] tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-4xl">{post.title}</h3>
      <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 180)}</p>
    </Link>
  )
}

export function ImageFirstCard({ post, href }: { post: SitePost; href: string; badge?: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[1.9rem] border border-[color:var(--slot4-border)] bg-white p-5 shadow-[0_18px_44px_rgba(26,47,77,0.08)]">
      <h3 className="line-clamp-3 text-2xl font-black leading-[1.05] tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 130)}</p>
    </Link>
  )
}

export function EditorialListCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block border-b border-[color:var(--slot4-border)] py-5 last:border-b-0">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent-fill)]">{getEditableCategory(post)}</p>
      <h3 className="mt-2 text-xl font-black leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent-fill)]">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 100)}</p>
    </Link>
  )
}
