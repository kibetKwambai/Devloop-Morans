
import React from 'react';
import { Icon, IconName } from './Icon';

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

const CareerBenefit: React.FC<{ title: string, description: string, icon: IconName }> = ({ title, description, icon }) => (
    <div className="py-8 border-b border-slate-100 dark:border-indigo-900/50 last:border-0">
        <div className="flex items-start gap-4">
            <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-xl">
                <Icon name={icon} className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-600 dark:text-indigo-200 leading-relaxed">{description}</p>
            </div>
        </div>
    </div>
);

export const CareersPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-indigo-950 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-6xl">
              Build the Future of <span className="text-indigo-600 dark:text-indigo-400">Trust</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 dark:text-indigo-200 max-w-3xl mx-auto">
              Join a team of innovators, dreamers, and doers dedicated to transforming the hiring landscape in Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mb-20">
            <CareerBenefit 
                icon="sparkles"
                title="1. Mission-Driven Work"
                description="Every line of code you write and every verification you perform directly contributes to a more honest and efficient job market in Kenya."
            />
            <CareerBenefit 
                icon="globeAlt"
                title="2. Remote-First Culture"
                description="We believe in results, not clock-watching. Work from wherever you are most productive, with flexible hours that fit your life."
            />
            <CareerBenefit 
                icon="academicCap"
                title="3. Continuous Learning"
                description="We provide a generous learning budget for courses, certifications, and conferences to help you stay at the top of your game."
            />
            <CareerBenefit 
                icon="shieldCheck"
                title="4. Health & Wellness"
                description="Comprehensive health insurance for you and your family, including mental health support and wellness stipends."
            />
            <CareerBenefit 
                icon="userGroup"
                title="5. Collaborative Environment"
                description="Work with some of the brightest minds in tech and recruitment in a culture that values open communication and mutual respect."
            />
            <CareerBenefit 
                icon="scale"
                title="6. Equity & Ownership"
                description="We want everyone to share in our success. We offer competitive equity packages to all full-time employees."
            />
            <CareerBenefit 
                icon="briefcase"
                title="7. Modern Tech Stack"
                description="Work with the latest technologies, including React, TypeScript, Node.js, and advanced AI models like Gemini."
            />
            <CareerBenefit 
                icon="star"
                title="8. Recognition & Rewards"
                description="We celebrate our wins, big and small. Regular performance reviews and spot bonuses for exceptional work."
            />
            <CareerBenefit 
                icon="phone"
                title="9. Impactful Mentorship"
                description="Learn from experienced leaders and mentor junior team members as we grow together."
            />
            <CareerBenefit 
                icon="cog"
                title="10. Autonomy & Trust"
                description="We hire smart people and trust them to do their jobs. You'll have the autonomy to make decisions and drive projects."
            />
            <CareerBenefit 
                icon="buildingOffice"
                title="11. Beautiful Office Space"
                description="For those who prefer an office environment, we have a modern, vibrant space in the heart of Nairobi."
            />
            <CareerBenefit 
                icon="sparkles"
                title="12. Team Retreats"
                description="Regular off-sites and team-building activities to foster connections and have some fun."
            />
            <CareerBenefit 
                icon="checkCircle"
                title="13. Inclusive Hiring"
                description="We are committed to building a diverse team that reflects the community we serve."
            />
            <CareerBenefit 
                icon="arrowTrendingUp"
                title="14. Career Pathing"
                description="Clear paths for advancement, whether you want to move into management or deepen your technical expertise."
            />
            <CareerBenefit 
                icon="lockClosed"
                title="15. Security-First Mindset"
                description="Join a team that takes data privacy and security seriously, implementing best practices in everything we do."
            />
            <CareerBenefit 
                icon="globeAlt"
                title="16. Global Exposure"
                description="Work on a platform with global ambitions, gaining experience that is relevant on an international scale."
            />
            <CareerBenefit 
                icon="sparkles"
                title="17. Innovation Days"
                description="Dedicated time to work on side projects, experiment with new technologies, and innovate."
            />
            <CareerBenefit 
                icon="userPlus"
                title="18. Referral Bonuses"
                description="Help us find great talent and get rewarded for it with our generous referral program."
            />
            <CareerBenefit 
                icon="circleStack"
                title="19. Financial Planning"
                description="Access to financial advisors and resources to help you manage your wealth and plan for the future."
            />
            <CareerBenefit 
                icon="heart"
                title="20. Work with Heart"
                description="Join a company that truly cares about its employees, its users, and the impact it has on the world."
            />
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Current Openings</h2>
            <div className="space-y-6">
              {jobOpenings.map((job) => (
                <div key={job.title} className="group bg-slate-50 dark:bg-indigo-900/30 p-8 rounded-2xl border border-slate-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                      <p className="mt-2 text-slate-500 dark:text-indigo-300 flex items-center gap-2">
                        <Icon name="globeAlt" className="h-4 w-4" />
                        <span className="font-medium">{job.location}</span>
                        <span className="text-slate-300 dark:text-indigo-800">|</span>
                        <Icon name="briefcase" className="h-4 w-4" />
                        <span>{job.type}</span>
                      </p>
                    </div>
                    <button className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25">
                      Apply Now
                    </button>
                  </div>
                  <p className="mt-6 text-slate-600 dark:text-indigo-200 leading-relaxed">{job.description}</p>
                </div>
              ))}
            </div>
            
             <div className="mt-16 text-center bg-indigo-50 dark:bg-indigo-900/20 p-12 rounded-3xl border border-indigo-100 dark:border-indigo-800">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Don't see a role for you?</h3>
                <p className="mt-4 text-lg text-slate-600 dark:text-indigo-200">We are always looking for exceptional talent. Send your resume and a cover letter to{' '}
                  <a href="mailto:careers@verifiedhire.com" className="font-bold text-indigo-600 hover:underline dark:text-indigo-400">careers@verifiedhire.com</a>.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
