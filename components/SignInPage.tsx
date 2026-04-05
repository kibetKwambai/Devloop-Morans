

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
  onNavigate: (view: 'signup' | 'forgotpassword' | 'admin') => void;
  onAdminClick?: () => void;
  children: React.ReactNode;
}> = ({ title, onNavigate, onAdminClick, children }) => {
  return (
    <div className="bg-white dark:bg-indigo-900 px-4 py-8 shadow sm:rounded-lg sm:px-10 relative overflow-hidden">
      {onAdminClick && (
        <button 
          onClick={onAdminClick}
          className="absolute top-0 right-0 bg-white dark:bg-slate-100 px-4 py-2 text-[11px] font-extrabold uppercase tracking-widest text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 rounded-bl-xl shadow-md border-l border-b border-indigo-100 dark:border-indigo-800"
        >
          Admin Portal
        </button>
      )}
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

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-indigo-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-indigo-900 px-2 text-slate-500 dark:text-indigo-300">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-3">
            <button className="inline-flex w-full justify-center rounded-md bg-white dark:bg-indigo-800 px-3 py-2 text-slate-500 dark:text-indigo-300 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-indigo-700 hover:bg-slate-50 dark:hover:bg-indigo-700 focus:outline-offset-0">
              <Icon name="google" className="h-5 w-5" />
            </button>
            <button className="inline-flex w-full justify-center rounded-md bg-white dark:bg-indigo-800 px-3 py-2 text-slate-500 dark:text-indigo-300 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-indigo-700 hover:bg-slate-50 dark:hover:bg-indigo-700 focus:outline-offset-0">
              <Icon name="facebook" className="h-5 w-5" />
            </button>
            <button className="inline-flex w-full justify-center rounded-md bg-white dark:bg-indigo-800 px-3 py-2 text-slate-500 dark:text-indigo-300 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-indigo-700 hover:bg-slate-50 dark:hover:bg-indigo-700 focus:outline-offset-0">
              <Icon name="linkedin" className="h-5 w-5" />
            </button>
            <button className="inline-flex w-full justify-center rounded-md bg-white dark:bg-indigo-800 px-3 py-2 text-slate-500 dark:text-indigo-300 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-indigo-700 hover:bg-slate-50 dark:hover:bg-indigo-700 focus:outline-offset-0">
              <Icon name="microsoft" className="h-5 w-5" />
            </button>
          </div>
        </div>

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
  const [isAdminView, setIsAdminView] = React.useState(false);

  const jobSeekerCard = (
    <AuthCard title="Job Seeker" onNavigate={onNavigate as any}>
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
    <AuthCard 
      title={isAdminView ? "Administrator" : "Employer"} 
      onNavigate={onNavigate as any}
      onAdminClick={() => setIsAdminView(!isAdminView)}
    >
        <button
            type="button"
            onClick={() => onLogin(isAdminView ? UserRole.Admin : UserRole.Employer)}
            className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all transform hover:scale-[1.02] ${isAdminView ? 'bg-rose-600 hover:bg-rose-500' : 'bg-slate-700 hover:bg-slate-600'}`}
        >
            <Icon name={isAdminView ? "shieldCheck" : "userGroup"} className="-ml-1 mr-3 h-5 w-5" />
            Continue as {isAdminView ? "Admin" : "Employer"}
        </button>
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
              {employerCard}
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
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={() => onLogin(UserRole.Agent)}
            className="flex items-center px-6 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-all text-sm font-semibold shadow-sm"
          >
            <Icon name="shieldCheck" className="h-4 w-4 mr-2" />
            Agent Login
          </button>
          <button 
            onClick={() => onLogin(UserRole.Admin)}
            className="flex items-center px-6 py-2 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-sm font-semibold shadow-sm"
          >
            <Icon name="shieldCheck" className="h-4 w-4 mr-2" />
            Admin Portal Login
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-5xl">
        {renderCards()}
      </div>
    </div>
  );
};