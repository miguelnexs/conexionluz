import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { api } from "./api/client";
import Index from "./pages/Index";
import Agenda from "./pages/Agenda";
import TherapistsPage from "./pages/Therapists";
import ServicesPage from "./pages/Services";
import ConversatoriosPage from "./pages/Conversatorios";
import TestimonialsPage from "./pages/TestimonialsPage";
import StoriesPage from "./pages/StoriesPage";
import StoryDetailPage from "./pages/StoryDetailPage";
import ForumPage from "./pages/ForumPage";
import ForumDetailPage from "./pages/ForumDetailPage";
import ForumCreatePage from "./pages/ForumCreateTopic";
import ContactPage from "./pages/Contact";
import CoursesPage from "./pages/Courses";
import CoursePage from "./pages/Course";
import CheckoutPage from "./pages/Checkout";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProfilePage from "./pages/Profile";
import PublicProfilePage from "./pages/PublicProfile";
import MiCalendarioPage from "./pages/MiCalendario";
import LumiStorePage from "./pages/LumiStorePage";
import LumiCheckoutPage from "./pages/LumiCheckoutPage";
import NotFound from "./pages/NotFound";
import PostDetailPage from "./pages/PostDetailPage";
// ── Actividades ──────────────────────────────────────
import TestsBienestarPage from "./pages/actividades/TestsBienestar";
import TestResultPage from "./pages/actividades/TestResultPage";
import EjerciciosGuiadosPage from "./pages/actividades/EjerciciosGuiados";
import DiarioEmocionalPage from "./pages/actividades/DiarioEmocional";
import RelajacionPage from "./pages/actividades/Relajacion";
import MiProgresoPage from "./pages/actividades/MiProgreso";
// ── Información ───────────────────────────────────
import QuienesSomosPage from "./pages/QuienesSomos";
import BlogPage from "./pages/Blog";
import FaqPage from "./pages/Faq";
import PrivacidadPage from "./pages/Privacidad";
import TerminosPage from "./pages/Terminos";

const queryClient = new QueryClient();

const MiPerfilRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('conexionluz:token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    api.get<any>('/api/portal/me/').then(res => {
      if (res.ok && res.data) {
        const name = `${res.data.firstName || ''} ${res.data.lastName || ''}`.trim();
        if (name) {
          navigate(`/perfil/${encodeURIComponent(name)}`, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/terapeutas" element={<TherapistsPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/conversatorios" element={<ConversatoriosPage />} />
          <Route path="/cursos" element={<CoursesPage />} />
          <Route path="/cursos/:slug" element={<CoursePage />} />
          <Route path="/checkout/:slug" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/mi-perfil" element={<MiPerfilRedirect />} />
          <Route path="/mi-calendario" element={<MiCalendarioPage />} />
          <Route path="/comprar-lumis" element={<LumiStorePage />} />
          <Route path="/comprar-lumis/checkout" element={<LumiCheckoutPage />} />
          <Route path="/comprar-lumis/checkout/:packageId" element={<LumiCheckoutPage />} />
          <Route path="/billetera" element={<LumiStorePage />} />
          <Route path="/mi-biblioteca" element={<Navigate to="/mi-perfil" replace />} />
          <Route path="/hipnosis-interdimencional" element={<Navigate to="/cursos/hipnosis-interdimencional" replace />} />
          <Route path="/testimonios" element={<TestimonialsPage />} />
          <Route path="/historias" element={<StoriesPage />} />
          <Route path="/historias/:id" element={<StoryDetailPage />} />
          <Route path="/foro" element={<ForumPage />} />
          <Route path="/foro/nuevo" element={<ForumCreatePage />} />
          <Route path="/foro/:id" element={<ForumDetailPage />} />
          <Route path="/perfil/:name" element={<PublicProfilePage />} />
          <Route path="/publicacion/:postId" element={<Index />} />
          <Route path="/destello/:postId" element={<Index />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/membresia" element={<Navigate to="/" replace />} />
          {/* ── Actividades ───────────────────────────────────── */}
          <Route path="/actividades/tests" element={<TestsBienestarPage />} />
          <Route path="/actividades/tests/resultado" element={<TestResultPage />} />
          <Route path="/actividades/ejercicios" element={<EjerciciosGuiadosPage />} />
          <Route path="/actividades/diario" element={<DiarioEmocionalPage />} />
          <Route path="/actividades/relajacion" element={<RelajacionPage />} />
          <Route path="/mi-progreso" element={<MiProgresoPage />} />
          <Route path="/actividades/progreso" element={<Navigate to="/mi-progreso" replace />} />
          {/* ── Información ──────────────────────────────────── */}
          <Route path="/quienes-somos" element={<QuienesSomosPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacidad" element={<PrivacidadPage />} />
          <Route path="/terminos" element={<TerminosPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
