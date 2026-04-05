
import React, { useState } from 'react';
import { Icon } from './Icon';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const inputClass = "block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-indigo-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 bg-white dark:bg-indigo-800 text-slate-900 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500";
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-white dark:bg-indigo-950 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-indigo-200">
              Have a question, feedback, or a partnership inquiry? We'd love to hear from you.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-slate-50 dark:bg-indigo-900/50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Us</h2>
              {submitted ? (
                <div className="mt-6 flex flex-col items-center justify-center h-full text-center">
                  <Icon name="checkCircle" className="h-16 w-16 text-green-500" />
                  <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-white">Thank you!</h3>
                  <p className="text-slate-600 dark:text-indigo-200">Your message has been sent successfully. We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-indigo-100">Full Name</label>
                    <input type="text" id="name" required className={inputClass} />
                  </div>
                   <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-indigo-100">Email Address</label>
                    <input type="email" id="email" required className={inputClass} />
                  </div>
                   <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-indigo-100">Message</label>
                    <textarea id="message" rows={4} required className={inputClass}></textarea>
                  </div>
                  <div>
                    <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Our Information</h3>
              <div className="flex items-start space-x-4">
                <Icon name="mail" className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Email</h4>
                  <p className="text-slate-500 dark:text-indigo-300">General Inquiries: <a href="mailto:info@verifiedhire.com" className="text-indigo-600 dark:text-indigo-400">info@verifiedhire.com</a></p>
                  <p className="text-slate-500 dark:text-indigo-300">Support: <a href="mailto:support@verifiedhire.com" className="text-indigo-600 dark:text-indigo-400">support@verifiedhire.com</a></p>
                </div>
              </div>
               <div className="flex items-start space-x-4">
                <Icon name="phone" className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Phone</h4>
                  <p className="text-slate-500 dark:text-indigo-300">+254 700 000 000</p>
                </div>
              </div>
               <div className="flex items-start space-x-4">
                <Icon name="buildingOffice" className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Office</h4>
                  <p className="text-slate-500 dark:text-indigo-300">123 Business Avenue<br/>Westlands, Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};