import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function SettingsPage(): JSX.Element {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h2>
      
      <div className="grid gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border bg-card p-6 space-y-4"
        >
          <h3 className="text-xl font-semibold">{t('settings.general')}</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('settings.language_select')}
            </label>
            <div className="flex gap-2">
              <Button 
                variant={i18n.language === 'es' ? 'default' : 'outline'} 
                onClick={() => changeLanguage('es')}
              >
                Español
              </Button>
              <Button 
                variant={i18n.language === 'en' ? 'default' : 'outline'} 
                onClick={() => changeLanguage('en')}
              >
                English
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
