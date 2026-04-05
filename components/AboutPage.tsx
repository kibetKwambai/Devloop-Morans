
import React from 'react';
import { Icon } from './Icon';

const teamMembers = [
  { name: 'Jenrick Kibet', role: 'CEO & Founder', imageUrl: 'https://i.pravatar.cc/150?u=ceo' },
  { name: 'Evans Kwambai', role: 'Chief Technology Officer', imageUrl: 'https://i.pravatar.cc/150?u=cto' },
  { name: 'Linda Okumu', role: 'Head of Operations', imageUrl: 'https://i.pravatar.cc/150?u=coo' },
  { name: 'Felix Nyariki', role: 'Lead Verifications Officer', imageUrl: 'https://i.pravatar.cc/150?u=lvo' },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-indigo-950 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl">
              About <span className="text-indigo-600 dark:text-indigo-400">Verified</span>Hire
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-indigo-200">
              We are on a mission to revolutionize the hiring landscape in Kenya by building a foundation of trust and transparency between employers and job seekers.
            </p>
          </div>

          <div className="mt-16 prose prose-lg prose-indigo dark:prose-invert mx-auto text-slate-600 dark:text-indigo-200">
            <h2>Our Story</h2>
            <p>
              VerifiedHire was born from a simple observation: the traditional hiring process is broken. Employers spend countless hours sifting through resumes, uncertain of the qualifications presented. Job seekers struggle to stand out and prove their skills and experience. We knew there had to be a better way.
            </p>
            <p>
              We created a platform where every candidate's credentials—from work experience to education—are meticulously verified by our expert team. This simple act of verification creates a trusted ecosystem where companies can hire with confidence and talented professionals can let their verified skills speak for themselves.
            </p>

            <h2>Our Vision</h2>
            <p>
              Our vision is to become the most trusted talent marketplace in Africa, where merit and verified qualifications are the primary drivers of career opportunities. We believe that by ensuring authenticity, we can unlock potential, foster growth, and build stronger teams and careers.
            </p>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">Meet the Team</h2>
            <p className="mt-4 text-center text-slate-500 dark:text-indigo-300">The passionate individuals dedicated to building a better way to hire.</p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map(member => (
                <div key={member.name} className="text-center">
                  <img className="mx-auto h-24 w-24 rounded-full object-cover" src={member.imageUrl} alt={member.name} />
                  <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">{member.name}</h3>
                  <p className="text-indigo-600 dark:text-indigo-400">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};