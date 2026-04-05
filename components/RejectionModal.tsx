
import React, { useState } from 'react';
import { Icon } from './Icon';

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export const RejectionModal: React.FC<RejectionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onSubmit(reason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-indigo-900 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-200 dark:border-indigo-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Reason for Rejection</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <Icon name="xMark" className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label htmlFor="rejectionReason" className="block text-sm font-medium text-slate-700 dark:text-indigo-100">
              Please provide a clear reason for rejecting this profile. This will be shared with the job seeker.
            </label>
            <textarea
              id="rejectionReason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 block w-full px-3 py-2 border border-slate-300 dark:border-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-indigo-800 dark:text-white"
              placeholder="e.g., Uploaded documents are illegible."
            />
          </div>
          <div className="px-6 py-4 bg-slate-50 dark:bg-indigo-950/50 rounded-b-lg flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 dark:bg-indigo-800 dark:border-indigo-600 dark:text-indigo-100 dark:hover:bg-indigo-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};