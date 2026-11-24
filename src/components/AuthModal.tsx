import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (email: string, name?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setErrorMsg('Por favor, informe seu nome completo.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          setSuccessMsg('Conta criada e conectada com sucesso!');
          setTimeout(() => {
            onAuthSuccess(email, fullName);
            onClose();
          }, 1200);
        } else {
          setSuccessMsg('Cadastro realizado! Enviamos um link de confirmação para o seu e-mail.');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        const userName = data.user?.user_metadata?.full_name || email.split('@')[0];
        setSuccessMsg('Login realizado com sucesso!');
        setTimeout(() => {
          onAuthSuccess(email, userName);
          onClose();
        }, 800);
      }
    } catch (err: any) {
      const msg = err?.message || 'Ocorreu um erro ao processar a autenticação.';
      if (msg.includes('Invalid login credentials')) {
        setErrorMsg('E-mail ou senha incorretos.');
      } else if (msg.includes('Password should be at least')) {
        setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
      } else if (msg.includes('User already registered')) {
        setErrorMsg('Este e-mail já está cadastrado. Tente entrar.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-[440px] bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl border border-[#E2E5E2] overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#7A8580] hover:text-[#0F2D24] hover:bg-[#F2F4F2] transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0B4D3A]/10 text-[#0B4D3A] mb-3">
            <Lock className="w-6 h-6 text-[#0B4D3A]" />
          </div>
          <h2 className="text-[22px] font-bold text-[#0F2D24]">
            {isSignUp ? 'Criar conta no Vitalidade' : 'Acessar sua conta'}
          </h2>
          <p className="text-[13px] text-[#7A8580] mt-1">
            {isSignUp
              ? 'Conecte seus benefícios e salve seus dados com segurança'
              : 'Entre com seu e-mail e senha cadastrados'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-full bg-[#F2F4F2] p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-[13px] font-semibold rounded-full transition-all ${
              !isSignUp
                ? 'bg-white text-[#0B4D3A] shadow-sm'
                : 'text-[#7A8580] hover:text-[#0F2D24]'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-[13px] font-semibold rounded-full transition-all ${
              isSignUp
                ? 'bg-white text-[#0B4D3A] shadow-sm'
                : 'text-[#7A8580] hover:text-[#0F2D24]'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-[13px]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-[13px]">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[13px] font-semibold text-[#0F2D24] mb-1.5">
                Nome completo
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8580]" />
                <input
                  type="text"
                  required
                  placeholder="Seu nome"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-[48px] pl-10 pr-4 rounded-[14px] bg-white border border-[#E2E5E2] text-[14px] text-[#0F2D24] focus:outline-none focus:border-[#0B4D3A] focus:ring-3 focus:ring-[#DDE9C8]/50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-semibold text-[#0F2D24] mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8580]" />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[48px] pl-10 pr-4 rounded-[14px] bg-white border border-[#E2E5E2] text-[14px] text-[#0F2D24] focus:outline-none focus:border-[#0B4D3A] focus:ring-3 focus:ring-[#DDE9C8]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#0F2D24] mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8580]" />
              <input
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[48px] pl-10 pr-4 rounded-[14px] bg-white border border-[#E2E5E2] text-[14px] text-[#0F2D24] focus:outline-none focus:border-[#0B4D3A] focus:ring-3 focus:ring-[#DDE9C8]/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] mt-2 rounded-full bg-[#0B4D3A] hover:bg-[#003526] text-white font-semibold text-[14px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              <span>{isSignUp ? 'Criar minha conta' : 'Entrar'}</span>
            )}
          </button>
        </form>

        <p className="text-[11px] text-center text-[#7A8580] mt-5">
          Protegido com criptografia de ponta a ponta via Supabase Auth
        </p>
      </div>
    </div>
  );
};
