import type { Metadata } from 'next'
import Link from 'next/link'
import { Globe2, Layers3, Megaphone } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-transparent text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="overflow-hidden rounded-[2.6rem] bg-white shadow-[0_28px_80px_rgba(26,47,77,0.12)]">
            <div className="grid lg:grid-cols-[.95fr_1.05fr]">
              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-16">
                <div className="max-w-md">
                  <p className="editorial-kicker text-[var(--slot4-accent-fill)]">Create account</p>
                  <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">{pagesContent.auth.signup.formTitle}</h1>
                  <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">Set up your publishing access and start preparing releases in a cleaner workspace.</p>
                  <EditableLocalSignupForm />
                  <p className="mt-6 border-t border-[color:var(--slot4-border)] pt-6 text-sm text-[var(--slot4-muted-text)]">
                    Already have an account? <Link href="/login" className="font-black text-[var(--slot4-accent-fill)] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link>
                  </p>
                </div>
              </div>

              <div className="rounded-l-[2rem] bg-[linear-gradient(180deg,#eef5ea_0%,#d9e9cf_100%)] p-8 sm:p-12 lg:p-16">
                <p className="editorial-kicker text-[var(--slot4-accent-fill)]">{pagesContent.auth.signup.badge}</p>
                <h2 className="mt-5 max-w-xl text-5xl font-black leading-[0.92] tracking-[-0.06em] text-[var(--slot4-page-text)] sm:text-7xl">{pagesContent.auth.signup.title}</h2>
                <p className="mt-6 max-w-lg text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.auth.signup.description}</p>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.6rem] bg-white/75 p-5 shadow-[0_16px_36px_rgba(26,47,77,0.08)]">
                    <Megaphone className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
                    <p className="mt-4 text-lg font-black text-[var(--slot4-page-text)]">Launch updates</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">Create polished submissions for public-facing announcements and campaigns.</p>
                  </div>
                  <div className="rounded-[1.6rem] bg-white/75 p-5 shadow-[0_16px_36px_rgba(26,47,77,0.08)]">
                    <Layers3 className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
                    <p className="mt-4 text-lg font-black text-[var(--slot4-page-text)]">Organized flow</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">Keep your publishing history, drafts, and release-ready content aligned.</p>
                  </div>
                  <div className="rounded-[1.6rem] bg-white/75 p-5 shadow-[0_16px_36px_rgba(26,47,77,0.08)]">
                    <Globe2 className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
                    <p className="mt-4 text-lg font-black text-[var(--slot4-page-text)]">Public reach</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">Prepare content for a more consistent distribution and archive experience.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
