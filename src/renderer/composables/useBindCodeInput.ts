import { reactive, toRefs } from 'vue'
type CodeIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type CodeKey = `code${CodeIndex}`
export function useBindCodeInput(acquire: (code: string) => Promise<void>, uppercase = false) {
  const state = reactive({
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: '',
    code7: '',
    code8: '',
    codeIsTrue: true,
    bindingStatus: 0
  })
  const input = (event: Event): HTMLInputElement => event.target as HTMLInputElement
  const codeKey = (index: CodeIndex): CodeKey => `code${index}`
  const value = (): string =>
    Array.from({ length: 8 }, (_, index) => state[codeKey((index + 1) as CodeIndex)]).join('')
  function filterBindInput(index: CodeIndex, event: Event): void {
    const target = input(event)
    target.value = target.value.replace(/[^\w./]/gi, '')
    state[codeKey(index)] = target.value
  }
  function deleteInput(index: CodeIndex): void {
    state[codeKey(index)] = ''
  }
  function inpFocus(event: Event): void {
    if (value().length !== 8) input(event).value = ''
  }
  function inpCode(index: CodeIndex, event: KeyboardEvent): void {
    state.codeIsTrue = true
    if (index === 8) {
      const code = uppercase ? value().toUpperCase() : value()
      if (/^[a-hj-np-zA-HJ-NP-Z2-9]{8}$/.test(code)) {
        state.bindingStatus = 1
        void acquire(code)
      } else {
        state.codeIsTrue = false
        if (!uppercase) state.bindingStatus = 0
      }
    }
    const target = input(event)
    if (target.value.length === 1) (target.nextElementSibling as HTMLElement | null)?.focus()
    else target.value = ''
    if (event.key === 'Backspace') (target.previousElementSibling as HTMLElement | null)?.focus()
  }
  return { state, ...toRefs(state), filterBindInput, deleteInput, inpFocus, inpCode }
}
