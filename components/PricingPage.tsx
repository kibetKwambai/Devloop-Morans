
import React, { useState } from 'react';
import { Icon, IconName } from './Icon';
import { SubscriptionPlan } from '../types';
import { subscriptionPlans, jobSeekerPlans } from '../services/mockData';

interface PricingPageProps {
  onNavigate: (view: string) => void;
}

const RoiCalculator: React.FC<{ plans: SubscriptionPlan[] }> = ({ plans }) => {
    const [hires, setHires] = useState(5);
    const [hours, setHours] = useState(25);
    const [cost, setCost] = useState(2500);

    const annualPlanCost = 85000;
    const valueGenerated = hires * hours * cost;
    const roi = valueGenerated - annualPlanCost;
    const roiPercentage = (roi / annualPlanCost) * 100;

    const Slider: React.FC<{label: string, value: number, min: number, max: number, step: number, unit: string, onChange: (val: number) => void}> = ({ label, value, min, max, step, unit, onChange }) => (
        <div className="space-y-2">
            <label className="flex justify-between font-medium text-slate-700 dark:text-indigo-200">
                <span>{label}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{unit === 'KES' ? value.toLocaleString() : value} {unit !== 'KES' ? unit : ''}</span>
            </label>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-indigo-700 rounded-lg appearance-none cursor-pointer"
            />
        </div>
    );

    return (
        <div className="mt-20 max-w-4xl mx-auto">
            <h3 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Calculate Your ROI</h3>
            <p className="mt-4 text-center text-lg text-slate-600 dark:text-indigo-300">See how much value VerifiedHire can bring to your company.</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-indigo-900/50 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-indigo-800">
                <div className="space-y-6">
                    <Slider label="Annual Hires" value={hires} min={1} max={50} step={1} unit="Hires" onChange={setHires} />
                    <Slider label="Hours Saved Per Hire" value={hours} min={5} max={100} step={5} unit="Hours" onChange={setHours} />
                    <Slider label="Avg. Hourly Cost of Hiring Team" value={cost} min={500} max={10000} step={100} unit="KES" onChange={setCost} />
                </div>
                <div className="text-center bg-slate-50 dark:bg-indigo-900 p-8 rounded-xl">
                    <p className="text-sm font-semibold text-slate-500 dark:text-indigo-400 uppercase tracking-wider">Estimated Annual ROI</p>
                    <p className="mt-2 text-5xl font-extrabold text-green-600 dark:text-green-400">
                        {roi.toLocaleString('en-US', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 })}
                    </p>
                    <p className="mt-2 text-lg font-medium text-slate-700 dark:text-indigo-200">
                        <span className={`font-bold ${roi > 0 ? 'text-green-500' : 'text-red-500'}`}>{roiPercentage.toFixed(0)}%</span> return on investment
                    </p>
                     <p className="mt-4 text-xs text-slate-500 dark:text-indigo-300">Based on our Annual Plan cost of KES 85,000.</p>
                </div>
            </div>
        </div>
    );
};


const PricingDetail: React.FC<{ title: string, description: string, icon: IconName }> = ({ title, description, icon }) => (
    <div className="py-6 border-b border-slate-100 dark:border-indigo-900/50 last:border-0">
        <div className="flex items-start gap-4">
            <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-lg">
                <Icon name={icon} className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
                <p className="text-slate-600 dark:text-indigo-200 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    </div>
);

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [userType, setUserType] = useState<'employer' | 'jobSeeker'>('employer');

  const currentPlans = userType === 'employer' ? subscriptionPlans : jobSeekerPlans;

  return (
    <div className="bg-white dark:bg-indigo-950 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 leading-7 uppercase tracking-widest">Pricing Strategy</h2>
          <p className="mt-2 text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Invest in <span className="text-indigo-600 dark:text-indigo-400">Quality</span>
          </p>
          <p className="mt-6 text-xl text-slate-600 dark:text-indigo-200 leading-8 max-w-3xl mx-auto">
            {userType === 'employer' 
              ? "Access a curated pool of Kenya's best-verified talent. Choose the plan that fits your hiring needs and scale your team with confidence."
              : "Boost your career with verified status and premium job-seeking features. Stand out to top employers in Kenya."}
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center space-y-8">
            {/* User Type Toggle */}
            <div className="flex p-1.5 bg-slate-100 dark:bg-indigo-900/50 rounded-2xl border border-slate-200 dark:border-indigo-800 shadow-inner">
                <button 
                    onClick={() => setUserType('employer')}
                    className={`px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${userType === 'employer' ? 'bg-white dark:bg-indigo-800 text-indigo-600 dark:text-white shadow-lg' : 'text-slate-500 dark:text-indigo-300 hover:text-slate-700'}`}
                >
                    For Employers
                </button>
                <button 
                    onClick={() => setUserType('jobSeeker')}
                    className={`px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${userType === 'jobSeeker' ? 'bg-white dark:bg-indigo-800 text-indigo-600 dark:text-white shadow-lg' : 'text-slate-500 dark:text-indigo-300 hover:text-slate-700'}`}
                >
                    For Job Seekers
                </button>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center space-x-6">
                <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>Monthly Billing</span>
                <label htmlFor="billing-cycle-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            id="billing-cycle-toggle"
                            className="sr-only"
                            checked={billingCycle === 'annual'}
                            onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                        />
                        <div className="block bg-slate-200 dark:bg-indigo-800 w-16 h-9 rounded-full shadow-inner"></div>
                        <div className={`dot absolute left-1.5 top-1.5 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 ${billingCycle === 'annual' ? 'transform translate-x-7' : ''}`}></div>
                    </div>
                </label>
                <span className={`text-sm font-bold transition-colors ${billingCycle === 'annual' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>Annual Billing</span>
                <span className="ml-2 px-3 py-1 text-xs font-bold text-green-700 bg-green-100 dark:text-green-200 dark:bg-green-500/20 rounded-full animate-pulse">Save 15%</span>
            </div>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {currentPlans.map((plan: SubscriptionPlan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col p-10 rounded-3xl shadow-2xl dark:bg-indigo-900/40 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${plan.isPopular ? 'border-4 border-indigo-600 dark:border-indigo-500 ring-8 ring-indigo-600/10' : 'border border-slate-200 dark:border-indigo-800'}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-6 py-2 text-sm font-extrabold text-white bg-indigo-600 rounded-full shadow-xl uppercase tracking-widest">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
              <p className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">{plan.price[billingCycle]}</span>
                <span className="ml-2 text-lg font-medium text-slate-500 dark:text-indigo-300">{plan.priceDetails}</span>
              </p>
              {billingCycle === 'annual' && plan.annualPrice && (
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-2">{plan.annualPrice}</p>
              )}
              <button
                onClick={() => onNavigate('signin')}
                className={`mt-10 w-full py-4 px-6 rounded-2xl text-lg font-bold transition-all shadow-xl hover:shadow-2xl ${
                  plan.isPopular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-800 dark:text-white dark:hover:bg-indigo-700'
                }`}
              >
                {plan.ctaText}
              </button>
              <ul role="list" className="mt-10 space-y-4 text-base text-slate-600 dark:text-indigo-200 leading-7">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-4">
                    <Icon name="checkCircle" className="h-6 w-6 flex-none text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <RoiCalculator plans={subscriptionPlans} />

        {/* Detailed Pricing Value Sections */}
        <div className="mt-32 max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Why Our Pricing Makes Sense</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                <PricingDetail 
                    icon="shieldCheck"
                    title="1. Quality Over Quantity"
                    description="We don't charge per job post. We charge for access to a pre-verified, high-quality talent pool, saving you thousands in recruitment costs."
                />
                <PricingDetail 
                    icon="sparkles"
                    title="2. AI-Powered Efficiency"
                    description="Our platform uses advanced AI to match you with the best candidates, reducing the time-to-hire by up to 60%."
                />
                <PricingDetail 
                    icon="lockClosed"
                    title="3. Secure Data Handling"
                    description="A portion of your subscription goes directly into maintaining world-class security standards for your company's data."
                />
                <PricingDetail 
                    icon="userGroup"
                    title="4. Dedicated Account Management"
                    description="Enterprise and Pro plans include a dedicated account manager to help you optimize your hiring strategy."
                />
                <PricingDetail 
                    icon="academicCap"
                    title="5. Verified Credentials"
                    description="Every candidate's education and work history is manually verified, eliminating the risk of fraudulent hires."
                />
                <PricingDetail 
                    icon="globeAlt"
                    title="6. Scalable for Any Size"
                    description="Whether you're a startup or a multinational, our plans scale with your hiring volume and budget."
                />
                <PricingDetail 
                    icon="scale"
                    title="7. Ethical Pricing"
                    description="We believe in fair pricing that reflects the real value provided to both employers and job seekers."
                />
                <PricingDetail 
                    icon="arrowTrendingUp"
                    title="8. Market Insights"
                    description="Pro and Enterprise plans gain access to exclusive market data and hiring trends in Kenya."
                />
                <PricingDetail 
                    icon="cog"
                    title="9. API Integration"
                    description="Seamlessly integrate VerifiedHire with your existing ATS or HR software (Enterprise only)."
                />
                <PricingDetail 
                    icon="star"
                    title="10. Priority Verification"
                    description="Job seekers on premium plans get their profiles verified faster by our dedicated team."
                />
                <PricingDetail 
                    icon="phone"
                    title="11. 24/7 Premium Support"
                    description="Get help whenever you need it with our around-the-clock support for Pro and Enterprise users."
                />
                <PricingDetail 
                    icon="buildingOffice"
                    title="12. Custom Employer Branding"
                    description="Enhance your company's presence on our platform with custom branding and culture showcases."
                />
                <PricingDetail 
                    icon="checkCircle"
                    title="13. No Hidden Fees"
                    description="What you see is what you pay. No setup fees, no cancellation fees, no surprises."
                />
                <PricingDetail 
                    icon="circleStack"
                    title="14. Flexible Billing"
                    description="Switch between monthly and annual billing at any time to suit your cash flow."
                />
                <PricingDetail 
                    icon="sparkles"
                    title="15. Early Access Features"
                    description="Premium users are the first to try out our new tools and features as we innovate."
                />
                <PricingDetail 
                    icon="userPlus"
                    title="16. Referral Rewards"
                    description="Earn credits towards your subscription by referring other companies or talented professionals."
                />
                <PricingDetail 
                    icon="lockClosed"
                    title="17. Compliance Ready"
                    description="Our platform is fully compliant with Kenyan labor laws and data protection regulations."
                />
                <PricingDetail 
                    icon="globeAlt"
                    title="18. International Reach"
                    description="Access talent from across the globe who are looking to work in the Kenyan market."
                />
                <PricingDetail 
                    icon="academicCap"
                    title="19. Training & Onboarding"
                    description="We provide comprehensive training for your HR team to get the most out of VerifiedHire."
                />
                <PricingDetail 
                    icon="heart"
                    title="20. Community Support"
                    description="A portion of our revenue goes back into supporting local tech and aviation communities in Kenya."
                />
            </div>
        </div>
      </div>
    </div>
  );
};
