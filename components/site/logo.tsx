import Link from 'next/link'
import { cn } from '@/lib/utils'

export function EggMark({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn('egg inline-block bg-primary', className)} />
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('inline-flex items-center gap-2 font-display text-2xl font-bold tracking-wide', className)}
    >
      <EggMark className="h-6 w-5 ring-1 ring-foreground/80" />
      <span>EGK</span>
      <span className="sr-only">EggKingdom</span>
    </Link>
  )
}
