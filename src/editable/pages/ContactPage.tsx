'use client'

import { FileText, Mail, Megaphone } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const desks = [
  { icon: FileText, title: 'Editorial desk', body: 'Send story ideas, corrections, source material, and publication questions.' },
  { icon: Megaphone, title: 'Media partnerships', body: 'Discuss distribution, syndication, newsroom collaborations, and campaigns.' },
  { icon: Mail, title: 'General support', body: 'Reach out for account help, publishing questions, and site-related assistance.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-transparent text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="overflow-hidden rounded-[2.8rem] bg-white shadow-[0_30px_90px_rgba(26,47,77,0.12)]">
            <div className="grid lg:grid-cols-[.95fr_1.05fr]">
            <div className="relative overflow-hidden border-b border-[color:var(--slot4-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f6f8f3_100%)] p-8 text-[var(--slot4-page-text)] sm:p-12 lg:border-r lg:border-b-0 lg:p-16">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(182,206,180,0.22),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(150,167,141,0.16),transparent_24%)]" />
                <div className="relative">
                <p className="editorial-kicker text-black/45">{pagesContent.contact.eyebrow}</p>
                <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.06em] text-black sm:text-7xl">{pagesContent.contact.title}</h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-black/72">{pagesContent.contact.description}</p>

                <div className="mt-10 grid gap-4">
                  {desks.map((desk, index) => (
                    <div key={desk.title} className="rounded-[1.8rem] border border-[color:var(--slot4-border)] bg-white/85 p-5 text-[var(--slot4-page-text)] shadow-[0_16px_40px_rgba(26,47,77,0.06)] backdrop-blur">
                      <div className="flex items-center justify-between gap-4">
                        <desk.icon className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">0{index + 1}</span>
                      </div>
                      <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">{desk.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-black/68">{desk.body}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 rounded-[2rem] border border-[color:var(--slot4-border)] bg-white/85 p-6 shadow-[0_16px_40px_rgba(26,47,77,0.06)] backdrop-blur">
                  <p className="editorial-kicker text-black/45">What to include</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      { title: 'Goal', copy: 'Tell us what you want to publish, update, or fix.' },
                      { title: 'Context', copy: 'Share links, deadlines, categories, or release details.' },
                      { title: 'Next step', copy: 'We will route your message through the right support lane.' },
                    ].map((item) => (
                      <div key={item.title} className="rounded-[1.4rem] border border-[color:var(--slot4-border)] bg-white p-4 text-[var(--slot4-page-text)]">
                        <p className="text-sm font-black">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-black/68">{item.copy}</p>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
              </div>

              <div className="p-7 sm:p-10 lg:p-16">
                <div className="max-w-2xl">
                  <p className="editorial-kicker text-[var(--slot4-accent-fill)]">Send a message</p>
                  <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">{pagesContent.contact.formTitle}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">Share what you want to publish, fix, or launch and we’ll route it through the right support lane.</p>
                  <EditableContactLeadForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
