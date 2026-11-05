import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type Common = { id: string; label: string; hint?: string; required?: boolean; className?: string }

const control = 'h-12 rounded-none border-input bg-background px-3 text-base md:text-sm'

export function Field({
  id,
  label,
  hint,
  required,
  className,
  ...props
}: Common & Omit<React.ComponentProps<'input'>, 'id'>) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id} className="text-sm font-bold">
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-destructive">*</span>}
      </Label>
      <Input id={id} name={id} required={required} aria-describedby={hint ? `${id}-hint` : undefined} className={control} {...props} />
      {hint && (
        <p id={`${id}-hint`} className="text-xs leading-5 text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
}

export function TextareaField({
  id,
  label,
  hint,
  required,
  className,
  ...props
}: Common & Omit<React.ComponentProps<'textarea'>, 'id'>) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id} className="text-sm font-bold">
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-destructive">*</span>}
      </Label>
      <Textarea
        id={id}
        name={id}
        required={required}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="min-h-40 rounded-none border-input px-3 py-3 text-base md:text-sm"
        {...props}
      />
      {hint && (
        <p id={`${id}-hint`} className="text-xs leading-5 text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
}

export function SubmitButton({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      aria-disabled={disabled}
      className="flex h-14 w-full items-center justify-center bg-primary text-base font-black text-primary-foreground hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
    >
      {children}
    </button>
  )
}
