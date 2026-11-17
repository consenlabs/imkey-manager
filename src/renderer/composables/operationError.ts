export function operationError(value: unknown): string {
  if (value instanceof Error) return value.message || 'operation_failed'
  if (typeof value === 'string') return value || 'operation_failed'
  if (value && typeof value === 'object') {
    let message = 'operation_failed'
    if ('result' in value && typeof value.result === 'string') message = value.result || message
    else if ('message' in value && typeof value.message === 'string')
      message = value.message || message
    if (
      'operationId' in value &&
      typeof value.operationId === 'string' &&
      /^[a-z0-9-]{1,64}$/.test(value.operationId)
    ) {
      return `${message} [${value.operationId}]`
    }
    return message
  }
  return 'operation_failed'
}

// A missing response field can occur for multiple server errors, including a
// rejected upgrade. It does not prove that the user cancelled the operation.
export function firmwareOperationError(value: unknown): string {
  const message = operationError(value)
  const match = message.match(
    /^missing field [`']?_ReturnData[`']? at line \d+ column \d+( \[[a-z0-9-]{1,64}\])?$/
  )
  return match ? `firmware_response_incomplete${match[1] || ''}` : message
}
