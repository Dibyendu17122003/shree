import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '../api/client';
import type { DashboardStats, AnswersGroup, ChartData } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [answers, setAnswers] = useState<AnswersGroup[]>([]);
  const [charts, setCharts] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAccepted, setFilterAccepted] = useState<string>('');
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'answers' | 'analytics'>('overview');
  const [notification, setNotification] = useState('');

  const notify = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  }, []);

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [statsData, answersData, chartsData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getAnswers(),
        adminApi.getCharts(),
      ]);
      setStats(statsData);
      setAnswers(answersData);
      setCharts(chartsData);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    adminApi.checkAuth().then(fetchData).catch(() => {
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    });
  }, [token, navigate, fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    navigate('/admin/login');
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await adminApi.deleteSession(sessionId);
      setAnswers(prev => prev.filter(a => a.sessionId !== sessionId));
      notify('Session deleted');
    } catch {
      notify('Failed to delete session');
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const blob = await adminApi.exportData(format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `date-proposal-data.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      notify(`Exported as ${format.toUpperCase()}`);
    } catch {
      notify('Export failed');
    }
  };

  const filteredAnswers = answers.filter(a => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!a.sessionId.toLowerCase().includes(q)) return false;
    }
    if (filterAccepted === 'true' && !a.session?.dateAccepted) return false;
    if (filterAccepted === 'false' && a.session?.dateAccepted) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <motion.div
          className="text-6xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ❤️
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const StatCard = ({ label, value, icon }: { label: string; value: string | number; icon: string }) => (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-white/40 mt-1">{label}</p>
    </motion.div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0a0a0f]' : 'bg-[#fafafa]'} transition-colors duration-300`}>
      <AnimatePresence>
        {notification && (
          <motion.div
            className="fixed top-4 right-4 z-50 glass-strong px-6 py-3 rounded-xl text-white"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className={`text-2xl font-display font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dashboard
              </h1>
              <span className="text-sm text-rose-400">❤️</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-white/5 rounded-xl p-1">
                {(['overview', 'answers', 'analytics'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize
                      ${activeTab === tab
                        ? 'bg-rose-500 text-white'
                        : `${darkMode ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {darkMode ? '🌙' : '☀️'}
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-sm font-medium transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <motion.h2
              className={`text-3xl font-script ${darkMode ? 'text-white' : 'text-gray-900'}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Welcome back ❤️
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Total Visits" value={stats?.totalVisits ?? 0} icon="👀" />
              <StatCard label="Completed" value={stats?.completedSessions ?? 0} icon="✅" />
              <StatCard label="Current Visitors" value={stats?.currentVisitors ?? 0} icon="🟢" />
              <StatCard label="Date Accepted" value={stats?.dateAccepted ?? 0} icon="❤️" />
              <StatCard label="Avg Completion" value={`${stats?.avgCompletion ?? 0}%`} icon="📊" />
              <StatCard label="Avg Time" value={`${stats?.avgTime ?? 0}s`} icon="⏱️" />
            </div>

            <div className="glass-card p-6">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => handleExport('csv')} className="btn-secondary text-sm py-2 px-4">
                  📥 Export CSV
                </button>
                <button onClick={() => handleExport('json')} className="btn-secondary text-sm py-2 px-4">
                  📥 Export JSON
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'answers' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by session ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 px-4 py-3 rounded-xl outline-none transition-all
                  ${darkMode
                    ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-rose-500/50'
                    : 'bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-rose-500'
                  }`}
              />
              <select
                value={filterAccepted}
                onChange={(e) => setFilterAccepted(e.target.value)}
                className={`px-4 py-3 rounded-xl outline-none transition-all
                  ${darkMode
                    ? 'bg-white/5 border border-white/10 text-white focus:border-rose-500/50'
                    : 'bg-white border border-gray-200 text-gray-900 focus:border-rose-500'
                  }`}
              >
                <option value="">All Responses</option>
                <option value="true">Accepted ❤️</option>
                <option value="false">Not Accepted</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredAnswers.length === 0 && (
                <p className={`text-center py-12 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
                  No responses found
                </p>
              )}
              {filteredAnswers.map((group, idx) => (
                <motion.div
                  key={group.sessionId}
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <p className={`text-xs font-mono ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
                      Session: {group.sessionId}
                    </p>
                    <button
                      onClick={() => handleDeleteSession(group.sessionId)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs transition-all"
                    >
                      Delete
                    </button>
                  </div>

                  <pre className={`text-xs font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto p-4 rounded-xl ${darkMode ? 'bg-white/5 text-white/80' : 'bg-gray-100 text-gray-800'}`}>
{JSON.stringify(group.answers, null, 2)}
                  </pre>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && charts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Analytics Data (JSON)
              </h3>
              <pre className={`text-xs font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-[600px] overflow-y-auto p-4 rounded-xl ${darkMode ? 'bg-white/5 text-white/80' : 'bg-gray-100 text-gray-800'}`}>
{JSON.stringify(charts, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}


