'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function EditableContactLeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Unable to send your message.')
      setStatus('success')
      setMessage(data?.message || 'Thanks. Your message has been received.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to send your message.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-[2rem] border border-[color:var(--slot4-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f7faf6_100%)] p-6 shadow-[0_18px_48px_rgba(26,47,77,0.08)] sm:p-7">
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="name" label="Full name" placeholder="Your name" required />
        <Field name="email" type="email" label="Email address" placeholder="you@example.com" required />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field name="phone" label="Phone number" placeholder="Optional" />
        <Field name="subject" label="Subject" placeholder="How can we help?" />
      </div>
      <label className="mt-4 grid gap-2 text-sm font-black text-[var(--slot4-muted-text)]">
        Message
        <textarea name="message" required rows={6} placeholder="Tell us what you need help with..." className="rounded-2xl border border-[color:var(--slot4-border)] bg-[var(--slot4-page-bg)] px-4 py-3 text-base font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent-fill)] focus:bg-white" />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {message ? (
        <div className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-bold ${status === 'success' ? 'border-emerald-800 bg-emerald-50 text-emerald-800' : 'border-red-700 bg-red-50 text-red-700'}`}>
          {status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : null}
          <span>{message}</span>
        </div>
      ) : null}
      <button type="submit" disabled={status === 'submitting'} className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--slot4-dark-bg)] px-6 text-xs font-black uppercase tracking-[0.24em] text-white transition hover:bg-[var(--slot4-accent-fill)] disabled:cursor-not-allowed disabled:opacity-70">
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Send message
      </button>
    </form>
  )
}

function Field({ name, label, type = 'text', placeholder, required = false }: { name: string; label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[var(--slot4-muted-text)]">
      {label}
      <input name={name} type={type} required={required} placeholder={placeholder} className="h-14 rounded-2xl border border-[color:var(--slot4-border)] bg-[var(--slot4-page-bg)] px-4 text-base font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent-fill)] focus:bg-white" />
    </label>
  )
}
