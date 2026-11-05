export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <div className="h-10 w-48 animate-pulse bg-muted" />
      <div className="mt-10 flex flex-col gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 animate-pulse bg-muted" />
        ))}
      </div>
    </div>
  )
}
