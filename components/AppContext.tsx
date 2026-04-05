
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { JobSeekerProfile, VerificationStatus, UserRole, Job, Application, Notification, Message } from '../types';
import { mockProfiles, mockJobs, mockApplications, mockNotifications } from '../services/mockData';

export type Theme = 'light' | 'dark' | 'system';

interface AppContextType {
  profiles: JobSeekerProfile[];
  jobs: Job[];
  applications: Application[];
  notifications: Notification[];
  getProfileById: (id: string) => JobSeekerProfile | undefined;
  updateProfileStatus: (id: string, status: VerificationStatus, reason?: string) => void;
  toggleShortlist: (id: string) => void;
  getLoggedInSeeker: () => JobSeekerProfile;
  addUser: (user: Omit<JobSeekerProfile, 'id'>) => void;
  updateProfile: (profile: JobSeekerProfile) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyToJob: (jobId: string, jobSeekerId: string, coverLetter?: string, interestedOnly?: boolean) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  addNotification: (userId: string, title: string, message: string, type: Notification['type'], link?: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  postJob: (job: Omit<Job, 'id' | 'postedAt'>) => void;
  deleteJob: (jobId: string) => void;
  respondToOffer: (applicationId: string, status: 'Accepted' | 'Rejected', feedback?: string) => void;
  sendMessage: (receiverId: string, content: string, jobId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<JobSeekerProfile[]>(mockProfiles);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
        return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };
  
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.classList.toggle('dark', isDark);
  }, [theme]);

  const getProfileById = useCallback((id: string) => {
    return profiles.find(p => p.id === id);
  }, [profiles]);

  const updateProfileStatus = useCallback((id: string, status: VerificationStatus, reason?: string) => {
    setProfiles(prevProfiles =>
      prevProfiles.map(p => {
        if (p.id === id) {
          const updatedProfile = { ...p, verificationStatus: status };
          if (status === VerificationStatus.REJECTED) {
            updatedProfile.rejectionReason = reason;
          }
          if (status === VerificationStatus.PENDING || status === VerificationStatus.VERIFIED) {
             delete updatedProfile.rejectionReason;
          }
          return updatedProfile;
        }
        return p;
      })
    );
  }, []);

  const toggleShortlist = useCallback((id: string) => {
    setProfiles(prevProfiles =>
      prevProfiles.map(p =>
        p.id === id ? { ...p, isShortlisted: !p.isShortlisted } : p
      )
    );
  }, []);
  
  const addUser = useCallback((user: Omit<JobSeekerProfile, 'id'>) => {
    const newUser: JobSeekerProfile = {
      ...user,
      id: `usr_${String(Date.now()).slice(-6)}`,
    };
    setProfiles(prevProfiles => [newUser, ...prevProfiles]);
  }, []);

  const updateProfile = useCallback((updatedProfile: JobSeekerProfile) => {
    setProfiles(prevProfiles =>
      prevProfiles.map(p =>
        p.id === updatedProfile.id ? updatedProfile : p
      )
    );
  }, []);
  
  const applyToJob = useCallback((jobId: string, jobSeekerId: string, coverLetter?: string, interestedOnly?: boolean) => {
    const newApp: Application = {
        id: `app_${Date.now()}`,
        jobId,
        jobSeekerId,
        status: 'Applied',
        appliedAt: new Date().toISOString(),
        coverLetter,
        interestedOnly
    };
    setApplications(prev => [newApp, ...prev]);
    
    // Notify employer
    const job = jobs.find(j => j.id === jobId);
    if (job) {
        addNotification(
            job.employerId,
            interestedOnly ? 'New Interest' : 'New Application',
            `A candidate is ${interestedOnly ? 'interested in' : 'applied for'} ${job.title}`,
            'Application',
            `/employer/jobs/${jobId}`
        );
    }
  }, [jobs]);

  const updateApplicationStatus = useCallback((applicationId: string, status: Application['status']) => {
    setApplications(prev => prev.map(app => app.id === applicationId ? { ...app, status } : app));
    
    // Notify job seeker
    const app = applications.find(a => a.id === applicationId);
    if (app) {
        addNotification(
            app.jobSeekerId,
            'Application Status Updated',
            `Your application for a position has been moved to "${status}"`,
            'StatusChange'
        );
    }
  }, [applications]);

  const addNotification = useCallback((userId: string, title: string, message: string, type: Notification['type'], link?: string) => {
    const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId,
        title,
        message,
        type,
        isRead: false,
        createdAt: new Date().toISOString(),
        link
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  }, []);

  const postJob = useCallback((job: Omit<Job, 'id' | 'postedAt'>) => {
    const newJob: Job = {
        ...job,
        id: `job_${Date.now()}`,
        postedAt: new Date().toISOString()
    };
    setJobs(prev => [newJob, ...prev]);
  }, []);

  const deleteJob = useCallback((jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    // Also cleanup applications for this job
    setApplications(prev => prev.filter(a => a.jobId !== jobId));
  }, []);

  const respondToOffer = useCallback((applicationId: string, status: 'Accepted' | 'Rejected', feedback?: string) => {
    setApplications(prev => prev.map(app => app.id === applicationId ? { ...app, status, coverLetter: feedback ? `${app.coverLetter}\n\nFeedback: ${feedback}` : app.coverLetter } : app));
    
    // Notify employer
    const app = applications.find(a => a.id === applicationId);
    if (app) {
        const job = jobs.find(j => j.id === app.jobId);
        if (job) {
            addNotification(
                job.employerId,
                `Offer ${status}`,
                `A candidate has ${status.toLowerCase()} your offer for ${job.title}`,
                'StatusChange',
                `/employer/applications/${applicationId}`
            );
        }
    }
  }, [applications, jobs]);

  // For demonstration, the profile with id 'usr_00001' is considered the logged-in user.
  const getLoggedInSeeker = useCallback(() => {
    const seeker = profiles.find(p => p.id === 'usr_00001');
    if (!seeker) {
        return profiles[0];
    }
    return seeker;
  }, [profiles]);

  const sendMessage = useCallback((receiverId: string, content: string, jobId?: string) => {
    const seeker = getLoggedInSeeker();
    const newMsg: Message = {
        id: `msg_${Date.now()}`,
        senderId: seeker.id,
        receiverId,
        jobId,
        content,
        sentAt: new Date().toISOString(),
        isRead: false
    };
    // In a real app, we'd have a messages state. For now, we'll just notify.
    addNotification(
        receiverId,
        'New Message',
        `You have a new message regarding a position.`,
        'Message',
        jobId ? `/jobs/${jobId}` : undefined
    );
    console.log('Message sent:', newMsg);
  }, [addNotification, getLoggedInSeeker]);

  const value = {
    profiles,
    jobs,
    applications,
    notifications,
    getProfileById,
    updateProfileStatus,
    toggleShortlist,
    getLoggedInSeeker,
    addUser,
    updateProfile,
    theme,
    setTheme,
    applyToJob,
    updateApplicationStatus,
    addNotification,
    markNotificationAsRead,
    postJob,
    deleteJob,
    respondToOffer,
    sendMessage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};