import { useI18n } from 'vue-i18n'
export function useTranslation() {
  const { t, te } = useI18n({ useScope: 'global' })
  return { t, te }
}
