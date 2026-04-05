
import React from 'react';
import { Icon, IconName } from './Icon';

const teamMembers = [
  { name: 'Jenrick Kibet', role: 'CEO & Founder', imageUrl: 'https://i.pravatar.cc/150?u=ceo' },
  { name: 'Evans Kwambai', role: 'Chief Technology Officer', imageUrl: 'https://i.pravatar.cc/150?u=cto' },
  { name: 'Linda Okumu', role: 'Head of Operations', imageUrl: 'https://i.pravatar.cc/150?u=coo' },
  { name: 'Felix Nyariki', role: 'Lead Verifications Officer', imageUrl: 'https://i.pravatar.cc/150?u=lvo' },
];

const AboutSection: React.FC<{ title: string, content: string, icon?: IconName }> = ({ title, content, icon }) => (
    <div className="py-10 border-b border-slate-100 dark:border-indigo-900/50 last:border-0">
        <div className="flex items-start gap-4">
            {icon && <Icon name={icon} className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />}
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-slate-600 dark:text-indigo-200 leading-relaxed">{content}</p>
            </div>
        </div>
    </div>
);

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-indigo-950 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-6xl">
              The <span className="text-indigo-600 dark:text-indigo-400">Verified</span>Hire Story
            </h1>
            <p className="mt-6 text-xl text-slate-600 dark:text-indigo-200 max-w-3xl mx-auto">
              Redefining trust in the Kenyan job market through meticulous verification and cutting-edge technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <AboutSection 
                title="1. Our Genesis"
                content="VerifiedHire was founded in 2024 to address the critical gap in trust within the recruitment industry. We saw a market where credentials were often taken at face value, leading to poor hiring decisions and missed opportunities for genuine talent."
                icon="sparkles"
            />
            <AboutSection 
                title="2. The Core Mission"
                content="Our mission is to empower every professional in Kenya to prove their worth through verified achievements, and every employer to hire with absolute certainty."
                icon="shieldCheck"
            />
            <AboutSection 
                title="3. Radical Transparency"
                content="We believe in a world where hiring is based on facts, not just claims. Our verification process is transparent, thorough, and unbiased."
                icon="globeAlt"
            />
            <AboutSection 
                title="4. Innovation at Heart"
                content="We leverage the latest in AI and cloud technology to streamline the verification process, making it faster and more accurate than traditional methods."
                icon="cog"
            />
            <AboutSection 
                title="5. Integrity First"
                content="Integrity is our North Star. We never compromise on the quality of our verifications, ensuring that our 'Verified' badge remains the gold standard in Kenya."
                icon="checkCircle"
            />
            <AboutSection 
                title="6. Empowering Job Seekers"
                content="We provide job seekers with the tools to build a credible professional identity that stands out in a crowded market."
                icon="userPlus"
            />
            <AboutSection 
                title="7. Supporting Employers"
                content="We help companies reduce hiring risks, save time, and build high-performing teams by providing access to a pre-vetted talent pool."
                icon="buildingOffice"
            />
            <AboutSection 
                title="8. Community Impact"
                content="By improving hiring efficiency, we contribute to the overall economic growth of Kenya, helping the right people find the right roles."
                icon="userGroup"
            />
            <AboutSection 
                title="9. Data Privacy Excellence"
                content="We treat user data with the utmost respect, implementing state-of-the-art security measures to ensure privacy and compliance with all local laws."
                icon="lockClosed"
            />
            <AboutSection 
                title="10. Continuous Improvement"
                content="We are constantly evolving our processes and technology based on feedback from our community of users and partners."
                icon="arrowTrendingUp"
            />
            <AboutSection 
                title="11. Our Global Vision"
                content="While we start in Kenya, our vision is to expand our verified talent model across Africa and eventually the globe."
                icon="globeAlt"
            />
            <AboutSection 
                title="12. Ethical AI Usage"
                content="We use AI responsibly to enhance human decision-making, not replace it. Our agents always have the final say in the verification process."
                icon="sparkles"
            />
            <AboutSection 
                title="13. Diversity & Inclusion"
                content="We promote merit-based hiring, which naturally fosters a more diverse and inclusive workforce by focusing on verified skills."
                icon="scale"
            />
            <AboutSection 
                title="14. Sustainable Growth"
                content="We are building a business that is sustainable for the long term, focusing on value creation for all our stakeholders."
                icon="circleStack"
            />
            <AboutSection 
                title="15. Customer-Centricity"
                content="Everything we do is driven by the needs of our job seekers and employers. Their success is our success."
                icon="phone"
            />
            <AboutSection 
                title="16. Professional Standards"
                content="We adhere to the highest professional standards in recruitment and verification, setting a benchmark for the industry."
                icon="academicCap"
            />
            <AboutSection 
                title="17. Collaborative Ecosystem"
                content="We work closely with educational institutions, government bodies, and industry leaders to ensure our verification data is accurate."
                icon="userGroup"
            />
            <AboutSection 
                title="18. Scalable Solutions"
                content="Our platform is designed to handle the needs of everyone from individual freelancers to large multinational corporations."
                icon="serverStack"
            />
            <AboutSection 
                title="19. Transparent Pricing"
                content="We offer clear, honest pricing models that reflect the value we provide, with no hidden costs."
                icon="dollarSign"
            />
            <AboutSection 
                title="20. Our Commitment"
                content="We are committed to being the most trusted partner in your professional journey, whether you're hiring or being hired."
                icon="shieldCheck"
            />
          </div>

          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Meet the Visionaries</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {teamMembers.map(member => (
                <div key={member.name} className="group text-center">
                  <div className="relative inline-block">
                    <img className="mx-auto h-32 w-32 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300" src={member.imageUrl} alt={member.name} />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10"></div>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">{member.name}</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
