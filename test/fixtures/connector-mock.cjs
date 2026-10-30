module.exports = {
  callImKeyApi(request) {
    return `mock:${request}`
  },
  getLastErrorMessage() {
    return ''
  }
}
