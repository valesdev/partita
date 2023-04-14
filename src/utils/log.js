export default class {
  static d () {
    // if (process.env.NODE_ENV === 'development') {
    //   window.console.debug.apply(null, arguments)
    // }
  }

  static i () {
    window.console.info.apply(null, arguments)
  }

  static w () {
    window.console.warn.apply(null, arguments)
  }

  static e () {
    window.console.error.apply(null, arguments)
  }
}
