import React, { useState } from 'react';
import { VerifiedHireLogo } from './VerifiedHireLogo';
import { Icon } from './Icon';

interface ForgotPasswordPageProps {
  onNavigate: (view: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center text-center">
        <VerifiedHireLogo 
          variant="stacked" 
          size="lg" 
          showTagline={false}
          onClick={() => onNavigate('landing')}
        />

        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Reset Credentials
        </h2>
        {!submitted ? (
            <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                Enter your registered email address to receive cryptographic password reset credentials.
            </p>
        ) : null}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 p-8 shadow-xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Icon name="checkCircle" className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Check your email</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                If an account with <strong className="text-indigo-600 dark:text-indigo-400">{email}</strong> exists, we have dispatched secure recovery instructions.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => onNavigate('signin')}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@organization.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Send Recovery Link
                </button>
              </div>
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('signin')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Remember your credentials? Return to Sign In
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Security &amp; Support Guidance</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start">
                    <span className="text-indigo-600 dark:text-indigo-400 mr-2 font-bold">•</span>
                    Check your spam or junk folder if the dispatch message is not delivered in 2 minutes.
                </li>
                <li className="flex items-start">
                    <span className="text-indigo-600 dark:text-indigo-400 mr-2 font-bold">•</span>
                    One-time recovery hashes remain valid for 24 hours.
                </li>
                <li className="flex items-start">
                    <span className="text-indigo-600 dark:text-indigo-400 mr-2 font-bold">•</span>
                    Questions? Contact compliance support at <a href="mailto:support@verifiedhire.co.ke" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">support@verifiedhire.co.ke</a>.
                </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
