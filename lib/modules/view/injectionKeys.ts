import { type InjectionKey } from 'vue'
import { type ViewInstance } from '.'

const viewStackFn = Symbol() as InjectionKey<{
    registerView: (key: string, instance: ViewInstance) => void
    unregisterView: (key: string) => void
    push: ({ name, params }: { name: string, params?: Record<string, unknown> | null }) => void
    pop: ({ steps }?: { steps?: number }) => void
    replace: ({ name, params }: { name: string, params?: Record<string, unknown> | null }) => void
    clear: () => void
    getSize: () => number | null
}>

export { viewStackFn }
