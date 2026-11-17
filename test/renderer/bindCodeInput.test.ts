import { describe, expect, it, vi } from 'vitest'
import { useBindCodeInput } from '../../src/renderer/composables/useBindCodeInput'

function keyboard(value: string, key = value): KeyboardEvent {
  return {
    target: { value, nextElementSibling: null, previousElementSibling: null },
    key
  } as unknown as KeyboardEvent
}
function populate(state: ReturnType<typeof useBindCodeInput>['state'], code: string): void {
  Object.assign(
    state,
    Object.fromEntries([...code].map((character, index) => [`code${index + 1}`, character]))
  )
}
describe('binding input device request boundary', () => {
  it('rejects forbidden characters without calling the connector', () => {
    const acquire = vi.fn(async () => {})
    const input = useBindCodeInput(acquire, true)
    for (const code of ['A2345670', 'A2345671', 'A234567I', 'A234567O', 'A234567_']) {
      populate(input.state, code)
      input.inpCode(8, keyboard(code[7]))
      expect(input.state.codeIsTrue).toBe(false)
    }
    expect(acquire).not.toHaveBeenCalled()
  })
  it('connection input normalizes lowercase and invokes the Promise immediately', () => {
    const acquire = vi.fn(async () => {})
    const input = useBindCodeInput(acquire, true)
    populate(input.state, 'a2345678')
    input.inpCode(8, keyboard('8'))
    expect(acquire).toHaveBeenCalledExactlyOnceWith('A2345678')
    expect(input.state.bindingStatus).toBe(1)
  })
  it('setup input preserves accepted lowercase binding code', () => {
    const acquire = vi.fn(async () => {})
    const input = useBindCodeInput(acquire)
    populate(input.state, 'a2345678')
    input.inpCode(8, keyboard('8'))
    expect(acquire).toHaveBeenCalledExactlyOnceWith('a2345678')
  })
  it('first and last input keyboard boundaries tolerate absent sibling elements', () => {
    const input = useBindCodeInput(async () => {})
    expect(() => input.inpCode(1, keyboard('', 'Backspace'))).not.toThrow()
    expect(() => input.inpCode(8, keyboard('8'))).not.toThrow()
    expect(input.state.codeIsTrue).toBe(false)
  })
})
