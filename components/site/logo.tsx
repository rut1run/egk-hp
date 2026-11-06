import Link from '@/components/site/link'
import { cn } from '@/lib/utils'

export function EggMark({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn('egg inline-block bg-primary', className)} />
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('inline-flex w-fit shrink-0 items-center gap-2 font-display text-2xl font-bold tracking-wide', className)}
    >
      <img src="/images/egk-logo.jpg" alt="" width={400} height={400} className="size-10 shrink-0 object-contain" />
      <span>EGK</span>
      <span className="sr-only">EggKingdom</span>
    </Link>
  )
}
