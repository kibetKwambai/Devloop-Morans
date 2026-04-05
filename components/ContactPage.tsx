
import React, { useState } from 'react';
import { Icon, IconName } from './Icon';

const ContactInfoItem: React.FC<{ title: string, content: string, icon: IconName }> = ({ title, content, icon }) => (
    <div className="py-6 border-b border-slate-100 dark:border-indigo-900/50 last:border-0">
        <div className="flex items-start gap-4">
            <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-lg">
                <Icon name={icon} className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
                <p className="text-slate-600 dark:text-indigo-200 text-sm leading-relaxed">{content}</p>
            </div>
        </div>
    </div>
);

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const inputClass = "block w-full rounded-xl border-0 py-3 px-4 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-indigo-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 bg-white dark:bg-indigo-800/50 text-slate-900 dark:text-white dark:focus:ring-indigo-500 transition-all";
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-white dark:bg-indigo-950 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-6xl">
              Let's <span className="text-indigo-600 dark:text-indigo-400">Connect</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 dark:text-indigo-200 max-w-2xl mx-auto">
              Whether you're a job seeker, an employer, or a potential partner, we're here to help you navigate the future of hiring.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
                <div className="bg-slate-50 dark:bg-indigo-900/30 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-indigo-800 shadow-xl">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Send us a Message</h2>
                {submitted ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="bg-green-100 dark:bg-green-500/20 p-6 rounded-full mb-6">
                        <Icon name="checkCircle" className="h-16 w-16 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Message Received!</h3>
                    <p className="mt-4 text-lg text-slate-600 dark:text-indigo-200 max-w-md">Thank you for reaching out. Our team will review your inquiry and get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-8 text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Send another message</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-slate-700 dark:text-indigo-100 mb-2">Full Name</label>
                            <input type="text" id="name" placeholder="John Doe" required className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-indigo-100 mb-2">Email Address</label>
                            <input type="email" id="email" placeholder="john@example.com" required className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-bold text-slate-700 dark:text-indigo-100 mb-2">Subject</label>
                        <select id="subject" className={inputClass}>
                            <option>General Inquiry</option>
                            <option>Employer Partnership</option>
                            <option>Verification Support</option>
                            <option>Career Opportunities</option>
                            <option>Press & Media</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-bold text-slate-700 dark:text-indigo-100 mb-2">Your Message</label>
                        <textarea id="message" rows={6} placeholder="How can we help you?" required className={inputClass}></textarea>
                    </div>
                    <div>
                        <button type="submit" className="w-full flex justify-center py-4 px-8 border border-transparent rounded-xl shadow-2xl text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transform hover:scale-[1.02] transition-all">
                        Send Message
                        </button>
                    </div>
                    </form>
                )}
                </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white dark:bg-indigo-900/20 p-8 rounded-3xl border border-slate-100 dark:border-indigo-800 shadow-lg">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Contact Details</h3>
                <div className="space-y-2">
                    <ContactInfoItem 
                        icon="mail"
                        title="1. General Inquiries"
                        content="info@verifiedhire.com - For all general questions about our platform."
                    />
                    <ContactInfoItem 
                        icon="phone"
                        title="2. Direct Support"
                        content="+254 700 000 000 - Available Mon-Fri, 8 AM to 6 PM EAT."
                    />
                    <ContactInfoItem 
                        icon="buildingOffice"
                        title="3. Physical Office"
                        content="123 Business Avenue, Westlands, Nairobi, Kenya."
                    />
                    <ContactInfoItem 
                        icon="userGroup"
                        title="4. Partnership Team"
                        content="partners@verifiedhire.com - For corporate and institutional partnerships."
                    />
                    <ContactInfoItem 
                        icon="shieldCheck"
                        title="5. Verification Desk"
                        content="verify@verifiedhire.com - Specific queries regarding profile verification."
                    />
                    <ContactInfoItem 
                        icon="sparkles"
                        title="6. Media Relations"
                        content="press@verifiedhire.com - For all media and interview requests."
                    />
                    <ContactInfoItem 
                        icon="briefcase"
                        title="7. Careers"
                        content="careers@verifiedhire.com - Join our growing team."
                    />
                    <ContactInfoItem 
                        icon="globeAlt"
                        title="8. International Support"
                        content="global@verifiedhire.com - For inquiries outside of Kenya."
                    />
                    <ContactInfoItem 
                        icon="lockClosed"
                        title="9. Data Privacy"
                        content="privacy@verifiedhire.com - Questions about your data and privacy."
                    />
                    <ContactInfoItem 
                        icon="scale"
                        title="10. Legal Department"
                        content="legal@verifiedhire.com - For all legal and compliance matters."
                    />
                    <ContactInfoItem 
                        icon="academicCap"
                        title="11. Educational Outreach"
                        content="edu@verifiedhire.com - Partnering with universities and colleges."
                    />
                    <ContactInfoItem 
                        icon="cog"
                        title="12. Technical Support"
                        content="tech@verifiedhire.com - Report bugs or technical issues."
                    />
                    <ContactInfoItem 
                        icon="star"
                        title="13. Feedback & Suggestions"
                        content="feedback@verifiedhire.com - We value your input."
                    />
                    <ContactInfoItem 
                        icon="phone"
                        title="14. WhatsApp Support"
                        content="+254 711 111 111 - Quick chat support for job seekers."
                    />
                    <ContactInfoItem 
                        icon="globeAlt"
                        title="15. Regional Offices"
                        content="Mombasa, Kisumu, and Eldoret branches coming soon."
                    />
                    <ContactInfoItem 
                        icon="userPlus"
                        title="16. Affiliate Program"
                        content="affiliates@verifiedhire.com - Earn by referring talent."
                    />
                    <ContactInfoItem 
                        icon="circleStack"
                        title="17. Billing & Finance"
                        content="billing@verifiedhire.com - For all payment-related queries."
                    />
                    <ContactInfoItem 
                        icon="sparkles"
                        title="18. Innovation Lab"
                        content="labs@verifiedhire.com - Explore the future of hiring with us."
                    />
                    <ContactInfoItem 
                        icon="userGroup"
                        title="19. Community Events"
                        content="events@verifiedhire.com - Join our networking sessions."
                    />
                    <ContactInfoItem 
                        icon="checkCircle"
                        title="20. Quality Assurance"
                        content="qa@verifiedhire.com - Ensuring the highest standards."
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
