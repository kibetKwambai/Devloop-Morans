

import React, { useState } from 'react';

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
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white dark:bg-indigo-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Forgot your password?
        </h2>
        {!submitted ? (
            <p className="mt-2 text-center text-sm text-slate-600 dark:text-indigo-200">
                Enter your email address and we'll send you a link to reset it.
            </p>
        ) : null}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-indigo-900 px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {submitted ? (
            <div className="text-center">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Check your email</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-indigo-200">
                If an account with that email exists, we have sent instructions to reset your password.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => onNavigate('signin')}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 bg-white dark:bg-indigo-800 dark:text-white dark:ring-indigo-700"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};