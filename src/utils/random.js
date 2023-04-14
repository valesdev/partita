export default class {
  static string (length = 6) {
    return Math.random().toString(16).substring(2, Math.max(0, Math.min(8, length)) + 2)
  }
}
