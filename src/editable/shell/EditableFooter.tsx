'use client'

import Link from 'next/link'
import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const columns = globalContent.footer.columns

  return (
    <footer className="mt-16 overflow-hidden border-t border-white/10 bg-[var(--slot4-dark-bg)] text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%,rgba(255,255,255,0.03))]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.05))]" />
        <div className="absolute inset-x-0 bottom-0 h-56 opacity-30 [background-image:linear-gradient(90deg,transparent_0,transparent_4%,rgba(255,255,255,.06)_4%,rgba(255,255,255,.06)_6%,transparent_6%,transparent_12%,rgba(255,255,255,.04)_12%,rgba(255,255,255,.04)_15%,transparent_15%,transparent_100%)]" />

        <div className="relative mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_.85fr_.85fr_.85fr_.85fr]">
            <div>
              <Link href="/" className="flex items-center gap-4">
              <img src={'/favicon.png'} width={'100px'} height={'100px'} alt='logo' />
                <span className="flex flex-col leading-none">
                  <span className="text-[1.15rem] font-black tracking-[-0.05em]">{SITE_CONFIG.name}</span>
                </span>
              </Link>
              <p className="mt-6 max-w-sm text-sm leading-7 text-white/72">
                {globalContent.footer.description}
              </p>
             
            </div>

            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-2xl font-black tracking-[-0.04em]">{column.title}</h3>
                <div className="mt-6 grid gap-4">
                  {column.links.map((link) => (
                    <Link key={`${column.title}-${link.label}`} href={link.href} className="text-sm text-white/75 transition hover:text-white">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

           
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[rgba(0,0,0,0.15)]">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-4 py-5 text-xs text-white/65 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>{year} {SITE_CONFIG.name}. All rights reserved.</p>
          
        </div>
      </div>
    </footer>
  )
}
