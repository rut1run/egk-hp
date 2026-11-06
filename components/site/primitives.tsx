import Link from '@/components/site/link'
import { ArrowRight, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EggMark } from './logo'

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 md:px-8', className)}>{children}</div>
}

export function PageHeader({ title, lead, children }: { title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="border-b">
      <Container className="py-10 md:py-16">
        <h1 className="text-3xl font-black tracking-tight text-balance md:text-5xl">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">{lead}</p>}
        {children}
      </Container>
    </div>
  )
}

export function SectionHeading({
  title,
  href,
  linkLabel,
  as: Tag = 'h2',
  id,
}: {
  title: string
  href?: string
  linkLabel?: string
  as?: 'h2' | 'h3'
  id?: string
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-foreground pb-3 md:mb-8">
      <Tag id={id} className="flex items-center gap-3 text-xl font-black tracking-tight md:text-2xl">
        <EggMark className="h-5 w-4" />
        {title}
      </Tag>
      {href && linkLabel && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-bold hover:underline"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

export function EmptyState({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 border border-dashed px-5 py-8 text-sm text-muted-foreground">
      <p>{children}</p>
      {action}
    </div>
  )
}

export function Notice({ children, tone = 'info' }: { children: React.ReactNode; tone?: 'info' | 'warn' }) {
  return (
    <div
      role="note"
      className={cn(
        'flex items-start gap-3 border-l-4 px-4 py-3 text-sm leading-6',
        tone === 'warn' ? 'border-foreground bg-accent' : 'border-border bg-muted',
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}

export function Tag({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'yellow' | 'ink' | 'live' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] leading-5 font-bold tracking-wide',
        tone === 'default' && 'border border-foreground/20 text-foreground',
        tone === 'yellow' && 'bg-primary text-primary-foreground',
        tone === 'ink' && 'bg-foreground text-background',
        tone === 'live' && 'bg-destructive text-white',
      )}
    >
      {tone === 'live' && <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-white" />}
      {children}
    </span>
  )
}

export function DevBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center border border-dashed border-foreground/40 px-1.5 text-[10px] leading-4 font-medium text-muted-foreground">
      {label}
    </span>
  )
}
