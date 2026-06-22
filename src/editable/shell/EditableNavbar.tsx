'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, Phone, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const navLinks: Array<{ label: string; href: string }> = [...globalContent.nav.primaryLinks]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--slot4-border)] bg-white/95 backdrop-blur-xl">
      <div className="bg-[var(--slot4-dark-bg)] text-white">
        <div className="mx-auto flex min-h-[58px] max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="hidden items-center gap-3 text-sm font-semibold sm:flex">
            
          </div>
          <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70 sm:hidden">
              {globalContent.nav.tagline}
            </p>
            <div className="ml-auto flex items-center gap-3 text-sm font-semibold">
              {!session ? (
                <>
                  <Link href="/signup" className="hidden transition hover:text-[var(--slot4-highlight)] sm:inline-flex">Sign Up</Link>
                  <Link href="/login" className="hidden transition hover:text-[var(--slot4-highlight)] sm:inline-flex">Login</Link>
                </>
              ) : (
                <>
                  <button type="button" onClick={logout} className="hidden transition hover:text-[var(--slot4-highlight)] sm:inline-flex">Logout</button>
                </>
              )}
              <Link href={session ? '/create' : globalContent.nav.actions.primary.href} className="rounded-none bg-[var(--slot4-accent-fill)] px-4 py-4 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#14639f] sm:px-7">
                {session ? 'Submit Release' : globalContent.nav.actions.primary.label}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[108px] grid-cols-[auto_1fr_auto] items-center gap-4">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--slot4-border)] text-[var(--slot4-page-text)] lg:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex items-center gap-4 justify-self-start">
            <img src={'/favicon.png'} width={'100px'} height={'100px'} alt='logo'/>
            <span className="flex flex-col leading-none">
            
              
              <span className="text-[1.1rem] font-black tracking-[-0.05em] text-[var(--slot4-accent-fill)] sm:text-[1.35rem]">
                {SITE_CONFIG.name}
              </span>
            </span>
          </Link>

          <div className="hidden items-center justify-end gap-8 lg:flex">
            <nav className="flex items-center gap-8">
              {navLinks.map((item) => (
                <Link key={`${item.label}-${item.href}`} href={item.href} className="inline-flex items-center gap-1 text-[1rem] font-semibold text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-accent-fill)]">
                  {item.label}
                  {item.label !== 'Contact' ? <ChevronDown className="h-4 w-4 opacity-55" /> : null}
                </Link>
              ))}
            </nav>
            <form action="/search" className="flex items-center rounded-full border border-[color:var(--slot4-border)] bg-[var(--slot4-page-bg)] px-4">
              <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
              <input
                name="q"
                type="search"
                placeholder="Search releases"
                className="h-11 w-44 border-0 bg-transparent px-3 text-sm font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
              />
            </form>
          </div>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[color:var(--slot4-border)] bg-white lg:hidden">
          <div className="mx-auto max-w-[1320px] px-4 py-5 sm:px-6">
            <form action="/search" className="mb-4 flex items-center rounded-2xl border border-[color:var(--slot4-border)] bg-[var(--slot4-page-bg)] px-4">
              <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
              <input name="q" type="search" placeholder="Search releases" className="h-12 flex-1 border-0 bg-transparent px-3 text-sm outline-none" />
            </form>
            <div className="grid gap-2">
              {navLinks.map((item) => (
                <Link key={`${item.label}-${item.href}-mobile`} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl border border-[color:var(--slot4-border)] bg-white px-4 py-3 text-sm font-bold text-[var(--slot4-page-text)]">
                  {item.label}
                </Link>
              ))}
              {!session ? (
                <>
                  <Link href="/signup" onClick={() => setOpen(false)} className="rounded-2xl border border-[color:var(--slot4-border)] bg-[var(--slot4-panel-bg)] px-4 py-3 text-sm font-bold">Sign Up</Link>
                  <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl border border-[color:var(--slot4-border)] bg-[var(--slot4-panel-bg)] px-4 py-3 text-sm font-bold">Login</Link>
                </>
              ) : (
                <>
                  <Link href="/create" onClick={() => setOpen(false)} className="rounded-2xl border border-[color:var(--slot4-border)] bg-[var(--slot4-panel-bg)] px-4 py-3 text-sm font-bold">Dashboard</Link>
                  <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-2xl border border-[color:var(--slot4-border)] bg-[var(--slot4-panel-bg)] px-4 py-3 text-left text-sm font-bold">Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
