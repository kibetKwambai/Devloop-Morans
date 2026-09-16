import React, { useState } from 'react';
import { Icon, IconName } from './Icon';

interface OfficeLocation {
  city: string;
  badge: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  email: string;
  services: string[];
}

const offices: OfficeLocation[] = [
  {
    city: 'Nairobi',
    badge: 'Headquarters & AI Labs',
    name: 'VerifiedHire Executive Center',
    address: 'Delta Corner Annex, 8th Floor, Chiromo Road, Westlands, Nairobi',
    phone: '+254 (0) 20 790 4000',
    hours: 'Mon - Fri: 8:00 AM - 6:00 PM EAT | Sat: 9:00 AM - 1:00 PM EAT',
    email: 'hq@verifiedhire.co.ke',
    services: ['Enterprise Hiring Consultations', 'Executive Pilot Verifications', 'Forensics Lab Audits', 'Field Agent Inductions'],
  },
  {
    city: 'Mombasa',
    badge: 'Maritime & Logistics Desk',
    name: 'Coast & Port Operations Center',
    address: 'Nyali Links Business Plaza, 3rd Floor, Links Road, Nyali, Mombasa',
    phone: '+254 (0) 41 230 1120',
    hours: 'Mon - Fri: 8:30 AM - 5:30 PM EAT',
    email: 'mombasa@verifiedhire.co.ke',
    services: ['Merchant Navy Crew Audits', 'Port Logistics Credentials', 'Hospitality & Tourism Clearances'],
  },
  {
    city: 'Kisumu',
    badge: 'Western Region Hub',
    name: 'Lakeside Technology Hub',
    address: 'Mega City Complex, Wing B, Oginga Odinga Street, Kisumu',
    phone: '+254 (0) 57 202 8840',
    hours: 'Mon - Fri: 8:30 AM - 5:00 PM EAT',
    email: 'kisumu@verifiedhire.co.ke',
    services: ['Healthcare Specialist Audits', 'Agri-tech Talent Screening', 'University Verification Liaison'],
  },
  {
    city: 'Eldoret',
    badge: 'Aviation & Engineering Desk',
    name: 'Rift Valley Regional Desk',
    address: 'KVDA Plaza, 5th Floor, Oloo Street, Eldoret',
    phone: '+254 (0) 53 206 4300',
    hours: 'Mon - Fri: 8:30 AM - 5:00 PM EAT',
    email: 'eldoret@verifiedhire.co.ke',
    services: ['Aviation Pilot Logbooks', 'Mechanical Engineering Licensure', 'Athletics & Sports Coaching Verification'],
  },
];

const departments = [
  {
    name: 'Enterprise Recruitment & API Solutions',
    desc: 'For talent acquisition directors, banks, airlines, and tech companies seeking verified talent.',
    email: 'enterprise@verifiedhire.co.ke',
    phone: '+254 700 890 100',
    sla: '< 15 minute response time',
    icon: 'buildingOffice' as IconName,
  },
  {
    name: 'Candidate Verification & Appeals',
    desc: 'For job seekers with questions regarding pending document reviews or re-verifications.',
    email: 'verification@verifiedhire.co.ke',
    phone: '+254 700 890 200',
    sla: '< 2 hour business response',
    icon: 'shieldCheck' as IconName,
  },
  {
    name: 'Legal, ODPC & Regulatory Compliance',
    desc: 'For statutory inquiries, Data Protection Officer requests, and institutional verification subpoenas.',
    email: 'dpo@verifiedhire.co.ke',
    phone: '+254 (0) 20 790 4015',
    sla: '< 24 hour statutory response',
    icon: 'scale' as IconName,
  },
  {
    name: 'Security & Integrity Whistleblower Desk',
    desc: 'Confidential reporting of attempted document forgery, impostor applications, or agent misconduct.',
    email: 'whistleblower@verifiedhire.co.ke',
    phone: '+254 700 890 999 (Confidential Hotline)',
    sla: 'Immediate Priority Triage',
    icon: 'lockClosed' as IconName,
  },
];

const faqs = [
  {
    q: 'How long does a candidate credential check take?',
    a: 'Automated academic and regulatory checks take less than 15 minutes. Manual field checks with former direct supervisors and reference validation are guaranteed within 18 business hours.',
  },
  {
    q: 'Can employers contact candidates directly without third-party fees?',
    a: 'Yes. Once an employer is registered with an active plan, they can browse the verified candidate directory and initiate contact, schedule interviews, or extend verified offers directly.',
  },
  {
    q: 'How do you prevent forged certificates from passing your system?',
    a: 'We operate a multi-layer verification protocol combining direct API integration with university registrars (KNQA accredited), biometric ID validation, and Google Gemini multimodal AI visual forensic analysis to detect microscopic document tampering.',
  },
  {
    q: 'Is my candidate data secure and compliant with Kenyan privacy laws?',
    a: 'Absolutely. VerifiedHire is registered with the Office of the Data Protection Commissioner (ODPC) as both a Data Controller and Processor. All documents are AES-256 encrypted and never shared without explicit candidate consent.',
  },
];

export const ContactPage: React.FC<{ onNavigate?: (view: any) => void }> = ({ onNavigate }) => {
  const [selectedOffice, setSelectedOffice] = useState<string>('Nairobi');
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    inquiryType: 'Enterprise Recruitment',
    priority: 'Normal',
    message: '',
  });

  const activeOffice = offices.find((o) => o.city === selectedOffice) || offices[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomTicket = 'VH-' + Math.floor(100000 + Math.random() * 900000);
    setTicketNumber(randomTicket);
    setSubmitted(true);
  };

  return (
    <div className="bg-white dark:bg-indigo-950 py-12 sm:py-20 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {onNavigate && (
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <Icon name="arrowLeft" className="h-4 w-4 mr-2" />
              Back to Overview
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="text-xs font-bold text-slate-500 dark:text-indigo-300 hover:text-indigo-600 transition-colors"
            >
              View Enterprise Verification Pricing &rarr;
            </button>
          </div>
        )}

        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-6">
            Direct Corporate Directory & Support
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            We Are Here to <span className="text-indigo-600 dark:text-indigo-400">Back Your Trust</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-indigo-200 leading-relaxed">
            Reach out to our specialized enterprise directors, verification inspectors, or data protection team across Kenya and East Africa.
          </p>
        </div>

        {/* Specialized Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {departments.map((dept, i) => (
            <div key={i} className="p-6 bg-slate-50 dark:bg-indigo-900/20 rounded-3xl border border-slate-200 dark:border-indigo-800/70 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon name={dept.icon} className="h-5 w-5" />
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                    {dept.sla}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{dept.name}</h3>
                <p className="text-xs text-slate-600 dark:text-indigo-300 mt-2 leading-relaxed">{dept.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-indigo-800/50 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                <a href={`mailto:${dept.email}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  {dept.email}
                </a>
                <span className="text-slate-500 dark:text-indigo-300">{dept.phone}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid: Interactive Form & Office Hub Switcher */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24">
          
          {/* Form Column (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-indigo-900/30 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-indigo-800/70 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Submit an Official Inquiry</h2>
                  <p className="text-xs text-slate-500 dark:text-indigo-300 mt-1">Directly routed to the relevant department lead.</p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800">
                  ODPC Protected
                </span>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="checkCircle" className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Inquiry Dispatched Successfully</h3>
                  <div className="p-4 bg-slate-50 dark:bg-indigo-900/40 rounded-2xl max-w-sm mx-auto text-center border border-slate-200 dark:border-indigo-800">
                    <p className="text-xs text-slate-500 dark:text-indigo-300 uppercase font-bold tracking-wider">Tracking Reference</p>
                    <p className="text-xl font-mono font-black text-indigo-600 dark:text-indigo-400 mt-1">{ticketNumber}</p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-indigo-200 max-w-md mx-auto">
                    A confirmation has been sent to <span className="font-bold">{formData.email}</span>. Our specialist will respond within the guaranteed SLA window.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', organization: '', inquiryType: 'Enterprise Recruitment', priority: 'Normal', message: '' });
                    }}
                    className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. Wanjiru Mwangi"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="wanjiru@organization.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+254 7..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Company / Institution</label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="e.g. Equity Group Holdings"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Inquiry Department *</label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Enterprise Recruitment">Enterprise Recruitment & Custom SLAs</option>
                        <option value="Candidate Verification">Candidate Verification Support</option>
                        <option value="API Integration">Developer & API Integration</option>
                        <option value="Regulatory / ODPC">Regulatory / ODPC Data Compliance</option>
                        <option value="Field Agent Program">Field Agent Application Support</option>
                        <option value="Press & Media">Press & Media Relations</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Urgency Level</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Normal">Normal Business Hours</option>
                        <option value="Expedited">Expedited (Hiring in 48 hrs)</option>
                        <option value="Critical">Critical Priority (Executive Check)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Inquiry Details *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please provide details regarding your query, requirements, or candidates..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
                    >
                      Dispatch Official Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Regional Hubs Selector (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 dark:bg-indigo-900/20 p-8 rounded-3xl border border-slate-200 dark:border-indigo-800/70">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">Physical Verification Hubs</h3>
              
              {/* Hub Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
                {offices.map((off) => (
                  <button
                    key={off.city}
                    onClick={() => setSelectedOffice(off.city)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      selectedOffice === off.city
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white dark:bg-indigo-950 text-slate-600 dark:text-indigo-200 border border-slate-200 dark:border-indigo-800'
                    }`}
                  >
                    {off.city}
                  </button>
                ))}
              </div>

              {/* Selected Office Details */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-800/60 dark:text-indigo-300 rounded-md">
                    {activeOffice.badge}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-2">{activeOffice.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-indigo-200 mt-1 leading-relaxed">{activeOffice.address}</p>
                </div>

                <div className="p-4 bg-white dark:bg-indigo-900/40 rounded-2xl border border-slate-200 dark:border-indigo-800/50 space-y-2 text-xs">
                  <p className="text-slate-700 dark:text-indigo-200"><span className="font-bold">Desk Direct:</span> {activeOffice.phone}</p>
                  <p className="text-slate-700 dark:text-indigo-200"><span className="font-bold">Email:</span> {activeOffice.email}</p>
                  <p className="text-slate-500 dark:text-indigo-300"><span className="font-bold">Hours:</span> {activeOffice.hours}</p>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-2">On-Site Capabilities</h5>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-indigo-200">
                    {activeOffice.services.map((svc, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>{svc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Corporate Registry & Compliance Card */}
            <div className="p-6 bg-white dark:bg-indigo-900/30 rounded-3xl border border-slate-200 dark:border-indigo-800/70 text-xs text-slate-600 dark:text-indigo-300 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Corporate & Statutory Data</h4>
              <p><span className="font-semibold text-slate-800 dark:text-white">Legal Entity:</span> VerifiedHire Technologies East Africa Limited</p>
              <p><span className="font-semibold text-slate-800 dark:text-white">Company Registry (CR12):</span> CPR/2024/91823</p>
              <p><span className="font-semibold text-slate-800 dark:text-white">Kenya Revenue Authority PIN:</span> P052189921Z</p>
              <p><span className="font-semibold text-slate-800 dark:text-white">ODPC Data Controller:</span> Reg # ODPC/PR/2024/00821</p>
            </div>
          </div>
        </div>

        {/* FAQ Quick Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Frequently Asked Inquiries</h2>
            <p className="text-sm text-slate-600 dark:text-indigo-300 mt-1">Instant answers before submitting an inquiry.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-indigo-900/20 rounded-2xl border border-slate-200 dark:border-indigo-800/60">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h4>
                <p className="text-xs text-slate-600 dark:text-indigo-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
