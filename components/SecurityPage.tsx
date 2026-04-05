

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
                    <li><strong>In Transit:</strong> All data transmitted between your browser and our servers is protected using strong TLS 1.3 encryption, ensuring no eavesdropping.</li>
                    <li><strong>At Rest:</strong> Sensitive information and uploaded documents stored in our databases and file systems are encrypted using the industry-standard AES-256 algorithm.</li>
                    <li><strong>Key Management:</strong> We use advanced cloud-native key management services to rotate and protect encryption keys.</li>
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
                    <li><strong>Role-Based Access (RBAC):</strong> Our internal systems operate on the principle of least privilege, meaning employees only have access to the data necessary to perform their job functions.</li>
                    <li><strong>Multi-Factor Authentication (MFA):</strong> Access to all internal administrative tools and infrastructure is protected by mandatory MFA.</li>
                    <li><strong>Identity Management:</strong> We use centralized identity providers to manage user access and revoke permissions instantly when needed.</li>
                </ul>
            </>
        )
    },
    {
        id: 'infrastructure',
        title: '3. Infrastructure Security',
        icon: 'serverStack',
        content: <p>Our platform is hosted on leading cloud infrastructure providers that offer state-of-the-art physical and network security. We utilize virtual private clouds (VPCs), firewalls, intrusion detection systems (IDS), and regular vulnerability scanning to protect our infrastructure from threats.</p>
    },
    {
        id: 'network-security',
        title: '4. Network Security',
        icon: 'globeAlt',
        content: <p>We employ advanced network security measures including DDoS protection, web application firewalls (WAF), and rate limiting to prevent malicious traffic from reaching our servers. Our network architecture is designed to isolate sensitive components from the public internet.</p>
    },
    {
        id: 'vulnerability-management',
        title: '5. Vulnerability Management',
        icon: 'sparkles',
        content: <p>We perform regular automated vulnerability scans and manual penetration tests on our platform. Our development team follows secure coding practices (OWASP) and undergoes regular security training to prevent common vulnerabilities like SQL injection and XSS.</p>
    },
    {
        id: 'data-privacy',
        title: '6. Data Privacy by Design',
        icon: 'shieldCheck',
        content: <p>Privacy is integrated into our product development lifecycle. We conduct privacy impact assessments for new features and ensure that data minimization principles are followed at every stage of data processing.</p>
    },
    {
        id: 'compliance',
        title: '7. Compliance & Audits',
        icon: 'academicCap',
        content: (
            <>
                <p>We are committed to meeting and exceeding industry best practices for security and compliance. Our infrastructure and processes are designed to be compliant with standards like:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li><strong>SOC 2 Type II:</strong> We undergo regular third-party audits to verify our security controls.</li>
                    <li><strong>ISO/IEC 27001:</strong> Our security program is aligned with international information security management standards.</li>
                    <li><strong>Kenyan Data Protection Act:</strong> We are fully registered and compliant with local data regulations.</li>
                </ul>
            </>
        )
    },
    {
        id: 'incident-response',
        title: '8. Incident Response Plan',
        icon: 'arrowTrendingUp',
        content: <p>In the unlikely event of a security breach, we have a comprehensive incident response plan in place. This plan includes steps for containment, investigation, notification of affected parties, and remediation to prevent future incidents. We conduct regular drills to ensure our team is ready.</p>
    },
    {
        id: 'physical-security',
        title: '9. Physical Security',
        icon: 'buildingOffice',
        content: <p>Our cloud providers maintain rigorous physical security measures at their data centers, including biometric access controls, 24/7 surveillance, and environmental monitoring to protect the hardware that powers VerifiedHire.</p>
    },
    {
        id: 'backup-recovery',
        title: '10. Backup & Disaster Recovery',
        icon: 'circleStack',
        content: <p>We perform daily encrypted backups of all critical data. Our disaster recovery plan ensures that we can restore services quickly in the event of a major infrastructure failure, with geographically redundant storage for maximum resilience.</p>
    },
    {
        id: 'third-party-risk',
        title: '11. Third-Party Risk Management',
        icon: 'userGroup',
        content: <p>We conduct thorough security assessments of all third-party vendors and service providers. We only partner with organizations that meet our high standards for data protection and security.</p>
    },
    {
        id: 'secure-sdlc',
        title: '12. Secure Software Development',
        icon: 'cog',
        content: <p>Our Software Development Life Cycle (SDLC) includes mandatory code reviews, static and dynamic analysis, and security testing before any code is deployed to production. We use automated CI/CD pipelines to ensure consistent security checks.</p>
    },
    {
        id: 'employee-training',
        title: '13. Security Awareness Training',
        icon: 'academicCap',
        content: <p>All VerifiedHire employees undergo mandatory security awareness training upon hiring and annually thereafter. This covers topics like phishing, social engineering, and secure data handling practices.</p>
    },
    {
        id: 'endpoint-security',
        title: '14. Endpoint Security',
        icon: 'lockClosed',
        content: <p>All company-issued devices are managed with mobile device management (MDM) software, encrypted, and equipped with advanced endpoint detection and response (EDR) tools to prevent malware and unauthorized access.</p>
    },
    {
        id: 'logging-monitoring',
        title: '15. Logging & Monitoring',
        icon: 'arrowTrendingUp',
        content: <p>We maintain comprehensive logs of all system activity and security events. Our centralized monitoring system alerts our security team to any suspicious patterns or unauthorized access attempts in real-time.</p>
    },
    {
        id: 'data-anonymization',
        title: '16. Data Anonymization',
        icon: 'userPlus',
        content: <p>When performing analytics or training our AI models, we use data anonymization and pseudonymization techniques to protect the identity of our users while still gaining valuable insights.</p>
    },
    {
        id: 'api-security',
        title: '17. API Security',
        icon: 'cog',
        content: <p>Our APIs are protected by strong authentication (OAuth 2.0), rate limiting, and input validation. We use API gateways to manage and monitor all external traffic to our services.</p>
    },
    {
        id: 'patch-management',
        title: '18. Patch Management',
        icon: 'sparkles',
        content: <p>We have a rigorous patch management process to ensure that all our systems and software are up-to-date with the latest security fixes. Critical patches are applied within 24-48 hours of release.</p>
    },
    {
        id: 'customer-trust',
        title: '19. Customer Trust & Transparency',
        icon: 'shieldCheck',
        content: <p>We believe in transparency. We provide regular security updates to our customers and are always open to discussing our security practices. Your trust is our most valuable asset.</p>
    },
    {
        id: 'vulnerability-disclosure',
        title: '20. Vulnerability Disclosure Program',
        icon: 'mail',
        content: <p>We encourage security researchers to responsibly disclose vulnerabilities through our bug bounty program. If you believe you've found a security issue, please contact us at <a href="mailto:security@verifiedhire.com" className="text-indigo-600 dark:text-indigo-400">security@verifiedhire.com</a>.</p>
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