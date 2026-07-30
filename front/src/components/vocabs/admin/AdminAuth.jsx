import React, { useState } from 'react';
import { Lock, Mail, Key, AlertCircle, Check } from 'lucide-react';
import { supabase } from '../../../services/supabaseClient';

export default function AdminAuth({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setMessage('Inscription réussie. Vérifiez votre e-mail pour confirmer le compte.');
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        onLoginSuccess?.(data.session);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#dadce0] rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#E8F0FE] rounded-2xl flex items-center justify-center mx-auto text-[#1a73e8] mb-3">
          <Lock className="w-5 h-5" />
        </div>
        <h2 className="text-[22px] font-medium text-[#202124]">
          {isSignUp ? 'Créer un compte' : 'Connexion admin'}
        </h2>
        <p className="text-[13px] text-[#5f6368] mt-1">
          Accès réservé pour gérer le vocabulaire sur Supabase.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-[13px] flex gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 text-[13px] flex gap-2">
          <Check className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full h-11 pl-9 pr-4 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] outline-none text-[14px]"
            />
          </div>
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5 block">Mot de passe</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-11 pl-9 pr-4 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] outline-none text-[14px]"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-[#1a73e8] text-white font-semibold text-[14px] hover:bg-[#1b66c9] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (isSignUp ? 'Créer le compte' : 'Se connecter')}
        </button>
      </form>

      <button
        type="button"
        onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
        className="w-full mt-5 pt-4 border-t border-[#f1f3f4] text-[13px] text-[#1a73e8] font-medium hover:underline"
      >
        {isSignUp ? 'Déjà un compte ? Se connecter' : 'Créer un compte administrateur'}
      </button>
    </div>
  );
}
