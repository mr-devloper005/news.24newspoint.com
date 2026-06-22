import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' || task === 'mediaDistribution' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => asText(getContent(post).body) || asText(getContent(post).description) || asText(getContent(post).details) || post.summary || 'Details will appear here once available.'

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'
const linkifyMarkdown = (value: string) => value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)
const linkifyText = (value: string) => linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const detailVars = { '--detail-bg': preset.colors.background, '--detail-text': preset.colors.foreground, '--detail-surface': preset.colors.surface, '--detail-accent': preset.colors.accent } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-transparent text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' || task === 'mediaDistribution' ? <ArticleDetail task={task} post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({ task, post, related, comments }: { task: TaskKey; post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  const published = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''
  const heroImage = images[0] || getEditablePostImage(post)

  return (
    <section className="pb-10">
      <div className="mx-auto max-w-[1320px] px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="overflow-hidden rounded-[2.6rem] bg-white shadow-[0_28px_80px_rgba(26,47,77,0.14)]">
          <div className="grid gap-0 lg:grid-cols-[1.02fr_.98fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <BackLink task={task} />
              <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.16em]">
                <span className="rounded-full bg-[var(--slot4-panel-bg)] px-4 py-2 text-[var(--slot4-page-text)]">{getEditableCategory(post)}</span>
                {published ? <time className="text-[var(--slot4-soft-muted-text)]">{published}</time> : null}
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.06em] text-[var(--slot4-page-text)] sm:text-6xl lg:text-[5.2rem]">{post.title}</h1>
              {summaryText(post) ? <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-[var(--slot4-muted-text)] sm:text-2xl">{summaryText(post)}</p> : null}
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white"><CheckCircle2 className="h-4 w-4" /> Verified presentation</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--slot4-border)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-page-text)]"><Tag className="h-4 w-4" /> {SITE_CONFIG.name}</span>
              </div>
            </div>

            <div className="relative min-h-[360px] bg-[var(--slot4-media-bg)] lg:min-h-full">
              <img src={heroImage} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,36,63,0.04),rgba(17,36,63,0.30))]" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <article className="rounded-[2.3rem] bg-white p-7 shadow-[0_20px_60px_rgba(26,47,77,0.10)] sm:p-10">
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Release gallery" />
          <EditableComments slug={post.slug} comments={comments} />
        </article>
        <aside className="space-y-6">
          <AboutPanel task={task} post={post} />
          <RelatedPanel task={task} related={related} />
        </aside>
      </div>
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)

  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-[2.4rem] bg-white p-7 shadow-[0_20px_60px_rgba(26,47,77,0.10)] sm:p-10">
          <HeroHeader post={post} badge="Business listing" />
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images} label="Business gallery" large />
        </article>
        <aside className="space-y-6">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="listing" related={related} />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])

  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="rounded-[2.4rem] bg-[var(--slot4-dark-bg)] p-7 text-white shadow-[0_26px_70px_rgba(26,47,77,0.18)] lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <p className="mt-10 text-xs font-black uppercase tracking-[0.28em] text-white/60">Classified notice</p>
          <h1 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-5xl">{post.title}</h1>
          <div className="mt-8 grid gap-3">
            {price ? <BadgeLine label="Price" value={price} /> : null}
            {condition ? <BadgeLine label="Condition" value={condition} /> : null}
            {location ? <BadgeLine label="Location" value={location} /> : null}
          </div>
          <ContactAction website={website} phone={phone} email={email} dark />
        </aside>
        <article className="rounded-[2.4rem] bg-white p-7 shadow-[0_20px_60px_rgba(26,47,77,0.10)] sm:p-10">
          <ImageStrip images={images.length ? images : [getEditablePostImage(post)]} label="Offer images" large />
          <BodyContent post={post} />
          <RelatedPanel task="classified" related={related} />
        </article>
      </div>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : [getEditablePostImage(post)]

  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <BackLink task="image" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="rounded-[2.4rem] bg-white p-7 shadow-[0_20px_60px_rgba(26,47,77,0.10)] lg:sticky lg:top-24 lg:self-start">
          <HeroHeader post={post} badge="Image story" compact />
          <BodyContent post={post} compact />
        </aside>
        <div className="columns-1 gap-5 space-y-5 md:columns-2">
          {gallery.map((image, index) => (
            <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[2rem] bg-white shadow-[0_16px_42px_rgba(26,47,77,0.08)]">
              <img src={image} alt={post.title} className="w-full object-cover" />
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-10"><RelatedPanel task="image" related={related} /></div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-[2.4rem] bg-white p-7 shadow-[0_20px_60px_rgba(26,47,77,0.10)] sm:p-10">
          <BackLink task="sbm" />
          <div className="mt-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[var(--slot4-dark-bg)] text-white"><Bookmark className="h-9 w-9" /></div>
          <h1 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-6xl">{post.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
          {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-md bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
          <BodyContent post={post} />
        </article>
        <RelatedPanel task="sbm" related={related} />
      </div>
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-[2.4rem] bg-white p-7 shadow-[0_20px_60px_rgba(26,47,77,0.10)] sm:p-10">
          <BackLink task="pdf" />
          <div className="mt-8 grid gap-6 sm:grid-cols-[120px_1fr]">
            <div className="flex h-28 w-28 items-center justify-center rounded-[1.8rem] bg-[var(--slot4-dark-bg)] text-white"><FileText className="h-12 w-12" /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">PDF resource</p>
              <h1 className="mt-3 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-6xl">{post.title}</h1>
            </div>
          </div>
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-[color:var(--slot4-border)] bg-[var(--slot4-page-bg)]">
              <div className="flex items-center justify-between gap-3 border-b border-[color:var(--slot4-border)] bg-white p-4">
                <span className="text-sm font-black">Document preview</span>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[var(--slot4-dark-bg)] px-4 py-2 text-xs font-black text-white">Download <Download className="h-4 w-4" /></Link>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
            </div>
          ) : null}
        </article>
        <RelatedPanel task="pdf" related={related} />
      </div>
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="rounded-[2.4rem] bg-white p-8 text-center shadow-[0_20px_60px_rgba(26,47,77,0.10)] lg:sticky lg:top-24 lg:self-start">
          <BackLink task="profile" />
          <div className="mx-auto mt-10 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-page-bg)]">
            <img src={images[0] || getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover" />
          </div>
          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.07em]">{post.title}</h1>
          <ContactAction website={website} email={email} />
        </aside>
        <article className="rounded-[2.4rem] bg-white p-7 shadow-[0_20px_60px_rgba(26,47,77,0.10)] sm:p-10">
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Profile gallery" />
          <RelatedPanel task="profile" related={related} />
        </article>
      </div>
    </section>
  )
}

function HeroHeader({ post, badge, compact = false }: { post: SitePost; badge: string; compact?: boolean }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">{badge}</p>
      <h1 className={`mt-3 font-black leading-[0.98] tracking-[-0.07em] text-[var(--slot4-page-text)] ${compact ? 'text-4xl sm:text-5xl' : 'text-4xl sm:text-6xl'}`}>{post.title}</h1>
      {summaryText(post) ? <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{summaryText(post)}</p> : null}
    </div>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'}`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-[color:var(--slot4-border)] bg-[var(--slot4-page-bg)] p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-[var(--slot4-page-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] object-cover" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_16px_42px_rgba(26,47,77,0.08)]">
      <div className="flex items-center gap-2 p-4 text-sm font-black"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email, dark = false }: { website?: string; phone?: string; email?: string; dark?: boolean }) {
  if (!website && !phone && !email) return null
  return (
    <div className={`mt-6 rounded-[2rem] border p-5 ${dark ? 'border-white/12 bg-white/8 text-white' : 'border-[color:var(--slot4-border)] bg-white text-[var(--slot4-page-text)] shadow-[0_16px_42px_rgba(26,47,77,0.08)]'}`}>
      <p className={`text-xs font-black uppercase tracking-[0.22em] ${dark ? 'text-white/60' : 'text-[var(--slot4-soft-muted-text)]'}`}>Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-black ${dark ? 'bg-white text-[var(--slot4-dark-bg)]' : 'bg-[var(--slot4-dark-bg)] text-white'}`}>Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-black ${dark ? 'border-white/20 text-white' : 'border-[color:var(--slot4-border)] text-[var(--slot4-page-text)]'}`}><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-black ${dark ? 'border-white/20 text-white' : 'border-[color:var(--slot4-border)] text-[var(--slot4-page-text)]'}`}><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.16em] text-white/60">{label}</span><span className="font-black">{value}</span></div>
}

function AboutPanel({ task, post }: { task: TaskKey; post: SitePost }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-[0_16px_42px_rgba(26,47,77,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">About this post</p>
      <div className="mt-4 grid gap-3 text-sm font-bold text-[var(--slot4-muted-text)]">
        <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[var(--slot4-accent-fill)]" /> Task: {taskConfig?.label || task}</p>
        <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent-fill)]" /> Site: {SITE_CONFIG.name}</p>
        {post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
      </div>
    </div>
  )
}

function RelatedPanel({ task, related }: { task: TaskKey; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="rounded-[2rem] bg-white p-6 shadow-[0_16px_42px_rgba(26,47,77,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black tracking-[-0.04em]">More like this</h2>
        <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]">View all</Link>
      </div>
      <div className="mt-5 grid gap-3">
        {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
      </div>
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0] || getEditablePostImage(post)
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 border-t border-[color:var(--slot4-border)] py-3 first:border-t-0 transition hover:text-[var(--slot4-accent-fill)]">
      {image && task !== 'sbm' ? <img src={image} alt={post.title} className="h-20 w-20 shrink-0 rounded-xl object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[var(--slot4-dark-bg)] text-white"><FileText className="h-6 w-6" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black leading-tight tracking-[-0.03em]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 72)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-12 rounded-[2rem] bg-[var(--slot4-page-bg)] p-5">
      <div className="flex items-center gap-2 text-lg font-black"><MessageCircle className="h-5 w-5 text-[var(--slot4-accent-fill)]" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[1.25rem] border border-white bg-white p-4">
            <p className="text-sm font-black">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[var(--slot4-muted-text)]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
