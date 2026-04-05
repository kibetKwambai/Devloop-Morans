

import React from 'react';
import { ProfileSection } from './ProfileSection';
import { Icon } from './Icon';

export const SettingsPage: React.FC = () => {
  const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-indigo-900 border border-slate-300 dark:border-indigo-700 rounded-md shadow-sm text-slate-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h2>
        <p className="mt-1 text-slate-500 dark:text-indigo-300">Manage your profile information and account security.</p>
      </div>

      <ProfileSection title="Personal Information" iconName="edit">
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-white">Full Name</label>
              <input type="text" id="fullName" defaultValue="Alex Doe" className={inputClass} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-white">Email Address</label>
              <input type="email" id="email" defaultValue="alex.doe@example.com" className={inputClass} />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-white">Phone Number</label>
              <input type="tel" id="phone" defaultValue="+1 (555) 123-4567" className={inputClass} />
            </div>
             <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-white">Location</label>
              <input type="text" id="location" defaultValue="San Francisco, CA" className={inputClass} />
            </div>
          </div>
          <div className="text-right">
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </form>
      </ProfileSection>

      <ProfileSection title="Change Password" iconName="cog">
        <form className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 dark:text-white">Current Password</label>
            <input type="password" id="currentPassword" className={inputClass} />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-white">New Password</label>
            <input type="password" id="newPassword" className={inputClass} />
          </div>
           <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-white">Confirm New Password</label>
            <input type="password" id="confirmPassword" className={inputClass} />
          </div>
          <div className="text-right">
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Update Password
            </button>
          </div>
        </form>
      </ProfileSection>
    </div>
  );
};