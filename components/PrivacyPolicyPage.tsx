

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
                <p>We may collect personal information that you provide to us directly, such as your name, email address, phone number, work experience, education history, and documents you upload for verification purposes (e.g., CVs, certificates, identification documents).</p>
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
                    <li>Create and manage your account.</li>
                    <li>Provide, operate, and maintain our services.</li>
                    <li>Verify your identity and credentials.</li>
                    <li>Process your requests and transactions.</li>
                    <li>Communicate with you, including responding to your comments, questions, and requests for customer service.</li>
                    <li>Make your profile available to potential employers (if you are a job seeker).</li>
                    <li>Improve our platform and user experience.</li>
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
                    <li><strong>With Employers:</strong> If you are a job seeker with a verified profile, we will make your profile information available to subscribing employers.</li>
                    <li><strong>For Verification:</strong> We may share necessary information with third-party services to verify your documents and credentials.</li>
                    <li><strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                </ul>
            </>
        )
    },
    {
        id: 'data-security',
        title: '4. Data Security',
        icon: 'shieldCheck',
        content: <p>We implement a variety of industry-standard security measures to maintain the safety of your personal information. All documents and sensitive information are encrypted, stored securely, and handled with strict confidentiality.</p>
    },
    {
        id: 'data-rights',
        title: '5. Your Data Rights',
        icon: 'edit',
        content: <p>You have the right to access, update, or delete the information we have on you. You can manage your profile information through your account settings. If you wish to permanently delete your account, please contact us at <a href="mailto:support@verifiedhire.com" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300">support@verifiedhire.com</a>.</p>
    },
    {
        id: 'policy-changes',
        title: '6. Changes to This Privacy Policy',
        icon: 'arrowTrendingUp',
        content: <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
    },
    {
        id: 'contact-us',
        title: '7. Contact Us',
        icon: 'mail',
        content: <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@verifiedhire.com" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300">privacy@verifiedhire.com</a>.</p>
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