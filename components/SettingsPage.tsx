

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

      <ProfileSection title="Notification Preferences" iconName="bell">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-indigo-900/30 rounded-lg">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Email Notifications</p>
              <p className="text-xs text-slate-500 dark:text-indigo-300">Receive updates about your account activity via email.</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-indigo-900/30 rounded-lg">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Push Notifications</p>
              <p className="text-xs text-slate-500 dark:text-indigo-300">Get real-time alerts on your browser or mobile device.</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-indigo-900/30 rounded-lg">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Marketing Emails</p>
              <p className="text-xs text-slate-500 dark:text-indigo-300">Stay updated on new features and industry insights.</p>
            </div>
            <input type="checkbox" className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-indigo-900/30 rounded-lg">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Job Alerts</p>
              <p className="text-xs text-slate-500 dark:text-indigo-300">Get notified when new jobs matching your profile are posted.</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
          </div>
        </div>
      </ProfileSection>

      <ProfileSection title="Privacy & Visibility" iconName="eye">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-indigo-900/30 rounded-lg">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Public Profile</p>
              <p className="text-xs text-slate-500 dark:text-indigo-300">Allow employers to find your profile in search results.</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-indigo-900/30 rounded-lg">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Show Salary Expectations</p>
              <p className="text-xs text-slate-500 dark:text-indigo-300">Make your desired salary visible to verified employers.</p>
            </div>
            <input type="checkbox" className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-indigo-900/30 rounded-lg">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Anonymous Browsing</p>
              <p className="text-xs text-slate-500 dark:text-indigo-300">Hide your identity when viewing company profiles.</p>
            </div>
            <input type="checkbox" className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-indigo-900/30 rounded-lg">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Data Sharing with Partners</p>
              <p className="text-xs text-slate-500 dark:text-indigo-300">Allow us to share anonymized data with research partners.</p>
            </div>
            <input type="checkbox" className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
          </div>
        </div>
      </ProfileSection>

      <ProfileSection title="Security & Access" iconName="shieldCheck">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-indigo-900/30 rounded-lg">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</p>
              <p className="text-xs text-slate-500 dark:text-indigo-300">Add an extra layer of security to your account.</p>
            </div>
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Enable 2FA</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-indigo-900/30 rounded-lg">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Active Sessions</p>
              <p className="text-xs text-slate-500 dark:text-indigo-300">Manage your logged-in devices and sessions.</p>
            </div>
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View Sessions</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-indigo-900/30 rounded-lg">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Login History</p>
              <p className="text-xs text-slate-500 dark:text-indigo-300">Review recent login attempts for your account.</p>
            </div>
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View History</button>
          </div>
        </div>
      </ProfileSection>

      <ProfileSection title="Linked Accounts" iconName="link">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-indigo-900/30 rounded-lg">
            <div className="flex items-center">
                <Icon name="google" className="h-5 w-5 text-slate-400 mr-3" />
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Google</p>
                    <p className="text-xs text-slate-500 dark:text-indigo-300">Connected as alex.doe@gmail.com</p>
                </div>
            </div>
            <button className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">Disconnect</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-indigo-900/30 rounded-lg">
            <div className="flex items-center">
                <Icon name="linkedin" className="h-5 w-5 text-slate-400 mr-3" />
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">LinkedIn</p>
                    <p className="text-xs text-slate-500 dark:text-indigo-300">Not connected</p>
                </div>
            </div>
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Connect</button>
          </div>
        </div>
      </ProfileSection>

      <ProfileSection title="Data Management" iconName="document">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-indigo-900/30 rounded-lg">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Download Your Data</p>
              <p className="text-xs text-slate-500 dark:text-indigo-300">Get a copy of all your personal information and activity.</p>
            </div>
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Request Export</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
            <div>
              <p className="text-sm font-bold text-red-700 dark:text-red-400">Delete Account</p>
              <p className="text-xs text-red-600 dark:text-red-300/70">Permanently remove your account and all associated data.</p>
            </div>
            <button className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline">Delete Forever</button>
          </div>
        </div>
      </ProfileSection>
    </div>
  );
};