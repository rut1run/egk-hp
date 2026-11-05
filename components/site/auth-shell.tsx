import { EggMark } from './logo'

export function AuthShell({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-4 py-12 md:py-20">
      <div className="flex flex-col gap-3">
        <EggMark className="h-8 w-6 ring-1 ring-foreground" />
        <h1 className="text-3xl font-black">{title}</h1>
        {lead && <p className="text-sm leading-6 text-muted-foreground">{lead}</p>}
      </div>
      {children}
    </div>
  )
}
