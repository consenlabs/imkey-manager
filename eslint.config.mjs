import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier/recommended'
export default tseslint.config(
  { ignores: ['test/fixtures/**', 'out/**', '**/*.cjs', '**/*.mjs'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/essential'],
  { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tseslint.parser } }, rules: { 'vue/multi-word-component-names': 'off' } },
  { files: ['src/renderer/**/*.{ts,js,vue}'], languageOptions: { globals: { window: 'readonly', document: 'readonly', console: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly', navigator: 'readonly' } } },
  { rules: { '@typescript-eslint/no-explicit-any': 'off' } },
  prettier
)
