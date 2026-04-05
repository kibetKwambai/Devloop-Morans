

import React, { useState } from 'react';
import { Icon } from './Icon';
import { useAppContext } from './AppContext';
import { JobSeekerProfile, VerificationStatus, UserRole } from '../types';

interface SignUpPageProps {
  onNavigate: (view: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const { addUser } = useAppContext();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'jobSeeker' | 'employer' | 'agent'>('jobSeeker');
  const [error, setError] = useState('');
  
  const inputFieldClasses = "block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-indigo-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 bg-white dark:bg-indigo-800 text-slate-900 dark:text-white";
  const baseRadioClass = "flex items-center justify-center p-3 rounded-md border cursor-pointer transition-colors bg-white dark:bg-indigo-800 text-slate-700 dark:text-indigo-100 border-slate-300 dark:border-indigo-700 hover:bg-slate-50 dark:hover:bg-indigo-700";
  const activeRadioClass = "border-indigo-600 bg-indigo-100 text-indigo-700 font-semibold dark:bg-indigo-600/30 dark:text-indigo-200 dark:border-indigo-400";


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('All fields are required.');
      return;
    }
    
    // For this demo, we handle Job Seeker, Employer, and Agent sign up.
    if (role === 'jobSeeker') {
        const newSeeker: Omit<JobSeekerProfile, 'id'> = {
            name: fullName,
            email: email,
            phone: 'N/A',
            location: 'N/A',
            photoUrl: `https://i.pravatar.cc/200?u=${email}`,
            headline: 'Newly Registered User',
            verificationStatus: VerificationStatus.DRAFT,
            workExperience: [],
            education: [],
            skills: [],
            documents: [],
            certifications: [],
            jobInterests: [],
            languages: ['English'],
        };
        addUser(newSeeker);
    }
    
    // After successful registration, navigate to sign in page
    onNavigate('signin');
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white dark:bg-indigo-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-indigo-200">
          Already a member?{' '}
          <button onClick={() => onNavigate('signin')} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Sign in here
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-indigo-900 px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
                Full Name
              </label>
              <div className="mt-2">
                <input id="fullName" name="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className={inputFieldClasses} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
                Email address
              </label>
              <div className="mt-2">
                <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className={inputFieldClasses} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
                Password
              </label>
              <div className="mt-2">
                <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputFieldClasses} />
              </div>
            </div>

            <div>
                <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">I am a...</label>
                <fieldset className="mt-2">
                    <legend className="sr-only">User role</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label className={`${baseRadioClass} ${role === 'jobSeeker' ? activeRadioClass : ''}`}>
                            <input type="radio" name="role" value="jobSeeker" checked={role === 'jobSeeker'} onChange={(e) => setRole(e.target.value as any)} className="sr-only" />
                            <Icon name="briefcase" className="h-5 w-5"/>
                            <span className="ml-2">Job Seeker</span>
                        </label>
                         <label className={`${baseRadioClass} ${role === 'employer' ? activeRadioClass : ''}`}>
                            <input type="radio" name="role" value="employer" checked={role === 'employer'} onChange={(e) => setRole(e.target.value as any)} className="sr-only" />
                            <Icon name="userGroup" className="h-5 w-5"/>
                            <span className="ml-2">Employer</span>
                        </label>
                        <label className={`${baseRadioClass} ${role === 'agent' ? activeRadioClass : ''}`}>
                            <input type="radio" name="role" value="agent" checked={role === 'agent'} onChange={(e) => setRole(e.target.value as any)} className="sr-only" />
                            <Icon name="shieldCheck" className="h-5 w-5"/>
                            <span className="ml-2">Agent</span>
                        </label>
                    </div>
                </fieldset>
            </div>
            
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-indigo-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-indigo-900 px-2 text-slate-500 dark:text-indigo-300">Or sign up with</span>
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
        </div>
      </div>
    </div>
  );
};