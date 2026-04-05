

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
        id: 'encryption',
        title: '1. Encryption & Data Protection',
        icon: 'lockClosed',
        content: (
            <>
                <p>Your data security is our top priority. We employ robust encryption protocols to protect your information both in transit and at rest.</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li><strong>In Transit:</strong> All data transmitted between your browser and our servers is protected using strong TLS 1.2/1.3 encryption.</li>
                    <li><strong>At Rest:</strong> Sensitive information and uploaded documents stored in our databases and file systems are encrypted using the industry-standard AES-256 algorithm.</li>
                </ul>
            </>
        ),
    },
    {
        id: 'access-control',
        title: '2. Secure Access Control',
        icon: 'userCircle',
        content: (
            <>
                <p>We enforce strict access control policies to ensure that only authorized individuals can access sensitive data.</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li><strong>Role-Based Access:</strong> Our internal systems operate on the principle of least privilege, meaning employees only have access to the data necessary to perform their job functions.</li>
                    <li><strong>Multi-Factor Authentication (MFA):</strong> Access to all internal administrative tools and infrastructure is protected by mandatory MFA.</li>
                    <li><strong>Single Sign-On (SSO):</strong> We support SSO integration for enterprise clients, allowing for centralized and secure user management.</li>
                </ul>
            </>
        )
    },
    {
        id: 'infrastructure',
        title: '3. Infrastructure Security',
        icon: 'serverStack',
        content: <p>Our platform is hosted on leading cloud infrastructure providers (like AWS, Azure, or GCP) that offer state-of-the-art physical and network security. We utilize firewalls, intrusion detection systems, and regular vulnerability scanning to protect our infrastructure from threats.</p>
    },
     {
        id: 'compliance',
        title: '4. Compliance & Audits',
        icon: 'shieldCheck',
        content: (
            <>
                <p>We are committed to meeting and exceeding industry best practices for security and compliance. Our infrastructure and processes are designed to be compliant with standards like:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li><strong>SOC 2 Type II:</strong> We are actively working towards our SOC 2 certification to demonstrate our commitment to data security, availability, processing integrity, confidentiality, and privacy.</li>
                    <li><strong>ISO/IEC 27001:</strong> Our security program is aligned with the ISO 27001 framework for information security management.</li>
                    <li><strong>Data Privacy Laws:</strong> We adhere to principles of major data privacy regulations like GDPR and the Kenya Data Protection Act.</li>
                </ul>
            </>
        )
    },
    {
        id: 'incident-response',
        title: '5. Incident Response',
        icon: 'arrowTrendingUp',
        content: <p>In the unlikely event of a security breach, we have a comprehensive incident response plan in place. This plan includes steps for containment, investigation, notification of affected parties, and remediation to prevent future incidents.</p>
    },
    {
        id: 'contact-us',
        title: '6. Report a Vulnerability',
        icon: 'mail',
        content: <p>If you believe you have discovered a security vulnerability in our platform, we encourage you to let us know right away. Please email us at <a href="mailto:security@verifiedhire.com" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">security@verifiedhire.com</a>.</p>
    }
];

const SecuritySection: React.FC<{ section: Section }> = ({ section }) => (
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


export const SecurityPage: React.FC = () => {
    const handleNavClick = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    
    return (
        <div className="bg-white dark:bg-indigo-950 py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 mb-4">
                            <Icon name="shieldCheck" className="h-9 w-9 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl">
                            Security & Trust
                        </h1>
                        <p className="mt-4 text-lg text-slate-500 dark:text-indigo-300">
                           How we protect your data and build a trustworthy platform.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
                        <aside className="lg:w-1/3 xl:w-1/4">
                            <div className="lg:sticky lg:top-28">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-indigo-300 mb-4">Security Topics</h3>
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
                                    At VerifiedHire, we understand that trust is built on a foundation of robust security. We are deeply committed to protecting our customers' data. This page outlines the security measures we have in place.
                                </p>
                            </div>
                            {sections.map(section => (
                                <SecuritySection key={section.id} section={section} />
                            ))}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};