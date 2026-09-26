import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { UserRole, VerificationStatus } from '../types';
import { VerifiedHireLogo } from './VerifiedHireLogo';
import { useAppContext, TEST_ACCOUNTS, TestAccountDefinition } from './AppContext';

interface SignInPageProps {
  onLogin: (role: UserRole, identifier?: string) => void;
  onNavigate: (view: string, targetRole?: 'jobSeeker' | 'employer' | 'agent' | 'admin' | 'all', options?: any) => void;
  showRole?: 'jobSeeker' | 'employer' | 'agent' | 'admin' | 'all';
  redirectNotice?: string;
}

interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  title: string;
  avatar: string;
  badge: string;
  verified: boolean;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onLogin,
  onNavigate,
  showRole = 'all',
  redirectNotice,
}) => {
  const { profiles, loginUser, signInWithGoogle, isFirebaseConnected, firebaseUser } = useAppContext();

  // Active role tab state
  const getInitialRole = (): UserRole => {
    if (showRole === 'employer') return UserRole.Employer;
    if (showRole === 'agent') return UserRole.Agent;
    if (showRole === 'admin') return UserRole.Admin;
    return UserRole.JobSeeker;
  };

  const [activeTab, setActiveTab] = useState<UserRole>(getInitialRole);
  const [email, setEmail] = useState<string>('amani.wanjiku@example.com');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState<string>('');

  // Update email defaults when tab switches
  useEffect(() => {
    if (showRole && showRole !== 'all') {
      if (showRole === 'employer') setActiveTab(UserRole.Employer);
      else if (showRole === 'agent') setActiveTab(UserRole.Agent);
      else if (showRole === 'admin') setActiveTab(UserRole.Admin);
      else setActiveTab(UserRole.JobSeeker);
    }
  }, [showRole]);

  useEffect(() => {
    setErrorMessage('');
    if (activeTab === UserRole.JobSeeker) {
      setEmail('amani.wanjiku@example.com');
    } else if (activeTab === UserRole.Employer) {
      setEmail('talent@safaricom.co.ke');
    } else if (activeTab === UserRole.Agent) {
      setEmail('agent.wachira@verifiedhire.africa');
    } else if (activeTab === UserRole.Admin) {
      setEmail('admin.compliance@verifiedhire.africa');
    }
  }, [activeTab]);

  // Use centralized TEST_ACCOUNTS catalogue
  const demoAccounts = TEST_ACCOUNTS;

  const selectDemoAccount = (account: TestAccountDefinition) => {
    setActiveTab(account.role);
    setEmail(account.email);
    setPassword('password123');
    setErrorMessage('');
  };

  const handleQuickLogin = (account: TestAccountDefinition) => {
    setActiveTab(account.role);
    setEmail(account.email);
    setPassword('password123');
    setIsLoading(true);
    setErrorMessage('');
    setSuccessNotice(`Authenticating as ${account.name}...`);

    setTimeout(() => {
      const u = loginUser(account.id, account.role);
      setIsLoading(false);
      onLogin(account.role, u.id);
    }, 250);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      try {
        const user = loginUser(email, activeTab);
        setIsLoading(false);
        setSuccessNotice(`Authentication successful as ${user.name || email}. Redirecting...`);
        setTimeout(() => {
          onLogin(activeTab, user ? user.id : email);
        }, 300);
      } catch (err) {
        setIsLoading(false);
        setErrorMessage('Failed to sign in. Please check your credentials.');
      }
    }, 450);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const success = await signInWithGoogle();
      if (success) {
        setSuccessNotice('Signed in with Google successfully. Redirecting...');
        setTimeout(() => {
          onLogin(activeTab, firebaseUser?.email || email);
        }, 350);
      } else {
        // Fallback to demo account for testing preview
        const demoUser = demoAccounts[activeTab][0];
        const user = loginUser(demoUser.email, activeTab);
        setSuccessNotice(`Connected to session. Redirecting...`);
        setTimeout(() => {
          onLogin(activeTab, user.id);
        }, 350);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google Sign-in failed. Please try with demo credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      handleGoogleSignIn();
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const demoUser = demoAccounts[activeTab][0];
      const user = loginUser(demoUser.email, activeTab);
      setIsLoading(false);
      onLogin(activeTab, user.id);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <VerifiedHireLogo
          variant="stacked"
          size="lg"
          showTagline={false}
          onClick={() => onNavigate('landing')}
        />
        <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Sign in to VerifiedHire
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-indigo-300">
          Cryptographic talent verification & hiring platform
        </p>

        {/* Live Firebase Connectivity Badge */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold ${
            isFirebaseConnected 
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
          }`}>
            <span className={`h-2 w-2 rounded-full ${isFirebaseConnected ? 'bg-emerald-500' : 'bg-indigo-500'} animate-pulse`} />
            <span>Firebase &amp; Google Meet OAuth Ready</span>
          </span>
        </div>

        {redirectNotice && (
          <div className="mt-4 p-3.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl flex items-center gap-2.5 text-xs text-indigo-700 dark:text-indigo-300 font-medium text-left shadow-sm">
            <Icon name="sparkles" className="h-4 w-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span>{redirectNotice}</span>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-xl">
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-3xl border border-slate-200/70 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-xl">
          
          {/* Role Navigation Tabs */}
          <div className="mb-8">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 text-center sm:text-left">
              Select Your Portal Role
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveTab(UserRole.JobSeeker)}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === UserRole.JobSeeker
                    ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon name="briefcase" className="h-4 w-4 mb-1" />
                <span>Job Seeker</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab(UserRole.Employer)}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === UserRole.Employer
                    ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon name="userGroup" className="h-4 w-4 mb-1" />
                <span>Employer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab(UserRole.Agent)}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === UserRole.Agent
                    ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon name="shieldCheck" className="h-4 w-4 mb-1" />
                <span>Agent</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab(UserRole.Admin)}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === UserRole.Admin
                    ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon name="lockClosed" className="h-4 w-4 mb-1" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Quick 1-Click Demo Profiles */}
          <div className="mb-8 p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <Icon name="sparkles" className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                Quick 1-Click Test Accounts ({demoAccounts[activeTab].length})
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Click to populate</span>
            </div>

            <div className="space-y-2">
              {demoAccounts[activeTab].map((acc) => {
                const isSelected = email.toLowerCase() === acc.email.toLowerCase();
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleQuickLogin(acc)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                        : 'bg-white/70 dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="h-10 w-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {acc.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                            {acc.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          {acc.title}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickLogin(acc);
                      }}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                    >
                      <span>1-Click Sign In</span>
                      <Icon name="arrowRight" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controlled Form */}
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 font-semibold">
                <Icon name="exclamationCircle" className="h-4 w-4 flex-shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successNotice && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 font-semibold animate-pulse">
                <Icon name="checkCircle" className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                <span>{successNotice}</span>
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Icon name="briefcase" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="auth-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgotpassword')}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Icon name="lockClosed" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 dark:text-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <Icon name={showPassword ? 'eye' : 'eyeSlash'} className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Remember me for 30 days
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-bold rounded-2xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>
                    Sign In as{' '}
                    {activeTab === UserRole.JobSeeker
                      ? 'Job Seeker'
                      : activeTab === UserRole.Employer
                      ? 'Employer'
                      : activeTab === UserRole.Agent
                      ? 'Accredited Agent'
                      : 'Administrator'}
                  </span>
                  <Icon name="arrowRight" className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Social OAuth Dividers */}
          <div className="mt-8">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Or Instant Single Sign-On
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                title="Sign in with Google (Firebase & Meet Ready)"
                className="flex items-center justify-center p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300 cursor-pointer group"
              >
                <Icon name="google" className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('LinkedIn')}
                title="Sign in with LinkedIn"
                className="flex items-center justify-center p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <Icon name="linkedin" className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('Microsoft')}
                title="Sign in with Microsoft"
                className="flex items-center justify-center p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <Icon name="microsoft" className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                title="Sign in with Facebook"
                className="flex items-center justify-center p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <Icon name="facebook" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Don't have a verified account yet?{' '}
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

