import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, MoreHorizontal } from 'lucide-react'

export function CustomersPage(): JSX.Element {
  const { t } = useTranslation()

  const customers = [
    { name: "Alice Johnson", email: "alice@example.com", status: "active", date: "2024-01-15" },
    { name: "Bob Smith", email: "bob@example.com", status: "inactive", date: "2024-02-20" },
    { name: "Charlie Brown", email: "charlie@example.com", status: "active", date: "2024-03-10" },
    { name: "Diana Prince", email: "diana@example.com", status: "active", date: "2024-04-05" },
    { name: "Evan Wright", email: "evan@example.com", status: "inactive", date: "2024-05-12" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('customers.title')}</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> {t('customers.add_new')}
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-md border bg-card"
      >
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t('customers.name')}</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t('customers.email')}</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t('customers.status')}</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {customers.map((customer, i) => (
                <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">{customer.name}</td>
                  <td className="p-4 align-middle">{customer.email}</td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {customer.status === 'active' ? t('customers.active') : t('customers.inactive')}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
