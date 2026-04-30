import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, CreditCard, Lock, Sparkles } from 'lucide-react';

const getPurchaseKey = (slug: string) => `conexionluz:purchased:${slug}`;
const getTokenKey = () => 'conexionluz:token';

const CheckoutPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  if (!slug) return <Navigate to="/cursos" replace />;

  const product =
    slug === 'hipnosis-interdimencional'
      ? {
          slug,
          title: 'Hipnosis Interdimencional',
          price: '$ 99.000 COP',
          includes: [
            'Acceso al curso completo en tu biblioteca',
            'Lecciones en video y recursos complementarios',
            'Acceso desde cualquier dispositivo'
          ]
        }
      : null;

  if (!product) return <Navigate to="/cursos" replace />;

  const handleSimulatePay = () => {
    localStorage.setItem(getPurchaseKey(product.slug), '1');
    const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem(getTokenKey()));
    navigate(hasToken ? '/mi-perfil' : '/login', { replace: true, state: { from: '/mi-perfil' } });
  };

  return (
    <PublicLayout contentClassName="p-0">
      <section className="py-12 bg-gradient-to-br from-primary/10 via-white to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
              <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-5 py-2 border border-gray-100">
                <Lock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-gray-700">Checkout</span>
              </div>

              <h1 className="mt-4 text-4xl font-bold text-gray-800">{product.title}</h1>
              <p className="mt-2 text-gray-600">
                Compra segura. Al finalizar tendrás acceso inmediato en tu biblioteca.
              </p>

              <div className="mt-8 space-y-3">
                <div className="text-sm font-semibold text-gray-700">Incluye:</div>
                {product.includes.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSimulatePay}
                  className="group bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-5 w-5" />
                  Finalizar compra (demo)
                </button>
                <Link
                  to={`/cursos/${product.slug}`}
                  className="bg-white text-gray-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-5 w-5 text-primary" />
                  Volver al curso
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm p-8 h-fit">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-4xl font-bold text-gray-800 mt-1">{product.price}</div>
              <div className="text-xs text-gray-500 mt-2">
                Este checkout es demostrativo. Cuando conectemos pagos reales se reemplaza este paso.
              </div>
              <div className="mt-6 border-t border-gray-200 pt-6">
                <Link
                  to="/mi-perfil"
                  className="text-primary font-semibold hover:underline"
                >
                  Ya compré, ir a mi perfil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default CheckoutPage;
