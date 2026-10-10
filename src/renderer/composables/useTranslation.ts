import { useI18n } from 'vue-i18n'
export function useTranslation() {
  const { t } = useI18n({ useScope: 'global' })
  return { t }
}
