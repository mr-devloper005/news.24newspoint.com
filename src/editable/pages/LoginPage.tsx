import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, LockKeyhole, Radar, ShieldCheck } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-transparent text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="overflow-hidden rounded-[2.8rem] bg-white shadow-[0_30px_90px_rgba(26,47,77,0.12)]">
            <div className="grid lg:grid-cols-[1.02fr_.98fr]">
              <div className="bg-[linear-gradient(160deg,#1a2f4d_0%,#203a5f_42%,#d9e9cf_42%,#eef5ea_100%)] p-8 sm:p-12 lg:p-16">
                <p className="editorial-kicker text-[#d8f06d]">{pagesContent.auth.login.badge}</p>
                <h1 className="mt-5 max-w-xl text-5xl font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-7xl">
                  Return to your release workspace.
                </h1>
                <p className="mt-6 max-w-lg text-base leading-8 text-white/76">
                  Access your publishing flow, review archived submissions, and continue preparing public-facing updates from one cleaner dashboard.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.6rem] bg-white/30 p-5 text-black backdrop-blur">
                    <ShieldCheck className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
                    <p className="mt-4 text-lg font-black text-black">Protected access</p>
                    <p className="mt-2 text-sm leading-6 text-black/70">Secure entry for your publishing account and saved session details.</p>
                  </div>
                  <div className="rounded-[1.6rem] bg-white/30 p-5 text-black backdrop-blur">
                    <Radar className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
                    <p className="mt-4 text-lg font-black text-black">Active archive</p>
                    <p className="mt-2 text-sm leading-6 text-black/70">Jump back into current releases, updates, and publication activity.</p>
                  </div>
                  <div className="rounded-[1.6rem] bg-white/30 p-5 text-black backdrop-blur">
                    <CheckCircle2 className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
                    <p className="mt-4 text-lg font-black text-black">Fast continuation</p>
                    <p className="mt-2 text-sm leading-6 text-black/70">Pick up where you left off without friction or extra navigation.</p>
                  </div>
                </div>

                <div className="mt-10 rounded-[2rem] border border-white/12 bg-white/70 p-6 text-[var(--slot4-page-text)] shadow-[0_18px_40px_rgba(26,47,77,0.08)]">
                  <p className="editorial-kicker text-[var(--slot4-accent-fill)]">Account overview</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">Access</p>
                      <p className="mt-2 text-2xl font-black tracking-[-0.04em]">Member</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">Workspace</p>
                      <p className="mt-2 text-2xl font-black tracking-[-0.04em]">Premium</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">Status</p>
                      <p className="mt-2 text-2xl font-black tracking-[-0.04em]">Ready</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center bg-white p-7 sm:p-10 lg:p-16">
                <div className="w-full max-w-md rounded-[2.2rem] border border-[color:var(--slot4-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f7faf6_100%)] p-7 shadow-[0_18px_48px_rgba(26,47,77,0.08)] sm:p-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-bg)] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">
                    <LockKeyhole className="h-4 w-4" /> Member login
                  </div>
                  <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">{pagesContent.auth.login.formTitle}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">Use the email and password linked to your publishing access.</p>
                  <EditableLocalLoginForm />
                  <p className="mt-6 border-t border-[color:var(--slot4-border)] pt-6 text-sm text-[var(--slot4-muted-text)]">
                    New here? <Link href="/signup" className="font-black text-[var(--slot4-accent-fill)] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
