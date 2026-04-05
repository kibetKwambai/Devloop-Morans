

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
        content: <p>By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service. This agreement is effective as of your first use of the platform and constitutes a legally binding contract between you and VerifiedHire.</p>
    },
    {
        id: 'accounts',
        title: '2. Account Registration',
        icon: 'userCircle',
        content: (
            <>
                <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>
            </>
        ),
    },
    {
        id: 'eligibility',
        title: '3. Eligibility',
        icon: 'checkCircle',
        content: <p>You must be at least 18 years of age to use our Service. By using VerifiedHire, you represent and warrant that you have the right, authority, and capacity to enter into this agreement and to abide by all of the terms and conditions of these Terms.</p>
    },
    {
        id: 'verification-process',
        title: '4. Verification Process',
        icon: 'shieldCheck',
        content: (
            <>
                <p>VerifiedHire reserves the right to verify any information provided by job seekers. This includes, but is not limited to, educational background, employment history, and professional certifications.</p>
                <p>By submitting your information, you grant VerifiedHire a non-exclusive, worldwide, royalty-free license to use, copy, and process your information for the sole purpose of verification and profile creation.</p>
            </>
        )
    },
    {
        id: 'employer-obligations',
        title: '5. Employer Obligations',
        icon: 'buildingOffice',
        content: <p>Employers agree to use the Service solely for legitimate recruitment purposes. Any use of candidate data for marketing, sales, or any other non-recruitment purpose is strictly prohibited and will result in immediate account termination and potential legal action.</p>
    },
    {
        id: 'job-seeker-obligations',
        title: '6. Job Seeker Obligations',
        icon: 'academicCap',
        content: <p>Job seekers agree to provide truthful and accurate information. Any attempt to provide fraudulent documents or misrepresent professional experience will result in a permanent ban from the platform and may be reported to relevant authorities.</p>
    },
    {
        id: 'prohibited-activities',
        title: '7. Prohibited Activities',
        icon: 'xCircle',
        content: (
            <ul className="list-disc space-y-2 pl-6">
                <li>Using the service for any illegal purpose.</li>
                <li>Attempting to bypass any security measures.</li>
                <li>Scraping or extracting data from the platform.</li>
                <li>Impersonating any person or entity.</li>
                <li>Posting false, misleading, or defamatory content.</li>
            </ul>
        )
    },
    {
        id: 'intellectual-property',
        title: '8. Intellectual Property',
        icon: 'sparkles',
        content: <p>The Service and its original content, features, and functionality are and will remain the exclusive property of VerifiedHire and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>
    },
    {
        id: 'user-content',
        title: '9. User Content',
        icon: 'edit',
        content: <p>You retain all of your ownership rights in your content. However, by posting content to the Service, you grant us a right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service.</p>
    },
    {
        id: 'subscription-billing',
        title: '10. Subscriptions and Billing',
        icon: 'circleStack',
        content: <p>Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select.</p>
    },
    {
        id: 'refunds',
        title: '11. Refund Policy',
        icon: 'arrowTrendingUp',
        content: <p>Except when required by law, paid subscription fees are non-refundable. We may consider refund requests on a case-by-case basis and at our sole discretion.</p>
    },
    {
        id: 'termination',
        title: '12. Termination',
        icon: 'xCircle',
        content: <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>
    },
    {
        id: 'indemnification',
        title: '13. Indemnification',
        icon: 'shieldCheck',
        content: <p>You agree to defend, indemnify and hold harmless VerifiedHire and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses.</p>
    },
    {
        id: 'limitation-of-liability',
        title: '14. Limitation of Liability',
        icon: 'scale',
        content: <p>In no event shall VerifiedHire, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, or goodwill.</p>
    },
    {
        id: 'disclaimer',
        title: '15. Disclaimer',
        icon: 'sparkles',
        content: <p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied.</p>
    },
    {
        id: 'governing-law',
        title: '16. Governing Law',
        icon: 'globeAlt',
        content: <p>These Terms shall be governed and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions. Any legal action or proceeding related to your access to, or use of, the Service shall be instituted in a court in Nairobi, Kenya.</p>
    },
    {
        id: 'changes-to-terms',
        title: '17. Changes to Terms',
        icon: 'arrowTrendingUp',
        content: <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
    },
    {
        id: 'privacy-policy-ref',
        title: '18. Privacy Policy',
        icon: 'lockClosed',
        content: <p>Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices regarding your personal information.</p>
    },
    {
        id: 'severability',
        title: '19. Severability',
        icon: 'cog',
        content: <p>If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.</p>
    },
    {
        id: 'entire-agreement',
        title: '20. Entire Agreement',
        icon: 'documentDuplicate',
        content: <p>These Terms, together with our Privacy Policy and any other legal notices published by us on the Service, shall constitute the entire agreement between you and VerifiedHire concerning the Service.</p>
    },
    {
        id: 'contact-us',
        title: '21. Contact Us',
        icon: 'mail',
        content: <p>If you have any questions about these Terms, please contact us at <a href="mailto:legal@verifiedhire.com" className="text-indigo-600 dark:text-indigo-400">legal@verifiedhire.com</a>.</p>
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