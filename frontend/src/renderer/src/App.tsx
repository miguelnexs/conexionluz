import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import MainLayout from '@/layouts/MainLayout'
import { LoginPage } from '@/pages/LoginPage'
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
import { MembershipsPage } from '@/pages/MembershipsPage'
import { MembershipPlanFormPage } from '@/pages/MembershipPlanFormPage'
import { SettingsPage } from '@/pages/SettingsPage'
import './i18n/config'

function App(): JSX.Element {
  return (
    <HashRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <MainLayout>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/analitica" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/terapeutas" element={<ProtectedRoute><TherapistsPage /></ProtectedRoute>} />
              <Route path="/terapeutas/nuevo" element={<ProtectedRoute><TherapistFormPage mode="create" /></ProtectedRoute>} />
              <Route path="/terapeutas/:id" element={<ProtectedRoute><TherapistFormPage mode="edit" /></ProtectedRoute>} />
              <Route path="/servicios" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
              <Route path="/servicios/nuevo" element={<ProtectedRoute><ServiceFormPage mode="create" /></ProtectedRoute>} />
              <Route path="/servicios/:id" element={<ProtectedRoute><ServiceFormPage mode="edit" /></ProtectedRoute>} />
              <Route path="/conversatorios" element={<ProtectedRoute><TalksPage /></ProtectedRoute>} />
              <Route path="/conversatorios/nuevo" element={<ProtectedRoute><TalkFormPage key="talk-create" mode="create" /></ProtectedRoute>} />
              <Route path="/conversatorios/:id" element={<ProtectedRoute><TalkFormPage key="talk-edit" mode="edit" /></ProtectedRoute>} />
              <Route path="/conversatorios/:id/destacado" element={<ProtectedRoute><TalkFeaturedVideoPage /></ProtectedRoute>} />
              <Route path="/testimonios" element={<ProtectedRoute><TestimonialsPage /></ProtectedRoute>} />
              <Route path="/historia" element={<ProtectedRoute><HistoriaPage /></ProtectedRoute>} />
              <Route path="/historia/nueva" element={<ProtectedRoute><HistoriaFormPage mode="create" /></ProtectedRoute>} />
              <Route path="/historia/:id" element={<ProtectedRoute><HistoriaDetailPage /></ProtectedRoute>} />
              <Route path="/historia/:id/editar" element={<ProtectedRoute><HistoriaFormPage mode="edit" /></ProtectedRoute>} />
              <Route path="/foro" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
              <Route path="/foro/nuevo" element={<ProtectedRoute><ForumFormPage mode="create" /></ProtectedRoute>} />
              <Route path="/foro/:id" element={<ProtectedRoute><ForumDetailPage /></ProtectedRoute>} />
              <Route path="/foro/:id/editar" element={<ProtectedRoute><ForumFormPage mode="edit" /></ProtectedRoute>} />
              <Route path="/cursos" element={<ProtectedRoute><CoursesAdminPage /></ProtectedRoute>} />
              <Route path="/cursos/nuevo" element={<ProtectedRoute><CourseFormPage mode="create" /></ProtectedRoute>} />
              <Route path="/cursos/:id" element={<ProtectedRoute><CourseFormPage mode="edit" /></ProtectedRoute>} />
              <Route path="/calendario" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
              <Route path="/membresias" element={<ProtectedRoute><MembershipsPage /></ProtectedRoute>} />
              <Route path="/membresias/planes/nuevo" element={<ProtectedRoute><MembershipPlanFormPage mode="create" /></ProtectedRoute>} />
              <Route path="/membresias/planes/:id/editar" element={<ProtectedRoute><MembershipPlanFormPage mode="edit" /></ProtectedRoute>} />
              <Route path="/pacientes" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
              <Route path="/pacientes/nuevo" element={<ProtectedRoute><PatientFormPage mode="create" /></ProtectedRoute>} />
              <Route path="/pacientes/:id" element={<ProtectedRoute><PatientFormPage mode="edit" /></ProtectedRoute>} />
              <Route path="/configuracion" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            </Routes>
          </MainLayout>
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  )
}

export default App
