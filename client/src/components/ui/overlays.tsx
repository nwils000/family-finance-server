import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IconClose, Penny, type PennyMood } from '@/art';
import { gentle, spring } from '@/lib/motion';
import { Button, Heading, Text } from './primitives';

/* ---------- Sheet ---------- */

/** Bottom sheet on phones, centered dialog on wide screens. The only modal in the app. */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        // pointerEvents goes to none the instant closing starts, so a closing sheet can never block taps.
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, pointerEvents: 'auto' }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
        >
          <motion.div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[32px] border-[2.5px] border-ink bg-bg p-5 pb-safe shadow-lift sm:max-w-md sm:rounded-[32px] sm:pb-5"
            initial={{ y: 32, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1, transition: spring }}
            exit={{ y: 80, opacity: 0, transition: { duration: 0.15 } }}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink/15 sm:hidden" />
            <div className="mb-4 flex items-start justify-between gap-3">
              {title ? <Heading size="sm">{title}</Heading> : <span />}
              <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose} className="-mr-2 -mt-1 h-9 w-9">
                <IconClose />
              </Button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ---------- Confirm ---------- */

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  danger?: boolean;
  mood?: PennyMood;
}

const ConfirmContext = createContext<(o: ConfirmOptions) => Promise<boolean>>(() => Promise.resolve(false));

/** `const confirm = useConfirm(); if (await confirm({ title })) ...` Never window.confirm. */
export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<(v: boolean) => void>();
  const confirm = useCallback(
    (o: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setOpts(o);
      }),
    [],
  );
  const close = (v: boolean) => {
    resolver.current?.(v);
    setOpts(null);
  };
  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Sheet open={!!opts} onClose={() => close(false)}>
        {opts && (
          <div className="flex flex-col items-center gap-3 text-center">
            <motion.div initial={{ scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={gentle}>
              <Penny size={96} mood={opts.mood ?? (opts.danger ? 'sad' : 'think')} />
            </motion.div>
            <Heading size="sm">{opts.title}</Heading>
            {opts.message && <Text>{opts.message}</Text>}
            <div className="mt-2 grid w-full grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => close(false)}>
                Never mind
              </Button>
              <Button variant={opts.danger ? 'danger' : 'primary'} onClick={() => close(true)}>
                {opts.confirmText ?? 'Yes!'}
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </ConfirmContext.Provider>
  );
}
