

import React from 'react';
import { Icon, IconName } from './Icon';

interface Section {
    id: string;
    title: string;
    icon: IconName;
    content: React.ReactNode;
}

const sections: Section[] = [
    {
        id: 'agreement',
        title: '1. Agreement to Terms',
        icon: 'documentDuplicate',
        content: <p>By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service. This agreement is effective as of your first use of the platform.</p>
    },
    {
        id: 'accounts',
        title: '2. Accounts',
        icon: 'userCircle',
        content: (
            <>
                <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>
            </>
        ),
    },
    {
        id: 'the-service',
        title: '3. The Service',
        icon: 'briefcase',
        content: (
            <>
                 <p>VerifiedHire provides a platform for job seekers to create verified professional profiles and for employers to find and connect with this verified talent. We reserve the right to modify or discontinue the Service at any time without notice.</p>
                <div className="mt-4 p-4 rounded-lg bg-slate-100 dark:bg-indigo-900 border border-slate-200 dark:border-indigo-800">
                    <h4 className="font-semibold text-slate-800 dark:text-white">For Job Seekers:</h4>
                    <p className="mt-2">You agree to provide accurate and truthful information for your profile. You grant us the right to review and verify the documents and information you submit. Misrepresentation or fraudulent information will result in immediate termination of your account.</p>
                </div>
                <div className="mt-4 p-4 rounded-lg bg-slate-100 dark:bg-indigo-900 border border-slate-200 dark:border-indigo-800">
                    <h4 className="font-semibold text-slate-800 dark:text-white">For Employers:</h4>
                    <p className="mt-2">You agree to use the information of job seekers solely for legitimate recruitment purposes. You may not use the data for any other purpose, including marketing or selling the data to third parties.</p>
                </div>
            </>
        ),
    },
    {
        id: 'termination',
        title: '4. Termination',
        icon: 'xCircle',
        content: <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>
    },
    {
        id: 'liability',
        title: '5. Limitation of Liability',
        icon: 'shieldCheck',
        content: <p>In no event shall VerifiedHire, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
    },
    {
        id: 'governing-law',
        title: '6. Governing Law',
        icon: 'globeAlt',
        content: <p>These Terms shall be governed and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.</p>
    },
    {
        id: 'contact-us',
        title: '7. Contact Us',
        icon: 'mail',
        content: <p>If you have any questions about these Terms, please contact us at <a href="mailto:legal@verifiedhire.com" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300">legal@verifiedhire.com</a>.</p>
    }
];

const LegalSection: React.FC<{ section: Section }> = ({ section }) => (
    <section id={section.id} className="mb-12 scroll-mt-24">
        <div className="flex items-center mb-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                <Icon name={section.icon} className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="ml-4 text-2xl font-bold text-slate-800 dark:text-white">{section.title}</h2>
        </div>
        <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed lg:pl-16">
            {section.content}
        </div>
    </section>
);

export const TermsOfServicePage: React.FC = () => {
    const handleNavClick = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="bg-white dark:bg-indigo-950 py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 mb-4">
                            <Icon name="scale" className="h-9 w-9 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl">
                            Terms of Service
                        </h1>
                        <p className="mt-4 text-slate-500 dark:text-indigo-300">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
                         <aside className="lg:w-1/3 xl:w-1/4">
                            <div className="lg:sticky lg:top-28">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-indigo-300 mb-4">On this page</h3>
                                <nav>
                                    <ul className="space-y-2">
                                        {sections.map(section => (
                                            <li key={section.id}>
                                                <button 
                                                    onClick={() => handleNavClick(section.id)}
                                                    className="w-full text-left text-slate-600 dark:text-indigo-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-indigo-900 p-2 rounded-md transition-colors"
                                                >
                                                    {section.title}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </aside>

                        <main className="lg:w-2/3 xl:w-3/4">
                            <div className="prose prose-lg prose-indigo dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 mb-12">
                                <p className="lead !text-lg !text-slate-500 dark:!text-indigo-300">
                                   Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the VerifiedHire platform (the "Service") operated by VerifiedHire ("us", "we", or "our"). Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms.
                                </p>
                            </div>
                            {sections.map(section => (
                                <LegalSection key={section.id} section={section} />
                            ))}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};