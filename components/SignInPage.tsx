

import React from 'react';
import { Icon } from './Icon';
import { UserRole } from '../types';

interface SignInPageProps {
  onLogin: (role: UserRole) => void;
  onNavigate: (view: string) => void;
  showRole?: 'jobSeeker' | 'employer' | 'all';
}

const AuthCard: React.FC<{
  title: string;
  onNavigate: (view: 'signup' | 'forgotpassword') => void;
  children: React.ReactNode;
}> = ({ title, onNavigate, children }) => {
  return (
    <div className="bg-white dark:bg-indigo-900 px-4 py-8 shadow sm:rounded-lg sm:px-10">
      <h3 className="text-xl font-bold text-center text-slate-800 dark:text-white">{title}</h3>
      <div className="mt-6">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); }}>
          <div>
            <label htmlFor={`${title}-email`} className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
              Email address
            </label>
            <div className="mt-2">
              <input
                id={`${title}-email`}
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={title.includes('Seeker') ? 'amani.wanjiku@example.com' : 'employer@example.com'}
                className="block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 bg-white dark:bg-indigo-800 dark:text-white dark:ring-indigo-700 text-slate-900"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${title}-password`} className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
              Password
            </label>
            <div className="mt-2">
              <input
                id={`${title}-password`}
                name="password"
                type="password"
                autoComplete="current-password"
                required
                defaultValue="password123"
                className="block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 bg-white dark:bg-indigo-800 dark:text-white dark:ring-indigo-700 text-slate-900"
              />
            </div>
          </div>
          <div className="text-sm text-right">
            <button type="button" onClick={() => onNavigate('forgotpassword')} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              Forgot password?
            </button>
          </div>
          <div>
            {children}
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-indigo-200">
          Not a member?{' '}
          <button type="button" onClick={() => onNavigate('signup')} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

export const SignInPage: React.FC<SignInPageProps> = ({ onLogin, onNavigate, showRole = 'all' }) => {
  const jobSeekerCard = (
    <AuthCard title="Job Seeker" onNavigate={onNavigate}>
      <button
        type="button"
        onClick={() => onLogin(UserRole.JobSeeker)}
        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all transform hover:scale-[1.02]"
      >
        <Icon name="briefcase" className="-ml-1 mr-3 h-5 w-5" />
        Continue as Job Seeker
      </button>
    </AuthCard>
  );

  const employerCard = (
    <AuthCard title="Employer" onNavigate={onNavigate}>
        <button
            type="button"
            onClick={() => onLogin(UserRole.Employer)}
            className="inline-flex w-full justify-center rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 transition-all transform hover:scale-[1.02]"
        >
            <Icon name="userGroup" className="-ml-1 mr-3 h-5 w-5" />
            Continue as Employer
        </button>
    </AuthCard>
  );

  const employerAdminCard = (
    <AuthCard title="Employer / Admin" onNavigate={onNavigate}>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onLogin(UserRole.Employer)}
          className="inline-flex w-full justify-center rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 transition-all transform hover:scale-[1.02]"
        >
          <Icon name="userGroup" className="-ml-1 mr-3 h-5 w-5" />
          Continue as Employer
        </button>
        <button
          type="button"
          onClick={() => onLogin(UserRole.Admin)}
          className="inline-flex w-full justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 transition-all transform hover:scale-[1.02]"
        >
          <Icon name="shieldCheck" className="-ml-1 mr-3 h-5 w-5" />
          Continue as Admin
        </button>
      </div>
    </AuthCard>
  );
  
  const renderCards = () => {
      if (showRole === 'jobSeeker') {
          return <div className="sm:mx-auto sm:w-full sm:max-w-md">{jobSeekerCard}</div>;
      }

      if (showRole === 'employer') {
          return <div className="sm:mx-auto sm:w-full sm:max-w-md">{employerCard}</div>;
      }
      
      return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {jobSeekerCard}
              {employerAdminCard}
          </div>
      );
  }

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white dark:bg-indigo-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-indigo-200">
          Sign in to continue your journey with VerifiedHire.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-5xl">
        {renderCards()}
      </div>
    </div>
  );
};