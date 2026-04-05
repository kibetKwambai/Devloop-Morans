
import React, { useState } from 'react';
import { Icon } from './Icon';
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


export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [userType, setUserType] = useState<'employer' | 'jobSeeker'>('employer');

  const currentPlans = userType === 'employer' ? subscriptionPlans : jobSeekerPlans;

  return (
    <div className="bg-white dark:bg-indigo-950 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 leading-7">Pricing</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Simple, transparent pricing for {userType === 'employer' ? 'employers' : 'job seekers'}
          </p>
          <p className="mt-6 text-lg text-slate-600 dark:text-indigo-200 leading-8">
            {userType === 'employer' 
              ? "Access a curated pool of Kenya's best-verified talent. Choose the plan that fits your hiring needs."
              : "Boost your career with verified status and premium job-seeking features."}
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center space-y-6">
            {/* User Type Toggle */}
            <div className="flex p-1 bg-slate-100 dark:bg-indigo-900/50 rounded-xl border border-slate-200 dark:border-indigo-800">
                <button 
                    onClick={() => setUserType('employer')}
                    className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${userType === 'employer' ? 'bg-white dark:bg-indigo-800 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-indigo-300 hover:text-slate-700'}`}
                >
                    For Employers
                </button>
                <button 
                    onClick={() => setUserType('jobSeeker')}
                    className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${userType === 'jobSeeker' ? 'bg-white dark:bg-indigo-800 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-indigo-300 hover:text-slate-700'}`}
                >
                    For Job Seekers
                </button>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center space-x-4">
                <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Monthly</span>
                <label htmlFor="billing-cycle-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            id="billing-cycle-toggle"
                            className="sr-only"
                            checked={billingCycle === 'annual'}
                            onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                        />
                        <div className="block bg-slate-200 dark:bg-indigo-800 w-14 h-8 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${billingCycle === 'annual' ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                </label>
                <span className={`text-sm font-semibold ${billingCycle === 'annual' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Annual</span>
                <span className="ml-2 px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-100 dark:text-green-200 dark:bg-green-500/20 rounded-full">Save 15%</span>
            </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {currentPlans.map((plan: SubscriptionPlan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col p-8 rounded-2xl shadow-lg dark:bg-indigo-900/50 ${plan.isPopular ? 'border-2 border-indigo-600 dark:border-indigo-500' : 'border border-slate-200 dark:border-indigo-800'}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 dark:text-indigo-200 dark:bg-indigo-500/30 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
              <p className="mt-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price[billingCycle]}</span>
                <span className="text-base font-medium text-slate-500 dark:text-indigo-300">{plan.priceDetails}</span>
              </p>
              {billingCycle === 'annual' && plan.annualPrice && (
                  <p className="text-sm text-slate-500 dark:text-indigo-300 mt-1">{plan.annualPrice}</p>
              )}
              <button
                onClick={() => onNavigate('signin')}
                className={`mt-6 w-full py-3 px-4 rounded-lg text-base font-semibold transition-colors ${
                  plan.isPopular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-800 dark:text-white dark:hover:bg-indigo-700'
                }`}
              >
                {plan.ctaText}
              </button>
              <ul role="list" className="mt-8 space-y-3 text-sm text-slate-600 dark:text-indigo-200 leading-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Icon name="checkCircle" className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <RoiCalculator plans={subscriptionPlans} />
      </div>
    </div>
  );
};