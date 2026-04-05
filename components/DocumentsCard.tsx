
import React from 'react';
import { Document, UserRole } from '../types';
import { Icon } from './Icon';

interface DocumentsCardProps {
  documents: Document[];
  viewerRole?: UserRole;
}

export const DocumentsCard: React.FC<DocumentsCardProps> = ({ documents, viewerRole = UserRole.JobSeeker }) => {
  const isOwner = viewerRole === UserRole.JobSeeker;
  
  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {documents.map(doc => (
          <li key={doc.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-indigo-800/50 transition-colors">
            <div className="flex items-center">
              <Icon name="documentText" className="h-6 w-6 text-slate-400" />
              <span className="ml-3 text-sm font-medium text-slate-700 dark:text-indigo-100">{doc.name}</span>
            </div>
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
              View
            </a>
          </li>
        ))}
      </ul>
      {isOwner && (
        <button className="w-full mt-4 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
          <Icon name="upload" className="h-5 w-5 mr-2" />
          Upload New Document
        </button>
      )}
    </div>
  );
};