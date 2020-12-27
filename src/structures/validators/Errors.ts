class ValidateError extends Error {
  props: object
  constructor(message: string, props: object) {
    super(message)
    this.message = message
    this.name = 'ValidateError'
    this.props = props
  }
}

export { ValidateError }
