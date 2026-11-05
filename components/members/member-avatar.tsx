import Image from 'next/image'
import Link from 'next/link'
import type { Member } from '@/lib/types'
import { cn } from '@/lib/utils'

export function MemberAvatar({ member, className, sizes = '160px' }: { member: Member; className?: string; sizes?: string }) {
  return (
    <div className={cn('relative aspect-square overflow-hidden bg-muted', className)}>
      {member.iconUrl ? (
        <Image src={member.iconUrl || '/placeholder.svg'} alt="" fill sizes={sizes} className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-accent">
          <span
            aria-hidden="true"
            className="egg flex h-3/5 w-1/2 items-center justify-center bg-primary font-display text-2xl font-bold text-primary-foreground md:text-3xl"
          >
            {member.handle.replace(/^Dev/, '').slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}

export function MemberTile({ member }: { member: Member }) {
  return (
    <Link href={`/members/${member.slug}`} className="group flex flex-col gap-2">
      <MemberAvatar
        member={member}
        className="ring-0 ring-foreground transition-shadow group-hover:ring-2 group-focus-visible:ring-2"
      />
      <span className="truncate text-center font-display text-base font-semibold tracking-wide group-hover:underline">
        {member.handle}
      </span>
    </Link>
  )
}
