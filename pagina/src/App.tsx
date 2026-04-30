
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
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
import ContactPage from "./pages/Contact";
import CoursesPage from "./pages/Courses";
import CoursePage from "./pages/Course";
import CheckoutPage from "./pages/Checkout";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProfilePage from "./pages/Profile";
import MiCalendarioPage from "./pages/MiCalendario";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
          <Route path="/mi-perfil" element={<ProfilePage />} />
          <Route path="/mi-calendario" element={<MiCalendarioPage />} />
          <Route path="/mi-biblioteca" element={<Navigate to="/mi-perfil" replace />} />
          <Route path="/hipnosis-interdimencional" element={<Navigate to="/cursos/hipnosis-interdimencional" replace />} />
          <Route path="/testimonios" element={<TestimonialsPage />} />
          <Route path="/historias" element={<StoriesPage />} />
          <Route path="/historias/:id" element={<StoryDetailPage />} />
          <Route path="/foro" element={<ForumPage />} />
          <Route path="/foro/:id" element={<ForumDetailPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
