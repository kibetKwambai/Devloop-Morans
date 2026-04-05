
import React from 'react';
import { Icon } from './Icon';

const jobOpenings = [
  {
    title: 'Senior Frontend Engineer (React)',
    location: 'Nairobi, Kenya (Remote-friendly)',
    type: 'Full-time',
    description: 'We are looking for an experienced Frontend Engineer to join our core product team. You will be responsible for building beautiful, intuitive, and high-performance user interfaces that power the VerifiedHire platform.'
  },
  {
    title: 'Verifications Officer',
    location: 'Nairobi, Kenya',
    type: 'Full-time',
    description: 'As a Verifications Officer, you will be on the front lines of our mission. You will be responsible for meticulously reviewing and verifying candidate documents, ensuring the integrity of our platform.'
  },
  {
    title: 'Marketing & Community Manager',
    location: 'Nairobi, Kenya',
    type: 'Full-time',
    description: 'Join us to build and nurture the VerifiedHire community. You will lead our marketing efforts, engage with users, and tell the story of how we are changing the hiring landscape in Kenya.'
  },
];

export const CareersPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-indigo-950 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl">
              Careers at <span className="text-indigo-600 dark:text-indigo-400">Verified</span>Hire
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-indigo-200">
              Join our passionate team and help us build the future of hiring in Africa. We're looking for talented, mission-driven individuals to help us grow.
            </p>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Current Openings</h2>
            <div className="mt-8 space-y-8">
              {jobOpenings.map((job) => (
                <div key={job.title} className="bg-slate-50 dark:bg-indigo-900/50 p-6 rounded-lg border border-slate-200 dark:border-indigo-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">{job.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-indigo-300">
                        <span className="font-medium">{job.location}</span> &middot; <span>{job.type}</span>
                      </p>
                    </div>
                    <button className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                  <p className="mt-4 text-slate-600 dark:text-indigo-200">{job.description}</p>
                  <button className="mt-4 sm:hidden w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                      Apply Now
                  </button>
                </div>
              ))}
            </div>
            
             <div className="mt-12 text-center bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Don't see a role for you?</h3>
                <p className="mt-2 text-slate-600 dark:text-indigo-200">We are always looking for talented people. Send your resume and a cover letter to{' '}
                  <a href="mailto:careers@verifiedhire.com" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">careers@verifiedhire.com</a>.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};