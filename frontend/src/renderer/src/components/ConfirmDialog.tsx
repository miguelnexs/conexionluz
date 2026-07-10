import { useCallback, useMemo, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ConfirmOptions = {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}

type ConfirmState = {
  open: boolean
  options: ConfirmOptions
  resolve: ((value: boolean) => void) | null
}

export function useConfirmDialog(): {
  confirm: (options: ConfirmOptions) => Promise<boolean>
  ConfirmDialog: JSX.Element | null
} {
  const [state, setState] = useState<ConfirmState>({
    open: false,
    options: { title: '' },
    resolve: null
  })

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ open: true, options, resolve })
    })
  }, [])

  const close = useCallback((value: boolean) => {
    setState((prev) => {
      prev.resolve?.(value)
      return { open: false, options: { title: '' }, resolve: null }
    })
  }, [])

  const dialog = useMemo(() => {
    if (!state.open) return null
    const { title, description, confirmText, cancelText, destructive } = state.options

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
        <button type="button" className="absolute inset-0 bg-black/55" aria-label="Close" onClick={() => close(false)} />
        <div role="dialog" aria-modal="true" className="relative w-full max-w-lg overflow-hidden rounded-3xl border bg-card shadow-2xl">
          <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div
                className={[
                  'h-11 w-11 rounded-2xl flex items-center justify-center ring-1 ring-border',
                  destructive ? 'bg-red-500/10 text-red-600' : 'bg-primary/10 text-primary'
                ].join(' ')}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="text-lg font-bold">{title}</div>
                {description ? <div className="text-sm text-muted-foreground whitespace-pre-wrap">{description}</div> : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => close(false)}>
                {cancelText || 'Cancel'}
              </Button>
              <Button
                variant={destructive ? 'destructive' : 'default'}
                onClick={() => close(true)}
              >
                {confirmText || 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }, [close, state.open, state.options])

  return { confirm, ConfirmDialog: dialog }
}

