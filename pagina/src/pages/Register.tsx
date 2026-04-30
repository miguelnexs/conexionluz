import React, { useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { api } from '../api/client';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  type RegisterResponse = {
    token: string;
    patient: {
      id: number;
      firstName: string;
      lastName: string;
      portalWelcomeTitle?: string;
      portalWelcomeMessage?: string;
      portalAccentColor?: string;
    };
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !username || !password) return;
    setError(null);
    setLoading(true);
    const res = await api.post<RegisterResponse>('/api/auth/register/', {
      firstName,
      lastName,
      username,
      email,
      password
    });
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    localStorage.setItem('conexionluz:token', res.data.token);
    setLoading(false);
    navigate('/mi-perfil', { replace: true });
  };

  return (
    <PublicLayout contentClassName="p-0">
      <section className="py-12 bg-gradient-to-br from-blue-50 via-green-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
            <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-5 py-2 border border-gray-100">
              <UserPlus className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">Crear cuenta</span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-gray-800">Empieza hoy</h1>
            <p className="mt-2 text-gray-600">
              Crea tu cuenta para comprar cursos y acceder a tu biblioteca.
            </p>
            {error && (
              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="mt-8 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Nombre</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Apellido</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Tu apellido (opcional)"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Usuario</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="tu.usuario"
                />
                <div className="mt-2 text-xs text-gray-500">Letras, números y . _ - (mínimo 3)</div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="tu@email.com (opcional)"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Contraseña</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="••••••••"
                />
                <div className="mt-2 text-xs text-gray-500">Mínimo 8 caracteres</div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando...' : 'Crear cuenta'}
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Inicia sesión
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default RegisterPage;
