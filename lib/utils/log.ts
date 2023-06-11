export default class {
  static d(...args: any[]) {
    if (import.meta.env.NODE_ENV === 'development') {
      window.console.debug.apply(null, args)
    }
  }

  static i(...args: any[]) {
    window.console.info.apply(null, args)
  }

  static w(...args: any[]) {
    window.console.warn.apply(null, args)
  }

  static e(...args: any[]) {
    window.console.error.apply(null, args)
  }
}
