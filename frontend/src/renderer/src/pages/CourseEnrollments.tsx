import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import { useTranslation } from 'react-i18next'
import { Check, X, Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Enrollment = {
  id: number
  patientId: number
  patientName: string
  patientEmail: string
  isPaid: boolean
  createdAt: string
}

export function CourseEnrollments({ courseId }: { courseId: number }) {
  const { t } = useTranslation()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [courseId])

  async function load() {
    setLoading(true)
    const res = await api.get<Enrollment[]>(`/api/courses/${courseId}/enrollments/`)
    if (res.ok) {
      setEnrollments(res.data)
    }
    setLoading(false)
  }

  async function togglePaid(enrollmentId: number, currentPaid: boolean) {
    const res = await api.patch(`/api/courses/${courseId}/enrollments/${enrollmentId}/`, {
      isPaid: !currentPaid
    })
    if (res.ok) {
      load()
    }
  }

  return (
    <div className="mt-8 rounded-2xl border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6 border-b">
        <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {t('courses_builder.enrollments_tab', 'Inscritos')}
        </h3>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {t('courses_builder.enrollments_empty', 'Aún no hay inscritos.')}
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    {t('courses_builder.enrollments_name', 'Nombre')}
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    {t('courses_builder.enrollments_email', 'Correo')}
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    {t('courses_builder.enrollments_date', 'Fecha')}
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    {t('courses_builder.enrollments_paid', 'Pagado')}
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {enrollments.map((env) => (
                  <tr
                    key={env.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">{env.patientName}</td>
                    <td className="p-4 align-middle text-muted-foreground">{env.patientEmail}</td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {new Date(env.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle">
                      {env.isPaid ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                          <Check className="h-3.5 w-3.5" />
                          Sí
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-500">
                          <X className="h-3.5 w-3.5" />
                          No
                        </span>
                      )}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePaid(env.id, env.isPaid)}
                      >
                        {env.isPaid
                          ? t('courses_builder.enrollments_toggle_unpaid', 'Marcar como no pagado')
                          : t('courses_builder.enrollments_toggle_paid', 'Marcar como pagado')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
