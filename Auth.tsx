import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // <--- זה התיקון החשוב כאן
import { Loader2, Link2, Sparkles } from 'lucide-react';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('נרשמת בהצלחה! בדוק את תיבת המייל שלך לאישור החשבון.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'התרחשה שגיאה בתהליך האימות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 p-4" dir="rtl">
      {/* רקע עיצובי */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/10 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 mb-4 shadow-inner border border-blue-500/30">
            <Link2 size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">מערכת קישורים</h2>
          <p className="text-blue-200/80">התחבר כדי לנהל את הקישורים שלך</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1.5">אימייל</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-blue-300/50 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition text-left"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1.5">סיסמה</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-blue-300/50 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition text-left"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            {loading
              ? <Loader2 className="animate-spin h-5 w-5" />
              : (<><Sparkles size={16} />{mode === 'login' ? 'התחברות' : 'הרשמה'}</>)
            }
          </button>
        </form>

        <div className="text-center mt-5">
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
            className="text-sm text-blue-300 hover:text-white transition"
          >
            {mode === 'login' ? 'אין לך חשבון? הירשם עכשיו' : 'כבר יש לך חשבון? התחבר'}
          </button>
        </div>
      </div>
    </div>
  );
};
