import { useTranslation } from 'react-i18next'

export default function Loader() {
  const { t } = useTranslation()
  return (
    <div className="loader">
      <div className="ring" />
      <span>{t('ui.loading')}</span>
    </div>
  )
}
