import React, { useState } from 'react';
import { Icon } from './Icon';
import { useAppContext } from './AppContext';
import { JobSeekerProfile, VerificationStatus, UserRole } from '../types';
import { VerifiedHireLogo } from './VerifiedHireLogo';

interface SignUpPageProps {
  onNavigate: (view: string, targetRole?: 'jobSeeker' | 'employer' | 'agent' | 'admin' | 'all', options?: any) => void;
  onLogin?: (role: UserRole, identifier?: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate, onLogin }) => {
  const { addUser, loginUser } = useAppContext();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'jobSeeker' | 'employer' | 'agent'>('jobSeeker');
  const [specialization, setSpecialization] = useState('Technology & Software');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      let mappedRole = UserRole.JobSeeker;
      if (role === 'employer') mappedRole = UserRole.Employer;
      if (role === 'agent') mappedRole = UserRole.Agent;

      const newSeeker: Omit<JobSeekerProfile, 'id'> = {
        name: fullName.trim(),
        email: email.trim(),
        phone: '+254 7' + Math.floor(10000000 + Math.random() * 90000000),
        location: 'Nairobi, Kenya',
        photoUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
        headline: role === 'jobSeeker' 
          ? `${specialization} Professional (In Verification)` 
          : role === 'employer' 
          ? 'Enterprise Talent Specialist' 
          : 'Accredited Verification Agent',
        verificationStatus: VerificationStatus.DRAFT,
        workExperience: [
          {
            id: `exp_${Date.now()}`,
            title: role === 'employer' ? 'Talent Specialist' : 'Professional Practitioner',
            company: 'Verified Network Member',
            location: 'Nairobi, Kenya',
            startDate: 'Jan 2023',
            endDate: 'Present',
            description: 'Active member of the VerifiedHire credential ecosystem.',
            responsibilities: ['Profile verification in progress'],
            isVerified: false,
          }
        ],
        education: [
          {
            id: `edu_${Date.now()}`,
            institution: 'University of Nairobi',
            degree: 'Bachelor of Science',
            fieldOfStudy: specialization,
            startDate: '2018',
            endDate: '2022',
            isVerified: false,
          }
        ],
        skills: [
          { id: `sk_${Date.now()}_1`, name: specialization, type: 'Hard' },
          { id: `sk_${Date.now()}_2`, name: 'Professional Integrity', type: 'Soft' }
        ],
        documents: [],
        certifications: [],
        jobInterests: ['Full-time', 'Enterprise Requisitions'],
        languages: ['English', 'Swahili'],
      };

      const createdProfile = addUser(newSeeker);
      loginUser(createdProfile.email, mappedRole);
      setIsLoading(false);

      if (onLogin) {
        onLogin(mappedRole, createdProfile.email);
      } else {
        onNavigate('signin', role as any);
      }
    }, 450);
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
          Create Your Verified Account
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-indigo-300">
          Already registered?{' '}
          <button 
            type="button" 
            onClick={() => onNavigate('signin')} 
            className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline"
          >
            Sign in here
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-xl">
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-3xl border border-slate-200/70 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                I am creating an account as:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('jobSeeker')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                    role === 'jobSeeker'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Icon name="briefcase" className="h-5 w-5 mb-1 text-indigo-600 dark:text-indigo-400" />
                  <span>Job Seeker</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('employer')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                    role === 'employer'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Icon name="userGroup" className="h-5 w-5 mb-1 text-indigo-600 dark:text-indigo-400" />
                  <span>Employer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('agent')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                    role === 'agent'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Icon name="shieldCheck" className="h-5 w-5 mb-1 text-indigo-600 dark:text-indigo-400" />
                  <span>Agent</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 font-semibold">
                <Icon name="exclamationCircle" className="h-4 w-4 flex-shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                {role === 'employer' ? 'Company / HR Contact Name' : 'Full Legal Name'}
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === 'employer' ? 'e.g. Safaricom HR Team' : 'e.g. Amani Wanjiku'}
                required
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Work or Professional Email
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                required
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="specialization" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Industry / Focus
              </label>
              <select
                id="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              >
                <option value="Technology & Software">Technology & Software Architecture</option>
                <option value="Aviation & Flight Operations">Aviation & Flight Operations</option>
                <option value="Fintech & Banking">FinTech & Financial Services</option>
                <option value="Healthcare & Clinical Medicine">Healthcare & Clinical Medicine</option>
                <option value="Legal & Statutory Compliance">Legal & Statutory Compliance</option>
                <option value="Creative & Product Design">Creative & Product Design</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-bold rounded-2xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating your verified vault...</span>
                </>
              ) : (
                <>
                  <span>Create Verified Account</span>
                  <Icon name="arrowRight" className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              By creating an account, you agree to our{' '}
              <button 
                type="button"
                onClick={() => onNavigate('terms')} 
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button 
                type="button"
                onClick={() => onNavigate('privacy')} 
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Privacy Policy
              </button>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
