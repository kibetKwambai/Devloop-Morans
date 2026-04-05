

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
        id: 'info-collection',
        title: '1. Information We Collect',
        icon: 'userCircle',
        content: (
            <>
                <p>We collect personal information that you provide to us directly, including but not limited to:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li><strong>Identity Data:</strong> Name, date of birth, gender, and identification numbers.</li>
                    <li><strong>Contact Data:</strong> Email address, phone number, and physical address.</li>
                    <li><strong>Professional Data:</strong> Work history, skills, certifications, and education.</li>
                    <li><strong>Verification Data:</strong> Scanned copies of IDs, degrees, and employment letters.</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, and usage patterns.</li>
                </ul>
            </>
        ),
    },
    {
        id: 'info-use',
        title: '2. How We Use Your Information',
        icon: 'cog',
        content: (
            <>
                <p>We use the information we collect to:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li>Create and manage your secure account.</li>
                    <li>Perform rigorous manual and automated verifications.</li>
                    <li>Facilitate job matching and employer discovery.</li>
                    <li>Improve our platform's AI and matching algorithms.</li>
                    <li>Communicate critical updates and security alerts.</li>
                    <li>Comply with legal and regulatory requirements in Kenya.</li>
                </ul>
            </>
        ),
    },
    {
        id: 'info-sharing',
        title: '3. Information Sharing and Disclosure',
        icon: 'userGroup',
        content: (
            <>
                <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700/50 text-indigo-800 dark:text-indigo-300">
                    <p className="font-semibold">Your privacy is paramount. We do not sell your personal information to third parties.</p>
                </div>
                <p>We may share your information only in the following situations:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li><strong>With Employers:</strong> Only verified profiles are visible to subscribing employers.</li>
                    <li><strong>Verification Partners:</strong> With institutions for the sole purpose of credential validation.</li>
                    <li><strong>Service Providers:</strong> Cloud hosting and security partners who adhere to our strict standards.</li>
                    <li><strong>Legal Compliance:</strong> When required by the Data Protection Act of Kenya.</li>
                </ul>
            </>
        )
    },
    {
        id: 'data-security',
        title: '4. Data Security Protocols',
        icon: 'shieldCheck',
        content: <p>We implement military-grade encryption (AES-256) for all stored documents. Our infrastructure is hosted on secure cloud servers with 24/7 monitoring, firewalls, and regular penetration testing to ensure your data remains impenetrable.</p>
    },
    {
        id: 'data-retention',
        title: '5. Data Retention Policy',
        icon: 'circleStack',
        content: <p>We retain your personal data only for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. You can request deletion at any time.</p>
    },
    {
        id: 'cookies',
        title: '6. Cookies and Tracking',
        icon: 'sparkles',
        content: <p>We use cookies to enhance your browsing experience, analyze site traffic, and understand where our audience is coming from. You can manage your cookie preferences through your browser settings at any time.</p>
    },
    {
        id: 'third-party-links',
        title: '7. Third-Party Links',
        icon: 'globeAlt',
        content: <p>Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of these sites. We encourage you to read the privacy policies of every website you visit.</p>
    },
    {
        id: 'children-privacy',
        title: '8. Children\'s Privacy',
        icon: 'userPlus',
        content: <p>Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware of such collection, we will take immediate steps to delete the data.</p>
    },
    {
        id: 'international-transfers',
        title: '9. International Data Transfers',
        icon: 'globeAlt',
        content: <p>Your information may be transferred to and maintained on computers located outside of Kenya where data protection laws may differ. We ensure all transfers comply with the Data Protection Act of Kenya.</p>
    },
    {
        id: 'data-rights',
        title: '10. Your Data Rights',
        icon: 'edit',
        content: (
            <ul className="list-disc space-y-2 pl-6">
                <li><strong>Right to Access:</strong> Request a copy of your personal data.</li>
                <li><strong>Right to Rectification:</strong> Correct any inaccurate or incomplete data.</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data under certain conditions.</li>
                <li><strong>Right to Object:</strong> Object to our processing of your data.</li>
                <li><strong>Right to Portability:</strong> Request transfer of your data to another organization.</li>
            </ul>
        )
    },
    {
        id: 'marketing-pref',
        title: '11. Marketing Preferences',
        icon: 'mail',
        content: <p>You can opt-out of receiving marketing communications from us at any time by clicking the 'unsubscribe' link in our emails or updating your profile settings. Critical service updates cannot be opted out of.</p>
    },
    {
        id: 'automated-decisions',
        title: '12. Automated Decision Making',
        icon: 'cog',
        content: <p>We use AI to assist in matching candidates with jobs. However, all final hiring decisions are made by human employers, and all verification decisions are made by our human agents.</p>
    },
    {
        id: 'breach-notification',
        title: '13. Data Breach Notification',
        icon: 'shieldCheck',
        content: <p>In the unlikely event of a data breach, we will notify you and the relevant regulatory authorities in Kenya within 72 hours of becoming aware of the breach, as required by law.</p>
    },
    {
        id: 'consent-withdrawal',
        title: '14. Withdrawal of Consent',
        icon: 'edit',
        content: <p>Where we rely on your consent to process your data, you have the right to withdraw that consent at any time. This will not affect the lawfulness of processing based on consent before its withdrawal.</p>
    },
    {
        id: 'legal-basis',
        title: '15. Legal Basis for Processing',
        icon: 'scale',
        content: <p>We process your data based on contract necessity (providing our services), legal obligation, and our legitimate business interests in maintaining a secure and trustworthy platform.</p>
    },
    {
        id: 'privacy-officer',
        title: '16. Data Protection Officer',
        icon: 'userCircle',
        content: <p>We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions in relation to this privacy policy. You can contact our DPO at <a href="mailto:dpo@verifiedhire.com" className="text-indigo-600 dark:text-indigo-400">dpo@verifiedhire.com</a>.</p>
    },
    {
        id: 'kenya-compliance',
        title: '17. Compliance with Kenyan Law',
        icon: 'scale',
        content: <p>VerifiedHire is fully registered and compliant with the Office of the Data Protection Commissioner (ODPC) in Kenya. We strictly follow the Data Protection Act, 2019.</p>
    },
    {
        id: 'user-responsibilities',
        title: '18. Your Responsibilities',
        icon: 'lockClosed',
        content: <p>You are responsible for maintaining the confidentiality of your account password and for providing accurate information. Notify us immediately if you suspect any unauthorized access to your account.</p>
    },
    {
        id: 'policy-updates',
        title: '19. Updates to This Policy',
        icon: 'arrowTrendingUp',
        content: <p>We review this policy annually or whenever there are significant changes to our data practices. We will notify you of any material changes via email or a prominent notice on our platform.</p>
    },
    {
        id: 'contact-us',
        title: '20. Contact and Complaints',
        icon: 'mail',
        content: <p>If you have any concerns about our use of your personal data, you can make a complaint to us at <a href="mailto:privacy@verifiedhire.com" className="text-indigo-600 dark:text-indigo-400">privacy@verifiedhire.com</a>. You also have the right to complain to the ODPC.</p>
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


export const PrivacyPolicyPage: React.FC = () => {
    const handleNavClick = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    
    return (
        <div className="bg-white dark:bg-indigo-950 py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 mb-4">
                            <Icon name="lockClosed" className="h-9 w-9 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl">
                            Privacy Policy
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
                                    Welcome to VerifiedHire ("we", "our", "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
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