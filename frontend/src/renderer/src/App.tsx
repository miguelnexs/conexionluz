import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider'
import MainLayout from '@/layouts/MainLayout'
import { WelcomePage } from '@/pages/WelcomePage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { TherapistsPage } from '@/pages/TherapistsPage'
import { ServicesPage } from '@/pages/ServicesPage'
import { TalksPage } from '@/pages/TalksPage'
import { TalkFormPage } from '@/pages/TalkFormPage'
import { TalkFeaturedVideoPage } from '@/pages/TalkFeaturedVideoPage'
import { TestimonialsPage } from '@/pages/TestimonialsPage'
import { HistoriaPage } from '@/pages/HistoriaPage'
import { HistoriaDetailPage } from '@/pages/HistoriaDetailPage'
import { HistoriaFormPage } from '@/pages/HistoriaFormPage'
import { CoursesAdminPage } from '@/pages/CoursesAdminPage'
import { CourseFormPage } from '@/pages/CourseFormPage'
import { TherapistFormPage } from '@/pages/TherapistFormPage'
import { PatientsPage } from '@/pages/PatientsPage'
import { PatientFormPage } from '@/pages/PatientFormPage'
import { ServiceFormPage } from '@/pages/ServiceFormPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { ForumPage } from '@/pages/ForumPage'
import { ForumFormPage } from '@/pages/ForumFormPage'
import { ForumDetailPage } from '@/pages/ForumDetailPage'
import './i18n/config' // Import i18n configuration

function App(): JSX.Element {
  return (
    <HashRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <MainLayout>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analitica" element={<AnalyticsPage />} />
            <Route path="/terapeutas" element={<TherapistsPage />} />
            <Route path="/terapeutas/nuevo" element={<TherapistFormPage mode="create" />} />
            <Route path="/terapeutas/:id" element={<TherapistFormPage mode="edit" />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/servicios/nuevo" element={<ServiceFormPage mode="create" />} />
            <Route path="/servicios/:id" element={<ServiceFormPage mode="edit" />} />
            <Route path="/conversatorios" element={<TalksPage />} />
            <Route path="/conversatorios/nuevo" element={<TalkFormPage key="talk-create" mode="create" />} />
            <Route path="/conversatorios/:id" element={<TalkFormPage key="talk-edit" mode="edit" />} />
            <Route path="/conversatorios/:id/destacado" element={<TalkFeaturedVideoPage />} />
            <Route path="/testimonios" element={<TestimonialsPage />} />
            <Route path="/historia" element={<HistoriaPage />} />
            <Route path="/historia/nueva" element={<HistoriaFormPage mode="create" />} />
            <Route path="/historia/:id" element={<HistoriaDetailPage />} />
            <Route path="/historia/:id/editar" element={<HistoriaFormPage mode="edit" />} />
            <Route path="/foro" element={<ForumPage />} />
            <Route path="/foro/nuevo" element={<ForumFormPage mode="create" />} />
            <Route path="/foro/:id" element={<ForumDetailPage />} />
            <Route path="/foro/:id/editar" element={<ForumFormPage mode="edit" />} />
            <Route path="/cursos" element={<CoursesAdminPage />} />
            <Route path="/cursos/nuevo" element={<CourseFormPage mode="create" />} />
            <Route path="/cursos/:id" element={<CourseFormPage mode="edit" />} />
            <Route path="/calendario" element={<CalendarPage />} />
            <Route path="/pacientes" element={<PatientsPage />} />
            <Route path="/pacientes/nuevo" element={<PatientFormPage mode="create" />} />
            <Route path="/pacientes/:id" element={<PatientFormPage mode="edit" />} />
          </Routes>
        </MainLayout>
      </ThemeProvider>
    </HashRouter>
  )
}

export default App
