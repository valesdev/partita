import { type InjectionKey } from 'vue'

interface ViewStackFn {
  push: ({ name, params }: { name: string, params?: Record<string, unknown> | null }) => void
  pop: ({ steps }?: { steps?: number }) => void
  replace: ({ name, params }: { name: string, params?: Record<string, unknown> | null }) => void
  clear: () => void
  getSize: () => number | null
}

const injectionKeyForViewStackFn = Symbol() as InjectionKey<ViewStackFn>

export {
  injectionKeyForViewStackFn,
  type ViewStackFn
}
