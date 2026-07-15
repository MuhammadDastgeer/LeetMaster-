import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, Lock, User, HelpCircle, CheckCircle2, AlertCircle, 
  ArrowLeft, Sparkles, Code2, Eye, EyeOff
} from 'lucide-react';

interface AuthPageProps {
  darkMode: boolean;
  onNavigate: (path: string) => void;
  onAuthSuccess: (session: { email: string; fullName: string; id: string }) => void;
  initialMode?: 'login' | 'signup' | 'forgot';
}

export default function AuthPage({ darkMode, onNavigate, onAuthSuccess, initialMode = 'login' }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Status indicators
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Logged in successfully! 🚀');
        localStorage.setItem('leetmaster_user_session', JSON.stringify(data.user));
        // Save name for profile
        localStorage.setItem('leetmaster_user_profile', JSON.stringify({ name: data.user.fullName }));
        document.cookie = `leetmaster_user_email=${encodeURIComponent(data.user.email)}; path=/; max-age=31536000; SameSite=Lax`;
        
        setTimeout(() => {
          onAuthSuccess(data.user);
        }, 1200);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server connection failed. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !fullName) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Account created successfully! 🎉');
        localStorage.setItem('leetmaster_user_session', JSON.stringify(data.user));
        localStorage.setItem('leetmaster_user_profile', JSON.stringify({ name: data.user.fullName }));
        document.cookie = `leetmaster_user_email=${encodeURIComponent(data.user.email)}; path=/; max-age=31536000; SameSite=Lax`;

        setTimeout(() => {
          onAuthSuccess(data.user);
        }, 1200);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Server connection failed. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName || !newPassword) {
      setError('Please enter your email, registered full name, and new password');
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName,
          newPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Password reset successfully! 🥳');
        setTimeout(() => {
          setMode('login');
          setPassword('');
          setNewPassword('');
          setError(null);
          setSuccess(null);
        }, 1500);
      } else {
        setError(data.error || 'Verification failed. Please check your email and full name.');
      }
    } catch (err) {
      setError('Server connection failed. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-stone-50 dark:bg-zinc-950 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 border-2 border-stone-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl"
      >
        {/* Top visual accent */}
        <div className="bg-gradient-to-r from-[#ff6b2b] to-[#ff4500] h-2 w-full" />

        <div className="p-8">
          {/* Brand Logo */}
          <div className="flex flex-col items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-black dark:bg-zinc-800 flex items-center justify-center text-white relative shadow-md">
              <Code2 className="w-6 h-6 text-[#ff6b2b]" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              leetmaster<span className="text-[#ff6b2b]">.</span>
            </h1>
            <p className="text-xs text-stone-500 dark:text-zinc-400 font-mono">
              {mode === 'login' && 'CONTINUE YOUR DSA JOURNEY'}
              {mode === 'signup' && 'CREATE YOUR SCHOLAR ACCOUNT'}
              {mode === 'forgot' && 'SECURE PASSWORD RECOVERY'}
            </p>
          </div>

          {/* Alert messages */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Forms */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-extrabold font-mono text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700/80 rounded-2xl text-sm text-stone-950 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#ff6b2b] dark:focus:border-[#ff6b2b] focus:ring-1 focus:ring-[#ff6b2b]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-extrabold font-mono text-stone-700 dark:text-zinc-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-[#ff6b2b] hover:underline font-semibold"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700/80 rounded-2xl text-sm text-stone-950 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#ff6b2b] dark:focus:border-[#ff6b2b] focus:ring-1 focus:ring-[#ff6b2b]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-stone-400 dark:text-zinc-500 hover:text-stone-600 dark:hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#ff6b2b] hover:bg-[#e0561a] disabled:bg-stone-300 dark:disabled:bg-zinc-800 text-white rounded-2xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-stone-500 dark:text-zinc-400">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
                  className="text-xs text-[#ff6b2b] font-bold hover:underline"
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold font-mono text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700/80 rounded-2xl text-sm text-stone-950 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#ff6b2b] dark:focus:border-[#ff6b2b] focus:ring-1 focus:ring-[#ff6b2b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold font-mono text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700/80 rounded-2xl text-sm text-stone-950 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#ff6b2b] dark:focus:border-[#ff6b2b] focus:ring-1 focus:ring-[#ff6b2b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold font-mono text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create your password"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700/80 rounded-2xl text-sm text-stone-950 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#ff6b2b] dark:focus:border-[#ff6b2b] focus:ring-1 focus:ring-[#ff6b2b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold font-mono text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700/80 rounded-2xl text-sm text-stone-950 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#ff6b2b] dark:focus:border-[#ff6b2b] focus:ring-1 focus:ring-[#ff6b2b]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#ff6b2b] hover:bg-[#e0561a] disabled:bg-stone-300 dark:disabled:bg-zinc-800 text-white rounded-2xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-stone-500 dark:text-zinc-400">Already registered? </span>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                  className="text-xs text-[#ff6b2b] font-bold hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {mode === 'forgot' && (
            <div>
              <form onSubmit={handleForgotReset} className="space-y-4">
                <p className="text-xs text-stone-500 dark:text-zinc-400 mb-2 leading-relaxed">
                  Enter your registered Email and Full Name to reset your password.
                </p>

                <div>
                  <label className="block text-xs font-extrabold font-mono text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700/80 rounded-2xl text-sm text-stone-950 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#ff6b2b] dark:focus:border-[#ff6b2b] focus:ring-1 focus:ring-[#ff6b2b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold font-mono text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Registered Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter registered full name"
                      className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700/80 rounded-2xl text-sm text-stone-950 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#ff6b2b] dark:focus:border-[#ff6b2b] focus:ring-1 focus:ring-[#ff6b2b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold font-mono text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700/80 rounded-2xl text-sm text-stone-950 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#ff6b2b] focus:ring-1 focus:ring-[#ff6b2b]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#ff6b2b] hover:bg-[#e0561a] text-white rounded-2xl text-sm font-extrabold shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? 'Updating Password...' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                  className="w-full py-2 text-xs text-stone-500 dark:text-zinc-400 hover:text-black dark:hover:text-white font-bold flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </button>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
