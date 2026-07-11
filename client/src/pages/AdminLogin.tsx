import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminApi } from '../api/client';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await adminApi.login(username, password);
      localStorage.setItem('admin_token', data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.response) {
        setError('Invalid credentials. Try again.');
      } else {
        setError('Cannot reach server. Is it running on port 5000?');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin(e as any);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-900/5 via-transparent to-purple-900/5" />

      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-rose-500/5"
          style={{
            width: Math.random() * 200 + 50,
            height: Math.random() * 200 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div
        className="relative z-10 w-full max-w-sm mx-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass-card p-8">
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-2xl font-display font-bold text-gradient">
              Admin Access
            </h1>
            <p className="text-sm text-white/40 mt-1">
              Authorized personnel only
            </p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={checkEnter}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all touch-manipulation"
                autoComplete="username"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={checkEnter}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all touch-manipulation"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <motion.p
                className="text-red-400 text-sm text-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-base
                bg-gradient-to-r from-rose-500 to-pink-600
                hover:from-rose-400 hover:to-pink-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all active:scale-95"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
            </motion.button>
          </form>

          <motion.p
            className="text-center text-xs text-white/20 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Made with ❤️
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
